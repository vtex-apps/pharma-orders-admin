/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useQuery } from 'react-apollo'
import { ButtonWithIcon } from 'vtex.styleguide'
import Download from '@vtex/styleguide/lib/icon/Download'

import LoadingSpinner from './LoadingSpinner'
import getOrderCustomData from '../graphql/getOrderCustomData.gql'

export default function FilesTable({ orderId }: ProductTableProps) {
  const responseFromGetOrder = useQuery(getOrderCustomData, {
    variables: { orderId },
    ssr: false,
  })

  const customApps =
    responseFromGetOrder?.data?.getOrder?.data?.customData?.customApps

  console.info('customApps', customApps)

  // Cuando se pueda terminar una orden, cambiar el id
  // const files = customApps?.find((app: any) => app.id === 'files').fields

  const filesToTest = {
    fileName1: 'Receta_de_parasetamol_duo',
    fileUrl1: 'link/al/file/1',
    fileName2: 'Receta_de_buscapinaForte',
    fileUrl2: 'link/al/file/2',
    fileName3: 'Receta_de_RedoxonMaxPowerUltra',
    fileUrl3: null,
  }

  console.info('filesToTest', filesToTest)

  const icon = <Download />

  return (
    <div>
      {!filesToTest && <LoadingSpinner />}
      {filesToTest && (
        <div>
          {filesToTest.fileUrl1 && (
            <span className="mr3">
              <ButtonWithIcon icon={icon} variation="secondary" size="small">
                {`Receta 1`}
              </ButtonWithIcon>
            </span>
          )}

          {filesToTest.fileUrl2 && (
            <span className="mr3">
              <ButtonWithIcon icon={icon} variation="secondary" size="small">
                {`Receta 2`}
              </ButtonWithIcon>
            </span>
          )}

          {filesToTest.fileUrl3 && (
            <span>
              <ButtonWithIcon icon={icon} variation="secondary" size="small">
                {`Receta 3`}
              </ButtonWithIcon>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
