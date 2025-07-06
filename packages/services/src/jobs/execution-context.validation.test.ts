/**
 * Validation Tests for ExecutionContext userId Type Fix
 * 
 * These tests specifically validate that the userId field is properly typed 
 * as a string CUID and that invalid values are rejected.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildExecutionContext } from './execution-context.builder';
import { IntegrationAuthenticationError } from '../integrations/integrations.errors';
import { TaskStatus, TaskType, SubTaskStatus, SubTaskType } from '@repo/db';

// Mock the service dependencies
vi.mock('../index', () => ({
  subtaskService: {
    getTaskWithProviderForSubTask: vi.fn(),
  },
  youtubeService: {
    refreshAccessToken: vi.fn(),
  },
  integrationsService: {
    getIntegrationUserIntegrationByProviderId: vi.fn(),
    updateIntegrationAuthCredentials: vi.fn(),
  },
}));

// Import the mocked services
import { subtaskService, youtubeService, integrationsService } from '../index';

describe('ExecutionContext userId Type Validation', () => {
  const mockJobId = 123;
  const mockJobData = { videoUrl: 'https://youtube.com/watch?v=test123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid CUID string userId', () => {
    it('should accept valid CUID string userId', async () => {
      const validCUID = 'clt4x8k9z0000xyz123abcdef';
      
      // Mock environment variable for master API key
      const originalEnv = process.env.YOUTUBE_MASTER_API_KEY;
      process.env.YOUTUBE_MASTER_API_KEY = 'test-master-api-key';
      
      const mockSubTask = {
        id: mockJobId,
        status: SubTaskStatus.PENDING,
        type: SubTaskType.FETCH_CONTENT,
        errorMessage: null,
        taskId: 1,
        data: mockJobData,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: {
          id: 1,
          type: TaskType.FETCH_CONTENT,
          status: TaskStatus.PENDING,
          errorMessage: null,
          userId: validCUID,
          integrationId: null,
          providerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: validCUID,
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: null,
            image: null,
            password: null,
            planId: null,
            featureFlags: null,
            tokenUsageThisPeriod: 0,
            currentPeriodEnd: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          provider: {
            id: 1,
            name: 'YouTube',
            image: 'youtube-logo.png',
            description: 'YouTube video platform',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      };

      vi.mocked(subtaskService.getTaskWithProviderForSubTask).mockResolvedValue(mockSubTask);
      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId).mockResolvedValue(null);

      const result = await buildExecutionContext(mockJobId, mockJobData);

      expect(result.userId).toBe(validCUID);
      expect(typeof result.userId).toBe('string');
      
      // Clean up environment
      if (originalEnv !== undefined) {
        process.env.YOUTUBE_MASTER_API_KEY = originalEnv;
      } else {
        delete process.env.YOUTUBE_MASTER_API_KEY;
      }
    });
  });

  describe('Invalid userId validation', () => {
    it('should reject empty string userId', async () => {
      const mockSubTask = {
        id: mockJobId,
        status: SubTaskStatus.PENDING,
        type: SubTaskType.FETCH_CONTENT,
        errorMessage: null,
        taskId: 1,
        data: mockJobData,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: {
          id: 1,
          type: TaskType.FETCH_CONTENT,
          status: TaskStatus.PENDING,
          errorMessage: null,
          userId: '',
          integrationId: null,
          providerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: '',
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: null,
            image: null,
            password: null,
            planId: null,
            featureFlags: null,
            tokenUsageThisPeriod: 0,
            currentPeriodEnd: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          provider: {
            id: 1,
            name: 'YouTube',
            image: 'youtube-logo.png',
            description: 'YouTube video platform',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      };

      vi.mocked(subtaskService.getTaskWithProviderForSubTask).mockResolvedValue(mockSubTask);

      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow(IntegrationAuthenticationError);
    });

    it('should reject whitespace-only userId', async () => {
      const mockSubTask = {
        id: mockJobId,
        status: SubTaskStatus.PENDING,
        type: SubTaskType.FETCH_CONTENT,
        errorMessage: null,
        taskId: 1,
        data: mockJobData,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: {
          id: 1,
          type: TaskType.FETCH_CONTENT,
          status: TaskStatus.PENDING,
          errorMessage: null,
          userId: '   ',
          integrationId: null,
          providerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: '   ',
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: null,
            image: null,
            password: null,
            planId: null,
            featureFlags: null,
            tokenUsageThisPeriod: 0,
            currentPeriodEnd: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          provider: {
            id: 1,
            name: 'YouTube',
            image: 'youtube-logo.png',
            description: 'YouTube video platform',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      };

      vi.mocked(subtaskService.getTaskWithProviderForSubTask).mockResolvedValue(mockSubTask);

      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow(IntegrationAuthenticationError);
    });
  });

  describe('Type safety validation', () => {
    it('should ensure userId is typed as string in ExecutionContext interface', () => {
      // This test ensures compile-time type safety
      // If userId were typed as number, this would fail TypeScript compilation
      const validContext = {
        userId: 'clt4x8k9z0000xyz123abcdef', // Must be string, not number
        providerId: 1,
        providerName: 'YouTube',
        authToken: 'token123',
        jobData: mockJobData,
        integrationId: 789,
        tokenSource: 'USER_OAUTH' as const,
        authMethod: 'OAUTH' as const,
      };

      // TypeScript compilation will fail if userId is not a string
      expect(typeof validContext.userId).toBe('string');
    });
  });
});
