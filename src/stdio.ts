#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";
import { createTestRailServer } from "./server/createServer.js";

// Main execution
const main = async () => {
	try {
		console.error("Starting TestRail MCP Server (stdio mode)...");

		// Create and connect transport
		const server = createTestRailServer();
		const transport = new StdioServerTransport();
		await server.connect(transport);

		console.error("TestRail MCP Server connected via stdio");
	} catch (error) {
		console.error("Error starting TestRail MCP Server:", error);
		process.exit(1);
	}
};

// Run the server
main();
