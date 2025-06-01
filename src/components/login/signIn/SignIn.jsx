import React, { useContext } from 'react'
import styles from './signIn.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLoginUserMutation } from '../../../store/blogApi'
import { AuthContext } from '../../context/DataContext'

const SignIn = () => {
  const [loginUser, { isLoading, error }] = useLoginUserMutation()
  const navigate = useNavigate()
  const { login } = useContext(AuthContext) || {}

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    if (!isValid) return
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap()

      login?.(response.user)
      localStorage.setItem('token', response.user.token)
      reset()
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.wrapForm}>
        <h1 className={styles.title}>Sign In</h1>
        <form className={styles.signForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className={styles.labelWrap}>
            <label htmlFor="email">Email address</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              type="email"
              id="email"
              placeholder="Email address"
              className={`${errors?.email ? styles.inputError : ''}`}
            />
            {errors?.email ? (
              <p className={styles.error}>{errors.email.message}</p>
            ) : (
              <p style={{ color: 'transparent' }}>/</p>
            )}
          </div>

          {/* Password */}
          <div className={styles.labelWrap}>
            <label htmlFor="password">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'Password cannot be empty or contain only spaces',
                  noSpaces: (value) => !value.includes(' ') || 'Password cannot contain spaces',
                },
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type="password"
              id="password"
              placeholder="Password"
              className={`${errors?.password ? styles.inputError : ''}`}
            />
            {errors?.password ? (
              <p className={styles.error}>{errors.password.message}</p>
            ) : (
              <p style={{ color: 'transparent' }}>/</p>
            )}
          </div>

          {/* Ошибка сервера */}
          {error && (
            <div className={styles.serverError}>
              {error.data?.errors ? (
                Object.entries(error.data.errors).map(([key, messages]) => (
                  <p key={key}>
                    {key}: {messages.join(', ')}
                  </p>
                ))
              ) : (
                <p>Login failed. Please try again.</p>
              )}
            </div>
          )}

          <div className={styles.create}>
            <button type="submit" className={styles.btn} disabled={!isValid || isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <span>
              Don&apos;t have an account? <Link to="/sign-up">Sign Up.</Link>
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SignIn
