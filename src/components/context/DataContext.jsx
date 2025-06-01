import React, { createContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useGetCurrentUserQuery, useLoginUserMutation } from '../../store/blogApi'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const { data: userData, isLoading, refetch: refetchUser } = useGetCurrentUserQuery()
  const [loginMutation] = useLoginUserMutation()
  const navigate = useNavigate()

  useEffect(() => {
    refetchUser()
  }, [refetchUser])

  const login = async (credentials) => {
    try {
      const result = await loginMutation(credentials).unwrap()
      await refetchUser()
      return result
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    await refetchUser()
    window.location.reload()
    navigate('/')
  }
  const value = {
    user: userData?.user,
    isLoading,
    login,
    logout,
    refetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
