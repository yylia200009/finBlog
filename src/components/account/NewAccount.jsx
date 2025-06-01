import React from 'react'
import { Link } from 'react-router-dom'

const NewAccount = () => {
  return (
    <>
      <div className="nameTitle">
        <Link to=".." relative="path">
          Realworld Blog
        </Link>
      </div>
      <div className="loginWrap">
        <Link to="/sign-in">
          <button type="button" className="in">
            Sign In
          </button>
        </Link>
        <Link to="/sign-up">
          <button type="button" className="up">
            Sign Up
          </button>{' '}
        </Link>
      </div>
    </>
  )
}

export default NewAccount
