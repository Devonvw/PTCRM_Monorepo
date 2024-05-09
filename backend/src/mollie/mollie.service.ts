import { Injectable } from '@nestjs/common';
import createMollieClient, {
  PaymentMethod,
  SequenceType,
} from '@mollie/api-client';

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
    const mandates = await this.mollieClient.customerMandates.page({
      customerId: customerId,
    });

    return mandates;
  }

  async getMandate(mandateId: string, customerId: string) {
    const mandate = await this.mollieClient.customerMandates.get(mandateId, {
      customerId: customerId,
    });

    return mandate;
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
        value: amount.toFixed(2),
      },
      method: PaymentMethod.ideal,
      description,
      redirectUrl: process.env.FRONTEND_URL + `/app/start`,
      webhookUrl: process.env.BACKEND_URL + '/payment/webhook-mollie',
    });

    return res;
  }

  async createRecurringPayment(
    customerId: string,
    amount: number,
    description: string,
  ) {
    if (!(await this.checkUserMandate(customerId))) {
      throw new Error('No valid mandate found');
    }

    const res = await this.mollieClient.payments.create({
      customerId,
      sequenceType: SequenceType.recurring,
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2),
      },
      // No Method because its sepa direct debit automatically
      description: description,
      webhookUrl: process.env.BACKEND_URL + '/payment/webhook-mollie',
    });

    return res;
  }

  async cancelPayment(paymentId: string) {
    const res = await this.mollieClient.payments.cancel(paymentId);

    return res;
  }
}
