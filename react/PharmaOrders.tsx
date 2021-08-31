import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import TableV2 from './components/TableV2'
import { titlesIntl } from './utils/intl'

export default function PharmaOrders() {
  const intl = useIntl()

  const infoFromMasterData: Order[] = [
    {
      id: 0,
      status: 'status1',
      orderId: '123-123-123',
      products: [
        {
          id: '1',
          name: 'ibuprofeno 600',
        },
        {
          id: '2',
          name: 'paracetamol 600',
        },
      ],
      files: [
        {
          fileName: 'receta1',
          file: 'receta.jpg',
          key: '123',
        },
      ],
    },
    {
      id: 1,
      status: 'status2',
      orderId: '456-456-456',
      products: [
        {
          id: '27',
          name: 'buscapona 600',
        },
      ],
      files: [
        {
          fileName: 'receta4',
          file: 'receta.jpg',
          key: '456',
        },
      ],
    },
  ]

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title={intl.formatMessage(titlesIntl.pageTitle)} />
      }
    >
      <PageBlock variation="full">
        {infoFromMasterData.length > 0 && (
          <TableV2 orderList={infoFromMasterData} />
        )}
      </PageBlock>
    </Layout>
  )
}
