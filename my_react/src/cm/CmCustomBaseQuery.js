// src/cm/CmCustomBaseQuery.js

import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { navigateTo } from './CmNavigateUtil';
import { setAlertCheck} from '../features/user/userSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  credentials: 'include',

});

const baseQueryWithAuthHandler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions); 
  const dispatch = api.dispatch;
  const alertCheck = api.getState().user.alertCheck;
  
  if (alertCheck) {
    return { error: { message: "인증 만료 처리 중" } }; // 요청을 차단하는 형태로 처리
  }

  // 로그인 요청인지 구분할 수 있는 조건 추가
  const isLoginRequest = args?.url.includes('/user/login.do');
  // 401 오류가 발생하고 alertCheck가 false일 때만 얼럿을 띄움
  if (result?.error?.status === 401 && !isLoginRequest) {
    setTimeout(() => {
      const alertCheck = api.getState().user.alertCheck;
      if(!alertCheck) {
        dispatch(setAlertCheck(true));
        alert("인증이 만료 되었습니다. 로그인화면으로 이동합니다.");
        window.location.href = "/";
        // navigateTo('/');
      }
    }, 1000); 
  }
  return result;
};

export default baseQueryWithAuthHandler;
