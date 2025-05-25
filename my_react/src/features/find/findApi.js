//src/features/user/findApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';


export const findApi = createApi({
    reducerPath: 'findApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        FindId: builder.mutation({
            query: (credentials) => ({
              url: '/find/FindId.do',
              method: 'POST',
              body: credentials, 
            }),
        }),
        FindPw: builder.mutation({
            query: (credentials) => ({
              url: '/find/FindPw.do',
              method: 'POST',
              body: credentials,
            }),
        }),
        ResetPassword: builder.mutation({
            query: (credentials) => ({
              url: '/find/resetPassword.do',
              method: 'POST',
              body: credentials,
            }),
        }),
    }),
});

export const {
    useFindIdMutation,
    useFindPwMutation,
    useResetPasswordMutation,
} = findApi;