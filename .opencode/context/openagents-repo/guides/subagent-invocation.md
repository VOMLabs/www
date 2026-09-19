<!-- Context: openagents-repo/guides | Priority: high | Version: 2.0 | Updated: 2026-09-19 -->

# Guide: Subagent Invocation (OpenCode v2)

**Purpose**: How to correctly invoke subagents using the subagent tool in OpenCode v2  
**Priority**: HIGH - Critical for agent delegation

---

## The Model

OpenCode v2 loads agents from `.opencode/agents/`. An agent's ID is its path relative to that
directory, with nested folders separated by `/`:

```text
.opencode/agents/core/openagent.md                    →  core/openagent
.opencode/agents/subagents/core/contextscout.md       →  subagents/core/contextscout
.opencode/agents/subagents/code/coder-agent.md        →  subagents/code/coder-agent
.opencode/agents/team/reviewer.md                     →  team/reviewer
```

The `name:` frontmatter field is a display label. **Use the path-derived ID in subagent calls, never the name.**

---

## Correct Subagent Invocation

Use the `subagent` tool with the exact agent ID:

```javascript
subagent(agent: "subagents/core/task-manager",
  description: "Break down feature into subtasks",
  prompt: "Detailed instructions..."
)
```

### ❌ Incorrect Formats

```javascript
// ❌ Using display name
subagent(agent: "Task Manager", ...)

// ❌ Bare kebab-case ID without subfolder prefix
subagent(agent: "task-manager", ...)

// ❌ Using a file path
subagent(agent: ".opencode/agents/subagents/core/task-manager.md", ...)
```

---

## Available Agent IDs (this repo)

**Core agents**:
- `core/openagent` - Universal orchestration agent
- `core/opencoder` - Coding orchestration agent
- `meta/repo-manager` - Repository meta-agent
- `meta/system-builder` - System building orchestrator
- `content/copywriter` - Persuasive writing
- `content/technical-writer` - Technical documentation
- `data/data-analyst` - Data analysis
- `eval-runner` - Test harness (do not use directly)

**Subagents (code)**:
- `subagents/code/coder-agent` - Code implementation
- `subagents/code/test-engineer` - Test authoring (TDD)
- `subagents/code/reviewer` - Code review / QA
- `subagents/code/build-agent` - Type check / build validation

**Subagents (core)**:
- `subagents/core/contextscout` - Context file discovery
- `subagents/core/externalscout` - External library docs
- `subagents/core/task-manager` - JSON task breakdown
- `subagents/core/batch-executor` - Parallel batch execution
- `subagents/core/documentation` - Documentation authoring
- `subagents/core/context-retriever` - Generic context search

**Subagents (development)**:
- `subagents/development/frontend-specialist` - UI design systems
- `subagents/development/devops-specialist` - CI/CD, infra

**Subagents (system-builder)**:
- `subagents/system-builder/domain-analyzer` - Domain analysis
- `subagents/system-builder/agent-generator` - Agent file generation
- `subagents/system-builder/command-creator` - Slash command creation
- `subagents/system-builder/context-organizer` - Context organization
- `subagents/system-builder/workflow-designer` - Workflow design

**Subagents (utils)**:
- `subagents/utils/image-specialist` - Image generation/editing

---

## Common Subagent Invocations

### Task breakdown

```javascript
subagent(agent: "subagents/core/task-manager",
  description: "Break down complex feature",
  prompt: "Break down the following feature into atomic subtasks:

          Feature: {feature description}

          Requirements:
          - {requirement 1}
          - {requirement 2}

          Create subtask files under .tmp/tasks/{feature}/"
)
```

### Context discovery

```javascript
subagent(agent: "subagents/core/contextscout",
  description: "Find context for {topic}",
  prompt: "Discover context files related to {topic}, ranked by priority."
)
```

### Code review

```javascript
subagent(agent: "subagents/code/reviewer",
  description: "Review implementation",
  prompt: "Review the following implementation:

          Files:
          - {file 1}
          - {file 2}

          Focus areas:
          - Security
          - Performance
          - Code quality"
)
```

---

## How to Find the Correct Agent ID

### Method 1: List the agents directory

```bash
find .opencode/agents -name "*.md" | sort
```

Each file's path relative to `.opencode/agents/` (minus `.md`) is its ID.

### Method 2: Check agent frontmatter

The frontmatter identifies the agent and its mode:

```yaml
---
name: TaskManager        # display label (not an ID)
description: "..."
mode: subagent
---
```

Do NOT use the `name` value as the `agent` argument.

---

## Validation

Check the agent exists before invoking:

```bash
test -f .opencode/agents/subagents/core/task-manager.md && echo "exists"
```

---

## Best Practices

✅ **Use path-derived IDs** - `subagents/core/contextscout`, not `ContextScout`  
✅ **Check the agents directory** - Verify the file exists before using  
✅ **One description per call** - Keep `description` short (3-5 words)  
✅ **Pass context paths** - Reference session context files in the prompt  
✅ **Respect permissions** - Agents with `subagent` deny rules must not delegate outside their allowlist

❌ **Don't use display names** - `name:` is not an ID in v2  
❌ **Don't use file paths** - Pass the ID, not `.md` paths  
❌ **Don't guess** - Always check `.opencode/agents/` first

---

## Troubleshooting

### Error: "Unknown agent type" / "agent not found"

**Cause**: The agent ID doesn't match a file in `.opencode/agents/`.

**Solutions**:
1. `find .opencode/agents -name "*.md"` to list real IDs.
2. Use the exact path-derived ID.
3. If the agent file doesn't exist, create it (e.g. with `agents/subagents/core/...`).

### Delegation Fails Silently

**Cause**: Subagent invoked but doesn't execute.

**Solutions**:
1. Check the subagent's permissions allow the required tools.
2. Verify the subagent ID matches a file exactly (case-sensitive).
3. Check the prompt is clear and actionable.

---

## Related Files

- **Agents**: `.opencode/agents/` - Agent definitions (path-derived IDs)
- **Registry metadata**: `.opencode/config/agent-metadata.json` - OAC metadata (not consumed by OpenCode v2)

---

**Last Updated**: 2026-09-19  
**Version**: 2.0