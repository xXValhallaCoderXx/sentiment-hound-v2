export enum SentimentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface IComment {
  id: number;
  commentId: string;
  content: string;
  sentiment?: number;
  sentimentStatus: SentimentStatus;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentRepository {
  create(comment: Partial<IComment>): Promise<IComment>;
  findById(id: number): Promise<IComment | null>;
  findByPostId(postId: number): Promise<IComment[]>;
  update(id: number, data: Partial<IComment>): Promise<IComment>;
  delete(id: number): Promise<void>;
  updateSentiment(id: number, sentiment: number): Promise<IComment>;
}

export interface ICommentService {
  createComment(postId: number, content: string): Promise<IComment>;
  getComment(id: number): Promise<IComment>;
  getPostComments(postId: number): Promise<IComment[]>;
  updateComment(id: number, data: Partial<IComment>): Promise<IComment>;
  deleteComment(id: number): Promise<void>;
  analyzeSentiment(id: number): Promise<IComment>;
}
