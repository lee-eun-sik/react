import React, { useState, useEffect, useRef } from 'react';
import { useUserUpdateMutation, useUserDeleteMutation, useViewQuery } from '../../features/user/userApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const UserUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const userIdRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();

  const { showAlert } = useCmDialog();

  const [userUpdate] = useUserUpdateMutation();
  const [userDelete] = useUserDeleteMutation();
  const { data, isSuccess } = useViewQuery({ userId: user?.userId });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      setUserId(info.userId);
      setUsername(info.username);
      setEmail(info.email);
    }
  }, [isSuccess, data]);

  const handleUpdateClick = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert('아이디를 입력해주세요.');
      userIdRef.current?.focus();
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
   
    const response = await userUpdate({ userId, password, username, email }).unwrap();
    try {
      if (response.success) {
        showAlert("회원정보 수정에 성공 하셨습니다. 홈화면으로 이동합니다.", () => navigate('/'));
      } else {
        showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
    } 
  };

  const handleDeleteClick = async () => {
    try {
      const response = await userDelete({ userId }).unwrap();
      if (response.success) {
        showAlert("회원탈퇴에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => navigate('/user/login.do'));
      
      } else {
        showAlert('회원탈퇴에에 실패했습니다.');
      }
    } catch (error) {
      showAlert('회원탈퇴에에 실패했습니다.');
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
      <Typography variant="h4" gutterBottom>회원정보 수정</Typography>

      <TextField
        label="아이디"
        value={userId}
        disabled
        fullWidth
        inputRef={userIdRef}
        margin="normal"
      />

      <TextField
        label="새 비밀번호 (변경 시 입력)"
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
        onClick={handleUpdateClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원 정보 수정
      </Button>
     
      <Button
        onClick={handleDeleteClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원 탈퇴
      </Button>

      <Button
        onClick={() => navigate('/')}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        홈
      </Button>
    </Box>
  );
};

export default UserUpdate
