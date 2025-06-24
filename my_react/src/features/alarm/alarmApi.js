// src/features/board/boardApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const alarmApi = createApi({
  reducerPath: 'alarmApi', //중복있으면안됨
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    alarmList: builder.query({
      query: (params) => ({
        url: '/alarm/list.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    alarmOneList: builder.query({
      query: (params) => ({
        url: '/alarm/oneList.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    AlarmCreate: builder.mutation({
      query: (data) => ({
        url: '/alarm/create.do',
        method: 'POST',
        body: data,
      }),
    }),
    AlarmUpdate: builder.mutation({
      query: (data) => ({
        url: '/alarm/update.do',
        method: 'POST',
        body: data,
      }),
    }),
    AlarmAllUpdate: builder.mutation({
      query: (data) => ({
        url: '/alarm/AllUpdate.do',
        method: 'POST',
        body: data,
      }),
    }),
    AlarmDelete: builder.mutation({
      query: (data) => ({
        url: '/alarm/delete.do',
        method: 'POST',
        body: data,
      }),
    }),
    PetDeleteAlarm: builder.mutation({
      query: (data) => ({
        url: '/alarm/petDelete.do',
        method: 'POST',
        body: data,
      }),
    }),
    PlantDeleteAlarm: builder.mutation({
      query: (data) => ({
        url: '/alarm/plantDelete.do',
        method: 'POST',
        body: data,
      }),
    }),
    LogoutAlarm: builder.mutation({
      query: (data) => ({
        url: '/alarm/logoutDelete.do',
        method: 'POST',
        body: data,
      }),
    }),
    DropAlarm: builder.mutation({
      query: (data) => ({
        url: '/alarm/dropDelete.do',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
    useAlarmListQuery,
    useAlarmOneListQuery,
    useAlarmCreateMutation,
    useAlarmUpdateMutation,
    useAlarmAllUpdateMutation,
    useAlarmDeleteMutation,
    usePetDeleteAlarmMutation,
    usePlantDeleteAlarmMutation,
    useLogoutAlarmMutation,
    useDropAlarmMutation,
} = alarmApi;
