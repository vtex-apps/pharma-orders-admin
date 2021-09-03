import { IOClients } from '@vtex/api'

import MasterDataClient from './masterDataClient'
import OMS from './omsClient'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get masterDataGetData() {
    return this.getOrSet('getData', MasterDataClient)
  }

  public get omsGetOrder() {
    return this.getOrSet('getOrder', OMS)
  }
}
