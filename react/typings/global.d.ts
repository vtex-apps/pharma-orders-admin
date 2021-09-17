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
    invoice: {
      rowId: number
      invoiceNumber: string
    }
    observations: {
      rowId: number
      text: string
    }
  }

  export interface TableProps {
    orderList: Order[]
  }

  export interface OrderFromMasterData {
    id: string
    orderId: sting
    status: string
    invoiceNumber: string
    observations: string
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

  interface BodyUpdateDocument {
    orderId: string
    status: string
    invoiceNumber: string
  }

  interface ItemsInvoice {
    id: string
    quantity: number
    price: number
  }

  interface InvoiceBody {
    type: string
    issuanceDate: string
    invoiceNumber: string
    invoiceValue: number
    items: [ItemsInvoice]
  }
}
