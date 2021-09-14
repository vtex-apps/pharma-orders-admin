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

    if (status !== 'canceled') {
      const body: SaveDataInMasterDataBody = {
        orderId,
        status: 'canceled',
      }

      await masterDataClient.masterDataClient(id, body)

      await next()
    }
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }
}
