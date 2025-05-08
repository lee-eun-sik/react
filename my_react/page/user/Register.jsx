import React, { useState, useRef} from 'react';
import { useRegisterMutation } from '../../features/user/userApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const Register = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const userIdRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();

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

    if (CmUtil.isEmpty(username)) {
      showAlert('이름을 입력해주세요.');
      usernameRef.current?.focus();
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
    try {
      const response = await register({ userId, password, username, email }).unwrap();
      if (response.success) {
        showAlert("회원가입에 성공 하셨습니다. 로그인화면으로 이동합니다.",()=>{navigate('/user/login.do');});
      } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
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
      />

      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        inputRef={passwordRef}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        label="이름"
        fullWidth
        margin="normal"
        value={username}
        inputRef={usernameRef}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="이메일"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        inputRef={emailRef}
        onChange={(e) => setEmail(e.target.value)}
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
     <  Button
        onClick={() => navigate('/user/login.do')}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        로그인
        </Button>
    </Box>
  );
};

export default Register;
