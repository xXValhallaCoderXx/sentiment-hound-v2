/**
 * Unit Tests for ExecutionContext Builder
 * 
 * Tests all authentication scenarios including user OAuth, token refresh, 
 * master API key fallback, and error conditions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildExecutionContext } from './execution-context.builder';
import { ExecutionContext, TokenSource } from './execution-context.interface';
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

describe('buildExecutionContext', () => {
  const mockJobId = 123;
  const mockJobData = { videoUrl: 'https://youtube.com/watch?v=abc123' };
  
  // Create full mock objects that match the Prisma schema
  const mockSubTask = {
    id: mockJobId,
    status: SubTaskStatus.PENDING,
    type: SubTaskType.FETCH_CONTENT,
    errorMessage: null,
    taskId: 1,
    data: mockJobData, // Job data as JSON
    createdAt: new Date(),
    updatedAt: new Date(),
    task: {
      id: 1,
      type: TaskType.FETCH_CONTENT,
      status: TaskStatus.PENDING,
      errorMessage: null,
      userId: '456',
      integrationId: null,
      providerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: '456',
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

  const mockIntegration = {
    id: 789,
    accountId: 'youtube-account-123',
    accessToken: 'valid_access_token',
    refreshToken: 'valid_refresh_token',
    refreshTokenExpiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    userId: '456',
    isActive: true,
    providerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock setup - can be overridden in individual tests
    vi.mocked(subtaskService.getTaskWithProviderForSubTask).mockResolvedValue(mockSubTask);
  });

  describe('Successful user OAuth token scenario', () => {
    it('should use valid non-expired user OAuth token', async () => {
      // Arrange
      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockResolvedValue(mockIntegration);

      // Act
      const result = await buildExecutionContext(mockJobId, mockJobData);

      // Assert
      expect(result).toEqual<ExecutionContext>({
        userId: 456,
        providerId: 1,
        providerName: 'YouTube',
        authToken: 'valid_access_token',
        jobData: mockJobData,
        integrationId: 789,
        tokenSource: TokenSource.USER_OAUTH,
      });

      // Verify that token refresh was not called since token is valid
      expect(youtubeService.refreshAccessToken).not.toHaveBeenCalled();
      expect(integrationsService.updateIntegrationAuthCredentials).not.toHaveBeenCalled();
    });
  });

  describe('Expired OAuth token refresh scenario', () => {
    it('should successfully refresh expired OAuth token', async () => {
      // Arrange
      const expiredIntegration = {
        ...mockIntegration,
        refreshTokenExpiresAt: new Date(Date.now() - 3600000), // 1 hour ago (expired)
      };

      const refreshedToken = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 3600,
        expiresAt: new Date(Date.now() + 3600000),
      };

      const updatedIntegration = {
        ...expiredIntegration,
        id: 999, // Updated integration ID
        accessToken: refreshedToken.accessToken,
        refreshToken: refreshedToken.refreshToken,
      };

      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockResolvedValue(expiredIntegration);
      vi.mocked(youtubeService.refreshAccessToken)
        .mockResolvedValue(refreshedToken);
      vi.mocked(integrationsService.updateIntegrationAuthCredentials)
        .mockResolvedValue(updatedIntegration);

      // Act
      const result = await buildExecutionContext(mockJobId, mockJobData);

      // Assert
      expect(result).toEqual<ExecutionContext>({
        userId: 456,
        providerId: 1,
        providerName: 'YouTube',
        authToken: 'new_access_token',
        jobData: mockJobData,
        integrationId: 999,
        tokenSource: TokenSource.USER_OAUTH,
      });

      // Verify the refresh flow was called correctly
      expect(youtubeService.refreshAccessToken).toHaveBeenCalledWith('valid_refresh_token');
      expect(integrationsService.updateIntegrationAuthCredentials).toHaveBeenCalledWith({
        providerId: 1,
        userId: '456',
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        accessTokenExpiry: expect.any(Date),
      });
    });

    it('should fallback to master token when OAuth refresh fails', async () => {
      // Arrange
      const expiredIntegration = {
        ...mockIntegration,
        refreshTokenExpiresAt: new Date(Date.now() - 3600000), // 1 hour ago (expired)
      };

      // Set environment variable for master token
      process.env.YOUTUBE_MASTER_ACCESS_TOKEN = 'master_api_token';

      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockResolvedValue(expiredIntegration);
      vi.mocked(youtubeService.refreshAccessToken)
        .mockRejectedValue(new Error('Refresh failed'));

      // Act
      const result = await buildExecutionContext(mockJobId, mockJobData);

      // Assert
      expect(result).toEqual<ExecutionContext>({
        userId: 456,
        providerId: 1,
        providerName: 'YouTube',
        authToken: 'master_api_token',
        jobData: mockJobData,
        integrationId: null,
        tokenSource: TokenSource.MASTER_API_KEY,
      });

      // Verify refresh was attempted but update was not called due to failure
      expect(youtubeService.refreshAccessToken).toHaveBeenCalledWith('valid_refresh_token');
      expect(integrationsService.updateIntegrationAuthCredentials).not.toHaveBeenCalled();

      // Clean up
      delete process.env.YOUTUBE_MASTER_ACCESS_TOKEN;
    });
  });

  describe('Missing user integration scenario', () => {
    it('should use master token when user has no integration', async () => {
      // Arrange
      process.env.YOUTUBE_MASTER_ACCESS_TOKEN = 'master_api_token';

      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockResolvedValue(null);

      // Act
      const result = await buildExecutionContext(mockJobId, mockJobData);

      // Assert
      expect(result).toEqual<ExecutionContext>({
        userId: 456,
        providerId: 1,
        providerName: 'YouTube',
        authToken: 'master_api_token',
        jobData: mockJobData,
        integrationId: null,
        tokenSource: TokenSource.MASTER_API_KEY,
      });

      // Verify no token operations were attempted
      expect(youtubeService.refreshAccessToken).not.toHaveBeenCalled();
      expect(integrationsService.updateIntegrationAuthCredentials).not.toHaveBeenCalled();

      // Clean up
      delete process.env.YOUTUBE_MASTER_ACCESS_TOKEN;
    });
  });

  describe('Complete authentication failure scenario', () => {
    it('should throw IntegrationAuthenticationError when no authentication method available', async () => {
      // Arrange
      delete process.env.YOUTUBE_MASTER_ACCESS_TOKEN;

      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockResolvedValue(null);

      // Act & Assert
      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow(IntegrationAuthenticationError);

      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow(/No valid authentication method available for job 123/);
    });

    it('should throw IntegrationAuthenticationError when job data fetch fails', async () => {
      // Arrange
      vi.mocked(subtaskService.getTaskWithProviderForSubTask)
        .mockRejectedValue(new Error('Job not found'));

      // Act & Assert
      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow(IntegrationAuthenticationError);

      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow(/Failed to build execution context for job 123.*Job not found/);
    });

    it('should preserve IntegrationAuthenticationError when explicitly thrown', async () => {
      // Arrange
      const originalError = new IntegrationAuthenticationError('Custom auth error');
      vi.mocked(subtaskService.getTaskWithProviderForSubTask)
        .mockRejectedValue(originalError);

      // Act & Assert
      await expect(buildExecutionContext(mockJobId, mockJobData))
        .rejects
        .toThrow('Custom auth error');

      // Should be the exact same error, not wrapped
      try {
        await buildExecutionContext(mockJobId, mockJobData);
      } catch (error) {
        expect(error).toBe(originalError);
      }
    });
  });

  describe('Edge cases and validation', () => {
    it('should handle integration with missing access token', async () => {
      // Arrange
      const integrationWithoutToken = {
        ...mockIntegration,
        accessToken: '', // Missing access token
        refreshTokenExpiresAt: new Date(Date.now() + 3600000), // Not expired
      };

      process.env.YOUTUBE_MASTER_ACCESS_TOKEN = 'master_fallback_token';

      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockResolvedValue(integrationWithoutToken);

      // Act
      const result = await buildExecutionContext(mockJobId, mockJobData);

      // Assert - Should fallback to master token
      expect(result.authToken).toBe('master_fallback_token');
      expect(result.tokenSource).toBe(TokenSource.MASTER_API_KEY);

      // Clean up
      delete process.env.YOUTUBE_MASTER_ACCESS_TOKEN;
    });

    it('should handle integration service throwing error (not null return)', async () => {
      // Arrange
      process.env.YOUTUBE_MASTER_ACCESS_TOKEN = 'master_api_token';

      vi.mocked(integrationsService.getIntegrationUserIntegrationByProviderId)
        .mockRejectedValue(new Error('Database connection error'));

      // Act
      const result = await buildExecutionContext(mockJobId, mockJobData);

      // Assert - Should fallback to master token even when service throws
      expect(result.authToken).toBe('master_api_token');
      expect(result.tokenSource).toBe(TokenSource.MASTER_API_KEY);

      // Clean up
      delete process.env.YOUTUBE_MASTER_ACCESS_TOKEN;
    });
  });
});
