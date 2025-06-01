import React, { useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useGetSingleArticleQuery,
  useGetCurrentUserQuery,
  useFavoriteArticleMutation,
  useUnFavoriteArticleMutation,
  useDeleteArticleMutation,
} from '../../store/blogApi'
import Loading from '../UI/Loading'
import Error from '../UI/Error'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './singlePost.scss'
import { Popconfirm } from 'antd'
import { AuthContext } from '../context/DataContext'
import { useEffect } from 'react'
import Unlike from '../UI/heart/Unlike'
import Like from '../UI/heart/Like'

const SinglePost = () => {
  const { slug } = useParams()
  const { data: articleData, isLoading, isError, refetch } = useGetSingleArticleQuery(slug)
  const { data: getCurrentUser } = useGetCurrentUserQuery()
  const [deleteArticle] = useDeleteArticleMutation()
  const [favoriteArticle] = useFavoriteArticleMutation()
  const [unFavoriteArticle] = useUnFavoriteArticleMutation()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const article = articleData?.article
  const currentUser = getCurrentUser?.user
  const isAuthor = currentUser?.username === article?.author?.username

  useEffect(() => {
    if (article) {
      refetch()
    }
  }, [slug])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap()
      navigate('/')
      // window.location.reload()
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()

    if (!user) {
      navigate('/sign-in')
      return
    }

    try {
      if (article.favorited) {
        await unFavoriteArticle(article.slug).unwrap()
      } else {
        await favoriteArticle(article.slug).unwrap()
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  if (isLoading) return <Loading />
  if (isError) return <Error />
  if (!article) return <div className="not-found">Статья не найдена</div>

  return (
    <div className="singleWrap">
      <div className="singlePost">
        <header className="titlePost">
          <div className="titleName">
            <h1>{article.title}</h1>
            <div className="buttonHeartWrap" onClick={handleFavoriteClick}>
              {article.favorited ? <Like /> : <Unlike />}
              <p>{article.favoritesCount}</p>
            </div>
          </div>
          <div className="authorization">
            <div className="account">
              <div className="whoAuthor">
                <p className="author-name">{article.author.username}</p>
                <p className="post-date">{formatDate(article.createdAt)}</p>
              </div>
              <div className="imgSinglePost">
                <img src={article.author.image || '/default-avatar.jpg'} alt={article.author.username} />
              </div>
            </div>
            {isAuthor && (
              <div className="btnAuthor">
                <Popconfirm
                  title="Are you sure to delete this article?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                  placement={'right'}
                >
                  <button className=" btnAll deleteBtn">Delete</button>
                </Popconfirm>

                <Link to={`/articles/${article.slug}/edit`} className="btnAll editBtn">
                  Edit
                </Link>
              </div>
            )}
          </div>
        </header>
        {article.tagList.filter((tag) => tag.trim()).length > 0 && (
          <div className="tagWrap">
            {article.tagList.map(
              (tag, index) =>
                tag.trim() && (
                  <span className="tag" key={`${tag}-${index}`}>
                    {tag.trim()}
                  </span>
                )
            )}
          </div>
        )}

        {article.description && (
          <section className="description">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.description}</ReactMarkdown>
          </section>
        )}

        <article className="post-content">
          <div className="post-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ ...props }) => <img {...props} style={{ maxWidth: '100%' }} alt="" />,
                p: ({ ...props }) => <p className="break-long-words" {...props} />,
                pre: ({ ...props }) => (
                  <div className="code-wrapper">
                    <pre {...props} />
                  </div>
                ),
              }}
            >
              {article.body}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}

export default SinglePost
