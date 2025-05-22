import React, { useState, useRef } from 'react';
import { useFindIdMutation } from '../../features/find/findApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const FindId = () => {
  const [username, setUsername] = useState('');
  const usernameRef = useRef();

  const [phonenumber, setPhonenumber] = useState('');
  const phonenumberRef = useRef();

  const [birthdate, setBirthdate] = useState('');
  const birthdateRef = useRef();

  const [email, setEmail] = useState('');
  const emailRef = useRef();

  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [foundId, setFoundId] = useState('');
  
  const { showAlert } = useCmDialog();
  const [findId] = useFindIdMutation();
  const navigate = useNavigate();

  const handleFindIdClick = async () => {
    if (!isEmailVerified) {
      showAlert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    if (CmUtil.isEmpty(username)) {
      showAlert('이름을 입력해주세요.');
      usernameRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(phonenumber)) {
      showAlert("전화번호를 입력해주세요.");
      phonenumberRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(birthdate) || !CmUtil.isValidDate(birthdate)) {
      showAlert('유효한 생년월일을 YYYY-MM-DD 형식으로 입력해주세요.');
      birthdateRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(email) || !CmUtil.isEmail(email)) {
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
          username,
          phonenumber,
          birthdate,
          email
        })
      });

      const data = await res.json();

      if (data.success && data.data?.list && data.data.list.length > 0) {
        setFoundId(data.data.list);  // 객체 배열 그대로 저장 (userId, createDt 포함)
        setShowResult(true);
      } else {
        showAlert(data.message || '일치하는 사용자 정보를 찾을 수 없습니다.');
      }
    } catch (e) {
      showAlert('서버 오류가 발생했습니다.');
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
          <TextField label="이름" fullWidth margin="normal" value={username} inputRef={usernameRef}
            onChange={(e) => setUsername(e.target.value)} />
          <TextField label="전화번호" fullWidth margin="normal" value={phonenumber} inputRef={phonenumberRef}
            onChange={(e) => setPhonenumber(e.target.value)} />
          <TextField label="이메일" type="email" fullWidth margin="normal" value={email} inputRef={emailRef}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailVerified(false);
              setEmailSent(false);
              setEmailCode('');
            }} />
          <Button onClick={handleSendEmailCode} variant="outlined" fullWidth sx={{ mt: 1 }}>인증번호 전송</Button>

          {emailSent && (
            <>
              <TextField label="인증번호 입력" fullWidth margin="normal" value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)} />
              <Button onClick={handleVerifyEmailCode} variant="contained" color="success" fullWidth>
                인증번호 확인
              </Button>
            </>
          )}

          <TextField label="생년월일" type="date" fullWidth margin="normal" value={birthdate} inputRef={birthdateRef}
            onChange={(e) => setBirthdate(e.target.value)} InputLabelProps={{ shrink: true }} />

          <Button onClick={handleFindIdClick} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            아이디 찾기
          </Button>
          <Button onClick={() => navigate('/')} variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
            가입취소
          </Button>
        </>
      )}

      {/* 결과 출력부 */}
      {showResult && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>회원님의 아이디는 다음과 같습니다:</Typography>
          <Box sx={{ mt: 2 }}>
            {foundId.map((user, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ color: 'black' }}>
                  아이디: {user.userId} &nbsp;&nbsp; 가입일자: {user.createDt}
                </Typography>
              </Box>
            ))}
          </Box>
          <Button onClick={() => navigate('/user/login.do')} variant="contained" fullWidth sx={{ mt: 3 }}>
            로그인
          </Button>
          <Button onClick={() => navigate('/')} variant="outlined" fullWidth sx={{ mt: 2 }}>
            메인으로 돌아가기
          </Button>
        </>
      )}
    </Box>
  );
};

export default FindId;