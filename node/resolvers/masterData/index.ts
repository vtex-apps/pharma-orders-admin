/* eslint-disable @typescript-eslint/no-explicit-any */
export const queries = {
  getData: async (_: unknown, __: unknown, ctx: Context): Promise<any> => {
    return ctx.clients.masterDataClient.getData()
  },
}

export const mutations = {
  updateDocument: async (
    _: unknown,
    { documentId, body }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.masterDataClient.updateDocument(documentId, body)
  },
}
