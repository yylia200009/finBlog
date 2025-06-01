import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import styles from './signUp.module.scss'
import { useRegisterUserMutation } from '../../../store/blogApi'

const SignUp = () => {
  const [registerUser] = useRegisterUserMutation()
  const navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const [serverErrors, setServerErrors] = useState(null)

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onSubmit',
  })

  const onSubmit = async (data) => {
    try {
      setServerErrors({})
      clearErrors()
      const response = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap()

      localStorage.setItem('token', response.user.token)
      navigate('/sign-in')
      reset()
    } catch (error) {
      if (error.data?.errors) {
        const serverErrors = error.data.errors

        if (serverErrors.username) {
          setError('username', {
            type: 'server',
            message: serverErrors.username,
          })
        }

        if (error.data.errors.email) {
          const emailError = error.data.errors.email
          setError('email', {
            type: 'server',
            message: emailError,
          })
        }

        setServerErrors(serverErrors)
      } else {
        setServerErrors({ general: ['Registration failed. Please try again.'] })
      }
    }
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.wrapForm}>
        <h1 className={styles.title}>Create new account</h1>

        <form className={styles.signForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className={styles.labelWrap}>
            <label htmlFor="username">Username</label>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Username cannot exceed 20 characters',
                },
              })}
              type="text"
              id="username"
              placeholder="Username"
              className={`${errors?.username ? styles.inputError : ''}`}
            />
            {errors?.username && <p className={styles.error}>{errors.username.message}</p>}
          </div>

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
            {errors?.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>
          {/* Password */}
          <div className={styles.labelWrap}>
            <label htmlFor="password">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Password cannot exceed 40 characters',
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

          {/* Repeat Password */}
          <div className={styles.labelWrap}>
            <label htmlFor="repeatPassword">Repeat Password</label>
            <input
              {...register('repeatPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
              type="password"
              id="repeatPassword"
              placeholder="Repeat Password"
              className={`${errors?.repeatPassword ? styles.inputError : ''}`}
            />
            {errors?.repeatPassword ? (
              <p className={styles.error}>{errors.repeatPassword.message}</p>
            ) : (
              <p style={{ color: 'transparent' }}>/</p>
            )}
          </div>

          <div className={styles.line}></div>

          {/* Checkbox */}
          <div className={styles.agree}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                {...register('agreeToTerms', {
                  required: 'You must accept the terms',
                })}
              />
              I agree to the processing of my personal information
            </label>
            {errors.agreeToTerms ? (
              <p className={styles.error}>{errors.agreeToTerms.message}</p>
            ) : (
              <p style={{ color: 'transparent' }}>/</p>
            )}
          </div>

          {/* Submit button */}
          <div className={styles.create}>
            <button
              type="submit"
              className={styles.btn}
              // disabled={!isValid} // Исправлено здесь
            >
              Create
            </button>

            <span>
              Already have an account? <Link to="/sign-in">Sign In</Link>.
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SignUp
