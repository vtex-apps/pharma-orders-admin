/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { RecorderState } from '@vtex/api'
import { LRUCache, Service } from '@vtex/api'

import { Clients } from './clients'
import { resolvers } from './resolvers'
import { getOrder } from './middlewares/getOrder'
import { saveDataCreated } from './middlewares/saveDataCreated'
import { findDataCanceled } from './middlewares/findDataCanceled'
import { saveDataCanceled } from './middlewares/saveDataCanceled'

const TIMEOUT_MS = 800

const memoryCache = new LRUCache<string, any>({ max: 20 })

metrics.trackCache('status', memoryCache)

export default new Service<Clients, RecorderState, Context>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: TIMEOUT_MS,
      },
      status: {
        memoryCache,
      },
    },
  },
  graphql: {
    resolvers,
  },
  events: {
    orderCreated: [getOrder, saveDataCreated],
    orderCanceled: [findDataCanceled, saveDataCanceled],
  },
})
