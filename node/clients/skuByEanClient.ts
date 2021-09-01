/* eslint-disable prettier/prettier */

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class SkuByEanClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyean`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie:
            context.storeUserAuthToken ?? context.authToken,
        },
      }
    )
  }

  public async getSku(ean: string) {
    return this.http.getRaw(`/${ean}`)
  }
}
