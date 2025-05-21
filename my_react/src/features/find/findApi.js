//src/features/user/findApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';


export const findApi = createApi({
    reducerPath: 'findApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        FindIdByEmail: builder.mutation({
            query: (credentials) => ({
              url: '/find/find-id-by-email.do',
              method: 'POST',
              body: credentials, 
            }),
        }),
        FindIdByPhone: builder.mutation({
            query: (credentials) => ({
              url: '/find/findIdByPhone.do',
              method: 'POST',
              body: credentials,
            }),
        }),
    }),
});

export const {
    useFindIdByEmailMutation,
    useFindIdByPhoneMutation,
} = findApi;