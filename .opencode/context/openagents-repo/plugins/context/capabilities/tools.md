<!-- Context: openagents-repo/tools | Priority: low | Version: 2.0 | Updated: 2026-09-19 -->

# Building Custom Tools

Plugins can add custom tools that OpenCode agents can call autonomously (OpenCode v2 plugin API).

## Tool Definition

Custom tools are registered from a v2 plugin (`.opencode/plugins/<name>/index.ts`) using `Plugin.define` and
`ctx.tool.transform`. Tool inputs use JSON Schema; the execute callback returns `{ content }`.

```typescript
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "my-custom-tools",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
        name: "search_database",
        description: "Search your database",
        input: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            limit: { type: "number", description: "Results limit" },
          },
          required: ["query"],
        },
        execute: async (args) => {
          const { query, limit = 10 } = args as { query: string; limit?: number }
          // Implementation logic
          return { content: `Searched for "${query}" (limit ${limit})` }
        },
      })
    })
  },
})
```

## Shell-based Tools

Plugins can spawn processes with `ctx.shell` (the server Shell domain) to run commands in any language.

```typescript
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "python-calculator",
  setup(ctx) {
    ctx.tool.transform((editor) => {
      editor.add({
        name: "calculate",
        description: "Calculate mathematical expressions",
        input: {
          type: "object",
          properties: { expression: { type: "string" } },
          required: ["expression"],
        },
        async execute(args) {
          const { expression } = args as { expression: string }
          const { stdout } = await ctx.shell.run({ cmd: `python3 -c 'print(eval("${expression}"))'` })
          return { content: stdout }
        },
      })
    })
  },
})
```

## Integration

The plugin directory name under `.opencode/plugins/` is the plugin `id`. Plugins are auto-discovered from
`.opencode/plugins/`; no config entry is needed for local plugins. Dependencies (such as `@opencode/plugin`) are
installed with `npm install` inside `.opencode/`.

## Reference

The reference implementation in this repo is `.opencode/plugins/gemini/index.ts`, which registers
`gemini_generate_image`, `gemini_edit_image`, and `gemini_analyze_image`.