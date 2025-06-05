import React, { useState, useRef } from 'react';
import { useFindPwMutation } from '../../features/find/findApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import { useEffect } from 'react';

const FindPw = () => {
  const [usersId, setUsersId] = useState('');
  const usersIdRef = useRef();

  const [usersEmail, setUsersEmail] = useState('');
  const usersEmailRef = useRef();

  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [timer, setTimer] = useState(180); // 3분
  const timerRef = useRef();
  
  const { showAlert } = useCmDialog();
  const [findPw] = useFindPwMutation();
  const navigate = useNavigate();

  const [findSuccess, setFindSuccess] = useState(false); //  ✅ 성공 여부 상태 추가

  
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };
  const handleFindPwClick = async () => {
    if (CmUtil.isEmpty(usersId)) {
        showAlert("ID를 입력해주세요.");
        usersIdRef.current?.focus();
        return;
    }

    if (CmUtil.isEmpty(usersEmail) || !CmUtil.isEmail(usersEmail)) {
        showAlert('유효한 이메일 형식을 입력해주세요.');
        usersEmailRef.current?.focus();
        return;
    }

    try {
      const BACKEND_URL = 'http://localhost:8081';
      const res = await fetch(`${BACKEND_URL}/api/find/findPw.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usersId, usersEmail })
      });
      const data = await res.json();

      if (data.success) {
        showAlert("계정 확인 완료. 비밀번호를 재설정해주세요.");
        navigate('/find/resetPassword.do', { state: { usersId } }); // ✅ 페이지 이동 + userId 전달
      } else {
        showAlert(data.message || "입력한 정보가 일치하지 않습니다.");
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
    }
  }
  const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleFindPwClick();
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
            showAlert("사용자 인증이 완료되었습니다.");
        } else {
            showAlert(data.message || "인증번호를 다시 입력해주세요.");
        }
      } catch (e) {
        showAlert('서버 오류가 발생했습니다.');
      }
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
      <Typography variant="h4" gutterBottom>비밀번호 찾기</Typography>
  {/* ✅ 성공 시 메시지 표시 */}
      {findSuccess ? (
        <>
          <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
            비밀번호 찾기가 성공했습니다! 임시 비밀번호를 보내드렸으니 입력하신 이메일 메일함을 열람해주세요.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate('/user/login.do')}
          >
            비밀번호 재설정
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="아이디"
            fullWidth
            margin="normal"
            value={usersId}
            inputRef={usersIdRef}
            onChange={(e) => setUsersId(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <TextField
            label="이메일"
            type="email"
            fullWidth
            margin="normal"
            value={usersEmail}
            inputRef={usersEmailRef}
            onChange={(e) => {
              setUsersEmail(e.target.value);
              setIsEmailVerified(false);
              setEmailSent(false);
              setEmailCode('');
            }}
            onKeyPress={handleKeyPress}
          />

          <Button
            onClick={handleSendEmailCode}
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
          >
            인증번호 전송
          </Button>

          {emailSent && (
            <>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                남은 시간: {formatTime(timer)}
              </Typography>
              <TextField
                label="인증번호 입력"
                fullWidth
                margin="normal"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
              />
              
              <Button
                onClick={handleVerifyEmailCode}
                variant="contained"
                color="success"
                fullWidth
              >
                인증번호 확인
              </Button>
            </>
          )}

          <Button
            onClick={handleFindPwClick}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            비밀번호 찾기
          </Button>
        </>
      )}
    </Box>
  )
};
export default FindPw;