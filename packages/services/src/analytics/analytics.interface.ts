import { IBaseRepository } from "../common/base.repository";

export interface IAnalytics {
  id: number;
  userId: string;
  type: string;
  data: any;
  createdAt: Date;
  // Add other analytics properties as needed
}

export interface IAnalyticsRepository
  extends IBaseRepository<IAnalytics, number> {
  findByUserId(userId: string): Promise<IAnalytics[]>;
  findByType(type: string): Promise<IAnalytics[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<IAnalytics[]>;
}
