
// src/features/home/homeApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';
export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    animalList: builder.query({  //단순조회  query        데이터에변화  mutation
      query: (params) => ({
        url: '/home/animal.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),

    plantList: builder.query({  //단순조회  query        데이터에변화  mutation
      query: (params) => ({
        url: '/home/plant.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    })
  }),
});

export const {
  useAnimalListQuery,
  usePlantListQuery,

} = homeApi;


