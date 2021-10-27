/* eslint-disable @typescript-eslint/no-explicit-any */
export async function findDataCanceled(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { masterDataClient },
  } = ctx

  try {
    const { orderId } = ctx.body

    const response = await masterDataClient.getIdOfOrder(orderId)

    if (response.data.length > 0) {
      ctx.state.documentOfOrder = response.data
      await next()
    }
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }
}
