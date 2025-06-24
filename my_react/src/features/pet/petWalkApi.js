
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const petWalkApi = createApi({
  reducerPath: 'petWalkApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    petWalkSave: builder.mutation({
      query: (formData) => ({
        url: '/petWalk/petSave.do',
        method: 'POST',
        body: formData,
      }),
    }),
    petWalkUpdate: builder.mutation({
      query: (formData) => ({
        url: '/petWalk/petUpdate.do',
        method: 'POST',
        body: formData,
      }),
    }),
    petImgSave: builder.mutation({
      query: (formData) => ({
        url: '/petWalk/imgSave.do',
        method: 'POST',
        body: formData,
      }),
    }),
    petImgLoad: builder.query({
      query: (formData) => ({
        url: '/petWalk/imgLoad.do',
        method: 'POST',
        body: formData,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    petWalkLoad: builder.query({
      query: (formData) => ({
        url: '/petWalk/petLoad.do',
        method: 'POST',
        body: formData,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    petCurrentWalkLoad: builder.query({
      query: (formData) => ({
        url: '/petWalk/petCurrentLoad.do',
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
  usePetWalkSaveMutation,
  usePetWalkUpdateMutation,
  usePetImgSaveMutation,
  usePetImgLoadQuery,
  usePetWalkLoadQuery,
  usePetCurrentWalkLoadQuery,
} = petWalkApi;
