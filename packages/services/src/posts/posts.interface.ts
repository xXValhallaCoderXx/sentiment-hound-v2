export interface IPost {
  id: number;
  remoteId: string;
  title: string;
  description?: string;
  postUrl: string;
  imageUrl?: string;
  publishedAt: Date;
  isBlacklisted: boolean;
  commentCount: number;
  userId: string;
  integrationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostRepository {
  create(post: Partial<IPost>): Promise<IPost>;
  findById(id: number): Promise<IPost | null>;
  findByUserId(userId: string): Promise<IPost[]>;
  update(id: number, data: Partial<IPost>): Promise<IPost>;
  delete(id: number): Promise<void>;
  findByIntegrationId(integrationId: number): Promise<IPost[]>;
}

export interface IPostService {
  createPost(integrationId: number, postData: Partial<IPost>): Promise<IPost>;
  getPost(id: number): Promise<IPost>;
  getUserPosts(userId: string): Promise<IPost[]>;
  updatePost(id: number, data: Partial<IPost>): Promise<IPost>;
  deletePost(id: number): Promise<void>;
}
