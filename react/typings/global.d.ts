/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode, SetStateAction, Dispatch } from 'react'

declare global {
  export interface Files {
    key: string
    fileName: string
  }

  export interface Order {
    id: number
    idMasterData: string
    status: string
    orderId: sting
    products: string
    files: string
  }

  export interface TableProps {
    orderList: Order[]
  }

  export interface OrderFromMasterData {
    id: string
    orderId: sting
    status: string
  }

  export interface ProductTableProps {
    orderId: sting
  }

  export interface ImagePreviewProps {
    url: sting
  }
  export interface SuccessComponent {
    message: string
    onClose: () => void
  }

  export interface SuccessArrayComponent {
    messages: string[]
    onClose: () => void
  }

  export interface ErrorComponent {
    message: string
    onClose: () => void
  }

  export interface ErrorArrayComponent {
    messages: string[]
    onClose: () => void
  }
}
