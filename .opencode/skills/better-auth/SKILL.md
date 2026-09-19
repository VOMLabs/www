---
name: better-auth
description: Look up Better Auth documentation for server setup, client hooks, Drizzle adapter, plugins, session management, and protected routes via Context7.
---

# Better Auth Skill

## Overview

This skill retrieves current Better Auth documentation via Context7 for auth setup, configuration, and usage patterns.

## Workflow

### Step 1: Find the Library

```bash
curl -s "https://context7.com/api/v2/libs/search?libraryName=better-auth&query=TOPIC" | jq '.results[0]'
```

### Step 2: Fetch Documentation

```bash
curl -s "https://context7.com/api/v2/context?libraryId=LIBRARY_ID&query=TOPIC&type=txt"
```

## Common Queries

| Topic | Query |
|-------|-------|
| Server setup | `betterAuth configuration server setup` |
| Client hooks | `useSession signIn signOut client` |
| Drizzle adapter | `drizzle adapter postgres configuration` |
| Plugins | `email password OAuth plugins` |
| Protected routes | `middleware session validation protected` |
| Session management | `session cookies headers` |

## Quick Reference

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
});
```

### Client Setup

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://vomlabs.com",
});

// Hooks
const { data: session } = authClient.useSession();
```

### Protected API Routes

```ts
import { auth } from "@/lib/auth";

export async function protectedHandler(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });
  // ... proceed
}
```

## Key Concepts

- **Server-first**: Auth logic runs on the server, client is a thin wrapper
- **Session via cookies**: Sessions are stored in HTTP-only cookies
- **Drizzle adapter**: Maps auth tables to your existing Drizzle schema
- **Plugin system**: Extend with email, OAuth, 2FA, rate limiting, etc.
- **Framework agnostic**: Works with Next.js, TanStack Start, Express, etc.

## Official Docs

- https://www.better-auth.com/docs
- https://www.better-auth.com/docs/introduction
