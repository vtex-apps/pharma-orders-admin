import { IOClients } from '@vtex/api'

import MasterDataClient from './masterDataClient'
import OMS from './omsClient'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get masterDataClient() {
    return this.getOrSet('masterDataClient', MasterDataClient)
  }

  public get omsClient() {
    return this.getOrSet('omsClient', OMS)
  }
}
