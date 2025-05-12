// src/features/file/fileApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    imgUpload: builder.mutation({
      query: (formData) => ({
        url: '/file/imgUpload.do',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useImgUploadMutation,
} = fileApi;
