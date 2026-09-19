import { Plugin } from "@opencode/plugin"
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { join, basename, extname, resolve } from "node:path"
import { getApiKey } from "../lib/env.js"

// ─────────────────────────────────────────────────────────────────────────────
// Gemini image tools (generate / edit / analyze).
// Ported from the OpenCode v1 `.opencode/tool/gemini` module to the v2 plugin
// API. Requires GEMINI_API_KEY in the project `.env` (see `.opencode/env.example`).
// ─────────────────────────────────────────────────────────────────────────────

// Function to detect if we're in test mode
function isTestMode(): boolean {
  // Only enable test mode when explicitly set
  return process.env.GEMINI_TEST_MODE === "true"
}

// Function to get Gemini API key with automatic .env loading
async function getGeminiApiKey(): Promise<string> {
  if (isTestMode()) {
    return "test-api-key"
  }
  return getApiKey("GEMINI_API_KEY")
}

interface ImageConfig {
  outputDir?: string
  useTimestamp?: boolean
  preserveOriginal?: boolean
  customName?: string
}

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
}

function mimeForFile(filePath: string): string {
  return MIME_BY_EXT[extname(filePath).toLowerCase()] || "image/png"
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function parseImageInput(input: string) {
  // Accepts file path ("./img.png") or data URL ("data:image/png;base64,...")
  if (input.startsWith("data:")) {
    const base64 = input.split(",")[1]
    const mime = input.substring(5, input.indexOf(";"))
    return { mime, base64 }
  }
  // Treat as file path
  const buf = await readFile(input)
  const base64 = buf.toString("base64")
  // Best-effort mime
  const mime = mimeForFile(input)
  return { mime, base64 }
}

async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

function getDateBasedPath(baseDir?: string): string {
  // Default to assets/images at repo root. The plugin lives at
  // .opencode/plugins/gemini/, so the repo root is three levels up from here
  // regardless of the server's current working directory.
  if (!baseDir) {
    const here = resolve(fileURLToPath(import.meta.url), "..")
    baseDir = resolve(here, "../../../assets/images")
  }
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
  return join(baseDir, today)
}

async function getUniqueFilename(directory: string, baseName: string, extension: string, isEdit: boolean = false): Promise<string> {
  await ensureDirectoryExists(directory)

  if (!isEdit) {
    // For generations, use timestamp if file exists
    const baseFilename = join(directory, `${baseName}${extension}`)
    const exists = await fileExists(baseFilename)

    if (!exists) {
      return baseFilename
    }

    // Add timestamp if file exists
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5) // Remove milliseconds and Z
    return join(directory, `${baseName}_${timestamp}${extension}`)
  }

  // For edits, use incremental numbering
  let counter = 1
  let filename: string

  do {
    const editSuffix = `_edit_${counter.toString().padStart(3, "0")}`
    filename = join(directory, `${baseName}${editSuffix}${extension}`)
    counter++
  } while (await fileExists(filename))

  return filename
}

async function saveBase64(outputPath: string, b64: string): Promise<number> {
  await writeFile(outputPath, Buffer.from(b64, "base64"))
  const stats = await stat(outputPath)
  return stats.size
}

export async function generateImage(prompt: string, config: ImageConfig = {}): Promise<string> {
  const apiKey = await getGeminiApiKey()

  // Test mode - return mock response without API call
  if (isTestMode()) {
    const baseDir = config.outputDir || getDateBasedPath()
    const generationsDir = join(baseDir, "generations")
    let baseName = config.customName || "generated"
    if (baseName.endsWith(".png") || baseName.endsWith(".jpg") || baseName.endsWith(".jpeg")) {
      baseName = baseName.substring(0, baseName.lastIndexOf("."))
    }
    const outputPath = await getUniqueFilename(generationsDir, baseName, ".png", false)

    return `[TEST MODE] Would generate image: ${outputPath} for prompt: "${prompt.substring(0, 50)}..."`
  }

  const body = {
    contents: [{
      parts: [{ text: prompt }],
    }],
  }

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error (${res.status}): ${errorText}`)
  }

  const json = await res.json()

  // Look for image data in the response
  const candidates = json?.candidates
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates in response")
  }

  const parts = candidates[0]?.content?.parts
  if (!parts || parts.length === 0) {
    throw new Error("No parts in response")
  }

  let b64: string | null = null
  for (const part of parts) {
    if (part.inlineData?.data) {
      b64 = part.inlineData.data
      break
    }
  }

  if (!b64) {
    throw new Error("No image data returned from Nano Banana model")
  }

  // Determine output path
  const baseDir = config.outputDir || getDateBasedPath()
  const generationsDir = join(baseDir, "generations")

  // Generate filename (remove extension if already present)
  let baseName = config.customName || "generated"
  if (baseName.endsWith(".png") || baseName.endsWith(".jpg") || baseName.endsWith(".jpeg")) {
    baseName = baseName.substring(0, baseName.lastIndexOf("."))
  }
  const extension = ".png"
  const outputPath = await getUniqueFilename(generationsDir, baseName, extension, false)

  console.log(`Saving generated image to: ${outputPath}`)
  const size = await saveBase64(outputPath, b64)
  return `Generated image saved: ${outputPath} (${size} bytes)`
}

export async function editImage(imagePath: string, prompt: string, config: ImageConfig = {}): Promise<string> {
  const apiKey = await getGeminiApiKey()

  // Test mode - return mock response without API call
  if (isTestMode()) {
    const baseDir = config.outputDir || getDateBasedPath()
    const editsDir = join(baseDir, "edits")
    const originalName = basename(imagePath, extname(imagePath))
    let baseName = config.customName || originalName
    if (baseName.endsWith(".png") || baseName.endsWith(".jpg") || baseName.endsWith(".jpeg")) {
      baseName = baseName.substring(0, baseName.lastIndexOf("."))
    }
    const outputPath = await getUniqueFilename(editsDir, baseName, ".png", true)

    return `[TEST MODE] Would edit image: ${imagePath} -> ${outputPath} with prompt: "${prompt.substring(0, 50)}..."`
  }

  // Parse the input image
  const { mime, base64 } = await parseImageInput(imagePath)

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: mime, data: base64 } },
      ],
    }],
  }

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error (${res.status}): ${errorText}`)
  }

  const json = await res.json()

  // Look for image data in the response
  const candidates = json?.candidates
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates in response")
  }

  const parts = candidates[0]?.content?.parts
  if (!parts || parts.length === 0) {
    throw new Error("No parts in response")
  }

  let b64: string | null = null
  for (const part of parts) {
    if (part.inlineData?.data) {
      b64 = part.inlineData.data
      break
    }
  }

  if (!b64) {
    throw new Error("No image data returned from Nano Banana model")
  }

  // Determine output path
  const baseDir = config.outputDir || getDateBasedPath()
  const editsDir = join(baseDir, "edits")

  // Extract original filename without extension
  const originalName = basename(imagePath, extname(imagePath))
  let baseName = config.customName || originalName
  if (baseName.endsWith(".png") || baseName.endsWith(".jpg") || baseName.endsWith(".jpeg")) {
    baseName = baseName.substring(0, baseName.lastIndexOf("."))
  }
  const extension = ".png"

  const outputPath = await getUniqueFilename(editsDir, baseName, extension, true)

  console.log(`Saving edited image to: ${outputPath}`)
  const size = await saveBase64(outputPath, b64)
  return `Edited image saved: ${outputPath} (${size} bytes)`
}

