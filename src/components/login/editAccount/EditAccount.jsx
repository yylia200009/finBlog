import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AuthContext } from '../../context/DataContext'
import styles from './EditAccount.module.scss'
import { useUpdateUserMutation } from '../../../store/blogApi'
import { blogApi } from '../../../store/blogApi'

const CreateAccount = () => {
  const navigate = useNavigate()
  const [upDateUser] = useUpdateUserMutation()
  const dispatch = useDispatch()
  const { user, refetchUser } = useContext(AuthContext)

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      image: '',
    },
  })

  useEffect(() => {
    reset({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      image: '',
    })
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      const changedData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (key === 'password') return value !== ''
          return value !== '' && value !== user?.[key]
        })
      )

      if (Object.keys(changedData).length === 0) {
        navigate('/profile')
        return
      }

      console.log('Sending data:', changedData)
      const response = await upDateUser(changedData).unwrap()
      console.log('Server response:', response)

      dispatch(blogApi.util.invalidateTags(['User']))
      await refetchUser()
      navigate('/profile')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.wrapForm}>
        <h1 className={styles.title}>Edit Profile</h1>
        <form className={styles.signForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field (не обязательное) */}
          <div className={styles.labelWrap}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              {...register('username', {
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Username cannot exceed 20 characters',
                },
              })}
              className={`${errors?.username ? styles.inputError : ''}`}
            />
            {errors?.username && <p className={styles.error}>{errors.username.message}</p>}
          </div>

          {/* Email Field (не обязательное) */}
          <div className={styles.labelWrap}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className={`${errors?.email ? styles.inputError : ''}`}
            />
            {errors?.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>

          {/* Password Field (не обязательное) */}
          <div className={styles.labelWrap}>
            <label htmlFor="password">New password</label>
            <input
              type="password"
              id="password"
              placeholder="New Password"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Password cannot exceed 40 characters',
                },
              })}
              className={`${errors?.password ? styles.inputError : ''}`}
            />
            {errors?.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          {/* Avatar Field */}
          <div className={styles.labelWrap}>
            <label htmlFor="image">Avatar image (url)</label>
            <input
              type="url"
              id="image"
              placeholder="New avatar URL"
              {...register('image', {
                pattern: {
                  value: /^(https?:\/\/).+$/i,
                  message: 'Please enter a valid URL starting with http:// or https://',
                },
              })}
            />

            {errors?.image && <p className={styles.error}>{errors.image.message}</p>}
          </div>

          {/* Submit Button */}
          <div className={styles.create}>
            <button type="submit" className={styles.btn} disabled={!isDirty}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateAccount
