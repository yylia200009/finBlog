import React from 'react'

import { Spin } from 'antd'
import './loading.scss'

const Loading = () => {
  return (
    <div className="loading">
      <Spin size="large" align="center" />
    </div>
  )
}

export default Loading
