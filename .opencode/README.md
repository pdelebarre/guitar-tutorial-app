# OpenCode Configuration for Guitar Tutorial App

This directory contains the modular OpenCode agent configuration for the guitar-tutorial-app project.

## Structure

```
.opencode/
├── agents.json      # Main agent definitions with references
├── models.json      # LLM model configurations and routing
├── skills.json      # Reusable skill definitions
├── rules.json       # Shared rules and guidelines
└── README.md        # This file
```

## Agents

| Agent | Purpose | Default Model |
|-------|---------|---------------|
| `backend` | Spring Boot backend specialist | DeepSeek Chat V3 |
| `frontend` | React/TypeScript frontend specialist | DeepSeek Chat V3 |
| `docker` | Docker and containerization | DeepSeek Chat V3 |
| `fullstack` | Full-stack coordinator/orchestrator | DeepSeek Chat V3 |
| `testing` | Testing and QA specialist | DeepSeek Chat V3 |
| `devops` | CI/CD and deployment | DeepSeek Chat V3 |

## Model Strategy

### Cost-Optimized Routing

- **Cheapest**: `google/gemini-2.0-flash-lite-preview-02-05` - Simple queries, reviews
- **Standard**: `deepseek/deepseek-chat-v3-0324` - Most development tasks
- **Complex**: `anthropic/claude-3-haiku-20240307` - Complex refactoring, architecture

**Maximum cost cap**: Nothing more expensive than Claude 3 Haiku

### Task Routing

Each agent automatically routes tasks based on complexity:
- Simple → Gemini Flash Lite
- Standard → DeepSeek Chat V3 (best value)
- Complex → Claude 3 Haiku

## Features

### Shared Context
- All agents share conversation context progressively
- Automatic summarization when context exceeds 5000 tokens
- Max context: 8000 tokens

### Token Optimization
- Max 4000 tokens per request
- Context compression enabled
- Prefer diffs over full files
- Avoid repetition

### Skills-Based Routing
Agents declare skills for better task matching:
- Backend: `java`, `spring-boot`, `maven`, `junit`, `mockito`, `rest-api`
- Frontend: `react`, `typescript`, `vite`, `tailwind`, `vitest`, `testing-library`
- Docker: `docker`, `docker-compose`, `nginx`, `containers`, `security`
- Fullstack: `fullstack`, `architecture`, `api-design`, `integration`, `orchestration`
- Testing: `junit`, `mockito`, `vitest`, `testing-library`, `integration-testing`, `e2e`
- DevOps: `github-actions`, `docker`, `nginx`, `ci-cd`, `monitoring`, `security`

## Usage

### Using a Specific Agent

```bash
opencode --agent backend "Add a new REST endpoint for..."
opencode --agent frontend "Create a new React component for..."
opencode --agent fullstack "Review the API contract between..."
```

### Context Sharing

Agents automatically share relevant context. The fullstack agent orchestrates complex tasks by delegating to specialists.

### Model Selection

Models are automatically selected based on task complexity. You can override:

```bash
opencode --model google/gemini-2.0-flash-lite-preview-02-05 "Quick review of..."
```

## Modifying Configuration

### Adding a New Skill

Edit `.opencode/skills.json` and add:

```json
"new-skill": {
  "name": "Skill Name",
  "description": "What this skill does",
  "keywords": ["keyword1", "keyword2"]
}
```

### Adding a New Rule

Edit `.opencode/rules.json` and add to the `rules` object.

### Adding a New Agent

Edit `.opencode/agents.json` and add a new agent definition with:
- `name`, `description`
- `model` (use `${models.*}` references)
- `skills` (array of skill keys from skills.json)
- `rules` (array of rule keys from rules.json)
- `taskRouting` configuration

## Best Practices

1. **Be specific** when invoking agents - mention the agent name for specialized tasks
2. **Let the fullstack agent orchestrate** complex multi-layer changes
3. **Trust the model routing** - it will select the cheapest capable model
4. **Keep context focused** - agents will summarize automatically
5. **Review agent outputs** - especially for critical changes

## Cost Optimization

This configuration is optimized for cost-efficiency:
- Default model (DeepSeek V3) offers excellent value
- Automatic downgrading to Gemini Flash Lite for simple tasks
- Hard cap at Claude 3 Haiku pricing
- Token optimization reduces overall usage

Estimated cost per typical session: **$0.10 - $0.50** depending on complexity.
