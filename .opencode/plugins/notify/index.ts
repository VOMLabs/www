import { Plugin } from "@opencode/plugin"

/**
 * Notify plugin - announces when a session reaches idle.
 *
 * Ported from the OpenCode v1 `plugin/notify.ts` to the v2 plugin API
 * (`@opencode/plugin`). Disabled by default; flip ENABLED to activate.
 */
const ENABLED = false

export default Plugin.define({
  id: "notify",
  setup(ctx) {
    if (!ENABLED) return

    const abort = new AbortController()

    void (async () => {
      for await (const event of ctx.event.subscribe({ signal: abort.signal })) {
        if (event.type === "session.idle") {
          console.log(`[notify] Session ${event.data.sessionID} is idle — your code is done!`)
          // To surface a desktop notification on Linux instead of a log line, e.g.:
          // await ctx.shell.run({ cmd: `notify-send "OpenCode" "Your code is done!"` })
        }
      }
    })()

    return () => abort.abort()
  },
})