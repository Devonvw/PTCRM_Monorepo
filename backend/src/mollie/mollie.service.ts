import createMollieClient, { SequenceType } from '@mollie/api-client';
import { Injectable } from '@nestjs/common';
import { SUBSCRIPTION_INTERVAL } from 'src/utils/constants';

@Injectable()
export class MollieService {
  private readonly mollieClient: ReturnType<typeof createMollieClient>;

  constructor() {
    this.mollieClient = createMollieClient({
      apiKey: process.env.MOLLIE_API_KEY,
    });
  }

  async createCustomer(name: string, email: string) {
    const res = await this.mollieClient.customers.create({
      name: name,
      email: email,
    });

    return res?.id;
  }

  async getMandates(customerId: string) {
    return await this.mollieClient.customerMandates.page({
      customerId: customerId,
    });
  }

  async createFirstPayment(
    customerId: string,
    amount: number,
    description: string,
  ) {
    const res = await this.mollieClient.payments.create({
      customerId,
      sequenceType: SequenceType.first,
      amount: {
        currency: 'EUR',
        value: Number(amount).toFixed(2),
      },
      description,
      redirectUrl: `${process.env.FRONTEND_URL}/app`,
      webhookUrl: `${process.env.BACKEND_URL}/payment/webhook-mollie`,
    });

    return res;
  }

  async createSubscription(
    customerId: string,
    mandateId: string,
    startDate: string,
    amount: number,
    description: string,
  ) {
    return await this.mollieClient.customerSubscriptions.create({
      customerId,
      mandateId,
      startDate,
      amount: {
        currency: 'EUR',
        value: Number(amount).toFixed(2),
      },
      interval: SUBSCRIPTION_INTERVAL,
      description,
      webhookUrl: `${process.env.BACKEND_URL}/payment/webhook-mollie`,
    });
  }

  async checkUserMandate(customerId: string) {
    const mandates = await this.getMandates(customerId);

    if (
      mandates?.length == 0 ||
      !mandates?.some((man: any) => man?.status == 'valid')
    )
      return false;

    return true;
  }

  public async getPayment(paymentId: string) {
    return await this.mollieClient.payments.get(paymentId);
  }
}
