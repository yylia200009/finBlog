import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetSingleArticleQuery, useUpdateArticleMutation } from '../../store/blogApi'
import styles from './editArticles.module.scss'
import { useForm } from 'react-hook-form'
import Loading from '../../components/UI/Loading'
import Error from '../../components/UI/Error'

const EditArticle = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: articleData, isLoading: isArticleLoading, error: fetchError } = useGetSingleArticleQuery(slug)
  const [updateArticle, { isLoading: isUpdating, error: updateError }] = useUpdateArticleMutation()

  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const inputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },

    setValue,
  } = useForm({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (articleData?.article) {
      const article = articleData.article
      setValue('title', article.title)
      setValue('description', article.description)
      setValue('body', article.body)
      setTags(article.tagList || [])
    }
  }, [articleData, setValue])

  const onSubmit = async (data) => {
    try {
      const articleData = {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: tags,
      }
      console.log('Sending this data:', { slug, article: articleData })

      await updateArticle({ slug: slug, article: articleData }).unwrap()
      navigate(`/articles/${slug}`)
    } catch (error) {
      console.error('Failed to update article:', error)
    }
  }

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
      setInputValue('')
    }
  }

  const handleEditTag = (index) => {
    setEditingIndex(index)
    setInputValue(tags[index])
    inputRef.current?.focus()
  }

  const handleSaveEdit = () => {
    if (inputValue.trim() && editingIndex !== null) {
      const newTags = [...tags]
      newTags[editingIndex] = inputValue.trim()
      setTags(newTags)
      setEditingIndex(null)
      setInputValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (editingIndex !== null) {
        handleSaveEdit()
      } else {
        handleAddTag()
      }
    }
  }

  const handleClear = () => {
    setInputValue('')
  }

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus()
    }
  }, [editingIndex])

  if (isArticleLoading) return <Loading />
  if (fetchError) return <Error />

  return (
    <div className={styles.wrap}>
      <form className={styles.newArticle} onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Article</h2>

        <div className={styles.title}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            {...register('title', {
              required: 'Title is required',
              validate: {
                notEmpty: (value) => value.trim() !== '' || 'Title cannot be empty',
              },
            })}
            className={`${errors?.title ? styles.inputError : ''}`}
          />
          {errors?.title && <p className={styles.error}>{errors.title.message}</p>}
        </div>

        <div className={styles.description}>
          <label htmlFor="description">Short description</label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            {...register('description', {
              required: 'Description is required',
              validate: {
                notEmpty: (value) => value.trim() !== '' || 'Description cannot be empty',
              },
            })}
            className={`${errors?.description ? styles.inputError : ''}`}
          />
          {errors?.description && <p className={styles.error}>{errors.description.message}</p>}
        </div>

        <div className={styles.text}>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            placeholder="Text"
            {...register('body', {
              required: 'Text is required',
              validate: {
                notEmpty: (value) => value.trim() !== '' || 'Text cannot be empty',
              },
            })}
            className={`${errors?.body ? styles.inputError : ''}`}
          />
          {errors?.body && <p className={styles.error}>{errors.body.message}</p>}
        </div>

        <div className={styles.tags}>
          <label htmlFor="tag">Tags</label>
          <div className={styles.tagList}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tagItem}>
                <span onClick={() => handleEditTag(index)}>{tag}</span>
                <button type="button" className={styles.btnDelete} onClick={() => handleDeleteTag(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className={styles.tagInputContainer}>
            <input
              ref={inputRef}
              type="text"
              id="tag"
              placeholder="Tag"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" className={styles.btnDelete} onClick={handleClear}>
              Clear
            </button>
            <button type="button" className={styles.btnAdd} onClick={handleAddTag}>
              Add tag
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submit} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Send'}
        </button>

        {updateError && (
          <p className={styles.error}>Error updating article: {updateError.data?.message || 'Unknown error'}</p>
        )}
      </form>
    </div>
  )
}

export default EditArticle
