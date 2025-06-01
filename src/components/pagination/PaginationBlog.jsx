import React, { useContext } from 'react'
import { PaginationContext } from './paginationContext'
import { Pagination } from 'antd'
import './pagination.scss'
import PropTypes from 'prop-types'

const PaginationBlog = ({ total }) => {
  const { currentPage, setCurrentPage } = useContext(PaginationContext)

  const handleChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="pag">
      <Pagination
        itemActiveBg="none"
        itemBg="none"
        itemLinkBg="none"
        itemInputBg="none"
        itemActiveBgDisabled="none"
        current={currentPage}
        align="center"
        total={total}
        pageSize={5}
        onChange={handleChange}
        showSizeChanger={false}
      />
    </div>
  )
}

export default PaginationBlog

PaginationBlog.propTypes = {
  total: PropTypes.number.isRequired,
}
