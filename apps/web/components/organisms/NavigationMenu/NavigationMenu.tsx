import Image from "next/image";
import { Group, Anchor, Text, Button } from "@mantine/core";
import { signIn } from "@/lib/next-auth.lib";

const NavigationMenu = () => {
  return (
    <Group justify="space-between" h="100%">
      <Group gap="sm">
        <Image
          src="/globe.svg"
          alt=""
          height={50}
          width={50}
          className="mx-auto"
        />
        <Text>
          <Text span fw={700} c="primary.5" component="span">
            Sentiment
          </Text>{" "}
          Hound
        </Text>
      </Group>

      <Group gap="lg">
        <form
        // action={async () => {
        //   "use server";
        //   // await signIn("google");
        // }}
        >
          <Button variant="filled" type="submit">
            Sign in
          </Button>
        </form>

        <Anchor href="#" c="gray.8" fw={500}>
          Home
        </Anchor>
        <Anchor href="#" c="gray.8" fw={500}>
          About
        </Anchor>
        <Anchor href="#" c="gray.8" fw={500}>
          Services
        </Anchor>
        <Anchor href="#" c="gray.8" fw={500}>
          Contact
        </Anchor>
      </Group>
    </Group>
  );
};

export default NavigationMenu;
