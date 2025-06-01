import React, { useContext } from 'react'
import './header.scss'
import NewAccount from '../account/NewAccount'
import OldAccount from '../account/OldAccount'
import { AuthContext } from '../context/DataContext'

const Header = () => {
  const { user, logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout?.()
  }

  return (
    <section className="header">{user ? <OldAccount user={user} onLogout={handleLogout} /> : <NewAccount />}</section>
  )
}

export default Header
