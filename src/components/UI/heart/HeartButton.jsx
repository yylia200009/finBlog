import React from 'react'
import PropTypes from 'prop-types'
import './heartButton.scss'
import Like from './Like'
import Unlike from './Unlike'

const HeartButton = ({ favorited, onClick, favoritesCount }) => {
  return (
    <div onClick={onClick} className="heart-button">
      {favorited ? <Unlike /> : <Like />}
      <p>{favoritesCount}</p>
    </div>
  )
}

export default HeartButton

HeartButton.propTypes = {
  favorited: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  favoritesCount: PropTypes.number,
}
