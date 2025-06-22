"use client";
import { Container, Title, Accordion, Text } from "@mantine/core";
import classes from "./Faq.module.css";

const FaqSection = () => {
  return (
    <div className={classes.faqBackground}>
      <Container size="sm" className={classes.wrapper}>
        <Title ta="center" className={classes.title} c="white">
          Have Questions? We've Got Answers.
        </Title>

        <Text c="gray.4" ta="center" size="lg" mb="xl">
          Get answers to the most commonly asked questions about Sentiment Hound
        </Text>

        <Accordion variant="separated">
          <Accordion.Item className={classes.item} value="what-is-sentiment">
            <Accordion.Control>What is sentiment analysis?</Accordion.Control>
            <Accordion.Panel>
              Sentiment analysis is the process of determining the emotional
              tone behind a series of words. It helps businesses understand the
              attitudes, opinions, and emotions expressed in online
              conversations. Our platform uses advanced AI to accurately detect
              sentiment in text from various sources.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="data-sources">
            <Accordion.Control>
              What data sources can I analyze?
            </Accordion.Control>
            <Accordion.Panel>
              Sentiment Hound can analyze data from various sources including
              social media platforms, customer reviews, survey responses,
              support tickets, and more. Our platform includes built-in
              connectors for popular platforms and a flexible API for custom
              integrations.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="how-accurate">
            <Accordion.Control>
              How accurate is the sentiment analysis?
            </Accordion.Control>
            <Accordion.Panel>
              Our sentiment analysis technology achieves over 90% accuracy in
              most use cases. The system continuously improves through machine
              learning and can be customized for your specific industry
              terminology to further increase accuracy.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="pricing-plans">
            <Accordion.Control>
              What pricing plans do you offer?
            </Accordion.Control>
            <Accordion.Panel>
              We offer flexible pricing plans designed to meet the needs of
              businesses of all sizes. From our free tier for small projects to
              enterprise solutions for large-scale analysis, you can choose the
              plan that best fits your requirements and budget.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="get-started">
            <Accordion.Control>
              How quickly can I get started?
            </Accordion.Control>
            <Accordion.Panel>
              Getting started with Sentiment Hound is quick and easy. Sign up
              for a free account, connect your data sources, and start gaining
              insights within minutes. Our intuitive dashboard requires no
              technical expertise, and our support team is available to help you
              every step of the way.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </div>
  );
};

export default FaqSection;
