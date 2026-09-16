import { AxiosResponse } from "axios";
import { BaseTestRailClient } from "./baseClient.js";
import { TestRailMilestone } from "../../shared/schemas/milestones.js";
import { handleApiError } from "./utils.js";
import {
	AddMilestoneInputType,
	GetMilestonesInputType,
} from "../../shared/schemas/milestones.js";

export class MilestonesClient extends BaseTestRailClient {
	/**
	 * Gets all milestones for a project
	 * @param projectId The ID of the project
	 * @param filters Optional filter parameters
	 * @returns Promise with array of milestones
	 */
	async getMilestones(
		projectId: GetMilestonesInputType["projectId"],
		filters?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailMilestone[]> {
		try {
			const response: AxiosResponse<TestRailMilestone[]> =
				await this.client.get(`/api/v2/get_milestones/${projectId}`, {
					params: filters,
				});
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to get milestones for project ${projectId}`,
			);
		}
	}

	async addMilestone(
		projectId: AddMilestoneInputType["projectId"],
		data: Omit<AddMilestoneInputType, "projectId">,
	): Promise<TestRailMilestone> {
		try {
			const payload: Record<string, unknown> = { name: data.name };
			if (data.description !== undefined) payload.description = data.description;
			if (data.dueOn !== undefined) payload.due_on = data.dueOn;
			if (data.parentId !== undefined) payload.parent_id = data.parentId;
			if (data.refs !== undefined) payload.refs = data.refs;
			if (data.startOn !== undefined) payload.start_on = data.startOn;

			const response: AxiosResponse<TestRailMilestone> = await this.client.post(
				`/api/v2/add_milestone/${projectId}`,
				payload,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to add milestone to project ${projectId}`,
			);
		}
	}
}
