import { Html, Body, Container, Heading, Text } from '@react-email/components';

type ContactEmailProps = {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  message: string;
};

export default function ConfirmationEmail({ fname, lname, email, phone, message }: ContactEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Thanks for reaching out, {fname}!</Heading>
          <Text>We've received your message and will get back to you soon.</Text>
          <Text><strong>Here's what you submitted:</strong></Text>
          <Text>Name: {fname} {lname}</Text>
          <Text>Email: {email}</Text>
          <Text>Phone: {phone}</Text>
          <Text>Message: {message}</Text>
        </Container>
      </Body>
    </Html>
  );
}