 import React, { useState, useRef } from 'react'; 
import { useRegisterMutation } from '../../features/user/userApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography} from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import { useEffect } from 'react';
const Register = () => {
  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const [usersPassword_confirm, setUsersPassword_confirm] = useState('');
  const [usersEmail, setUsersEmail] = useState('');
  const [usersName, setUsersName] = useState('');
  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const usersPassword_confirmRef = useRef();
  const usersEmailRef = useRef();
  const usersNameRef =useRef();
  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(180); // 3분
  const timerRef = useRef();
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
  
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);
  
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };
  const { showAlert } = useCmDialog();
 
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    if (CmUtil.isEmpty(usersName)) {
      showAlert('닉네임 입력해주세요.');
      usersNameRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersId)) {
      showAlert('아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersPassword)) {
      showAlert('비밀번호를 입력해주세요.');
      usersPasswordRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(usersPassword_confirm)) {
      showAlert('비밀번호를 다시 입력해주세요.');
      usersPassword_confirmRef.current?.focus();
      return;
    }

    
    if (CmUtil.isEmpty(usersEmail)) {
      showAlert('이메일을 입력해주세요.');
      usersEmailRef.current?.focus();
      return;
    }

    if (!CmUtil.isEmail(usersEmail)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      usersEmailRef.current?.focus();
      return;
    }
    if (!isUserIdAvailable) {
      showAlert('아이디 중복 확인을 해주세요.');
      return;
    }
    if (usersPassword !== usersPassword_confirm) {
      showAlert('비밀번호가 일치하지 않습니다.');
      usersPassword_confirmRef.current?.focus();
      return;
    }
    if (!isEmailVerified) {
      showAlert('이메일 인증을 완료해주세요.');
      return;
    }
   
    try {
      const response = await register({ usersName, usersId, usersPassword, usersEmail}).unwrap();
      if (response.success) {
        showAlert("회원가입에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => { navigate('/user/login.do'); });
      } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };
  const handleCheckUserId = async () => {
    if (CmUtil.isEmpty(usersId)) {
      showAlert('아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }

    try {
      const BACKEND_URL = 'http://localhost:8081'; // 서버 주소
      const res = await fetch(`${BACKEND_URL}/api/user/checkUserId.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usersId })
      });
      const data = await res.json();
      
      if (data.available) {
        setIsUserIdAvailable(true);
        showAlert('사용 가능한 아이디입니다.');
      } else {
        setIsUserIdAvailable(false);
        showAlert('이미 사용 중인 아이디입니다.');
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegisterClick();
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
        body: JSON.stringify({ usersEmail, usersId })
      });
      const data = await res.json();

      if (data.success) {
        // 인증 성공 시 타이머 초기화 및 설정
        clearInterval(timerRef.current);
        setTimer(180);
        setEmailSent(true);
        setIsEmailVerified(false);
        setEmailCode('');
        console.log(data);
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

        showAlert('이메일로 인증번호가 전송되었습니다.');
      } else if (data.message === '해당 이메일은 이미 가입되어 있습니다.') {
        // 서버에서 중복 이메일 응답 시
        showAlert('해당 이메일은 이미 가입되어 있습니다.');
      } else {
        showAlert('인증번호 전송에 실패했습니다.');
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
    }
  };

  const handleVerifyEmailCode = async () => {
    try {
      const BACKEND_URL = 'http://localhost:8081'; // 백엔드 포트 맞게 수정
      const res = await fetch(`${BACKEND_URL}/api/email/verify-code.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usersEmail, code: emailCode })
      });
      const data = await res.json();
      if (data.success) {
        setIsEmailVerified(true);
        showAlert('이메일 인증이 완료되었습니다.');
      } else {
        showAlert('인증번호가 일치하지 않습니다.');
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
      <Typography variant="h4" gutterBottom>회원가입</Typography>
      <TextField
        label="닉네임*"
        fullWidth
        margin="normal"
        value={usersName}
        inputRef={usersNameRef}
        onChange={(e) => setUsersName(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
        <TextField
          label="아이디*"
          fullWidth
          value={usersId}
          inputRef={usersIdRef}
          onChange={(e) => {
            setUsersId(e.target.value);
            setIsUserIdAvailable(false); // 아이디 변경 시 상태 초기화
          }}
          onKeyPress={handleKeyPress}
        />
        <Button variant="outlined" onClick={handleCheckUserId}>
          중복확인
        </Button>
      </Box>

      <TextField
        label="비밀번호*"
        type="password"
        fullWidth
        margin="normal"
        value={usersPassword}
        inputRef={usersPasswordRef}
        onChange={(e) => setUsersPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <TextField
        label="비밀번호확인*"
        type="password"
        fullWidth
        margin="normal"
        value={usersPassword_confirm}
        inputRef={usersPassword_confirmRef}
        onChange={(e) => setUsersPassword_confirm(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <TextField
        label="이메일*"
        type="email"
        fullWidth
        margin="normal"
        value={usersEmail}
        inputRef={usersEmailRef}
        inputProps={{ maxLength: 200 }} // <- 여기 추가
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
            label="인증번호 확인*"
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
        onClick={handleRegisterClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>
    </Box>
  );
};

export default Register; 