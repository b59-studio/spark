import { Body, Button, Container, Head, Heading, Html, Text } from "react-email";

type Props = {
  magicUrl: string;
  staySignedIn: boolean;
};

export default function MagicLinkEmail({ magicUrl, staySignedIn }: Props) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading as="h2">Your TX*Spark sign-in link</Heading>
          <Text>
            Click the button below to open your organizer session. This link expires in 15
            minutes and works once.
          </Text>
          {staySignedIn ? (
            <Text>
              You chose to stay signed in on this device — your session will last longer until
              you sign out.
            </Text>
          ) : null}
          <Button
            href={magicUrl}
            style={{
              backgroundColor: "#e8e4dc",
              color: "#1a1a1a",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Sign in to TX*Spark
          </Button>
          <Text style={{ fontSize: 12, color: "#666", marginTop: 24 }}>
            If you did not request this email, you can ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
