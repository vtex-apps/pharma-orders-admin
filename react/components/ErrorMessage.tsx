import '../style/Alert.global.css'

import React from 'react'
import { Alert } from 'vtex.styleguide'

export function ErrorMessage({ message, onClose }: ErrorComponent) {
  return (
    <div className="error-container">
      <Alert type="error" onClose={onClose}>
        {message}
      </Alert>
    </div>
  )
}

export function ErrorArrayMessage({ messages, onClose }: ErrorArrayComponent) {
  return (
    <div className="error-container">
      <Alert type="error" onClose={onClose}>
        <div>
          {messages.map((message: string, index: number) => (
            <p className="ma0" key={index}>
              {message}
            </p>
          ))}
        </div>
      </Alert>
    </div>
  )
}
