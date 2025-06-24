import {createApi} from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    testQuestionOption: builder.mutation({
      query: (params) => ({
        url: '/test/questionOption.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    testResult: builder.query({
      query: (params) => ({
        url: '/test/result.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),

  }),
});

export const {
    useTestQuestionOptionMutation,
    useTestResultQuery,

} = testApi;
