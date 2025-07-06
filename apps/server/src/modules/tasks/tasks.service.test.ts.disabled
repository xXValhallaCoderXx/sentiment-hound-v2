import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './tasks.service';
import { TaskType } from '@repo/db';

// Mock the services package (must be at top level)
vi.mock('@repo/services', () => ({
  taskService: {
    createTask: vi.fn(),
  },
}));

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskService: any;

  beforeEach(async () => {
    // Get the mocked service
    const services = await import('@repo/services');
    mockTaskService = services.taskService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a task string when getTask is called', async () => {
    const result = await service.getTask();
    expect(result).toBe('task');
  });

  it('should be an instance of TaskService', () => {
    expect(service).toBeInstanceOf(TaskService);
  });

  describe('createTask', () => {
    it('should call core task service with correct parameters', async () => {
      const taskData = {
        userId: 'user123',
        integrationId: 99,
        taskType: TaskType.ANALYZE_POST as TaskType,
        extraData: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      };

      const mockResult = { id: 1, status: 'PENDING' };
      mockTaskService.createTask.mockResolvedValue(mockResult);

      const result = await service.createTask(taskData);

      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(mockResult);
    });

    it('should handle core service errors properly', async () => {
      const taskData = {
        userId: 'user123',
        integrationId: 99,
        taskType: TaskType.ANALYZE_POST as TaskType,
        extraData: { url: 'invalid-url' },
      };

      const error = new Error('Core service error');
      mockTaskService.createTask.mockRejectedValue(error);

      await expect(service.createTask(taskData)).rejects.toThrow(
        'Core service error',
      );
    });
  });
});
