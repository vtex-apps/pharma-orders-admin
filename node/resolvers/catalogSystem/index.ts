/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getSku: async (_: unknown, { ean }: any, ctx: Context): Promise<any> => {
    return ctx.clients.skuByEan.getSku(ean)
  },
}
