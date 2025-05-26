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
import { Link } from 'react-router-dom'; // 추가
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
