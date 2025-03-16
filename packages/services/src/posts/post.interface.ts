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
