/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.getOrder(orderId)
  },
  getOrderStatus: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.getOrder(orderId)
  },
  getPaymentTransaction: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.getPaymentTransaction(orderId)
  },
}

export const mutations = {
  cancelOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.cancelOrder(orderId)
  },
  paymentNotification: async (
    _: unknown,
    { orderId, paymentId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.paymentNotification(orderId, paymentId)
  },
  startHandlingOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.startHandlingOrder(orderId)
  },
  invoiceOrder: async (
    _: unknown,
    { orderId, bodyInvoice }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.invoiceOrder(orderId, bodyInvoice)
  },
}
