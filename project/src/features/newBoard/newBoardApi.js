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

export const {// 구조분해할당 이미만든것임. 객체안에 이미들어가있다. 
    useNewBoardListQuery,
    useNewBoardCreateMutation,
} = newBoardApi;
