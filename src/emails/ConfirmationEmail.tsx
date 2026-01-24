import { Html, Body, Container, Heading, Text } from '@react-email/components';

type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

export default function ConfirmationEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Thanks for reaching out.</Heading>
          <Text>
            <strong>Hi </strong> {name} <strong>, We are glad to hear from you. Hope you get this email.</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}