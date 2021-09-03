/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode, SetStateAction, Dispatch } from 'react'

declare global {
  export interface Files {
    key: string
    fileName: string
  }

  export interface Order {
    id: number
    status: string
    orderId: sting
    products: string
    files: Files[]
  }

  export interface TableProps {
    orderList: Order[]
  }

  export interface OrderFromMasterData {
    orderId: sting
    status: string
    fileKey: string
    fileName: string
  }

  export interface ProductTableProps {
    orderId: sting
  }
}
