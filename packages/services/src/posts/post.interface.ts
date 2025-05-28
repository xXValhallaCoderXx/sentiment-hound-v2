import { Post, Comment } from "@repo/db";
export interface ICreatePost {
  id: number;
  title: string;
  content: string;
  userId: string;
  commentCount: number;
  description: string;
  publishedAt: Date;
  imageUrl: string;
  postUrl: string;
  remoteId: string;
  integrationId: number;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export type ProcessedPost = Post & {
  comments: Comment[];
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentimentPercentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  aspectAnalyses: {
    positive: Record<string, number>;
    neutral: Record<string, number>;
    negative: Record<string, number>;
  };
};
