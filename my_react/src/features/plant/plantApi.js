import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthHandler from "../../cm/CmCustomBaseQuery"; // 인증 및 에러 처리용 커스텀 baseQuery

export const plantApi = createApi({
  reducerPath: "plantApi",
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    // 식물 등록
    createPlant: builder.mutation({
      query: (formData) => {
        return {
          url: "/plant/create.do",
          method: "POST",
          body: formData,
        };
      },
    }),

    // 식물 수정
    updatePlant: builder.mutation({
      query: (formData) => {
        return {
          url: "/plant/updatePlant.do",
          method: "POST",
          body: formData,
        };
      },
    }),

    // 식물 단건 조회 (GET)
    getPlant: builder.query({
      query: (plantId) => {
        return {
          url: `/plant/${plantId}`,
          method: "GET",
        };
      },
    }),

    // 식물 목록 조회 (GET)
    getPlantList: builder.query({
      query: () => {
        return {
          url: "/plant/list",
          method: "GET",
        };
      },
    }),

    // 식물 삭제
    deletePlant: builder.mutation({
      query: (formData) => {
        return {
          url: "/plant/deletePlant.do",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    // 식물 조회
    getSimplePlantList: builder.mutation({
      query: () => {
        return {
          url: "/plant/simple-list.do",
          method: "POST",
        };
      },
    }),

    // 식물 일조량 저장
    saveSunlightInfo: builder.mutation({
      query: (formData) => ({
        url: "/plant/sunlight-save.do",
        method: "POST",
        body: formData,
      }),
    }),

    // 식물 일조량 조회
    SunlightLogs: builder.query({
      query: (formData) => ({
        url: "/plant/sunlight-logs.do",
        method: "POST",
        body: formData,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),

    // 식물 일조량 개별 삭제
    deleteSunlightLogs: builder.mutation({
      query: (sunlightLogId) => {
        return {
          url: "/plant/sunlight-delete.do",
          method: "POST",
          body: { plantSunlightingId: sunlightLogId },
        };
      },
    }),
    //식물 일조량 개별 수정
    updateSunlightLogs: builder.mutation({
      query: (formData) => {
        return {
          url: "/plant/sunlight-update.do",
          method: "POST",
          body: formData,
        };
      },
    }),
    //식물 일조량 단건 조회
    sunlightAlist: builder.query({
      query: (params) => ({
        url: "/plant/sunlight-alist.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),
    // 식물 분갈이 저장
    saveRepottingInfo: builder.mutation({
      query: (formData) => ({
        url: "/plant/repotting-save.do",
        method: "POST",
        body: formData,
      }),
    }),
    // 식물 분갈이 조회
    repottingLogs: builder.query({
      query: (formData) => ({
        url: "/plant/repotting-logs.do",
        method: "POST",
        body: formData,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),
    // 식물 분갈이 개별 삭제
    deleteRepottingLogs: builder.mutation({
      query: (repottingLogId) => {
        return {
          url: "/plant/repotting-delete.do",
          method: "POST",
          body: { plantRepottingId: repottingLogId },
        };
      },
    }),
    //식물 분갈이 단건 조회
    repottingBlist: builder.query({
      query: (params) => ({
        url: "/plant/repotting-blist.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),
    //식물 분갈이 개별 수정
    repottingUpdateLogs: builder.mutation({
      query: (formData) => {
        return {
          url: "/plant/repotting-update.do",
          method: "POST",
          body: formData,
        };
      },
    }),
    // 식물 병충해 저장
    savePestInfo: builder.mutation({
      query: (formData) => ({
        url: "/plant/pest-save.do",
        method: "POST",
        body: formData,
      }),
    }),
    // 식물 병충해 조회
    pestLogs: builder.query({
      query: (formData) => ({
        url: "/plant/pest-logs.do",
        method: "POST",
        body: formData,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),
    // 식물 병충해 개별 삭제
    deletePestLogs: builder.mutation({
      query: (pestLogId) => {
        return {
          url: "/plant/pest-delete.do",
          method: "POST",
          body: { plantPestId: pestLogId },
        };
      },
    }),
    //식물 병충해 개별 수정
    updatePestLogs: builder.mutation({
      query: (formData) => {
        return {
          url: "/plant/pest-update.do",
          method: "POST",
          body: formData,
        };
      },
    }),
    // 식물 정보 조회
    plantInfo: builder.query({
      query: (plantId) => ({
        url: "/plant/plant-info.do",
        method: "POST",
        body: { plantId: plantId },
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),
    WaterCreate: builder.mutation({
      query: (data) => ({
        url: '/plant/waterCreate.do',
        method: 'POST',
        body: data,
      }),
    }),
    WaterDelete: builder.mutation({
      query: (data) => ({
        url: '/plant/waterDelete.do',
        method: 'POST',
        body: data,
      }),
    }),
    WaterList: builder.query({
      query: (data) => ({
        url: '/plant/waterList.do',
        method: 'POST',
        body: data,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
  }),
});

export const {
  usePlantInfoQuery,
  useUpdatePestLogsMutation, //식물 병충해 개별 수정
  useDeletePestLogsMutation, // 식물 병충해 개별 삭제
  usePestLogsQuery, //식물 병충해 조회
  useSavePestInfoMutation, //식물 병충해 저장
  useRepottingUpdateLogsMutation, //식물 분갈이 개별 수정
  useDeleteRepottingLogsMutation,
  useRepottingLogsQuery,
  useSaveRepottingInfoMutation,
  useSunlightAlistQuery,
  useUpdateSunlightLogsMutation,
  useDeleteSunlightLogsMutation, // 식물 일조량 로그 개별 삭제
  useSunlightLogsQuery, // 식물 일조량 조회
  useSaveSunlightInfoMutation,
  useGetSimplePlantListMutation,
  useCreatePlantMutation, // 식물 등록
  useUpdatePlantMutation, // 식물 수정
  useGetPlantQuery, // 식물 단건 조회
  useGetPlantListQuery, // 식물 목록 조회
  useDeletePlantMutation, // 식물 삭제
  useWaterCreateMutation, // 물주기 생성
  useWaterDeleteMutation, // 물주기 삭제
  useWaterListQuery,      //물주기 조회
} = plantApi;
