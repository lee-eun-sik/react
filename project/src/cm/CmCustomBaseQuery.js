// src/cm/CmCustomBaseQuery.js

import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { navigateTo } from './CmNavigateUtil';
import { setAlertCheck } from '../features/user/userSlice'; // 경로 통일

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  credentials: 'include',
});

const baseQueryWithAuthHandler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions); 
  const dispatch = api.dispatch;
  const alertCheck = api.getState().user.alertCheck;

  if (alertCheck) {
    return { error: { message: "인증 만료 처리 중" } }; // 중복 요청 방지
  }

  const isLoginRequest = args?.url?.includes('/user/login.do');

  if (result?.error?.status === 401 && !isLoginRequest) {
    setTimeout(() => {
      const currentAlertCheck = api.getState().user.alertCheck;
      if (!currentAlertCheck) {
        dispatch(setAlertCheck(true));
        alert("인증이 만료 되었습니다. 로그인 화면으로 이동합니다.");
        navigateTo('/user/login.do');
      }
    }, 1000);
  }

  return result;
};

export default baseQueryWithAuthHandler;