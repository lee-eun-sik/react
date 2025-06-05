import React, { useState, useRef } from 'react';
import { useFindIdMutation } from '../../features/find/findApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import { useEffect } from 'react';
const FindId = () => {
  
  const [usersEmail, setUsersEmail] = useState('');
  const emailRef = useRef();

  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [foundId, setFoundId] = useState(null);

  const [timer, setTimer] = useState(180); // 3분
  const timerRef = useRef();

  
    useEffect(() => {
      return () => clearInterval(timerRef.current);
    }, []);
  
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };
  const { showAlert } = useCmDialog();
  const [findId] = useFindIdMutation();
  const navigate = useNavigate();

  const handleFindIdClick = async () => {
    if (!isEmailVerified) {
      showAlert('이메일 인증을 먼저 완료해주세요.');
      return;
    }


    if (CmUtil.isEmpty(usersEmail) || !CmUtil.isEmail(usersEmail)) {
      showAlert('유효한 이메일 형식을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }

    try {
      const BACKEND_URL = 'http://localhost:8081';
      const res = await fetch(`${BACKEND_URL}/api/find/findId.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usersEmail
        })
      });

      const data = await res.json();

      if (data.success && data.data?.list && data.data.list.length > 0) {
        setFoundId(data.data.list[0]);  // 첫째 배열 그대로 저장 (userId, createDt 포함)
        setShowResult(true);
      } else {
        showAlert(data.message || '일치하는 사용자 정보를 찾을 수 없습니다.');
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
    }
  };

  const handleSendEmailCode = async () => {
    if (!CmUtil.isEmail(usersEmail)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const BACKEND_URL = 'http://localhost:8081';
      const res = await fetch(`${BACKEND_URL}/api/email/send-code.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usersEmail })
      });
      const data = await res.json();

      if (data.success) {
        // 기존 타이머 제거 및 초기화
        clearInterval(timerRef.current);
        setTimer(180);
        setEmailSent(true);
        setIsEmailVerified(false);
        setEmailCode('');

        // 타이머 새로 시작
        timerRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setEmailSent(false);
              showAlert("인증번호 입력 시간이 만료되었습니다. 다시 요청해주세요.");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        showAlert('인증번호가 이메일로 전송되었습니다.');
      } else {
        showAlert('인증번호 전송에 실패했습니다.');
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
    }
  };
  const handleVerifyEmailCode = async () => {
    try {
      const BACKEND_URL = 'http://localhost:8081';
      const res = await fetch(`${BACKEND_URL}/api/email/verify-code.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usersEmail, code: emailCode })
      });
      const data = await res.json();

      if (data.success) {
        setIsEmailVerified(true);
        showAlert('유효한 사용자입니다.');
      } else {
        showAlert('인증번호가 일치하지 않습니다.');
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>아이디 찾기</Typography>

      {!showResult && (
        <>
          
          <TextField label="이메일" type="email" fullWidth margin="normal" value={usersEmail} inputRef={emailRef}
            onChange={(e) => {
              setUsersEmail(e.target.value);
              setIsEmailVerified(false);
              setEmailSent(false);
              setEmailCode('');
            }} />
          <Button onClick={handleSendEmailCode} variant="outlined" fullWidth sx={{ mt: 1 }}>인증번호 전송</Button>

          {emailSent && (
            <>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                남은 시간: {formatTime(timer)}
              </Typography>
              <TextField label="인증번호 입력" fullWidth margin="normal" value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)} />
              <Button onClick={handleVerifyEmailCode} variant="contained" color="success" fullWidth>
                인증번호 확인
              </Button>
            </>
          )}


          <Button onClick={handleFindIdClick} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            아이디 찾기
          </Button>
          
        </>
      )}

      {/* 결과 출력부 */}
      {showResult && foundId && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            회원님의 아이디는 다음과 같습니다:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>
              아이디 : {foundId.usersId}
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold', mt: 1 }}>
              가입일자 : {foundId.createDt}
            </Typography>
          </Box>
          <Button
            onClick={() => navigate('/user/login.do')}
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            로그인
          </Button>
        </>
      )}
    </Box>
  );
};

export default FindId;