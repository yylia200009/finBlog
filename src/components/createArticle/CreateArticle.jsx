import React, { useState, useRef, useEffect } from 'react'
import styles from './createArticle.module.scss'
import { useForm } from 'react-hook-form'
import { useCreateArticleMutation } from '../../store/blogApi'
import Loading from '../../components/UI/Loading'
import Error from '../../components/UI/Error'

import { useDispatch } from 'react-redux'
import { api } from '../../store/blogApi'

const CreateArticle = () => {
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const inputRef = useRef(null)
  const [createArticle, { isLoading, error }] = useCreateArticleMutation()
  // const { refetch } = useGetArticlesQuery()
  const dispatch = useDispatch()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  })

  const onSubmit = async (data) => {
    try {
      const articleData = {
        title: data.title.trim(),
        description: data.description.trim(),
        body: data.body.trim(),
        tagList: tags.filter((tag) => tag.trim() !== ''),
      }

      console.log('Sending article data:', articleData)

      const result = await createArticle(articleData)
      console.log('Raw server response:', result)

      dispatch(api.util.invalidateTags(['Article']))

      await dispatch(api.util.prefetch('getArticles', { offset: 0, limit: 10 }, { force: true }))

      window.location.assign('/?forceRefresh=' + Date.now())
    } catch (error) {
      console.error('FULL ERROR DETAILS:', {
        status: error?.status,
        originalStatus: error?.originalStatus,
        data: error?.data,
        message: error?.error,
        stack: error?.stack,
      })
      alert(`Creation failed: ${error.data?.message || 'Unknown error'}`)
    }
  }

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()])
      setInputValue('')
    }
  }
  const handleTagBlur = () => {
    if (editingIndex === null && inputValue.trim()) {
      handleAddTag()
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

  if (isLoading) return <Loading />
  if (error) return <Error />

  return (
    <div className={styles.wrap}>
      <form className={styles.newArticle} onSubmit={handleSubmit(onSubmit)}>
        <h2>Create new article</h2>

        <div className={styles.title}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            {...register('title', {
              required: 'Title is required',
              validate: {
                notEmpty: (value) => value.trim() !== '' || 'Title cannot be empty or contain only spaces',
                noSpaces: (value) => !value.includes(' ') || 'Title cannot contain spaces',
              },
            })}
            className={`${errors?.title ? styles.inputError : ''}`}
          />
          {errors?.title ? (
            <p className={styles.error}>{errors.title.message}</p>
          ) : (
            <p style={{ color: 'transparent' }}>/</p>
          )}
        </div>

        <div className={styles.description}>
          <label htmlFor="description">Short description</label>
          <input
            type="description"
            id="description"
            placeholder="Description"
            {...register('description', {
              required: 'Description is required',
              validate: {
                notEmpty: (value) => value.trim() !== '' || 'Description cannot be empty or contain only spaces',
                noSpaces: (value) => !value.includes(' ') || 'Description cannot contain spaces',
              },
            })}
            className={`${errors?.description ? styles.inputError : ''}`}
          />
          {errors?.title ? (
            <p className={styles.error}>{errors.description.message}</p>
          ) : (
            <p style={{ color: 'transparent' }}>/</p>
          )}
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
          {errors?.body ? (
            <p className={styles.error}>{errors.body.message}</p>
          ) : (
            <p style={{ color: 'transparent' }}>/</p>
          )}
        </div>
        <div className={styles.tags}>
          <label htmlFor="tag">Tags</label>

          <div className={styles.tagList}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tagItem}>
                <span onClick={() => handleEditTag(index)}>{tag}</span>
                <button className={styles.btnDelete} onClick={() => handleDeleteTag(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div>
            <input
              ref={inputRef}
              type="text"
              id="tag"
              placeholder="Tag"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleTagBlur}
            />
            <button className={styles.btnDelete} onClick={() => handleClear()}>
              Delete
            </button>
            <button className={styles.btnAdd} onClick={handleAddTag}>
              Add tag
            </button>
          </div>
        </div>
        <button type="submit" className={styles.submit}>
          Send
        </button>
      </form>
    </div>
  )
}

export default CreateArticle

// import React, { useState, useRef, useEffect } from 'react'
// import styles from './createArticle.module.scss'
// import { useForm } from 'react-hook-form'
// import { useCreateArticleMutation } from '../../store/blogApi'
// import Loading from '../../components/UI/Loading'
// import Error from '../../components/UI/Error'
// import { useNavigate } from 'react-router-dom'

// const CreateArticle = () => {
//   const [tags, setTags] = useState([])
//   const [inputValue, setInputValue] = useState('')
//   const [editingIndex, setEditingIndex] = useState(null)
//   const inputRef = useRef(null)
//   const [createArticle, { isLoading, error }] = useCreateArticleMutation()
//   const navigate = useNavigate()
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     reset,
//   } = useForm({
//     mode: 'onBlur',
//   })

//   const onSubmit = async (data) => {
//     try {
//       const articleData = {
//         ...data,
//         tagList: tags,
//       }
//       const result = await createArticle(articleData).unwrap()
//       console.log(result)
//       reset()
//       setTags([])
//       navigate('/')
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const handleAddTag = () => {
//     if (inputValue.trim() && !tags.includes(inputValue.trim())) {
//       setTags([...tags, inputValue.trim()])
//       setInputValue('')
//     }
//   }
//   const handleTagBlur = () => {
//     if (editingIndex === null && inputValue.trim()) {
//       handleAddTag()
//     }
//   }

//   const handleDeleteTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index))
//     if (editingIndex === index) {
//       setEditingIndex(null)
//       setInputValue('')
//     }
//   }

//   const handleEditTag = (index) => {
//     setEditingIndex(index)
//     setInputValue(tags[index])
//     inputRef.current?.focus()
//   }

//   const handleSaveEdit = () => {
//     if (inputValue.trim() && editingIndex !== null) {
//       const newTags = [...tags]
//       newTags[editingIndex] = inputValue.trim()
//       setTags(newTags)
//       setEditingIndex(null)
//       setInputValue('')
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       if (editingIndex !== null) {
//         handleSaveEdit()
//       } else {
//         handleAddTag()
//       }
//     }
//   }

//   const handleClear = () => {
//     setInputValue('')
//   }

//   useEffect(() => {
//     if (editingIndex !== null) {
//       inputRef.current?.focus()
//     }
//   }, [editingIndex])

//   if (isLoading) return <Loading />
//   if (error) return <Error />

//   return (
//     <div className={styles.wrap}>
//       <form className={styles.newArticle} onSubmit={handleSubmit(onSubmit)}>
//         <h2>Create new article</h2>

//         <div className={styles.title}>
//           <label htmlFor="title">Title</label>
//           <input
//             type="text"
//             id="title"
//             placeholder="Title"
//             {...register('title', {
//               required: 'Title is required',
//               validate: {
//                 notEmpty: (value) => value.trim() !== '' || 'Title cannot be empty or contain only spaces',
//                 noSpaces: (value) => !value.includes(' ') || 'Title cannot contain spaces',
//               },
//             })}
//             className={`${errors?.title ? styles.inputError : ''}`}
//           />
//           {errors?.title ? (
//             <p className={styles.error}>{errors.title.message}</p>
//           ) : (
//             <p style={{ color: 'transparent' }}>/</p>
//           )}
//         </div>

//         <div className={styles.description}>
//           <label htmlFor="description">Short description</label>
//           <input
//             type="description"
//             id="description"
//             placeholder="Description"
//             {...register('description', {
//               required: 'Description is required',
//               validate: {
//                 notEmpty: (value) => value.trim() !== '' || 'Description cannot be empty or contain only spaces',
//                 noSpaces: (value) => !value.includes(' ') || 'Description cannot contain spaces',
//               },
//             })}
//             className={`${errors?.description ? styles.inputError : ''}`}
//           />
//           {errors?.title ? (
//             <p className={styles.error}>{errors.description.message}</p>
//           ) : (
//             <p style={{ color: 'transparent' }}>/</p>
//           )}
//         </div>
//         <div className={styles.text}>
//           <label htmlFor="body">Text</label>
//           <textarea
//             id="body"
//             placeholder="Text"
//             {...register('body', {
//               required: 'Text is required',
//               validate: {
//                 notEmpty: (value) => value.trim() !== '' || 'Text cannot be empty',
//               },
//             })}
//             className={`${errors?.body ? styles.inputError : ''}`}
//           />
//           {errors?.body ? (
//             <p className={styles.error}>{errors.body.message}</p>
//           ) : (
//             <p style={{ color: 'transparent' }}>/</p>
//           )}
//         </div>
//         <div className={styles.tags}>
//           <label htmlFor="tag">Tags</label>

//           <div className={styles.tagList}>
//             {tags.map((tag, index) => (
//               <div key={index} className={styles.tagItem}>
//                 <span onClick={() => handleEditTag(index)}>{tag}</span>
//                 <button className={styles.btnDelete} onClick={() => handleDeleteTag(index)}>
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div>
//             <input
//               ref={inputRef}
//               type="text"
//               id="tag"
//               placeholder="Tag"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//               onBlur={handleTagBlur}
//             />
//             <button className={styles.btnDelete} onClick={() => handleClear()}>
//               Delete
//             </button>
//             <button className={styles.btnAdd} onClick={handleAddTag}>
//               Add tag
//             </button>
//           </div>
//         </div>
//         <button type="submit" className={styles.submit}>
//           Send
//         </button>
//       </form>
//     </div>
//   )
// }

// export default CreateArticle
