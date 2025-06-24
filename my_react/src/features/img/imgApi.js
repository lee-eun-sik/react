// src/features/file/fileApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const imgApi = createApi({
  reducerPath: 'imgApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    imgSave: builder.mutation({
      query: (formData) => ({
        url: '/img/imgSave.do',
        method: 'POST',
        body: formData,
      }),
    }),
    imgLoad: builder.query({
      query: (formData) => ({
        url: '/img/imgLoad.do',
        method: 'POST',
        body: formData,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
  }),
});

export const {
  useImgSaveMutation,
  useImgLoadQuery,
} = imgApi;
