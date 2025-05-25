import React, { useState, useRef, useEffect } from 'react';
import { useLoginMutation } from '../../features/user/userApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import { clearUser } from '../../features/user/userSlice';
import { persistor } from '../../app/store';
import NaverLogin from 'react-naver-login';



const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const userIdRef = useRef();
  const passwordRef = useRef();
  const { showAlert } = useCmDialog();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
     persistor.purge();
     dispatch(clearUser());

     
  // ✅ 네이버 팝업 로그인 콜백 함수 등록
  window.successCallback = function (token) {
    handleNaverSuccess({ accessToken: token });
  };

  window.failureCallback = function (error) {
    console.error("Naver login failed:", error);
    showAlert("네이버 로그인 실패");
  };
  // ✅ 카카오 SDK 스크립트 삽입
  if (!window.Kakao) {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("3b8c03b2f5c0970a28eddb81de0ec7ff");
        console.log("Kakao SDK initialized");
      }
    };
    document.body.appendChild(script);
  } else if (!window.Kakao.isInitialized()) {
    window.Kakao.init("3b8c03b2f5c0970a28eddb81de0ec7ff");
  }
  return () => {
    // 언마운트 시 정리
    delete window.successCallback;
    delete window.failureCallback;
  };
  }, [dispatch]);

  const handleLoginClick = async () => {
     if (CmUtil.isEmpty(userId)) {
      showAlert("ID를 입력해주세요.");
      userIdRef.current?.focus();
      return;
    }

     if (CmUtil.isEmpty(password)) {
      showAlert("비밀번호를 입력해주세요.");
      passwordRef.current?.focus();
      return;
    }
    try {
      const response = await login({ userId, password }).unwrap();
       console.log("Raw response:", response);
      if (response.success) {
        showAlert("로그인 성공 홈으로 이동합니다.",() => {
          dispatch(setUser(response.data));
          console.log(response.data);
          navigate("/");
        });
      } else {
        showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'); //논리 실패
      }
    } catch (error) {
      showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'); // 통신 실패
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLoginClick();
    }
  };
  const handleNaverSuccess = (naverUser) => {
    console.log("naverUser:", naverUser);

    const accessToken = naverUser?.accessToken?.access_token || naverUser?.accessToken;

    if (!accessToken) {
      showAlert("네이버 accessToken을 받아오지 못했습니다.");
      return;
    }

    fetch('http://localhost:8081/api/auth/naver.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(setUser(data.user));
          showAlert("네이버 로그인 성공!", () => navigate('/'));
        } else {
          showAlert("네이버 로그인 실패");
        }
      })
      .catch(() => {
        showAlert("서버 오류 발생");
      });
  };
  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      showAlert("Kakao SDK가 아직 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      scope: 'profile_nickname, account_email',
      success: function (authObj) {
        console.log("카카오 로그인 성공:", authObj);

        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res) {
            console.log("카카오 사용자 정보:", res);
            const kakaoAccount = res.kakao_account;

            fetch('http://localhost:8081/api/auth/kakao.do', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: authObj.access_token }),
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  dispatch(setUser(data.user));
                  showAlert("카카오 로그인 성공!", () => navigate('/'));
                } else {
                  showAlert("카카오 로그인 실패");
                }
              })
              .catch(() => {
                showAlert("서버 오류 발생");
              });
          },
          fail: function (error) {
            console.error("사용자 정보 요청 실패", error);
            showAlert("카카오 사용자 정보 요청 실패");
          }
        });
      },
      fail: function (err) {
        console.error("카카오 로그인 실패", err);
        showAlert("카카오 로그인 실패");
      }
    });
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h4" gutterBottom>로그인</Typography>

      <TextField
        label="아이디"
        fullWidth
        margin="normal"
        value={userId}
        inputRef={userIdRef}
        onChange={(e) => setUserId(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        inputRef={passwordRef}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
        
      <Button
        onClick={handleLoginClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        로그인
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => navigate('/user/join.do')}
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>
      <NaverLogin
        clientId="yvIi067RdBqmMmfuBW1n"
        callbackUrl="http://localhost:3000/naver/callback"
        render={(props) => (
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: '#1ec800' }}
            onClick={props.onClick}
          >
            네이버 로그인
          </Button>
        )}
        onSuccess={handleNaverSuccess}
        onFailure={() => showAlert("네이버 로그인 실패")}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: 2, backgroundColor: '#FEE500', color: '#000' }}
        onClick={handleKakaoLogin}
      >
        카카오 로그인
      </Button>
    </Box>
  );
};

export default Login;
