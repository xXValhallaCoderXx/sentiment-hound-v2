"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { useSmartNavigation } from "@/lib/navigation.utils";
import classes from "./ModernHero.module.css";
import { Points as ThreePoints } from "three";

interface StarfieldProps {
  particleColor: string;
  [key: string]: unknown;
}

const Starfield = ({ particleColor, ...props }: StarfieldProps) => {
  const ref = useRef<ThreePoints>(null);
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 1.5 }),
  );

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    // eslint-disable-next-line react/no-unknown-property
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={particleColor}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ModernHero = () => {
  const { colorScheme } = useMantineTheme();
  const { handleNavigation } = useSmartNavigation();
  const particleColor = colorScheme === "dark" ? "#ffa0e0" : "#4A5568";

  return (
    <div className={classes.heroContainer}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      >
        <Starfield particleColor={particleColor} />
      </Canvas>
      <Container size={1600} className={classes.inner}>
        <div className={classes.content}>
          <Title
            className={classes.mainTitle}
            size={72}
            order={1}
            fw={700}
            lh={1.1}
            mb="md"
          >
            Cut through the noise.
          </Title>
          <Text c="dimmed" size="lg" lh={1.6} mb="xl">
            Sentiment Hound gives you clear, actionable insights from comments,
            reviews, and social chatter. Built for founders, creators, and
            brands.
          </Text>

          <Group className={classes.controls} mt="xl">
            <Button
              size="lg"
              className={classes.earlyAccessButton}
              color="primary.5"
              c="white"
              onClick={() => handleNavigation("#early-access", "Early Access")}
            >
              Early Access
            </Button>
          </Group>
        </div>
      </Container>
    </div>
  );
};

export default ModernHero;
