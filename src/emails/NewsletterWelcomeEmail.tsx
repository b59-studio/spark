import { Body, Container, Heading, Html, Text } from "react-email";

export default function NewsletterWelcomeEmail() {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Welcome to TX*Spark</Heading>
          <Text>
            Thanks for signing up. You now have access to our resource links on
            this device, and we will send occasional updates about toolkits,
            advocacy tools, and events.
          </Text>
          <Text>Build local power. Win year-round.</Text>
        </Container>
      </Body>
    </Html>
  );
}
