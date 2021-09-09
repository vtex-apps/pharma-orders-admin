/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { ButtonWithIcon, Modal } from 'vtex.styleguide'
import Image from '@vtex/styleguide/lib/icon/Image'
import { useIntl } from 'react-intl'

import { titlesIntl } from '../utils/intl'
import LoadingSpinner from './LoadingSpinner'
import getOrderCustomData from '../graphql/getOrderCustomData.gql'
import ImagePreview from './ImagePreview'

export default function FilesTable({ orderId }: ProductTableProps) {
  const intl = useIntl()

  const responseFromGetOrder = useQuery(getOrderCustomData, {
    variables: { orderId },
    ssr: false,
  })

  const customApps =
    responseFromGetOrder?.data?.getOrder?.data?.customData?.customApps

  console.info('customApps', customApps)

  // Cuando se pueda terminar una orden, cambiar el id
  // const files = customApps?.find((app: any) => app.id === 'files').fields

  const stringArray =
    "[{'name': 'fileName1', 'url': 'https://static.docsity.com/documents_first_pages/2021/06/02/4c41dd647fa079da842893ffed07a691.png'},{'name': 'fileName2', 'url': 'https://www.partesdel.com/wp-content/uploads/Ejemplo-de-receta-m%C3%A9dica.png'}]"

  const filesObject = JSON.parse(stringArray.replace(/'/g, '"'))

  const [isImagenPreviewModalOpen, setIsImagenPreviewModalOpen] =
    useState(false)

  const [fileUrlPreview, setfileUrlPreview] = useState('')

  const handleModalImagenPreviewToggle = () => {
    setIsImagenPreviewModalOpen(!isImagenPreviewModalOpen)
  }

  function handleOnClick(url: string) {
    setfileUrlPreview(url)
    handleModalImagenPreviewToggle()
  }

  const icon = <Image />

  return (
    <div>
      {!filesObject && <LoadingSpinner />}
      {filesObject && (
        <div>
          {filesObject.map((file: any, index: number) => (
            <span className="mr3" key={`${file.name} ${index}`}>
              <ButtonWithIcon
                icon={icon}
                variation="secondary"
                size="small"
                onClick={() => handleOnClick(file.url)}
              >
                {`${intl.formatMessage(titlesIntl.prescription)} ${index + 1}`}
              </ButtonWithIcon>
            </span>
          ))}
        </div>
      )}
      <Modal
        centered
        isOpen={isImagenPreviewModalOpen}
        onClose={handleModalImagenPreviewToggle}
      >
        <ImagePreview url={fileUrlPreview} />
      </Modal>
    </div>
  )
}
