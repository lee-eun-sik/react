import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; // 인증 및 에러 처리 커스텀
import PetForm from '../../page/pet/Pet_Form';

export const petApi = createApi({
  reducerPath: 'petApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    Pet_Form: builder.mutation({
      query: (formData) => ({
        url: '/api/pet/pet.do',
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Update: builder.mutation({
      query: (formData) => ({
        url: '/api/pet/petUpdate.do',
        method: 'POST',
        body: formData, 
      })
    })
  }),
});

export const {
  usePet_FormMutation,
  usePet_Form_UpdateMutation
} = petApi;