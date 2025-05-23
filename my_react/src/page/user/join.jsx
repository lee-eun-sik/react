import React, { useState, useRef } from 'react';
import { useRegisterMutation } from '../../features/user/userApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography} from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const Register = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_confirm] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const userIdRef = useRef();
  const passwordRef = useRef();
  const password_confirmRef = useRef();
  const usernameRef = useRef();
  const phonenumberRef = useRef();
  const emailRef = useRef();
  const birthdateRef= useRef();
  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
 
  const { showAlert } = useCmDialog();
 
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert('아이디를 입력해주세요.');
      userIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(password)) {
      showAlert('비밀번호를 입력해주세요.');
      passwordRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(password_confirm)) {
      showAlert('비밀번호를 다시 입력해주세요.');
      password_confirmRef.current?.focus();
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
    if (CmUtil.isEmpty(email)) {
      showAlert('이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }

    if (!CmUtil.isEmail(email)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      emailRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(birthdate) || !CmUtil.isValidDate(birthdate)) {
      showAlert('유효한 생년월일을 YYYY-MM-DD 형식으로 입력해주세요.');
      birthdateRef.current?.focus();
      return;
    }
    console.log('birthdate:', birthdate);
    if (!isEmailVerified) {
      showAlert('이메일 인증을 완료해주세요.');
      emailRef.current?.focus();
      return;
    }
   
    try {
      const response = await register({ userId, password, username, email, gender, phonenumber, birthdate }).unwrap();
      if (response.success) {
        showAlert("회원가입에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => { navigate('/user/login.do'); });
      } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegisterClick();
    }
  };
  const handleSendEmailCode = async () => {
    if (!CmUtil.isEmail(email)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      return;
    }
    try {
      const BACKEND_URL = 'http://localhost:8081'; // 백엔드 포트 맞게 수정
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
      const BACKEND_URL = 'http://localhost:8081'; // 백엔드 포트 맞게 수정
      const res = await fetch(`${BACKEND_URL}/api/email/verify-code.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: emailCode })
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
      <TextField
        label="비밀번호확인"
        type="password"
        fullWidth
        margin="normal"
        value={password_confirm}
        inputRef={password_confirmRef}
        onChange={(e) => setPassword_confirm(e.target.value)}
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
      <Box display="flex" alignItems="center" gap={2} width="100%">
        <Typography>성별</Typography>
        <label>
          <input
            type="radio"
            value="남성"
            checked={gender === 'M'}
            onChange={() => setGender('M')}
          /> 남성
        </label>
        <label>
          <input
            type="radio"
            value="여성"
            checked={gender === 'F'}
            onChange={() => setGender('F')}
          /> 여성
        </label>
      </Box>
      
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
        value={birthdate}
        inputRef={birthdateRef}
        onChange={(e) => setBirthdate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        onKeyPress={handleKeyPress}
      />
      <Button
        onClick={handleRegisterClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>
      <Button
        onClick={() => navigate('/')}
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        가입취소
      </Button>
    </Box>
  );
};

export default Register;