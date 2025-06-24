import React, { useState, useRef, useEffect } from 'react';
import { useLoginMutation } from '../../features/user/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import { clearUser } from '../../features/user/userSlice';
import { persistor } from '../../app/store';
import Background from '../../image/background.png';
import back from '../../image/back.png';
import UserTextField from '../design/UserTextField';


const Login = () => {
  const user = useSelector((state) => state.user.user);
  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const { showAlert } = useCmDialog();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
    persistor.purge();
      dispatch(clearUser());
    }
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
        console.log(response);
        showAlert("로그인 성공 홈으로 이동합니다.", () => {
          dispatch(setUser(response.data));
          navigate("/home.do");
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
        maxWidth: "360px",
        width: "100%",
        height: '100%',
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        margin: "auto",

      }}>
      <Button
        onClick={() => navigate(-1)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '10px',
          height: '35px',
          minWidth: '0',
          width: '35px',
          marginLeft: '0px',
          marginTop: '25px',

          marginBottom: "20px",
          '&:hover': {
            backgroundColor: '#363636'
          },
          backgroundColor: 'rgba(54, 54, 54, 0.4)'

        }}
      >
        <img src={back} alt="" sx={{ pl: '2px' }}></img>
      </Button>
      <Box
        sx={{
          width: "80%",
          display: 'flex',
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: '0 auto',
          marginTop: '30px',
          gap: 3,
          paddingBottom: '30px'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "black", marginTop: '20px' }}>로그인</Typography>
        {/* 아이디 입력 필드 (TextField로 복구 및 스타일 적용) */}
        <Box sx={{ width: "90%" }}>
          <Typography sx={{ color: "black", marginBottom: "5px" }}>아이디</Typography>
          <UserTextField
            fullWidth
            value={usersId}
            inputRef={usersIdRef}
            onChange={(e) => setUsersId(e.target.value)}
          />
        </Box>
        <Box sx={{ width: "90%" }}>
          <Typography sx={{ color: "black", marginBottom: "5px" }}>비밀번호</Typography>
          {/* 비밀번호 입력 필드 (TextField로 복구 및 스타일 적용) */}
          <UserTextField
            fullWidth
            type="password"
            value={usersPassword}
            inputRef={usersPasswordRef}
            onChange={(e) => setUsersPassword(e.target.value)}
          />
        </Box>
        <Button
          onClick={handleLoginClick}
          variant="contained"
          sx={{
            marginTop: 3,
            backgroundColor: '#4B6044',
            borderRadius: '10px',
            width: "180px",
            height: '45px',
            fontSize: '20px',
            fontWeight: '400'
          }}
        >
          로그인
        </Button>
      </Box>
      {/* 아래 추가: 링크 묶음 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2, marginBottom: 5 }}>
        <Link to="/find/findId.do" style={{ textDecoration: 'none', color: '#555' }}>아이디 찾기</Link>
        <span>|</span>
        <Link to="/find/findPw.do" style={{ textDecoration: 'none', color: '#555' }}>비밀번호 재설정</Link>
        <span>|</span>
        <Link to="/user/join.do" style={{ textDecoration: 'none', color: '#555' }}>회원가입</Link>
      </Box>

    </Box>
  );
};

export default Login;
