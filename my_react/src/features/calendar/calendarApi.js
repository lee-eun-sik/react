import {createApi} from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const calendarApi = createApi({
  reducerPath: 'calendarApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    calendarDot: builder.query({
      query: (params) => ({
        url: '/calendar/dot.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    calendarLog: builder.query({
      query: (params) => ({
        url: '/calendar/log.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    calendarAnimals: builder.query({
      query: ()=>({
        url: '/calendar/animals',
        method: 'GET',
        credentials:'include',
      }),
    }),
    calendarPlants: builder.query({
      query: () => ({
        url: '/calendar/plants',
        method: 'GET',
        credentials:'include',
      }),
    }),
  }),
});

export const {
    useCalendarDotQuery,
    useCalendarLogQuery,
    useCalendarAnimalsQuery,
    useCalendarPlantsQuery
} = calendarApi;
