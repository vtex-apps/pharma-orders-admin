/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Magnifier from 'react-magnifier'
import '../style/ImagePreview.global.css'

export default function ImagePreview({ url }: ImagePreviewProps) {
  return (
    <div className="wrapMagnifier">
      <Magnifier src={url} />
    </div>
  )
}
