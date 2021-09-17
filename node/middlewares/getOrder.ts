/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getOrder(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { omsClient },
  } = ctx

  const { orderId } = ctx.body

  try {
    const order = await omsClient.getOrder(orderId)

    const { idCategoriaMedicamentos } = await ctx.clients.apps.getAppSettings(
      `${process.env.VTEX_APP_ID}`
    )

    let orderWithMedicamentos = false

    const { items } = order.data

    items.forEach((item: any) => {
      const { categories } = item.additionalInfo

      if (!orderWithMedicamentos) {
        orderWithMedicamentos = categories.some(
          (categorie: any) => categorie.id === idCategoriaMedicamentos
        )
      }
    })
    console.info('orderId', orderId)
    console.info('idCategoriaMedicamentos', idCategoriaMedicamentos)
    console.info('orderWithMedicamentos', orderWithMedicamentos)

    if (orderWithMedicamentos) {
      await next()
    } else {
      return
    }
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }
}
