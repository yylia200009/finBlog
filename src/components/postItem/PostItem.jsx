import React, { useContext, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import remarkGfm from 'remark-gfm'
import './postItem.scss'
import { AuthContext } from '../context/DataContext'
import { useFavoriteArticleMutation, useUnFavoriteArticleMutation } from '../../store/blogApi'
import Unlike from '../UI/heart/Unlike'
import Like from '../UI/heart/Like'

const PostItem = ({ post }) => {
  const navigate = useNavigate()
  const [favoriteArticle] = useFavoriteArticleMutation()
  const [unFavoriteArticle] = useUnFavoriteArticleMutation()
  const { user } = useContext(AuthContext)

  const [isFavorited, setIsFavorited] = useState(post.favorited)
  const [favoritesCount, setFavoritesCount] = useState(post.favoritesCount)

  const truncateText = (text, maxLength = 250) => {
    if (!text) return ''

    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const handleCardClick = () => {
    navigate(`/articles/${post.slug}`)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()

    if (!user) {
      navigate('/sign-in')
      return
    }

    try {
      if (isFavorited) {
        await unFavoriteArticle(post.slug).unwrap()
        setIsFavorited(false)
        setFavoritesCount((prevCount) => prevCount - 1)
      } else {
        await favoriteArticle(post.slug).unwrap()
        setIsFavorited(true)
        setFavoritesCount((prevCount) => prevCount + 1)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  return (
    <div className="wrapPost" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="wrapWrap">
        <div className="titlePost">
          <h2>{post.title}</h2>
          <div className="buttonHeart" onClick={handleFavoriteClick}>
            {isFavorited ? <Like /> : <Unlike />}
            <p>{favoritesCount}</p>
          </div>
        </div>
        <div className="tagWrap" onClick={(e) => e.stopPropagation()}>
          {post.tagList.map((tag, index) =>
            typeof tag === 'string' && tag.trim().length > 0 ? (
              <p className="tag" key={post.tagList.length + index}>
                {tag.trim()}
              </p>
            ) : null
          )}
        </div>
        <div className="post__content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ ...props }) => <img {...props} style={{ maxWidth: '100%' }} alt="" />,
              p: ({ ...props }) => <p className="markdown-paragraph" {...props} />,
            }}
          >
            {truncateText(post.body)}
          </ReactMarkdown>
        </div>{' '}
      </div>
      <div className="account">
        <div className="whoAuthor">
          <p className="author-name">{post.author.username}</p>
          <p className="post-date">{formatDate(post.createdAt)}</p>
        </div>
        <div className="imgSinglePost">
          <img
            src={post.author.image || '/default-avatar.jpg'} // Fallback для изображения
            alt={post.author.username}
          />
        </div>
      </div>
    </div>
  )
}

PostItem.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
    favorited: PropTypes.bool.isRequired,
    favoritesCount: PropTypes.number.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      bio: PropTypes.string,
      image: PropTypes.string.isRequired,
      following: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
}

export default PostItem