export async function analyzeImage(imagePath: string, question: string): Promise<string> {
  const apiKey = await getGeminiApiKey()

  // Test mode - return mock response without API call
  if (isTestMode()) {
    return `[TEST MODE] Would analyze image: ${imagePath} with question: "${question.substring(0, 50)}..." - Mock analysis: This is a test image analysis response.`
  }

  const { mime, base64 } = await parseImageInput(imagePath)

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: question },
            { inlineData: { mimeType: mime, data: base64 } },
          ],
        }],
      }),
    },
  )

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error (${res.status}): ${errorText}`)
  }

  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error("No analysis returned")
  }

  return text
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool registrations (v2 plugin API)
// ─────────────────────────────────────────────────────────────────────────────

// Plain JSON Schema objects - the simplest portable schema form for V2 tools.
const generateSchema = {
  type: "object",
  properties: {
    prompt: { type: "string", description: "Text description of the image to generate" },
    outputDir: { type: "string", description: "Custom output directory (default: ./assets/images/YYYY-MM-DD/)" },
    filename: { type: "string", description: "Custom filename (default: generated)" },
  },
  required: ["prompt"],
} as const

const editSchema = {
  type: "object",
  properties: {
    image: { type: "string", description: "File path or data URL of image to edit" },
    prompt: { type: "string", description: "Edit instruction" },
    outputDir: { type: "string", description: "Custom output directory (default: ./assets/images/YYYY-MM-DD/)" },
    filename: { type: "string", description: "Custom filename (default: original name with _edit_XXX)" },
  },
  required: ["image", "prompt"],
} as const

const analyzeSchema = {
  type: "object",
  properties: {
    image: { type: "string", description: "File path or data URL of image to analyze" },
    question: { type: "string", description: "What to analyze about the image" },
  },
  required: ["image", "question"],
} as const

export default Plugin.define({
  id: "gemini-image-tools",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
      name: "gemini_generate_image",
      description: "Generate an image from a text prompt using Gemini Nano Banana",
      input: generateSchema,
      execute: async (args: any) => {
        try {
          const config: ImageConfig = {
            outputDir: args.outputDir,
            customName: args.filename,
          }
          const result = await generateImage(args.prompt, config)
          return { content: result }
        } catch (error) {
          return { content: `Error: ${(error as Error).message}` }
        }
      },
      })

      editor.add({
      name: "gemini_edit_image",
      description: "Edit an existing image using Gemini Nano Banana",
      input: editSchema,
      execute: async (args: any) => {
        try {
          const config: ImageConfig = {
            outputDir: args.outputDir,
            customName: args.filename,
          }
          const result = await editImage(args.image, args.prompt, config)
          return { content: result }
        } catch (error) {
          return { content: `Error: ${(error as Error).message}` }
        }
      },
      })

      editor.add({
      name: "gemini_analyze_image",
      description: "Analyze an image using Gemini (text analysis only)",
      input: analyzeSchema,
      execute: async (args: any) => {
        try {
          const result = await analyzeImage(args.image, args.question)
          return { content: result }
        } catch (error) {
          return { content: `Error: ${(error as Error).message}` }
        }
      },
      })
    })
  },
})