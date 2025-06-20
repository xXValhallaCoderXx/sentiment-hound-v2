import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  Group,
} from "@mantine/core";
import classes from "./TestimonialsSection.module.css";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "Sentiment Hound cut our monitoring time in half. The spam filtering is incredibly accurate.",
      author: "Sarah Chen",
      title: "Marketing Director",
      avatar: "/api/placeholder/40/40",
    },
    {
      quote:
        "Finally, a tool that shows us what customers actually feel. Great insights!",
      author: "Mike Rodriguez",
      title: "Product Manager",
      avatar: "/api/placeholder/40/40",
    },
    {
      quote:
        "The competitive analysis gives us insights we never had before. Game changer.",
      author: "Jessica Park",
      title: "Brand Manager",
      avatar: "/api/placeholder/40/40",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <div className={classes.header}>
          <Title order={2} className={classes.title} ta="center">
            What teams are saying
          </Title>
        </div>

        <Grid mt="xl" gutter="xl">
          {testimonials.map((testimonial, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <Box className={classes.testimonialCard}>
                <Text className={classes.quote} mb="lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </Text>
                <Group gap="sm">
                  <div className={classes.avatarPlaceholder}>
                    <Text size="sm" fw={600} c="white">
                      {testimonial.author.charAt(0)}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" fw={600} c="white">
                      {testimonial.author}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {testimonial.title}
                    </Text>
                  </div>
                </Group>
              </Box>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default TestimonialsSection;
