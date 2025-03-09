import { IBaseRepository } from "../common/base.repository";

export interface IFeedback {
  id: number;
  userId: string;
  content: string;
  sentiment?: string;
  createdAt: Date;
  // Add other feedback properties as needed
}

export interface IFeedbackRepository
  extends IBaseRepository<IFeedback, number> {
  findByUserId(userId: string): Promise<IFeedback[]>;
  findBySentiment(sentiment: string): Promise<IFeedback[]>;
}
