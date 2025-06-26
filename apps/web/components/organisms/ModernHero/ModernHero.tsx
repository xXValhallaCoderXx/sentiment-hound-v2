'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { useState, useRef } from 'react';
import { Container, Title, Text, Button, Group, useMantineTheme } from '@mantine/core';
import classes from './ModernHero.module.css';

const Starfield = ({ particleColor, ...props }: any) => {
  const ref = useRef<any>();
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
        />
      </Points>
    </group>
  );
};

const ModernHero = () => {
  const { colorScheme } = useMantineTheme();
  const particleColor = colorScheme === 'dark' ? '#ffa0e0' : '#868A8F';

  return (
    <div className={classes.heroContainer}>
      <Canvas camera={{ position: [0, 0, 1] }} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <Starfield particleColor={particleColor} />
      </Canvas>
      <Container size={1400} className={classes.inner}>
        <div className={classes.content}>
          <Title
            component="span"
            variant="gradient"
            className={classes.mainTitle}
            size={55}
            order={1}
            ml={-8}
          >
            Cut through the noise.
          </Title>
          <Title order={3} component="span" className={classes.subtitle}>
            Fetch the insights your audience is hiding
          </Title>
          <Text className={classes.description}>
            Sentiment Hound turns comments, reviews, and social chatter into
            clear, ready-to-act insights—priced for creators, solo founders,
            and growing brands.
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
