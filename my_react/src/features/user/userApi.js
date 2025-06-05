// src/features/auth/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery:  baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/login.do',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/user/register.do',
        method: 'POST',
        body: credentials
      })
    }),
    userUpdate: builder.mutation({
        query: (credentials) => ({
          url: '/user/update.do',
          method: 'POST',
          body: credentials
        })
    }),
    userDelete: builder.mutation({
        query: (credentials) => ({
          url: '/user/delete.do',
          method: 'POST',
          body: credentials
        })
    }),
    logout: builder.mutation({
        query: (credentials) => ({
          url: '/user/logout.do',
          method: 'POST',
          body: credentials
        })
    }),
    view: builder.query({
        query: (credentials) => ({
            url: '/user/view.do',
            method: 'POST',
            body: credentials
        }),
        keepUnusedDataFor: 0, // = cacheTime: 0
        refetchOnMountOrArgChange: true,
        staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
   
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserUpdateMutation,
  useUserDeleteMutation,
  useLogoutMutation,
  useViewQuery
} = userApi;
