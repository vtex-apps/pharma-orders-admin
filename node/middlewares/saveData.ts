/* eslint-disable @typescript-eslint/no-explicit-any */
export async function saveData(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { masterDataSaveData },
  } = ctx

  try {
    const { orderId } = ctx.body

    const body: SaveDataInMasterDataBody = {
      orderId,
      status: 'created',
    }

    await masterDataSaveData.saveData(body)
    await next()
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }
}
