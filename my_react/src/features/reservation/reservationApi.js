// src/features/auth/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 

export const reservationApi = createApi({
    reducerPath: 'reservationApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        reservationList: builder.query({
           query: (params) => ({
            url: '/reservation/list.do',
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
    useReservationListQuery
} = reservationApi;