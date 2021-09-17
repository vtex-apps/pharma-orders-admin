/* eslint-disable @typescript-eslint/no-explicit-any */
export async function saveDataCanceled(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { masterDataClient },
  } = ctx

  try {
    const { documentOfOrder } = ctx.state

    const id = documentOfOrder[0]?.id
    const orderId = documentOfOrder[0]?.orderId
    const status = documentOfOrder[0]?.status
    const invoiceNumber = documentOfOrder[0]?.invoiceNumber
    const observations = documentOfOrder[0]?.observations

    if (status !== 'canceled') {
      const body: SaveDataInMasterDataBody = {
        orderId,
        status: 'canceled',
        invoiceNumber,
        observations,
      }

      console.info('canceled')
      console.info('body', body)

      await masterDataClient.updateDocument(id, body)

      await next()
    }
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }
}
