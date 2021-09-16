/* eslint-disable prettier/prettier */

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class OMS extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/oms/pvt/orders`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie:
            context.adminUserAuthToken ??
            context.storeUserAuthToken ??
            context.authToken,
        },
      }
    )
  }

  public async getOrder(orderId: string) {
    return this.http.getRaw(`/${orderId}`)
  }

  public async cancelOrder(orderId: string) {
    return this.http.postRaw(`/${orderId}/cancel`)
  }

  public async getPaymentTransaction(orderId: string) {
    return this.http.getRaw(`/${orderId}/payment-transaction`)
  }

  public async paymentNotification(orderId: string, paymentId: string) {
    return this.http.postRaw(
      `/${orderId}/payments/${paymentId}/payment-notification`
    )
  }

  public async startHandlingOrder(orderId: string) {
    try {
      await this.http.postRaw(`/${orderId}/start-handling`)
    } catch (error) {
      console.info('error', error)
    }

    return { status: 200 }
  }

  public async invoiceOrder(orderId: string, bodyInvoice: InvoiceBody) {
    return this.http.postRaw(`/${orderId}/invoice`, bodyInvoice)
  }
}
