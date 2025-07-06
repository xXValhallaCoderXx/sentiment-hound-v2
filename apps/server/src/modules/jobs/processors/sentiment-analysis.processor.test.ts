/**
 * Unit Tests for Refactored SentimentAnalysisProcessor
 *
 * Tests the refactored processor using the unified ExecutionContext pattern,
 * covering authentication scenarios, error handling, and database transactions.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SentimentAnalysisProcessor } from './sentiment-analysis.processor';
import { Job } from '../jobs.service';
import { SubTaskType } from '@repo/db';
import {
  ExecutionContext,
  TokenSource,
  IntegrationAuthenticationError,
} from '@repo/services';

// Mock services to avoid circular dependency issues
vi.mock('@repo/services', () => ({
  // Import actual types for the test usage
  ExecutionContext: {},
  TokenSource: {
    USER_OAUTH: 'USER_OAUTH',
    MASTER_API_KEY: 'MASTER_API_KEY',
  },
  IntegrationAuthenticationError: class IntegrationAuthenticationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'IntegrationAuthenticationError';
    }
  },
  // Mock the service instances
  subtaskService: {
    markSubTaskAsFailed: vi.fn(),
    markSubTaskAsCompleted: vi.fn(),
  },
  mentionService: {
    updateMentionSentiment: vi.fn(),
  },
  buildExecutionContext: vi.fn(),
}));

// Mock Prisma
vi.mock('@repo/db', () => ({
  prisma: {
    $transaction: vi.fn(),
    mention: {
      findMany: vi.fn(),
    },
    subTaskMention: {
      createMany: vi.fn(),
      update: vi.fn(),
    },
  },
  SubTaskType: {
    ANALYZE_CONTENT_SENTIMENT: 'ANALYZE_CONTENT_SENTIMENT',
  },
}));

// Mock fetch for API calls
global.fetch = vi.fn();

// Import the mocked modules after vi.mock is set up
import {
  subtaskService,
  mentionService,
  buildExecutionContext,
} from '@repo/services';
import { prisma } from '@repo/db';

describe('SentimentAnalysisProcessor', () => {
  let processor: SentimentAnalysisProcessor;
  let module: TestingModule;

  // Common test data
  const mockJobId = 123;
  const mockJob: Job = {
    id: mockJobId,
    type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
    data: {
      integrationId: 456,
    },
  };

  const mockPendingMentions = [
    {
      id: 1,
      content: 'This is a great product!',
      sentimentStatus: 'PENDING',
    },
    {
      id: 2,
      content: 'Not satisfied with this service.',
      sentimentStatus: 'PENDING',
    },
  ];

  const mockSentimentAnalysisResponse = [
    {
      id: '1',
      text: 'This is a great product!',
      general_sentiment: {
        score: 0.8,
        label: 'POSITIVE',
      },
      aspect_sentiment: [
        {
          aspect: 'product quality',
          sentiment: 'POSITIVE',
        },
      ],
    },
    {
      id: '2',
      text: 'Not satisfied with this service.',
      general_sentiment: {
        score: -0.6,
        label: 'NEGATIVE',
      },
      aspect_sentiment: [
        {
          aspect: 'service quality',
          sentiment: 'NEGATIVE',
        },
      ],
    },
  ];

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [SentimentAnalysisProcessor],
    }).compile();

    processor = module.get<SentimentAnalysisProcessor>(
      SentimentAnalysisProcessor,
    );

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('process method', () => {
    describe('Successful processing with OAuth authentication', () => {
      it('should successfully process mentions with OAuth authentication', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: '456',
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_access_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        // Mock transaction
        (prisma.$transaction as any).mockImplementation(async (callback) => {
          const mockTx = {
            mention: {
              findMany: vi.fn().mockResolvedValue(mockPendingMentions),
            },
            subTaskMention: {
              createMany: vi.fn().mockResolvedValue({ count: 2 }),
            },
          };
          return await callback(mockTx);
        });

        // Mock fetch for sentiment analysis API
        (global.fetch as any).mockResolvedValue({
          json: () => Promise.resolve(mockSentimentAnalysisResponse),
        });

        (mentionService.updateMentionSentiment as any).mockResolvedValue(
          undefined,
        );
        (prisma.subTaskMention.update as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert
        expect(buildExecutionContext).toHaveBeenCalledWith(
          mockJob.id,
          mockJob.data,
        );
        expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/analyze',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: [
                { id: '1', value: 'This is a great product!' },
                { id: '2', value: 'Not satisfied with this service.' },
              ],
            }),
          },
        );
        expect(mentionService.updateMentionSentiment).toHaveBeenCalledTimes(2);
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJob.id,
        );
      });
    });

    describe('Successful processing with master API key', () => {
      it('should successfully process mentions with master API key authentication', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: '456',
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'master_api_key_123',
          jobData: mockJob.data,
          integrationId: null, // Master API key scenario
          tokenSource: TokenSource.MASTER_API_KEY,
          authMethod: 'API_KEY',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        // Mock transaction - should query by userId and providerId instead of integrationId
        (prisma.$transaction as any).mockImplementation(async (callback) => {
          const mockTx = {
            mention: {
              findMany: vi.fn().mockImplementation((params) => {
                // Verify the query uses userId and providerId for master API key
                expect(params.where.post.userId).toBe('456');
                expect(params.where.post.providerId).toBe(1);
                expect(params.where.post.integrationId).toBeUndefined();
                return Promise.resolve(mockPendingMentions);
              }),
            },
            subTaskMention: {
              createMany: vi.fn().mockResolvedValue({ count: 2 }),
            },
          };
          return await callback(mockTx);
        });

        (global.fetch as any).mockResolvedValue({
          json: () => Promise.resolve(mockSentimentAnalysisResponse),
        });

        (mentionService.updateMentionSentiment as any).mockResolvedValue(
          undefined,
        );
        (prisma.subTaskMention.update as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert
        expect(buildExecutionContext).toHaveBeenCalledWith(
          mockJob.id,
          mockJob.data,
        );
        expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJob.id,
        );
      });
    });

    describe('ExecutionContext building failure', () => {
      it('should handle IntegrationAuthenticationError and mark job as failed', async () => {
        // Arrange
        const authError = new IntegrationAuthenticationError('Invalid token');
        (buildExecutionContext as any).mockRejectedValue(authError);

        // Act
        await processor.process(mockJob);

        // Assert
        expect(buildExecutionContext).toHaveBeenCalledWith(
          mockJob.id,
          mockJob.data,
        );
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJob.id),
          'Invalid token',
        );
        expect(prisma.$transaction).not.toHaveBeenCalled();
      });
    });

    describe('No pending mentions scenario', () => {
      it('should complete job immediately when no pending mentions found', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: '456',
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_access_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        // Mock transaction with no mentions
        (prisma.$transaction as any).mockImplementation(async (callback) => {
          const mockTx = {
            mention: {
              findMany: vi.fn().mockResolvedValue([]), // No pending mentions
            },
            subTaskMention: {
              createMany: vi.fn().mockResolvedValue({ count: 0 }),
            },
          };
          return await callback(mockTx);
        });

        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert
        expect(buildExecutionContext).toHaveBeenCalledWith(
          mockJob.id,
          mockJob.data,
        );
        expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
        expect(global.fetch).not.toHaveBeenCalled(); // No API call should be made
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJob.id,
        );
      });
    });

    describe('Batch processing', () => {
      it('should handle batch processing correctly when there are many mentions', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: '456',
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_access_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        // Create 30 mock mentions to test batching (batch size is 25)
        const largeMentionList = Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          content: `Test comment ${i + 1}`,
          sentimentStatus: 'PENDING',
        }));

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        (prisma.$transaction as any).mockImplementation(async (callback) => {
          const mockTx = {
            mention: {
              findMany: vi.fn().mockResolvedValue(largeMentionList),
            },
            subTaskMention: {
              createMany: vi.fn().mockResolvedValue({ count: 30 }),
            },
          };
          return await callback(mockTx);
        });

        // Mock two separate API responses for two batches
        (global.fetch as any)
          .mockResolvedValueOnce({
            json: () =>
              Promise.resolve(
                Array.from({ length: 25 }, (_, i) => ({
                  id: String(i + 1),
                  text: `Test comment ${i + 1}`,
                  general_sentiment: { score: 0.5, label: 'NEUTRAL' },
                  aspect_sentiment: [],
                })),
              ),
          })
          .mockResolvedValueOnce({
            json: () =>
              Promise.resolve(
                Array.from({ length: 5 }, (_, i) => ({
                  id: String(i + 26),
                  text: `Test comment ${i + 26}`,
                  general_sentiment: { score: 0.5, label: 'NEUTRAL' },
                  aspect_sentiment: [],
                })),
              ),
          });

        (mentionService.updateMentionSentiment as any).mockResolvedValue(
          undefined,
        );
        (prisma.subTaskMention.update as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert
        expect(global.fetch).toHaveBeenCalledTimes(2); // Two batches
        expect(mentionService.updateMentionSentiment).toHaveBeenCalledTimes(30);
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJob.id,
        );
      });
    });

    describe('Error handling in sentiment processing', () => {
      it('should handle individual mention update failures', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: '456',
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_access_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        (prisma.$transaction as any).mockImplementation(async (callback) => {
          const mockTx = {
            mention: {
              findMany: vi.fn().mockResolvedValue(mockPendingMentions),
            },
            subTaskMention: {
              createMany: vi.fn().mockResolvedValue({ count: 2 }),
            },
          };
          return await callback(mockTx);
        });

        (global.fetch as any).mockResolvedValue({
          json: () => Promise.resolve(mockSentimentAnalysisResponse),
        });

        // Make one mention update fail
        (mentionService.updateMentionSentiment as any)
          .mockResolvedValueOnce(undefined) // First mention succeeds
          .mockRejectedValueOnce(new Error('Database error')); // Second mention fails

        (prisma.subTaskMention.update as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert
        expect(mentionService.updateMentionSentiment).toHaveBeenCalledTimes(2);
        expect(prisma.subTaskMention.update).toHaveBeenCalledTimes(2); // 1 success + 1 failure update
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJob.id,
        );
      });

      it('should handle batch processing failures gracefully', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: '456',
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_access_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        (prisma.$transaction as any).mockImplementation(async (callback) => {
          const mockTx = {
            mention: {
              findMany: vi.fn().mockResolvedValue(mockPendingMentions),
            },
            subTaskMention: {
              createMany: vi.fn().mockResolvedValue({ count: 2 }),
            },
          };
          return await callback(mockTx);
        });

        // Make the API call fail
        (global.fetch as any).mockRejectedValue(
          new Error('API service unavailable'),
        );
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert
        expect(global.fetch).toHaveBeenCalled();
        expect(mentionService.updateMentionSentiment).not.toHaveBeenCalled();
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJob.id,
        );
      });
    });

    describe('General error handling', () => {
      it('should handle unexpected errors and mark job as failed', async () => {
        // Arrange
        const unexpectedError = new Error('Unexpected database failure');
        (buildExecutionContext as any).mockRejectedValue(unexpectedError);

        // Act
        await processor.process(mockJob);

        // Assert
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJob.id),
          'Unexpected database failure',
        );
      });
    });
  });

  describe('chunkArray helper method', () => {
    it('should correctly split array into chunks of specified size', () => {
      // Arrange
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const chunkSize = 3;

      // Act
      const result = processor['chunkArray'](testArray, chunkSize);

      // Assert
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });

    it('should handle empty arrays', () => {
      // Arrange
      const testArray = [];
      const chunkSize = 5;

      // Act
      const result = processor['chunkArray'](testArray, chunkSize);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
