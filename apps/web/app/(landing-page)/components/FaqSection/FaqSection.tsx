"use client";
import { Container, Title, Accordion, Text, Box } from "@mantine/core";
import classes from "./Faq.module.css";

const faqData = [
  {
    question: "What is sentiment analysis?",
    answer: "Sentiment analysis is the process of determining the emotional tone behind text data. Our platform uses advanced natural language processing and machine learning algorithms to analyze customer feedback, social media posts, and other text content to determine if the sentiment is positive, negative, or neutral."
  },
  {
    question: "How accurate is Sentiment Hound's analysis?",
    answer: "Sentiment Hound achieves industry-leading accuracy rates of 85-90% for general sentiment classification. Our aspect-based sentiment analysis further refines this by identifying specific features or topics within the text and analyzing sentiment specifically related to those aspects."
  },
  {
    question: "What platforms can I integrate with?",
    answer: "Sentiment Hound seamlessly integrates with major social media platforms (Twitter, Facebook, Instagram), customer feedback systems, review sites, and more. Our flexible API also allows for custom integrations with virtually any platform that generates text data."
  },
  {
    question: "Is my data secure with Sentiment Hound?",
    answer: "Absolutely. We prioritize your data security with enterprise-grade encryption, strict access controls, and compliance with global privacy standards including GDPR and CCPA. Your data is processed securely and never shared with third parties."
  },
  {
    question: "How does pricing work?",
    answer: "Sentiment Hound offers flexible pricing plans based on your analysis needs. We have plans for startups, small businesses, and enterprise organizations with different volumes of data analysis. Contact us for a custom quote tailored to your specific requirements."
  }
];

const FaqSection = () => {
  const items = faqData.map((item, index) => (
    <Accordion.Item key={index} className={classes.item} value={\`item-\${index}\`}>
      <Accordion.Control>
        <Text fw={600}>{item.question}</Text>
      </Accordion.Control>
      <Accordion.Panel>{item.answer}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Box className={classes.sectionWrapper}>
      <Container size="md" className={classes.wrapper}>
        <Title ta="center" className={classes.title}>
          Frequently Asked Questions
        </Title>
        
        <Text size="sm" c="dimmed" ta="center" mb="xl" className={classes.subtitle}>
          Get answers to common questions about our sentiment analysis platform.
        </Text>

        <Accordion variant="separated" radius="md">
          {items}
        </Accordion>
      </Container>
    </Box>
  );
};

export default FaqSection;
