import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'

import OrdersTable from './components/OrdersTable'
import { titlesIntl } from './utils/intl'
import getData from './graphql/getData.gql'
import LoadingSpinner from './components/LoadingSpinner'

export default function PharmaOrders() {
  const intl = useIntl()

  const responseFromGetData = useQuery(getData, {
    ssr: false,
  })

  const dataFromMasterData: OrderFromMasterData[] =
    responseFromGetData.data?.getData?.data

  const orderList: Order[] = dataFromMasterData?.map(
    (orderFromMasterData: OrderFromMasterData, index: number) => {
      const { id, orderId, status, invoiceNumber } = orderFromMasterData

      const newOrder: Order = {
        id: index,
        idMasterData: id,
        status,
        orderId,
        products: orderId,
        files: orderId,
        invoice: {
          rowId: index,
          invoiceNumber,
        },
      }

      return newOrder
    }
  )

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title={intl.formatMessage(titlesIntl.pageTitle)} />
      }
    >
      <PageBlock variation="full">
        {!orderList && <LoadingSpinner />}
        {orderList?.length > 0 && <OrdersTable orderList={orderList} />}
        {orderList?.length === 0 && intl.formatMessage(titlesIntl.noOrdersYet)}
      </PageBlock>
    </Layout>
  )
}
