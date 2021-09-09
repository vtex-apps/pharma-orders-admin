import '../style/Alert.global.css'

import React from 'react'
import { Alert } from 'vtex.styleguide'

export default function SuccessMessage({ message, onClose }: SuccessComponent) {
  return (
    <div className="success-container">
      <Alert type="success" onClose={onClose}>
        {message}
      </Alert>
    </div>
  )
}
