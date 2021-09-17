/* eslint-disable @typescript-eslint/no-explicit-any */
export const queries = {
  getData: async (_: unknown, __: unknown, ctx: Context): Promise<any> => {
    const aux = await ctx.clients.masterDataClient.getData()

    /*
    const documents = aux.data

    console.info('documents', documents)
    const documentsWithInvoiceNumber: any = []

    documents?.forEach(async (document: any) => {
      const { orderId, status } = document
      let invoiceNumber = ''

      if (status === 'confirmed') {
        const aux2 = await ctx.clients.omsClient.getOrder(orderId)

        invoiceNumber = aux2.data.packageAttachment.packages[0].invoiceNumber
      }

      documentsWithInvoiceNumber.push({ ...document, invoiceNumber })
    })

    const getDataWithInvoiceNumber = {
      status: aux.status,
      data: documentsWithInvoiceNumber,
    }
    return getDataWithInvoiceNumber
    */
    return aux
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
