import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Header from '../header/Header'
import Posts from '../posts/Posts'
import './app.css'
import SinglePost from '../singlePost/SinglePost'
import { PaginationProvider } from '../pagination/paginationContext'
import SignUp from '../login/signup/SignUp'
import SignIn from '../login/signIn/SignIn'
import CreateAccount from '../login/editAccount/EditAccount'
import EditAccount from '../login/editAccount/EditAccount'
import { AuthProvider } from '../context/DataContext'
import Loading from '../UI/Loading'
import CreateArticle from '../createArticle/CreateArticle'
import EditArticle from '../editArticle/EditArticle'

// const SignUp = lazy(() => import('../login/signup/SignUp'))
// const SignIn = lazy(() => import('../login/signIn/SignIn'))
// const EditAccount = lazy(() => import('../login/editAccount/EditAccount'))
// const CreateArticle = lazy(() => import('../createArticle/CreateArticle'))
// const EditArticle = lazy(() => import('../editArticle/EditArticle'))

function App() {
  return (
    <BrowserRouter>
      <PaginationProvider>
        <AuthProvider>
          <div className="app">
            <Header />
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/articles/:slug" element={<SinglePost />} />
                {/* <Route path="/articles/:slug/edit" element={<EditArticle />} /> */}
                <Route path="/articles" element={<Posts />} />
                {/* <Route path="/sign-up" element={<SignUp />} /> */}
                <Route
                  path="/articles/:slug/edit"
                  element={
                    <Suspense fallback={<Loading />}>
                      <EditArticle />
                    </Suspense>
                  }
                />
                <Route
                  path="/sign-up"
                  element={
                    <Suspense fallback={<Loading />}>
                      <SignUp />
                    </Suspense>
                  }
                />
                <Route
                  path="/sign-in"
                  element={
                    <Suspense fallback={<Loading />}>
                      <SignIn />
                    </Suspense>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Suspense fallback={<Loading />}>
                      <EditAccount />
                    </Suspense>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CreateAccount />
                    </Suspense>
                  }
                />
                {/* <Route path="/sign-in" element={<SignIn />} /> */}
                {/* <Route path="/profile" element={<EditAccount />} /> */}
                {/* <Route path="/profile" element={<CreateAccount />} /> */}
                <Route path="/new-article" element={<CreateArticle />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </AuthProvider>
      </PaginationProvider>
    </BrowserRouter>
  )
}

export default App
