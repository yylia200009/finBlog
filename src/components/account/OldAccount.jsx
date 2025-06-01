import PropTypes from 'prop-types'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import def from '../../assets/def.png'
import styles from './oldAccount.module.scss'

const OldAccount = ({ user, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    onLogout()
    navigate('/')
  }
  return (
    <>
      <div className="nameTitle">
        <Link to=".." relative="path">
          Realworld Blog
        </Link>
      </div>
      <div className="loginWrap">
        <Link to="/new-article">
          <button type="button" className="up">
            Create article{' '}
          </button>
        </Link>
        <Link to="/profile">
          <button type="button" className="in">
            <p> {user?.username}</p>
            <img
              src={user?.image || def}
              alt={user?.username ? `${user.username}'s avatar` : 'Default avatar'}
              className={styles.userAvatar}
              onError={(e) => {
                e.target.src = def
              }}
            />
          </button>{' '}
        </Link>

        <button type="button" className="out" onClick={handleLogout}>
          Log Out{' '}
        </button>
      </div>
    </>
  )
}

OldAccount.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    bio: PropTypes.string,
    token: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
}

OldAccount.defaultProps = {
  user: {
    username: 'Anonymous',
    image: null,
    email: null,
    bio: null,
    token: null,
  },
}

export default OldAccount

// import PropTypes from 'prop-types'
// import React from 'react'
// import { Link } from 'react-router-dom'
// import def from '../../../public/def.png'
// import styles from './oldAccount.module.scss'

// const OldAccount = ({ user, onLogout }) => {
//   const handleLogout = (e) => {
//     e.preventDefault()
//     onLogout()
//   }
//   return (
//     <>
//       <div className="nameTitle">
//         <Link to=".." relative="path">
//           Realworld Blog
//         </Link>
//       </div>
//       <div className="loginWrap">
//         <Link to="/profile">
//           <button type="button" className="up">
//             Create article{' '}
//           </button>
//         </Link>
//         <Link to="/profile">
//           <button type="button" className="in">
//             <p> {user?.username}</p>
//             <img
//               src={user?.image || def}
//               alt={user?.username ? `${user.username}'s avatar` : 'Default avatar'}
//               className={styles.userAvatar}
//               onError={(e) => {
//                 e.target.src = def
//               }}
//             />
//           </button>{' '}
//         </Link>

//         <button type="button" className="out" onClick={handleLogout}>
//           Log Out{' '}
//         </button>
//       </div>
//     </>
//   )
// }

// OldAccount.propTypes = {
//   user: PropTypes.shape({
//     username: PropTypes.string,
//     email: PropTypes.string,
//     image: PropTypes.string,
//     bio: PropTypes.string,
//     token: PropTypes.string,
//   }),
//   onLogout: PropTypes.func.isRequired,
// }

// OldAccount.defaultProps = {
//   user: {
//     username: 'Anonymous',
//     image: null,
//     email: null,
//     bio: null,
//     token: null,
//   },
// }

// export default OldAccount
