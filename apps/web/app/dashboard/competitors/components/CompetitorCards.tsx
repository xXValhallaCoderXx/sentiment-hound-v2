"use client";

import { useState } from "react";
import { 
  Card, 
  Text, 
  Title, 
  SimpleGrid, 
  Group, 
  ActionIcon,
  Badge,
  Stack
} from "@mantine/core";
import { IconTrash, IconTrendingUp } from "@tabler/icons-react";
import { deleteCompetitor } from "../actions/delete-competitor";

interface Competitor {
  id: number;
  name: string;
  createdAt: string;
  isActive: boolean;
}

interface CompetitorCardsClientProps {
  competitors: Competitor[];
  userId: string;
}

const CompetitorCardsClient = ({ competitors: initialCompetitors, userId }: CompetitorCardsClientProps) => {
  const [competitors, setCompetitors] = useState(initialCompetitors);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (competitorId: number) => {
    setDeletingId(competitorId);
    
    try {
      const result = await deleteCompetitor(competitorId, userId);
      
      if (result.success) {
        setCompetitors(prev => prev.filter(c => c.id !== competitorId));
      } else {
        console.error("Failed to delete competitor:", result.error);
      }
    } catch (error) {
      console.error("Error deleting competitor:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (competitors.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No competitors added yet. Add your first competitor to start tracking sentiment.
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {competitors.map((competitor) => (
        <Card key={competitor.id} withBorder p="sm" radius="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500} size="sm">
              {competitor.name}
            </Text>
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              loading={deletingId === competitor.id}
              onClick={() => handleDelete(competitor.id)}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
          
          <Group justify="space-between" mt="md">
            <Badge variant="light" color="blue" size="sm">
              Active
            </Badge>
            <Group gap={4}>
              <IconTrendingUp size={14} color="green" />
              <Text size="xs" c="dimmed">
                Tracking
              </Text>
            </Group>
          </Group>
          
          <Text size="xs" c="dimmed" mt="xs">
            Added {new Date(competitor.createdAt).toLocaleDateString()}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default CompetitorCardsClient;

export default CompetitorCards;