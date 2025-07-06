/**
 * Utility functions for sentiment score calculations and formatting
 * Used by the My Analyses Dashboard components
 */

import { AnalysisData } from '@/types/analysis.types';

/**
 * Status badge color mapping using Mantine theme colors
 * Maps analysis status to specific theme color names
 */
export const STATUS_BADGE_COLOR_MAP: Record<AnalysisData['status'], string> = {
  PROCESSING: 'warning', // Yellow/amber background for processing status
  COMPLETED: 'success',  // Green background for completed status
  FAILED: 'error',       // Red background for failed status
} as const;

/**
 * Converts raw sentiment score (-1.0 to 1.0) to positivity percentage
 * Example: 0.64 becomes "82% Positive"
 * @param rawScore - Float between -1.0 and 1.0
 * @returns Formatted positivity percentage string
 */
export function convertSentimentToPositivityPercentage(rawScore: number): string {
  // Clamp the score to ensure it's within valid range
  const clampedScore = Math.max(-1, Math.min(1, rawScore));
  
  // Convert (-1 to 1) range to (0 to 100) percentage
  const percentage = Math.round(((clampedScore + 1) / 2) * 100);
  
  return `${percentage}% Positive`;
}

/**
 * Converts raw sentiment score (-1.0 to 1.0) to positivity percentage number
 * Example: 0.64 becomes 82
 * @param rawScore - Float between -1.0 and 1.0
 * @returns Positivity percentage as number
 */
export function sentimentToPercentage(rawScore: number): number {
  // Clamp the score to ensure it's within valid range
  const clampedScore = Math.max(-1, Math.min(1, rawScore));
  
  // Convert (-1 to 1) range to (0 to 100) percentage
  return Math.round(((clampedScore + 1) / 2) * 100);
}

/**
 * Gets the appropriate Mantine Badge color for analysis status
 * Maps to existing theme colors: yellow/amber for PROCESSING, green for COMPLETED, red for FAILED
 * @param status - Analysis status from AnalysisData
 * @returns Mantine Badge color string
 */
export function getStatusBadgeColor(status: AnalysisData['status']): string {
  return STATUS_BADGE_COLOR_MAP[status] || 'gray';
}

/**
 * Gets user-friendly status label for display
 * @param status - Analysis status from AnalysisData
 * @returns Formatted status label
 */
export function getStatusLabel(status: AnalysisData['status']): string {
  switch (status) {
    case 'PROCESSING':
      return 'Processing';
    case 'COMPLETED':
      return 'Completed';
    case 'FAILED':
      return 'Failed';
    default:
      return 'Unknown';
  }
}

/**
 * Formats comment count for display
 * @param count - Number of comments analyzed
 * @returns Formatted comment count string
 */
export function formatCommentCount(count: number): string {
  if (count === 1) {
    return '1 comment';
  }
  return `${count.toLocaleString()} comments`;
}

/**
 * Determines if a sentiment score is positive, neutral, or negative
 * @param rawScore - Float between -1.0 and 1.0
 * @returns Sentiment category
 */
export function getSentimentCategory(rawScore: number): 'positive' | 'neutral' | 'negative' {
  if (rawScore > 0.1) return 'positive';
  if (rawScore < -0.1) return 'negative';
  return 'neutral';
}

/**
 * Gets color indicator for sentiment score visualization
 * @param rawScore - Float between -1.0 and 1.0
 * @returns Mantine theme color for sentiment visualization
 */
export function getSentimentColor(rawScore: number): string {
  const category = getSentimentCategory(rawScore);
  
  switch (category) {
    case 'positive':
      return 'success';
    case 'negative':
      return 'error';
    case 'neutral':
    default:
      return 'gray';
  }
}
