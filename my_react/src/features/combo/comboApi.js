// src/features/board/boardApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 

export const comboApi = createApi({
  reducerPath: 'comboApi', //중복있으면안됨
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    comboCreate: builder.mutation({
      query: (formData) => ({
        url: '/combo/create.do',
        method: 'POST',
        body: formData,
      }),
    }),
    comboDelete: builder.mutation({
      query: (params) => ({
        url: '/combo/delete.do',
        method: 'POST',
        body: params,
      }),
    }),
    comboList: builder.query({
      query: () => ({
        url: '/combo/list.do',
        method: 'POST',
        body: {},
      }),
        keepUnusedDataFor: 0, // = cacheTime: 0
        refetchOnMountOrArgChange: true,
        staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    comboListByGroup: builder.query({
      query: (groupId) => ({
        url: '/combo/listByGroup.do',
        method: 'POST',
        body: { groupId },
      }),
    }),
  }),
});

export const {
    useComboCreateMutation,
    useComboDeleteMutation,
    useComboListQuery,
    useComboListByGroupQuery,
} = comboApi;
