/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.getOrder(orderId)
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
}
