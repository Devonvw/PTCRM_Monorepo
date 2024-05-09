import { Client } from 'src/clients/entities/client.entity';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import Template from './template';

interface ClientSignupProps {
  token: string;
  client: Client;
  company: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.FRONTEND_URL}`
  : '';

export const ClientSignup = ({ token, client, company }: ClientSignupProps) => (
  <Template preview={`Sign up with ${company}`}>
    <Text className="text-black text-xl">
      Sign up with <span className="font-black">{company}</span>
    </Text>
    <Section>
      <Text className="text-lg">
        Hello, {client?.firstName} {client.lastName}
      </Text>
      <Text className="text-base">
        <Link
          className="text-blue-700"
          href={`${process.env.FRONTEND_URL}/client-signup/${token}`}
        >
          👉 Click here to sign up 👈
        </Link>
      </Text>
      <Text className="text-base">
        If you didn't request this, please ignore this email.
      </Text>
    </Section>
    <Text className="text-base">
      <br />- PTCRM Team
    </Text>
    <Hr className="border-slate-400" />
  </Template>
);

ClientSignup.PreviewProps = {
  email: 'devonvanw@gmail.com',
  company: 'Joost Trainings',
  client: {
    firstName: 'Devon',
    lastName: 'van Winkle',
    email: '',
  } as Client,
  token: '123456',
} as ClientSignupProps;

export default ClientSignup;
