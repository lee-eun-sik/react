import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NaverCallback = () => {
  const navigate = useNavigate();

 useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');

    if (accessToken) {
        console.log('Access Token:', accessToken);
        // ✅ 부모 창의 successCallback 함수 호출
        if (window.opener && typeof window.opener.successCallback === 'function') {
        window.opener.successCallback(accessToken);
        }
    } else {
        // ✅ 부모 창의 failureCallback 함수 호출
        if (window.opener && typeof window.opener.failureCallback === 'function') {
        window.opener.failureCallback('access_token 없음');
        }
    }

    window.close(); // 팝업 닫기
    }, []);

  return (
    <div>
      <h2>로그인 처리 중입니다...</h2>
    </div>
  );
};

export default NaverCallback;