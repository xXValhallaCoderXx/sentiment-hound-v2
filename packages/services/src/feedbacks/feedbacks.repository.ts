import { BaseRepository } from "../common/base.repository";
import { IFeedback, IFeedbackRepository } from "./feedbacks.interface";

export class FeedbackRepository
  extends BaseRepository<IFeedback, number>
  implements IFeedbackRepository
{
  constructor(prisma: any) {
    super(prisma, "feedback");
  }

  async findByUserId(userId: string): Promise<IFeedback[]> {
    return this.findMany({ userId });
  }

  async findBySentiment(sentiment: string): Promise<IFeedback[]> {
    return this.findMany({ sentiment });
  }
}
