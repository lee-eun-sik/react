// src/features/auth/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuthHandler,
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
      query: (formData) => ({ 
        url: '/user/update.do',
        method: 'POST',
        body: formData
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
    userList: builder.query({
      query: (credentials) => ({
        url: '/user/list.do',
        method: 'POST',
        body: credentials
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    userM: builder.mutation({
      query: (credentials) => ({
        url: '/user/userM.do',
        method: 'POST',
        body: credentials
      })
    }),
    checkUsersId: builder.query({
      query: (params) => ({
        url: '/user/checkUsersId.do',
        method: 'POST',
        body: params,
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
  useViewQuery,
  useUserListQuery,
  useUserMMutation,
  useCheckUsersIdQuery
} = userApi;
