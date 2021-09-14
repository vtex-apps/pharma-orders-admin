/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.getOrder(orderId)
  },
  cancelOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.cancelOrder(orderId)
  },
}
