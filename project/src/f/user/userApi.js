// src/f/auth/authApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthHandler from "../../cm/CmCustomBaseQuery";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/user/login.do',
                method: 'POST',
                body: credentials
            })
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: '/user/register.do',
                method: 'POST',
                body: credentials
            })
        }),
        userUpdate: builder.mutation({
            query: (credentials) => ({
                url: '/user/update.do',
                method: 'POST',
                body: credentials
            })
        }),
        userDelete: builder.mutation({
            query: (credentials) => ({
                url: '/user/delete.do',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: (credentials) => ({
                url: '/user/logout.do',
                method: 'POST',
                body: credentials
            })
        }),
        view: builder.query({
            query: (credentials) => ({
                url: '/user/view.do',
                method: 'POST',
                body: credentials
            })
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useUserUpdateMutation,
    useUserDeleteMutation,
    useLogoutMutation,
    useViewQuery
} = userApi;