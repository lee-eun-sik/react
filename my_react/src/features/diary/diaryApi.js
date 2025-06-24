import {createApi} from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const diaryApi = createApi({
  reducerPath: 'diaryApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    diaryList: builder.query({
      query: (params) => ({
        url: '/diary/list.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    diaryView: builder.query({
      query: (params) => ({
        url: '/diary/view.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    diaryCreate: builder.mutation({
      query: (formData) => ({
        url: '/diary/create.do',
        method: 'POST',
        body: formData,
      }),
    }),
    diaryUpdate: builder.mutation({
      query: (formData) => ({
        url: '/diary/update.do',
        method: 'POST',
        body: formData,
      }),
    }),
    diaryDelete: builder.mutation({
      query: (params) => ({
        url: '/diary/delete.do',
        method: 'POST',
        body: params,
      }),
    }),
  }),
});

export const {
    useDiaryListQuery,
    useDiaryViewQuery,
    useDiaryCreateMutation,
    useDiaryUpdateMutation,
    useDiaryDeleteMutation,
} = diaryApi;
