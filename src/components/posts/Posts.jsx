import React, { useContext } from 'react'
import PostItem from '../postItem/PostItem'
import { PaginationContext } from '../pagination/paginationContext'
import { useGetArticlesQuery } from '../../store/blogApi'
import './posts.scss'
import PaginationBlog from '../pagination/PaginationBlog'
import Loading from '../UI/Loading'
import Error from '../UI/Error'

const Posts = () => {
  const { currentPage } = useContext(PaginationContext)
  const offset = (currentPage - 1) * 5

  const { data, isLoading, isError } = useGetArticlesQuery({
    offset,
    limit: 5,
  })

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <section className="posts">
      {data?.articles?.map((post) => (
        <div className="article" key={post.slug}>
          <PostItem post={post} />
        </div>
      ))}
      <PaginationBlog total={data?.total} />
    </section>
  )
}

export default Posts
