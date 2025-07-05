import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './tasks.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
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
});
