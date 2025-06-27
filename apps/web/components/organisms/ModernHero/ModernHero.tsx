'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { useState, useRef } from 'react';
import { Container, Title, Text, Button, Group, useMantineTheme } from '@mantine/core';
import classes from './ModernHero.module.css';

const Starfield = ({ particleColor, ...props }: any) => {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(5001), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={particleColor}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={particleColor === '#CCCCCC' ? 0.1 : 1} // Issue Requirements: 5-10% opacity for light mode
        />
      </Points>
    </group>
  );
};

const ModernHero = () => {
  const { colorScheme } = useMantineTheme();
  // Issue Requirements: faint starfield overlay with #CCCCCC 5-10% opacity dots
  const particleColor = colorScheme === 'dark' ? '#ffa0e0' : '#CCCCCC';

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
          <Title
            order={2}
            className={classes.subtitle}
            fw={400}
            lh={1.3}
            mb="xl"
          >
            Fetch the insights your audience is hiding
          </Title>
          <Text className={classes.description} size="lg" lh={1.6}>
            Sentiment Hound turns comments, reviews, and social chatter into
            clear, ready-to-act insights—priced for creators, solo founders, and
            growing brands.
          </Text>

          <Group className={classes.controls} mt="xl">
            <Button
              size="lg"
              className={classes.control}
              color="primary.5"
              c="white"
            >
              Early Access
            </Button>
            <Button
              size="lg"
              className={classes.controlSecondary}
              variant="outline"
              color="text-primary"
              c="text-primary"
            >
              See a Live Demo
            </Button>
          </Group>
        </div>
      </Container>
    </div>
  );
};

export default ModernHero;
