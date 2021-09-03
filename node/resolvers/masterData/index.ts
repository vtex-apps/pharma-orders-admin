/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getData: async (_: unknown, __: unknown, ctx: Context): Promise<any> => {
    return ctx.clients.masterDataGetData.getData()
  },
}
