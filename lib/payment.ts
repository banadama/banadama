export const payment = {
    createCheckoutSession: async (amount: number, currency: string) => {
        // Stub implementation
        console.log('Creating checkout session', { amount, currency });
        return { sessionId: 'stub_session_id', url: 'https://checkout.stripe.com/stub' };
    },

    processPayment: async (paymentMethodId: string, amount: number) => {
        // Stub
        return { success: true, transactionId: 'tx_stub' };
    },

    payout: async (recipientId: string, amount: number) => {
        // Stub
        return { success: true, payoutId: 'po_stub' };
    }
};
