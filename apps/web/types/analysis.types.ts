/**
 * TypeScript interfaces for analysis data structures
 * Based on the My Analyses Dashboard - List View PRD specifications
 */

import { TaskStatus } from "@repo/db";

/**
 * Main interface for analysis data as specified in the PRD
 * Maps database Task records with computed analysis metadata
 */
export interface AnalysisData {
  id: string; // Task ID converted to string for frontend consistency
  url: string; // Original URL that was analyzed
  title: string; // Auto-extracted from URL metadata during analysis
  status: "PROCESSING" | "COMPLETED" | "FAILED"; // Mapped from TaskStatus enum
  overallScore: number; // Float between -1.0 and 1.0, computed from sentiment analysis
  commentCount: number; // Total analyzed comments from source
  createdAt: Date; // When the analysis task was created
}

/**
 * Raw database Task record with additional computed fields
 * Used internally for data transformation
 */
export interface TaskWithAnalysisData {
  id: number;
  type: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // Related data for analysis computation
  posts?: {
    id: number;
    title: string;
    postUrl: string;
    commentCount: number;
    mentions: {
      sentiment: string | null;
    }[];
  }[];
  // Computed analysis metadata
  overallScore?: number;
  title?: string;
  url?: string;
}

/**
 * Props interface for AnalysisCard component
 */
export interface AnalysisCardProps {
  analysis: AnalysisData;
  onClick?: () => void;
  className?: string;
}

/**
 * Response type for getUserAnalyses server action
 */
export interface GetUserAnalysesResponse {
  analyses: AnalysisData[];
  total: number;
}

/**
 * Status mapping for TaskStatus to frontend status strings
 */
export const TASK_STATUS_MAP: Record<TaskStatus, AnalysisData["status"]> = {
  PENDING: "PROCESSING",
  IN_PROGRESS: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

/**
 * Task type filter for analysis tasks
 */
export const ANALYSIS_TASK_TYPE = "ANALYZE_POST" as const;
