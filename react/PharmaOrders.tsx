import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'

import TableV2 from './components/TableV2'
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
    (order: OrderFromMasterData, index: number) => {
      const newOrder: Order = {
        id: index,
        status: order.status,
        orderId: order.orderId,
        products: order.orderId,
        files: [
          {
            key: order.fileKey,
            fileName: order.fileName,
          },
        ],
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
        {orderList?.length > 0 && <TableV2 orderList={orderList} />}
        {!orderList && <LoadingSpinner />}
      </PageBlock>
    </Layout>
  )
}
