export interface IAspectAnalysis {
  id: number;
  aspect: string;
  sentiment: number;
  commentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAspectAnalysisRepository {
  create(analysis: Partial<IAspectAnalysis>): Promise<IAspectAnalysis>;
  findById(id: number): Promise<IAspectAnalysis | null>;
  findByCommentId(commentId: number): Promise<IAspectAnalysis[]>;
  update(id: number, data: Partial<IAspectAnalysis>): Promise<IAspectAnalysis>;
  delete(id: number): Promise<void>;
}

export interface IAspectAnalysisService {
  createAspectAnalysis(
    commentId: number,
    aspect: string,
    sentiment: number
  ): Promise<IAspectAnalysis>;
  getAspectAnalysis(id: number): Promise<IAspectAnalysis>;
  getCommentAspects(commentId: number): Promise<IAspectAnalysis[]>;
  updateAspectAnalysis(
    id: number,
    data: Partial<IAspectAnalysis>
  ): Promise<IAspectAnalysis>;
  deleteAspectAnalysis(id: number): Promise<void>;
}
