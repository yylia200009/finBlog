import React, { createContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

export const PaginationContext = createContext()

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        setCurrentPage: handlePageChange,
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}
PaginationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
