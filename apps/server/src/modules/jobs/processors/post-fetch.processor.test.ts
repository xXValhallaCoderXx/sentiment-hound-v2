/**
 * Unit Tests for Refactored PostFetchProcessor
 *
 * Tests the refactored processor using the unified ExecutionContext pattern,
 * covering authentication scenarios, error handling, and data flow validation.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PostFetchProcessor } from './post-fetch.processor';
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
    createMention: vi.fn(),
  },
  postService: {
    createUserPosts: vi.fn(),
    findPostsBasedOnRemoteIds: vi.fn(),
  },
  youtubeService: {
    fetchSingleYoutubeVideo: vi.fn(),
  },
  buildExecutionContext: vi.fn(),
}));

// Import the mocked modules after vi.mock is set up
import {
  subtaskService,
  mentionService,
  postService,
  youtubeService,
  buildExecutionContext,
} from '@repo/services';

describe('PostFetchProcessor', () => {
  let processor: PostFetchProcessor;
  let module: TestingModule;

  // Common test data
  const mockJobId = 123;
  const mockJob: Job = {
    id: mockJobId,
    type: SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT,
    data: {
      url: 'https://youtube.com/watch?v=test123',
      integrationId: 456,
    },
  };

  const mockYouTubeVideoResult = {
    id: 'test123',
    title: 'Test Video Title',
    description: 'Test video description',
    publishedAt: '2023-01-01T00:00:00Z',
    thumbnail: 'https://example.com/thumbnail.jpg',
    statistics: {
      commentCount: '5',
      viewCount: '1000',
    },
    comments: [
      {
        id: 'comment1',
        textOriginal: 'Great video!',
        authorDisplayName: 'User1',
      },
      {
        id: 'comment2',
        textOriginal: 'Thanks for sharing',
        authorDisplayName: 'User2',
      },
    ],
  };

  const mockCreatedPost = [
    {
      id: 789,
      remoteId: 'test123',
      title: 'Test Video Title',
    },
  ];

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PostFetchProcessor],
    }).compile();

    processor = module.get<PostFetchProcessor>(PostFetchProcessor);

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('process method', () => {
    describe('Successful YouTube video processing with user OAuth token', () => {
      it('should successfully process video with OAuth authentication', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: 456,
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_access_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);
        (youtubeService.fetchSingleYoutubeVideo as any).mockResolvedValue(
          mockYouTubeVideoResult,
        );
        (postService.createUserPosts as any).mockResolvedValue(undefined);
        (postService.findPostsBasedOnRemoteIds as any).mockResolvedValue(
          mockCreatedPost,
        );
        (mentionService.createMention as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert - ExecutionContext building
        expect(buildExecutionContext).toHaveBeenCalledWith(
          mockJobId,
          mockJob.data,
        );

        // Assert - YouTube API call with OAuth token
        expect(youtubeService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          'oauth_access_token_123',
          'OAUTH',
          'https://youtube.com/watch?v=test123',
        );

        // Assert - Post creation with correct ExecutionContext IDs
        expect(postService.createUserPosts).toHaveBeenCalledWith([
          expect.objectContaining({
            userId: '456',
            providerId: 1,
            integrationId: 789,
            title: 'Test Video Title',
            remoteId: 'test123',
            postUrl: 'https://youtube.com/watch?v=test123',
          }),
        ]);

        // Assert - Comment creation
        expect(mentionService.createMention).toHaveBeenCalledTimes(2);
        expect(mentionService.createMention).toHaveBeenCalledWith({
          data: expect.objectContaining({
            content: 'Great video!',
            remoteId: 'comment1',
            sourceType: 'YOUTUBE',
            post: { connect: { id: 789 } },
          }),
        });

        // Assert - Job completion
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJobId,
        );
        expect(subtaskService.markSubTaskAsFailed).not.toHaveBeenCalled();
      });
    });

    describe('Successful YouTube video processing with master API key', () => {
      it('should successfully process video with master API key fallback', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: 456,
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'AIzaSyC_master_api_key_123',
          jobData: mockJob.data,
          integrationId: null, // No user integration
          tokenSource: TokenSource.MASTER_API_KEY,
          authMethod: 'API_KEY',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);
        (youtubeService.fetchSingleYoutubeVideo as any).mockResolvedValue(
          mockYouTubeVideoResult,
        );
        (postService.createUserPosts as any).mockResolvedValue(undefined);
        (postService.findPostsBasedOnRemoteIds as any).mockResolvedValue(
          mockCreatedPost,
        );
        (mentionService.createMention as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert - YouTube API call with master API key
        expect(youtubeService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          'AIzaSyC_master_api_key_123',
          'API_KEY',
          'https://youtube.com/watch?v=test123',
        );

        // Assert - Post creation with null integrationId
        expect(postService.createUserPosts).toHaveBeenCalledWith([
          expect.objectContaining({
            userId: '456',
            providerId: 1,
            integrationId: null,
            title: 'Test Video Title',
          }),
        ]);

        // Assert - Successful completion
        expect(subtaskService.markSubTaskAsCompleted).toHaveBeenCalledWith(
          mockJobId,
        );
      });
    });

    describe('Authentication failure scenario', () => {
      it('should handle authentication failure gracefully', async () => {
        // Arrange
        const authError = new IntegrationAuthenticationError(
          'No valid authentication method available for job 123',
        );

        (buildExecutionContext as any).mockRejectedValue(authError);

        // Act
        await processor.process(mockJob);

        // Assert - Error handling
        expect(buildExecutionContext).toHaveBeenCalledWith(
          mockJobId,
          mockJob.data,
        );
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJobId),
          'Authentication failed: No valid authentication method available for job 123',
        );

        // Assert - No further processing
        expect(youtubeService.fetchSingleYoutubeVideo).not.toHaveBeenCalled();
        expect(postService.createUserPosts).not.toHaveBeenCalled();
        expect(subtaskService.markSubTaskAsCompleted).not.toHaveBeenCalled();
      });
    });

    describe('Unsupported provider scenario', () => {
      it('should throw error for unsupported providers', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: 456,
          providerId: 2,
          providerName: 'TikTok', // Unsupported provider
          authToken: 'tiktok_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        // Act
        await processor.process(mockJob);

        // Assert - Provider validation
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJobId),
          'Provider TikTok not supported',
        );

        // Assert - No YouTube processing
        expect(youtubeService.fetchSingleYoutubeVideo).not.toHaveBeenCalled();
        expect(subtaskService.markSubTaskAsCompleted).not.toHaveBeenCalled();
      });
    });

    describe('Missing video URL scenario', () => {
      it('should fail gracefully when video URL is missing', async () => {
        // Arrange
        const jobWithoutUrl: Job = {
          id: mockJobId,
          type: SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT,
          data: {
            integrationId: 456,
            // url is missing
          },
        };

        const mockContext: ExecutionContext = {
          userId: 456,
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_token_123',
          jobData: jobWithoutUrl.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);

        // Act
        await processor.process(jobWithoutUrl);

        // Assert - URL validation
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJobId),
          'No video URL provided',
        );

        // Assert - No further processing
        expect(youtubeService.fetchSingleYoutubeVideo).not.toHaveBeenCalled();
        expect(subtaskService.markSubTaskAsCompleted).not.toHaveBeenCalled();
      });
    });

    describe('YouTube API failure scenario', () => {
      it('should handle YouTube API failures gracefully', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: 456,
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);
        (youtubeService.fetchSingleYoutubeVideo as any).mockResolvedValue(null);

        // Act
        await processor.process(mockJob);

        // Assert - Error handling for YouTube failure
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJobId),
          expect.stringContaining('Processing failed:'),
        );

        // Assert - No database operations
        expect(postService.createUserPosts).not.toHaveBeenCalled();
        expect(subtaskService.markSubTaskAsCompleted).not.toHaveBeenCalled();
      });
    });

    describe('Post creation failure scenario', () => {
      it('should handle post creation failures', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: 456,
          providerId: 1,
          providerName: 'YouTube',
          authToken: 'oauth_token_123',
          jobData: mockJob.data,
          integrationId: 789,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);
        (youtubeService.fetchSingleYoutubeVideo as any).mockResolvedValue(
          mockYouTubeVideoResult,
        );
        (postService.createUserPosts as any).mockResolvedValue(undefined);
        (postService.findPostsBasedOnRemoteIds as any).mockResolvedValue([]); // No post found

        // Act
        await processor.process(mockJob);

        // Assert - Error handling for post creation failure
        expect(subtaskService.markSubTaskAsFailed).toHaveBeenCalledWith(
          String(mockJobId),
          expect.stringContaining('Processing failed:'),
        );

        // Assert - No comment creation
        expect(mentionService.createMention).not.toHaveBeenCalled();
        expect(subtaskService.markSubTaskAsCompleted).not.toHaveBeenCalled();
      });
    });

    describe('Data flow validation', () => {
      it('should use correct IDs from ExecutionContext throughout the flow', async () => {
        // Arrange
        const mockContext: ExecutionContext = {
          userId: 999, // Different from jobData to ensure context is used
          providerId: 3,
          providerName: 'YouTube',
          authToken: 'test_token',
          jobData: mockJob.data,
          integrationId: 888,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };

        (buildExecutionContext as any).mockResolvedValue(mockContext);
        (youtubeService.fetchSingleYoutubeVideo as any).mockResolvedValue(
          mockYouTubeVideoResult,
        );
        (postService.createUserPosts as any).mockResolvedValue(undefined);
        (postService.findPostsBasedOnRemoteIds as any).mockResolvedValue(
          mockCreatedPost,
        );
        (mentionService.createMention as any).mockResolvedValue(undefined);
        (subtaskService.markSubTaskAsCompleted as any).mockResolvedValue(
          undefined,
        );

        // Act
        await processor.process(mockJob);

        // Assert - All IDs come from ExecutionContext
        const postCreationCall = (postService.createUserPosts as any).mock
          .calls[0][0][0];
        expect(postCreationCall.userId).toBe('999'); // From context, not job data
        expect(postCreationCall.providerId).toBe(3); // From context
        expect(postCreationCall.integrationId).toBe(888); // From context

        // Assert - Comment count handling
        expect(postCreationCall.commentCount).toBe(5);
        expect(mentionService.createMention).toHaveBeenCalledTimes(2);
      });
    });
  });
});
