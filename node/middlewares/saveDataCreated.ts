/* eslint-disable @typescript-eslint/no-explicit-any */
export async function saveDataCreated(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { masterDataClient },
  } = ctx

  try {
    const { orderId } = ctx.body

    const body: SaveDataInMasterDataBody = {
      orderId,
      status: 'created',
    }

    console.info('body', body)
    await masterDataClient.saveData(body)
    await next()
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }
}
