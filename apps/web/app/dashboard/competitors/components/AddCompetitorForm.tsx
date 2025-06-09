"use client";

import { useState } from "react";
import { 
  Card, 
  TextInput, 
  Button, 
  Group, 
  Title, 
  Text, 
  Alert 
} from "@mantine/core";
import { IconPlus, IconInfoCircle } from "@tabler/icons-react";
import { addCompetitor } from "../actions/add-competitor";

interface AddCompetitorFormProps {
  userId: string;
}

const AddCompetitorForm = ({ userId }: AddCompetitorFormProps) => {
  const [competitorName, setCompetitorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!competitorName.trim()) {
      setError("Please enter a competitor name");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await addCompetitor(competitorName.trim(), userId);
      
      if (result.success) {
        setCompetitorName("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to add competitor");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder p="md" data-competitor-form>
      <Title order={3} mb="md">
        Add Competitor
      </Title>
      
      <Text size="sm" c="dimmed" mb="lg">
        Track any brand or company across all major platforms. We&apos;ll analyze 
        sentiment from YouTube, Reddit, Facebook, Instagram, and more.
      </Text>

      <form onSubmit={handleSubmit}>
        <Group align="end">
          <TextInput
            placeholder="Enter competitor name (e.g., Apple, Nike, Tesla)"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.currentTarget.value)}
            style={{ flex: 1 }}
            disabled={loading}
          />
          <Button 
            type="submit" 
            loading={loading}
            leftSection={<IconPlus size={16} />}
          >
            Add Competitor
          </Button>
        </Group>
      </form>

      {error && (
        <Alert 
          variant="light" 
          color="red" 
          mt="md"
          icon={<IconInfoCircle size={16} />}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          variant="light" 
          color="green" 
          mt="md"
          icon={<IconInfoCircle size={16} />}
        >
          Competitor added successfully! Sentiment data will be collected automatically.
        </Alert>
      )}
    </Card>
  );
};

export default AddCompetitorForm;