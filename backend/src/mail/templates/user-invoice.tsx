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
import { Invoice } from 'src/invoice/entities/invoice.entity';

interface UserInvoiceProps {
  invoiceNumber: number;
  name: string;
}

export const UserInvoice = ({ invoiceNumber, name }: UserInvoiceProps) => (
  <Template preview={`New invoice #${invoiceNumber}`}>
    <Text className="text-black text-xl">
      New invoice <span className="font-black">#{invoiceNumber}</span>
    </Text>
    <Section>
      <Text className="text-lg">Hello, {name}</Text>
      <Text className="text-base">
        You have a new invoice available in your account.
      </Text>
    </Section>
    <Text className="text-base">
      <br />- PTCRM Team
    </Text>
    <Hr className="border-slate-400" />
  </Template>
);

UserInvoice.PreviewProps = {
  invoiceNumber: 1333,
  name: 'Devon van Wichen',
} as UserInvoiceProps;

export default UserInvoice;
