/* eslint-disable @typescript-eslint/no-explicit-any */
export async function someStates(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  console.info(ctx.body.orderId)
  const {
    clients: { masterDataSaveData },
  } = ctx

  const body: SaveDataInMasterDataBody = {
    orderId: ctx.body.orderId,
    status: 'created',
  }

  console.info('body', body)

  console.info('masterDataSaveData', masterDataSaveData)

  try {
    await masterDataSaveData.saveData(body)
    await next()
  } catch (err) {
    ctx.body = err
  }

  await next()
}
