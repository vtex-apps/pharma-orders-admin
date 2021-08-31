/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode, SetStateAction, Dispatch } from 'react'

declare global {
  export interface Products {
    id: string
    name: sting
  }

  export interface Files {
    fileName: string
    file: sting
    key: string
  }

  export interface Order {
    id: number
    status: string
    orderId: sting
    products: Products[]
    files: Files[]
  }

  export interface TableProps {
    orderList: Order[]
  }
}
