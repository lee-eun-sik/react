import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; // 인증 및 에러 처리 커스텀


export const petApi = createApi({
  reducerPath: 'petApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    Pet_Form: builder.mutation({
      query: (formData) => ({
        url: '/pet/animalregister.do',
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Update: builder.mutation({
      query: (formData) => ({
        url: '/pet/petUpdate.do',
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Hospital: builder.mutation({
      query: (formData) => ({
        url: '/petHospital/petHospital.do',
        method: 'POST',
        body: formData,
      }),
    }),
    deletePet: builder.mutation({
      query: (payload) => ({
        url: '/pet/petDelete.do',
        method: 'POST',
        body: new URLSearchParams(payload),  // { animalId: 123 } 형태의 객체 받음
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
    getPetById: builder.query({
      query: ( animalId ) => ({
        url: '/pet/getPetById.do',
        method: 'GET',
        params: { animalId },
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    Pet_Form_Hospital_Update: builder.mutation({
      query: (formData) => ({
        url: `/petHospital/update.do`, // 실제 URL에 맞게 수정
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Training_And_Action: builder.mutation({
      query: (formData) => ({
        url: '/petTrainingAndAction/petTrainingAndAction.do',
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Training_And_Action_Update: builder.mutation({
      query: (formData) => ({
        url: `/petTrainingAndAction/update.do`, // 실제 URL에 맞게 수정
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  usePet_FormMutation,
  usePet_Form_UpdateMutation,
  usePet_Form_HospitalMutation,
  usePet_Form_Hospital_UpdateMutation, // ✅ 추가
  useDeletePetMutation,
  useGetPetByIdQuery,
  usePet_Form_Training_And_ActionMutation,
  usePet_Form_Training_And_Action_UpdateMutation
} = petApi;