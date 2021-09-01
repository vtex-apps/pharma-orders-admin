/* eslint-disable prettier/prettier */

import type {
  IOContext,
  ParamsContext,
  RecorderState,
  SegmentData,
  ServiceContext,
  MessagesLoaderV2,
} from '@vtex/api'

import type { Clients } from './clients'

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    messagesTenantLanguage?: MessagesLoaderV2
    messagesBindingLanguage?: MessagesLoaderV2
  }

  interface StaleRevalidateData<T> {
    ttl: Date
    data: T
  }

  interface CustomContext extends ParamsContext {
    cookie: string
    originalPath: string
    vtex: CustomIOContext
  }

  interface CustomIOContext extends IOContext {
    segment?: SegmentData
  }

  interface Property {
    name: string
    values: [string]
  }

  interface TranslatableMessage {
    content: string
    from: string
    id: string
  }

  interface Reference {
    Key: string
    Value: string
  }
}
