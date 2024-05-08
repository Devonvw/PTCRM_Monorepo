import createMollieClient from '@mollie/api-client';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
