"use client";

import { Container, Accordion, Box } from "@mantine/core";
import { SectionTitle, BodyText, DimmedText } from "@/components/atoms/Typography";

interface FaqItem {
  value: string;
  title: string;
  content: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqData: FaqItem[];
  containerSize?: "sm" | "md" | "lg" | "xl";
  variant?: "contained" | "separated" | "default";
}

const FaqSection = ({ 
  title = "Frequently Asked Questions",
  subtitle,
  faqData,
  containerSize = "xl",
  variant = "contained"
}: FaqSectionProps) => {
  return (
    <Container size={containerSize}>
      <SectionTitle ta="center" mb="xl">
        {title}
      </SectionTitle>
      
      {subtitle && (
        <BodyText ta="center" mb="xl">
          {subtitle}
        </BodyText>
      )}
      
      <Box style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Accordion variant={variant} radius="md">
          {faqData.map((item) => (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.Control>
                <BodyText fw={500}>{item.title}</BodyText>
              </Accordion.Control>
              <Accordion.Panel>
                <DimmedText>{item.content}</DimmedText>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Box>
    </Container>
  );
};

export default FaqSection;