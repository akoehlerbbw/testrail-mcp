# TestRail MCP Server

This Model Context Protocol (MCP) server provides tools for interacting with TestRail directly from Claude AI and other MCP-supported clients like Cursor. It allows you to manage test cases, projects, suites, runs, and more without leaving your conversation with the AI.

## Available Tools

The TestRail MCP server provides the following tools:

| Category | Tools |
|----------|-------|
| **Projects** | `getProjects`, `getProject` |
| **Suites** | `getSuites`, `getSuite`, `addSuite`, `updateSuite` |
| **Cases** | `getCase`, `getCases`, `addCase`, `updateCase`, `deleteCase`, `getCaseTypes`, `getCaseFields`, `copyToSection`, `moveToSection`, `getCaseHistory`, `updateCases`, `addBdd`, `getBdd` |
| **Sections** | `getSection`, `getSections`, `addSection`, `moveSection`, `updateSection`, `deleteSection` |
| **Runs** | `getRuns`, `getRun`, `addRun`, `updateRun` |
| **Tests** | `getTests`, `getTest` |
| **Results** | `getResults`, `getResultsForCase`, `getResultsForRun`, `addResultForCase`, `addResultsForCases` |
| **Plans** | `getPlans`, `getPlan`, `addPlan`, `addPlanEntry`, `addRunToPlanEntry` |
| **Milestones** | `getMilestones` |
| **Shared Steps** | `getSharedSteps` |

## Requirements

- Node.js 20.18.1 or newer
- Git
- A TestRail account with API access

## Use with VS Code

Add the following to `.vscode/mcp.json`. `npx` downloads this repository, builds the package, and runs the MCP server locally. Each user supplies their own TestRail credentials.

```json
{
  "servers": {
    "testrail": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "--package=git+https://github.com/akoehlerbbw/testrail-mcp.git#main",
        "mcp-testrail"
      ],
      "env": {
        "TESTRAIL_URL": "https://your-instance.testrail.io",
        "TESTRAIL_USERNAME": "${input:testrail_username}",
        "TESTRAIL_API_KEY": "${input:testrail_api_key}"
      }
    }
  },
  "inputs": [
    {
      "id": "testrail_username",
      "type": "promptString",
      "description": "TestRail email address"
    },
    {
      "id": "testrail_api_key",
      "type": "promptString",
      "description": "TestRail API key",
      "password": true
    }
  ]
}
```

Start the server from the MCP view in VS Code. The first start can take longer while `npx` downloads dependencies and builds the package.

The `#main` reference follows the latest repository version. For repeatable installations, replace it with a release tag or commit SHA.

## Other MCP clients

Clients that use the `mcpServers` configuration format can use the same command and environment variables:

```json
{
  "mcpServers": {
    "testrail": {
      "command": "npx",
      "args": [
        "-y",
        "--package=git+https://github.com/akoehlerbbw/testrail-mcp.git#main",
        "mcp-testrail"
      ],
      "env": {
        "TESTRAIL_URL": "https://your-instance.testrail.io",
        "TESTRAIL_USERNAME": "your-email@example.com",
        "TESTRAIL_API_KEY": "your-api-key"
      }
    }
  }
}
```

Do not commit a configuration containing real credentials. Prefer your MCP client's secure input or secret-storage support.

## Troubleshooting

- **`spawn npx ENOENT` / `spawn node ENOENT` (commonly on macOS)**: your MCP host (Cursor, Claude Code, Claude Desktop, …) cannot find `npx` or `node` at process-spawn time. The chat UI usually surfaces this as a generic "MCP server doesn't work" with no useful detail; the per-server log is the diagnostic source of truth.

  **Why it happens on macOS:** GUI apps launched from the Dock, Spotlight, or Finder inherit launchd's minimal `PATH` (`/usr/bin:/bin:/usr/sbin:/sbin`). If you installed Node via a version manager (`nvm`, `asdf`, `mise`, `fnm`, `Volta`) or Apple Silicon Homebrew (`/opt/homebrew/bin/`), `npx` lives outside that PATH — only your shell startup file (`~/.zshrc` / `~/.bashrc`) adds it. Your terminal works because the shell ran the startup file; the GUI-app process never did.

  **Diagnose** by checking the per-server log for `spawn npx ENOENT`:

  - **Cursor:** `~/Library/Application Support/Cursor/logs/<session>/window<N>/exthost/anysphere.cursor-mcp/MCP <server>.log`
  - **Claude Code / Claude Desktop:** `~/Library/Logs/Claude/`

  **Fix** by replacing `"npx"` in your MCP config with its absolute path. Run `which npx` in your normal terminal:

  ```text
  /Users/you/.nvm/versions/node/v24.15.0/bin/npx   # nvm
  /opt/homebrew/bin/npx                            # Apple Silicon Homebrew
  /usr/local/bin/npx                               # Intel Homebrew / system Node
  ```

  Then update your MCP config:

  ```json
  {
    "mcpServers": {
      "testrail": {
        "command": "/Users/you/.nvm/versions/node/v24.15.0/bin/npx",
        "args": [
          "-y",
          "--package=git+https://github.com/akoehlerbbw/testrail-mcp.git#main",
          "mcp-testrail"
        ],
        "env": {
          "TESTRAIL_URL": "https://your-instance.testrail.io",
          "TESTRAIL_USERNAME": "your-email@example.com",
          "TESTRAIL_API_KEY": "YOUR_API_KEY"
        }
      }
    }
  }
  ```

  Restart your MCP client after the change. The same fix applies to every `npx`-launched MCP server — if `mcp-testrail` is failing for this reason, your other `npx`-launched servers are likely failing too.

- **Authentication issues**: Check your TestRail API credentials.
- **Your conversation is too long**: Use `limit` and `offset` parameters for test cases and sections to paginate results.
- **HTTP 400 errors when creating/updating test cases**: TestRail projects have different templates, custom fields, and required fields. This MCP server passes your parameters directly to the TestRail API — it does not validate or transform them. If you encounter 400 errors, define your project's rules in `CLAUDE.md` or `AGENTS.md` so the LLM sends the correct parameters. For example:

  ```markdown
  # TestRail Rules for This Project
  - Project ID: 1
  - Always use template 2 (Separated Steps) when creating test cases
    - Use `customStepsSeparated` (array of step objects)
    - Do NOT send `customSteps` or `customExpected` with template 2
  - Required custom fields: custom_automation_type (default: 0)
  - Call `getCaseFields` at the start of a session to check available fields
  ```

## Contributing

Contributions are welcome. Open an issue before submitting a pull request, keep changes focused, and include tests for behavioral changes. Pull requests must pass the test and build workflow and require maintainer review before merge.

Security vulnerabilities should be reported privately according to [SECURITY.md](SECURITY.md), not through a public issue.

## Acknowledgements

- [TestRail API](https://docs.testrail.techmatrix.jp/testrail/docs/702/api/)
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)

