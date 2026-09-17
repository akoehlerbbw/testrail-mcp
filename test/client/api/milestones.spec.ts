import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMocks, createTestClient } from './testHelper';

describe('Milestones API', () => {
  let mockAxiosInstance: ReturnType<typeof setupMocks>;
  let client: ReturnType<typeof createTestClient>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = setupMocks();
    client = createTestClient();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('retrieves all milestones for a project', async () => {
    // Mock response
    const mockMilestones = [
      { id: 1, name: 'Milestone 1', description: 'Description for milestone 1', is_completed: false, due_on: 1609459200, project_id: 1, url: 'http://example.com/milestone/1' },
      { id: 2, name: 'Milestone 2', description: 'Description for milestone 2', is_completed: true, due_on: 1609545600, project_id: 1, url: 'http://example.com/milestone/2' }
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: mockMilestones });
    
    // Test method
    const result = await client.milestones.getMilestones(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_milestones/1', expect.anything());
    
    // Verify result
    expect(result).toEqual(mockMilestones);
  });

  it('updates a milestone, including closing it', async () => {
    // Mock response
    const mockMilestone = { id: 1, name: 'Milestone 1', description: 'Description', is_completed: true, due_on: 1609459200, project_id: 1, url: 'http://example.com/milestone/1' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockMilestone });

    // Test method
    const result = await client.milestones.updateMilestone(1, { isCompleted: true });

    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_milestone/1', { is_completed: true });

    // Verify result
    expect(result).toEqual(mockMilestone);
  });
});