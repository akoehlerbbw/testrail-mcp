#!/usr/bin/env node
import { timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import "dotenv/config";
import { createTestRailServer } from "./server/createServer.js";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const authToken = process.env.MCP_AUTH_TOKEN;
const allowedHosts = process.env.MCP_ALLOWED_HOSTS?.split(",")
	.map((value) => value.trim())
	.filter(Boolean);

if (!authToken) {
	throw new Error("MCP_AUTH_TOKEN must be set when using HTTP transport");
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
	throw new Error("PORT must be an integer between 1 and 65535");
}

const app = createMcpExpressApp({ host, allowedHosts });

app.get("/health", (_request, response) => {
	response.status(200).json({ status: "ok" });
});

app.use("/mcp", (request, response, next) => {
	const authorization = request.header("authorization") ?? "";
	const expected = Buffer.from(`Bearer ${authToken}`);
	const actual = Buffer.from(authorization);
	const authorized =
		actual.length === expected.length && timingSafeEqual(actual, expected);

	if (!authorized) {
		response.status(401).json({
			jsonrpc: "2.0",
			error: { code: -32001, message: "Unauthorized" },
			id: null,
		});
		return;
	}

	next();
});

app.post("/mcp", async (request, response) => {
	const server = createTestRailServer();
	const transport = new StreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
	});

	try {
		await server.connect(transport);
		await transport.handleRequest(request, response, request.body);
	} catch (error) {
		console.error("Error handling MCP request:", error);
		if (!response.headersSent) {
			response.status(500).json({
				jsonrpc: "2.0",
				error: { code: -32603, message: "Internal server error" },
				id: null,
			});
		}
	} finally {
		await transport.close();
		await server.close();
	}
});

app.all("/mcp", (_request, response) => {
	response.status(405).json({
		jsonrpc: "2.0",
		error: { code: -32000, message: "Method not allowed" },
		id: null,
	});
});

const httpServer = app.listen(port, host, () => {
	console.log(`TestRail MCP Server listening on http://${host}:${port}/mcp`);
});

httpServer.on("error", (error) => {
	console.error("Failed to start TestRail MCP Server:", error);
	process.exit(1);
});

const shutdown = () => {
	httpServer.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
