import { createApi} from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthHandler from "../../cm/CmCustomBaseQuery";

export const newBoardApi = createApi({
    reducerPath: 'newBoardApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        boardList: builder.query({
            newBoardList: builder.query({
                query: (params) => ({
                    url: '/board/list.do',
                    method: 'POST',
                    body: params,

                }),
                keepUnusedDataFor: 0, // = cacheTime: 0
                refetchOnMountOrArgChange: true,
                staleTime: 0, 
            }),
            newBoardCreate: builder.mutation({
                query: (formData) => ({
                    url: '/newboard/create.do',
                    method: 'POST',
                    body: formData,
                })
            })
        }),
    }),
});

export const {
    useNewBoardListQuery,
    useNewBoardCreateMutation,
} = newBoardApi;
