import React, { useState, useRef } from 'react';
import { useFindPwMutation } from '../../features/find/findApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';


const FindPw = () => {
  const [userId, setUserId] = useState('');
  const userIdRef = useRef();

  const [username, setUsername] = useState('');
  const usernameRef = useRef();

  const [phonenumber, setPhonenumber] = useState('');
  const phonenumberRef = useRef();

  const [birthDate, setBirthDate] = useState('');
  const birthDateRef = useRef();

  const [email, setEmail] = useState('');
  const emailRef = useRef();

  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  
  
  const { showAlert } = useCmDialog();
  const [findPw] = useFindPwMutation();
  const navigate = useNavigate();

  const handleFindPwClick = async ()  => {
    if (CmUtil.isEmpty(userId)) {
        showAlert("ID를 입력해주세요.");
        userIdRef.current?.focus();
        return;
    }

    if (CmUtil.isEmpty(username)) {
        showAlert("이름을 입력해주세요.");
        usernameRef.current?.focus();
        return;
    }

    if (CmUtil.isEmpty(phonenumber)) {
        showAlert("전화번호를 입력해주세요.");
        phonenumberRef.current?.focus();
        return;
    }

    
    if (CmUtil.isEmpty(birthDate) || !CmUtil.isValidDate(birthDate)) {
        showAlert('유효한 생년월일을 YYYY-MM-DD 형식으로 입력해주세요.');
        birthDateRef.current?.focus();
        return;
    }

    if (CmUtil.isEmpty(email) || !CmUtil.isEmail(email)) {
        showAlert('유효한 이메일 형식을 입력해주세요.');
        emailRef.current?.focus();
        return;
    }

    try {
      const BACKEND_URL = 'http://localhost:8081';
      const res = await fetch(`${BACKEND_URL}/api/find/findPw.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,  
          username,
          phonenumber,
          birthDate,
          email
        })
      });

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
      if (!CmUtil.isEmail(email)) {
        showAlert('유효한 이메일 형식이 아닙니다.');
        return;
      }
  
      try {
        const BACKEND_URL = 'http://localhost:8081';
        const res = await fetch(`${BACKEND_URL}/api/email/send-code.do`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
  
        if (data.success) {
          setEmailSent(true);
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
          body: JSON.stringify({ email, code: emailCode })
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
            label="이름"
            fullWidth
            margin="normal"
            value={username}
            inputRef={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <TextField
            label="전화번호"
            fullWidth
            margin="normal"
            value={phonenumber}
            inputRef={phonenumberRef}
            onChange={(e) => setPhonenumber(e.target.value)}
            onKeyPress={handleKeyPress}
        />
    
        <TextField
            label="이메일"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            inputRef={emailRef}
            // 이메일 변경 시 인증 초기화
            onChange={(e) => {
            setEmail(e.target.value);
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
        
        <TextField
            label="생년월일"
            type="date"
            fullWidth
            margin="normal"
            value={birthDate}
            inputRef={birthDateRef}
            onChange={(e) => setBirthDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            onKeyPress={handleKeyPress}
        />
        <Button
            onClick={handleFindPwClick}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
        >
            비밀번호 찾기
        </Button>
        <Button
            onClick={() => navigate('/')}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
        >
            메인으로 돌아가기
        </Button>
   </Box>  
  );
  
};
export default FindPw;