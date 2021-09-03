/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsGetOrder.getOrder(orderId)
  },
}
