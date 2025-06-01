import React from 'react'

import { Alert } from 'antd'
import './error.scss'

const Error = () => {
  return (
    <div className="error">
      <div>
        <Alert message="Error" type="error" showIcon />
      </div>
    </div>
  )
}

export default Error
