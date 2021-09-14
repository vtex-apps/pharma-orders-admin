/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { ButtonWithIcon, Modal, Tag } from 'vtex.styleguide'
import Image from '@vtex/styleguide/lib/icon/Image'
import { useIntl } from 'react-intl'

import { titlesIntl } from '../utils/intl'
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

  const files = customApps?.find((app: any) => app.id === 'uploadfiles').fields
    .data

  const filesObject = files && JSON.parse(files.replace(/'/g, '"'))

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
  const withoutPrescription = intl.formatMessage(titlesIntl.withoutPrescription)

  return (
    <div>
      {!filesObject && (
        <Tag color="#134CD8" variation="low">
          {withoutPrescription}
        </Tag>
      )}
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
