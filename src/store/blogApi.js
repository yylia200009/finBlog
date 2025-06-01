import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const blogApi = createApi({
  reducerPath: 'blogApi',
  tagTypes: ['User', 'Auth', 'Article'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Token ${token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    getArticles: build.query({
      query: (params = {}) => ({
        url: 'articles',
        params: {
          offset: params.offset,
          limit: params.limit,
        },
      }),
      transformResponse: (response) => ({
        articles: response.articles || [],
        total: response.articlesCount || 0,
      }),
      providesTags: (result) => [
        { type: 'Article', id: 'LIST' },
        ...(result?.articles?.map(({ slug }) => ({ type: 'Article', id: slug })) || []),
      ],
    }),
    createArticle: build.mutation({
      query: (articleData) => ({
        url: 'articles',
        method: 'POST',
        body: { article: articleData },
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    getSingleArticle: build.query({
      query: (slug) => `articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Article', slug }],
    }),
    registerUser: build.mutation({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: { user: userData },
      }),
      invalidatesTags: ['User'],
    }),
    loginUser: build.mutation({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: { user: credentials },
      }),
      invalidatesTags: ['User'],
    }),

    favoriteArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        const patchArticles = dispatch(
          blogApi.util.updateQueryData('getArticles', undefined, (draft) => {
            const article = draft.articles.find((a) => a.slug === slug)
            if (article) {
              article.favorited = true
              article.favoritesCount += 1
            }
          })
        )

        const patchArticle = dispatch(
          blogApi.util.updateQueryData('getSingleArticle', slug, (draft) => {
            if (draft.article) {
              draft.article.favorited = true
              draft.article.favoritesCount += 1
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchArticles.undo()
          patchArticle.undo()
        }
      },
    }),
    unFavoriteArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        const patchArticles = dispatch(
          blogApi.util.updateQueryData('getArticles', undefined, (draft) => {
            const article = draft.articles.find((a) => a.slug === slug)
            if (article) {
              article.favorited = false
              article.favoritesCount -= 1
            }
          })
        )

        const patchArticle = dispatch(
          blogApi.util.updateQueryData('getSingleArticle', slug, (draft) => {
            if (draft.article) {
              draft.article.favorited = false
              draft.article.favoritesCount -= 1
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchArticles.undo()
          patchArticle.undo()
        }
      },
    }),

    getCurrentUser: build.query({
      query: () => 'user',
      providesTags: ['User'],
    }),
    updateUser: build.mutation({
      query: (userData) => ({
        url: 'user',
        method: 'PUT',
        body: { user: userData },
      }),
      invalidatesTags: ['User'],
    }),
    updateArticle: build.mutation({
      query: ({ slug, article }) => {
        console.log('Sending update request with data:', { article })

        return {
          url: `articles/${slug}`,
          method: 'PUT',
          body: { article: article },
        }
      },
      invalidatesTags: ['Article'],
    }),
    deleteArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: ['Article'],
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useLazyGetArticlesQuery,
  useGetSingleArticleQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateArticleMutation,
  useUpdateUserMutation,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnFavoriteArticleMutation,
} = blogApi
export const api = blogApi
