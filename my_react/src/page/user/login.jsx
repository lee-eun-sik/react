import React, { useState, useRef, useEffect } from 'react';
import { useLoginMutation } from '../../features/user/userApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import { clearUser } from '../../features/user/userSlice';
import { persistor } from '../../app/store';

const Login = () => {
  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const { showAlert } = useCmDialog();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    persistor.purge();
    dispatch(clearUser());
  }, [dispatch]);

  const handleLoginClick = async () => {
     if (CmUtil.isEmpty(usersId)) {
      showAlert("ID를 입력해주세요.");
      usersIdRef.current?.focus();
      return;
    }

     if (CmUtil.isEmpty(usersPassword)) {
      showAlert("비밀번호를 입력해주세요.");
      usersPasswordRef.current?.focus();
      return;
    }
    try {
      const response = await login({ usersId, usersPassword }).unwrap();
      if (response.success) {
        showAlert("로그인 성공 홈으로 이동합니다.",() => {
          dispatch(setUser(response.data));
          navigate("/");
        });
      } else {
        showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
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
      <Typography variant="h4" gutterBottom>로그인</Typography>

      <TextField
        label="아이디"
        fullWidth
        margin="normal"
        value={usersId}
        inputRef={usersIdRef}
        onChange={(e) => setUsersId(e.target.value)}
      />

      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={usersPassword}
        inputRef={usersPasswordRef}
        onChange={(e) => setUsersPassword(e.target.value)}
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
      {/* 아래 추가: 링크 묶음 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
        <Link to="/find/findId.do" style={{ textDecoration: 'none', color: '#555' }}>아이디 찾기</Link>
        <span>|</span>
        <Link to="/find/findPw.do" style={{ textDecoration: 'none', color: '#555' }}>비밀번호 찾기</Link>
        <span>|</span>
        <Link to="/user/join.do" style={{ textDecoration: 'none', color: '#555' }}>회원가입</Link>
      </Box>
    </Box>
  );
};

export default Login;