import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	addMilestoneSchema,
	getMilestonesSchema,
	updateMilestoneSchema,
} from "../../shared/schemas/milestones.js";

/**
 * Function to register milestone-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerMilestoneTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get all milestones for a project
	server.tool(
		"getMilestones",
		"Retrieves all milestones for a specified TestRail project / 指定されたTestRailプロジェクトの全マイルストーンを取得します",
		getMilestonesSchema,
		async ({ projectId }) => {
			try {
				const milestones =
					await testRailClient.milestones.getMilestones(projectId);
				const successResponse = createSuccessResponse(
					"Milestones retrieved successfully",
					{
						milestones,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching milestones for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	server.tool(
		"addMilestone",
		"Creates a new milestone in a TestRail project / TestRailプロジェクトに新しいマイルストーンを作成します",
		{
			projectId: addMilestoneSchema.shape.projectId,
			name: addMilestoneSchema.shape.name,
			description: addMilestoneSchema.shape.description,
			dueOn: addMilestoneSchema.shape.dueOn,
			parentId: addMilestoneSchema.shape.parentId,
			refs: addMilestoneSchema.shape.refs,
			startOn: addMilestoneSchema.shape.startOn,
		},
		async (args) => {
			const { projectId, ...data } = args;
			try {
				const milestone = await testRailClient.milestones.addMilestone(
					projectId,
					data,
				);
				const successResponse = createSuccessResponse(
					"Milestone created successfully",
					{ milestone },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating milestone in project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update an existing milestone (including closing/reopening it)
	server.tool(
		"updateMilestone",
		"Updates an existing TestRail milestone, including marking it as completed/closed via isCompleted / 既存のTestRailマイルストーンを更新します（isCompletedで完了/クローズ設定が可能）",
		{
			milestoneId: updateMilestoneSchema.shape.milestoneId,
			name: updateMilestoneSchema.shape.name,
			description: updateMilestoneSchema.shape.description,
			dueOn: updateMilestoneSchema.shape.dueOn,
			parentId: updateMilestoneSchema.shape.parentId,
			refs: updateMilestoneSchema.shape.refs,
			startOn: updateMilestoneSchema.shape.startOn,
			isCompleted: updateMilestoneSchema.shape.isCompleted,
			isStarted: updateMilestoneSchema.shape.isStarted,
		},
		async (args) => {
			const { milestoneId, ...data } = args;
			try {
				const milestone = await testRailClient.milestones.updateMilestone(
					milestoneId,
					data,
				);
				const successResponse = createSuccessResponse(
					"Milestone updated successfully",
					{ milestone },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating milestone ${milestoneId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);
}
