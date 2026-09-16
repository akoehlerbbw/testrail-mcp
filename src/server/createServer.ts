import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient, TestRailClientConfig } from "../client/api/index.js";
import { registerAllTools } from "./api/index.js";

export function createTestRailServer(): McpServer {
	const testRailUrl = process.env.TESTRAIL_URL;
	const username = process.env.TESTRAIL_USERNAME;
	const apiKey = process.env.TESTRAIL_API_KEY;

	if (!testRailUrl || !username || !apiKey) {
		throw new Error(
			"TESTRAIL_URL, TESTRAIL_USERNAME, and TESTRAIL_API_KEY must be set",
		);
	}

	const baseURL = testRailUrl.endsWith("/index.php?/")
		? testRailUrl
		: testRailUrl.endsWith("/")
			? `${testRailUrl}index.php?/`
			: `${testRailUrl}/index.php?/`;
	const testRailConfig: TestRailClientConfig = {
		baseURL,
		auth: {
			username,
			password: apiKey,
		},
	};
	const server = new McpServer({
		name: "TestRail MCP Server",
		version: "1.0.0",
	});

	registerAllTools(server, new TestRailClient(testRailConfig));
	return server;
}
