import { Spinner } from 'vtex.styleguide'
import React from 'react'
import '../style/Loading.global.css'

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <Spinner />
    </div>
  )
}
