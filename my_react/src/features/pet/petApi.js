import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; // 인증 및 에러 처리 커스텀

export const petApi = createApi({
  reducerPath: 'petApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    createPet: builder.mutation({
      query: (formData) => ({
        url: '/api/pet/pet.do',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreatePetMutation,
} = petApi;