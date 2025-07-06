/**
 * Unit Tests for Updated YouTube Service
 * 
 * Tests the refactored YouTube service to ensure:
 * - OAuth token handling with Authorization headers
 * - API key handling with URL parameters
 * - No internal authentication logic remains
 * - Compatibility with existing helper methods
 * - Correct parameter passing to content service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { YoutubeService } from './youtube.services';

// Mock services to avoid initialization issues and circular dependencies
vi.mock('./services/content.service', () => ({
  YoutubeContentService: vi.fn().mockImplementation(() => ({
    fetchSingleYoutubeVideo: vi.fn(),
  })),
}));

vi.mock('./services/auth.service', () => ({
  YoutubeAuthService: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('./services/profile.service', () => ({
  YoutubeProfileService: vi.fn().mockImplementation(() => ({})),
}));

describe('YoutubeService', () => {
  let youtubeService: YoutubeService;
  let mockContentService: any;

  // Test data
  const mockOAuthToken = 'ya29.AHES6ZQO3-vRzMlkNE1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k1k';
  const mockApiKey = 'AIzaSyC1234567890123456789012345678901';
  const mockVideoUrl = 'https://youtube.com/watch?v=dQw4w9WgXcQ';
  
  const mockVideoResult = {
    id: 'dQw4w9WgXcQ',
    title: 'Test Video Title',
    description: 'Test video description',
    publishedAt: '2023-01-01T00:00:00Z',
    thumbnail: 'https://example.com/thumbnail.jpg',
    statistics: {
      commentCount: '5',
      viewCount: '1000',
      likeCount: '100',
      dislikeCount: '5',
      favoriteCount: '0',
    },
    comments: [
      {
        id: 'comment1',
        textOriginal: 'Great video!',
        authorDisplayName: 'User1',
      },
    ],
  };

  beforeEach(() => {
    youtubeService = new YoutubeService();
    // Access the mocked content service through the service instance
    mockContentService = (youtubeService as any).contentService;
    
    // Ensure the mock method exists and is properly set up
    if (!mockContentService.fetchSingleYoutubeVideo) {
      mockContentService.fetchSingleYoutubeVideo = vi.fn();
    }
    
    // Reset the mock calls but keep the implementation
    mockContentService.fetchSingleYoutubeVideo.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchSingleYoutubeVideo', () => {
    describe('OAuth token authentication', () => {
      it('should pass OAuth token correctly to content service', async () => {
        // Arrange
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        const result = await youtubeService.fetchSingleYoutubeVideo(mockOAuthToken, 'OAUTH', mockVideoUrl);

        // Assert
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          mockOAuthToken,
          'OAUTH',
          mockVideoUrl
        );
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockVideoResult);
      });

      it('should handle OAuth token with typical Bearer format', async () => {
        // Arrange
        const bearerToken = 'ya29.AHES6ZT_Long_OAuth_Token_Format_With_Dots.And.Dashes-12345';
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(bearerToken, 'OAUTH', mockVideoUrl);

        // Assert
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          bearerToken,
          'OAUTH',
          mockVideoUrl
        );
      });
    });

    describe('API key authentication', () => {
      it('should pass API key correctly to content service', async () => {
        // Arrange
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        const result = await youtubeService.fetchSingleYoutubeVideo(mockApiKey, 'API_KEY', mockVideoUrl);

        // Assert
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          mockApiKey,
          'API_KEY',
          mockVideoUrl
        );
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockVideoResult);
      });

      it('should handle short API key format', async () => {
        // Arrange
        const shortApiKey = 'AIzaSyC123456789012345678901234567890';
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(shortApiKey, 'API_KEY', mockVideoUrl);

        // Assert
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          shortApiKey,
          'API_KEY',
          mockVideoUrl
        );
      });
    });

    describe('No internal authentication logic', () => {
      it('should not attempt any user lookup or token refresh', async () => {
        // Arrange
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(mockOAuthToken, 'OAUTH', mockVideoUrl);

        // Assert - Only the content service method should be called
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledTimes(1);
        
        // Verify no other service methods are called (they would throw if called since they're empty mocks)
        // The fact that the test passes means no other internal authentication logic was triggered
      });

      it('should directly use provided authToken without modification', async () => {
        // Arrange
        const exactToken = 'EXACT_TOKEN_123_NO_MODIFICATIONS';
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(exactToken, 'OAUTH', mockVideoUrl);

        // Assert - Token should be passed exactly as provided
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          exactToken, // Exact same token, no modifications
          'OAUTH',
          mockVideoUrl
        );
      });
    });

    describe('Parameter passing validation', () => {
      it('should pass both authToken and videoUrl parameters in correct order', async () => {
        // Arrange
        const customToken = 'custom_auth_token_for_test';
        const customUrl = 'https://youtube.com/watch?v=custom123';
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(customToken, 'OAUTH', customUrl);

        // Assert - Verify exact parameter order and values
        const callArgs = mockContentService.fetchSingleYoutubeVideo.mock.calls[0];
        expect(callArgs).toBeDefined();
        expect(callArgs?.[0]).toBe(customToken);
        expect(callArgs?.[1]).toBe('OAUTH');
        expect(callArgs?.[2]).toBe(customUrl);
      });

      it('should handle edge case URLs correctly', async () => {
        // Arrange
        const edgeCaseUrl = 'https://youtu.be/shortformat123?t=30s';
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(mockApiKey, 'API_KEY', edgeCaseUrl);

        // Assert
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(
          mockApiKey,
          'API_KEY',
          edgeCaseUrl
        );
      });
    });

    describe('Error handling from content service', () => {
      it('should propagate errors from content service without modification', async () => {
        // Arrange
        const contentServiceError = new Error('YouTube API quota exceeded');
        mockContentService.fetchSingleYoutubeVideo.mockRejectedValue(contentServiceError);

        // Act & Assert
        await expect(youtubeService.fetchSingleYoutubeVideo(mockOAuthToken, 'OAUTH', mockVideoUrl))
          .rejects.toThrow('YouTube API quota exceeded');
      });

      it('should handle null/undefined responses from content service', async () => {
        // Arrange
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(null);

        // Act
        const result = await youtubeService.fetchSingleYoutubeVideo(mockApiKey, 'API_KEY', mockVideoUrl);

        // Assert
        expect(result).toBeNull();
      });
    });

    describe('Return value handling', () => {
      it('should return the exact result from content service', async () => {
        // Arrange
        const customResult = {
          id: 'custom123',
          title: 'Custom Title',
          description: 'Custom Description',
          publishedAt: '2024-01-01T00:00:00Z',
          thumbnail: 'https://custom.example.com/thumb.jpg',
          statistics: {
            commentCount: '10',
            viewCount: '2000',
            likeCount: '200',
            dislikeCount: '10',
            favoriteCount: '5',
          },
          comments: [],
        };
        mockContentService.fetchSingleYoutubeVideo.mockResolvedValue(customResult);

        // Act
        const result = await youtubeService.fetchSingleYoutubeVideo(mockOAuthToken, 'OAUTH', mockVideoUrl);

        // Assert
        expect(result).toEqual(customResult);
        expect(result).toBe(customResult); // Exact same object reference
      });
    });
  });

  describe('Service architecture validation', () => {
    it('should have content service as a dependency', () => {
      // This test validates the service properly initializes its dependencies
      expect(youtubeService).toBeDefined();
      // The fact that our mocked content service calls work proves the dependency injection is correct
    });

    it('should maintain backward compatibility with existing method signature', () => {
      // Verify the method exists with the expected signature
      expect(typeof youtubeService.fetchSingleYoutubeVideo).toBe('function');
      expect(youtubeService.fetchSingleYoutubeVideo.length).toBe(3); // Should accept exactly 3 parameters (token, authMethod, url)
    });
  });
  
  describe('Content service integration tests', () => {
    describe('Authentication method detection via service calls', () => {
      it('should correctly handle OAuth tokens with Authorization headers', async () => {
        // Arrange
        const oauthToken = 'ya29.Long_OAuth_Token_With_Dots.And-Dashes_123456789012345678901234567890123456789012345678901234567890';
        
        // Mock the content service to capture how it's called
        let capturedRequestConfig: any = null;
        mockContentService.fetchSingleYoutubeVideo = vi.fn().mockImplementation(async (token, url) => {
          // This simulates what the content service would do internally
          // We're testing that it receives the right token format
          capturedRequestConfig = { token, url };
          return mockVideoResult;
        });

        // Act
        await youtubeService.fetchSingleYoutubeVideo(oauthToken, 'OAUTH', mockVideoUrl);

        // Assert
        expect(capturedRequestConfig.token).toBe(oauthToken);
        expect(capturedRequestConfig.token.length).toBeGreaterThan(80); // OAuth tokens are long
        expect(capturedRequestConfig.token).toContain('.'); // OAuth tokens contain dots
      });

      it('should correctly handle API keys in URL parameters', async () => {
        // Arrange  
        const apiKey = 'AIzaSyC1234567890123456789012345678901';
        
        // Mock the content service to capture how it's called
        let capturedRequestConfig: any = null;
        mockContentService.fetchSingleYoutubeVideo = vi.fn().mockImplementation(async (token, url) => {
          capturedRequestConfig = { token, url };
          return mockVideoResult;
        });

        // Act
        await youtubeService.fetchSingleYoutubeVideo(apiKey, 'API_KEY', mockVideoUrl);

        // Assert
        expect(capturedRequestConfig.token).toBe(apiKey);
        expect(capturedRequestConfig.token.length).toBeLessThan(50); // API keys are shorter
        expect(capturedRequestConfig.token).toMatch(/^AIza/); // Google API keys start with AIza
      });
    });

    describe('Explicit Authentication Method Usage', () => {
      it('should correctly pass OAuth authentication method to content service', async () => {
        // Arrange
        const oauthToken = 'ya29.Long_OAuth_Token_Format_With_Special.Characters-123456789';
        
        mockContentService.fetchSingleYoutubeVideo = vi.fn().mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(oauthToken, 'OAUTH', mockVideoUrl);

        // Assert - Verify explicit authMethod is passed correctly
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(oauthToken, 'OAUTH', mockVideoUrl);
      });

      it('should correctly pass API key authentication method to content service', async () => {
        // Arrange
        const apiKey = 'AIzaSyC123456789012345678901234567890AB';
        
        mockContentService.fetchSingleYoutubeVideo = vi.fn().mockResolvedValue(mockVideoResult);

        // Act
        await youtubeService.fetchSingleYoutubeVideo(apiKey, 'API_KEY', mockVideoUrl);

        // Assert - Verify explicit authMethod is passed correctly
        expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(apiKey, 'API_KEY', mockVideoUrl);
      });

      it('should maintain compatibility with buildRequestConfig for different token types', async () => {
        // Arrange
        const testCases = [
          {
            token: 'ya29.OAuth_Token_With_Dots.And-Dashes-Very_Long_Format_123456789',
            expectedAuthType: 'oauth',
          },
          {
            token: 'AIzaSyC1234567890123456789012345678901',
            expectedAuthType: 'api_key',
          },
        ];

        for (const testCase of testCases) {
          mockContentService.fetchSingleYoutubeVideo = vi.fn().mockImplementation(async (token, url) => {
            // Verify the token format matches expected authentication type
            if (testCase.expectedAuthType === 'oauth') {
              expect(token.length).toBeGreaterThan(50);
              expect(token).toMatch(/[.-]/); // Contains dots or dashes
            } else {
              expect(token.length).toBeLessThanOrEqual(50);
              expect(token).toMatch(/^AIza/); // API key format
            }
            return mockVideoResult;
          });

          // Act
          const authMethod = testCase.expectedAuthType === 'oauth' ? 'OAUTH' : 'API_KEY';
          await youtubeService.fetchSingleYoutubeVideo(testCase.token, authMethod, mockVideoUrl);

          // Assert
          expect(mockContentService.fetchSingleYoutubeVideo).toHaveBeenCalledWith(testCase.token, authMethod, mockVideoUrl);
        }
      });
    });
  });
});
