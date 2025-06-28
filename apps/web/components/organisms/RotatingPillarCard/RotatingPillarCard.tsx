"use client";

import { useState, useEffect } from "react";
import { Stack, Center } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { IconRocket, IconBulb, IconSparkles } from "@tabler/icons-react";
import { CardTitle, DimmedText } from "@/components/atoms/Typography/Typography";
import Card from "@/components/organisms/Card/Card";
import classes from "./RotatingPillarCard.module.css";

interface BrandPillar {
  id: string;
  icon: React.ReactElement;
  headline: string;
  description: string;
}

const brandPillars: BrandPillar[] = [
  {
    id: "power",
    icon: <IconRocket size={48} />,
    headline: "Power That's Unleashed, Not Locked Up",
    description: "Experience the full potential of sentiment analysis without complexity barriers. Our tools give you enterprise-grade insights with consumer-friendly accessibility.",
  },
  {
    id: "insight",
    icon: <IconBulb size={48} />,
    headline: "Insight That Drives Action",
    description: "Transform raw social data into strategic decisions. Our intelligent analysis helps you understand not just what people are saying, but what it means for your business.",
  },
  {
    id: "innovation",
    icon: <IconSparkles size={48} />,
    headline: "Innovation That Feels Natural",
    description: "Advanced AI technology that works intuitively. We believe powerful tools should enhance your workflow, not complicate it.",
  },
];

export const RotatingPillarCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % brandPillars.length);
    }, 7000); // 7 seconds per slide

    return () => clearInterval(interval);
  }, []);

  const currentPillar = brandPillars[currentIndex];

  if (!currentPillar) {
    return null;
  }

  return (
    <Card className={classes.rotatingCard}>
      <Center style={{ height: "400px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center" }}
          >
            <Stack align="center" gap="xl">
              <Center style={{ color: "var(--mantine-primary-color)" }}>
                {currentPillar.icon}
              </Center>
              
              <CardTitle ta="center">
                {currentPillar.headline}
              </CardTitle>
              
              <DimmedText 
                ta="center" 
                maw={400}
                style={{ lineHeight: 1.7 }}
              >
                {currentPillar.description}
              </DimmedText>
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Center>
    </Card>
  );
};

export default RotatingPillarCard;
