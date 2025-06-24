// src/features/board/boardApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const boardApi = createApi({
  reducerPath: 'boardApi', //중복있으면안됨
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    boardList: builder.query({  //단순조회  query        데이터에변화  mutation
      query: (params) => ({
        url: '/board/list.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    boardView: builder.query({
      query: (params) => ({
        url: '/board/view.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    boardCreate: builder.mutation({
      query: (formData) => ({
        url: '/board/create.do',
        method: 'POST',
        body: formData,
      }),
    }),
    boardUpdate: builder.mutation({
      query: (formData) => ({
        url: '/board/update.do',
        method: 'POST',
        body: formData,
      }),
    }),
    boardDelete: builder.mutation({
      query: (params) => ({
        url: '/board/delete.do',
        method: 'POST',
        body: params,
      }),
    }),
    commentCreate: builder.mutation({
      query: (comment) => ({
        url: '/board/comment/create.do',
        method: 'POST',
        body: comment,
      }),
    }),
    commentUpdate: builder.mutation({
      query: (comment) => ({
        url: '/board/comment/update.do',
        method: 'POST',
        body: comment,
      }),
    }),
    commentDelete: builder.mutation({
      query: (comment) => ({
        url: '/board/comment/delete.do',
        method: 'POST',
        body: comment,
      }),
    }),
  }),
});

export const {
    useBoardListQuery,
    useBoardViewQuery,
    useBoardCreateMutation,
    useBoardUpdateMutation,
    useBoardDeleteMutation,
    useCommentCreateMutation,
    useCommentUpdateMutation,
    useCommentDeleteMutation,
} = boardApi;
