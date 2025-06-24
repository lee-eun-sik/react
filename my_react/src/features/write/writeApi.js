
// src/features/write/writeApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const writeApi = createApi({
  reducerPath: 'writeApi', //중복있으면안됨
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    writeList: builder.query({  //단순조회  query        데이터에변화  mutation
      query: (params) => ({
        url: '/write/list.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    writeView: builder.query({
      query: (params) => ({
        url: '/write/view.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    writeCreate: builder.mutation({
      query: (formData) => ({
        url: '/write/create.do',
        method: 'POST',
        body: formData,
      }),
    }),
    writeUpdate: builder.mutation({
      query: (formData) => ({
        url: '/write/update.do',
        method: 'POST',
        body: formData,
      }),
    }),
    writeDelete: builder.mutation({
      query: (formData) => ({
        url: '/write/delete.do',
        method: 'POST',
        body: formData,
      }),
    }),
    commentCreate: builder.mutation({
      query: (comment) => ({
        url: '/write/comment/create.do',
        method: 'POST',
        body: comment,
      }),
    }),
    commentUpdate: builder.mutation({
      query: (comment) => ({
        url: '/write/comment/update.do',
        method: 'POST',
        body: comment,
      }),
    }),
    commentDelete: builder.mutation({
      query: (comment) => ({
        url: '/write/comment/delete.do',
        method: 'POST',
        body: comment,
      }),
    }),
  }),
});

export const {
    useWriteListQuery,
    useWriteViewQuery,
    useWriteCreateMutation,
    useWriteUpdateMutation,
    useWriteDeleteMutation,
    useCommentCreateMutation,
    useCommentUpdateMutation,
    useCommentDeleteMutation,
} = writeApi;


