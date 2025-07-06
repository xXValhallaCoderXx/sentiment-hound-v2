'use client';

import React, { useEffect, useState } from 'react';
import { Box, Group, Title, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { getUserAnalyses } from '@/actions/dashboard.actions';
import AnalysisCard from '@/components/molecules/AnalysisCard/AnalysisCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/molecules/ErrorMessage/ErrorMessage';
import type { AnalysisData } from '@/types/analysis.types';
import classes from './dashboard.module.css';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserAnalyses();
      
      if (result.error) {
        setError(result.error.error);
      } else {
        setAnalyses(result.data?.analyses || []);
      }
    } catch {
      setError('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  // Auto-refresh when user navigates back to this page
  useEffect(() => {
    const handleFocus = () => {
      router.refresh();
      fetchAnalyses();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  if (loading) {
    return (
      <Box p={{ base: 12, sm: 16, md: 24 }} ta="center" py="xl">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={{ base: 12, sm: 16, md: 24 }}>
        <ErrorMessage />
      </Box>
    );
  }

  return (
    <Box p={{ base: 12, sm: 16, md: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Page Header */}
        <Group 
          justify="space-between" 
          align="flex-start"
          className={classes.headerGroup}
        >
          <Title 
            order={1} 
            size="h2"
            className={classes.headerTitle}
          >
            My Analyses
          </Title>
          
          <Button
            leftSection={<IconPlus size={16} />}
            variant="filled"
            size="md"
            className={classes.headerButton}
            // No click functionality as specified in PRD
          >
            Analyze New Post
          </Button>
        </Group>

        {/* Analysis List */}
        {analyses.length === 0 ? (
          <Box py="xl" ta="center">
            <Title order={3} c="dimmed" mb="sm">
              No analyses found
            </Title>
            <p style={{ color: 'var(--mantine-color-dimmed)' }}>
              Start your first analysis by clicking &quot;Analyze New Post&quot; above.
            </p>
          </Box>
        ) : (
          <div className={classes.analysisGrid}>
            {analyses.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                id={analysis.id}
                title={analysis.title}
                status={analysis.status}
                overallScore={analysis.overallScore}
                commentCount={analysis.commentCount}
                createdAt={analysis.createdAt}
                onClick={() => {
                  // Future-ready for detail pages - no navigation yet
                  console.log('Clicked analysis:', analysis.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Box>
  );
};

export default DashboardPage;
