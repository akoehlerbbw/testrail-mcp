import { z } from "zod";

// Schema for retrieving all milestones in a project
export const getMilestonesSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

export const addMilestoneSchema = z.object({
	projectId: z.number().describe("TestRail Project ID"),
	name: z.string().describe("Milestone name"),
	description: z.string().optional().describe("Milestone description"),
	dueOn: z.number().optional().describe("Due date as a Unix timestamp"),
	parentId: z.number().optional().describe("Parent milestone ID"),
	refs: z.string().optional().describe("Comma-separated references"),
	startOn: z.number().optional().describe("Start date as a Unix timestamp"),
});

export const updateMilestoneSchema = z.object({
	milestoneId: z.number().describe("TestRail Milestone ID"),
	name: z.string().optional().describe("Milestone name"),
	description: z.string().optional().describe("Milestone description"),
	dueOn: z.number().optional().describe("Due date as a Unix timestamp"),
	parentId: z.number().optional().describe("Parent milestone ID"),
	refs: z.string().optional().describe("Comma-separated references"),
	startOn: z.number().optional().describe("Start date as a Unix timestamp"),
	isCompleted: z
		.boolean()
		.optional()
		.describe("Mark the milestone as completed (closed) or reopen it"),
	isStarted: z
		.boolean()
		.optional()
		.describe("Mark the milestone as started or not started"),
});

// Create Zod objects from each schema
export const GetMilestonesInput = z.object(getMilestonesSchema);

// Extract input types
export type GetMilestonesInputType = z.infer<typeof GetMilestonesInput>;
export type AddMilestoneInputType = z.infer<typeof addMilestoneSchema>;
export type UpdateMilestoneInputType = z.infer<typeof updateMilestoneSchema>;

/**
 * TestRail API Response for Milestone
 */
export const TestRailMilestoneSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	due_on: z.number().optional(),
	start_on: z.number().optional(),
	started_on: z.number().optional(),
	completed_on: z.number().nullable().optional(),
	project_id: z.number(),
	is_completed: z.boolean(),
	is_started: z.boolean().optional(),
	parent_id: z.number().nullable().optional(),
	refs: z.string().optional(),
	url: z.string(),
});
export type TestRailMilestone = z.infer<typeof TestRailMilestoneSchema>;
