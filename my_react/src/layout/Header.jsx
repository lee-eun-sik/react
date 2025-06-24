import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useViewQuery, useLogoutMutation } from '../features/user/userApi';
import { clearUser, setAlertCheck } from '../features/user/userSlice';
import { persistor } from '../app/store';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import '../css/header.css';

export default function Header() {
  const user = useSelector((state) => state.user.user);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  
  const menuData = {
    "guest": [
      { "name": "로그인", "path": "/user/login.do" },
      { "name": "회원가입", "path": "/user/join.do" }
    ],
    "user": [
      { "name": "마이페이지", "path": "/user/view.do" },
      { "name": "게시판", "path": "/board/list.do" },
      { "name": "유저목록", "path": "/user/list.do" }
    ]
  };

  const { data, isSuccess, refetch } = useViewQuery({});
  const alertCheck = useSelector((state) => state.user.alertCheck);

  const checkAuth = useCallback(async () => {
    if (user?.usersId && !alertCheck) {
      const result = await refetch();
      if (result?.error?.status === 401) {
        dispatch(setAlertCheck(true));
        alert("인증이 만료 되었습니다. 로그인화면으로 이동합니다.");
        navigate('/user/login.do');
      }
    }
  }, [user?.usersId, refetch, dispatch, navigate, alertCheck]);

  useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]);

  useEffect(() => {
    if (isSuccess) {
      setUserInfo(data?.data);
    }
  }, [isSuccess, data]);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      await persistor.purge();
    } catch (e) {
      // 실패해도 로그아웃 처리
    } finally {
      dispatch(clearUser());
      navigate('/user/login.do');
    }
  };

  const menu = userInfo ? menuData.user : menuData.guest;

  return (
    <AppBar position="sticky" sx={{ background: '#2c3e50', boxShadow: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <Typography variant="h6" sx={{ color: '#ecf0f1', fontWeight: 'bold', textTransform: 'uppercase' }}>
        [{alertCheck}] MyApp
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {userInfo && (
            <Typography sx={{ color: '#ecf0f1', marginRight: 2 }}>
               {userInfo.usersName}님 환영합니다
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menu.map((item) => (
              <Button
                key={item.name}
                variant="contained"
                color="primary"
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '30px',
                  padding: '8px 16px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#2980b9'
                  }
                }}
              >
                {item.name}
              </Button>
            ))}
            {userInfo && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{
                  borderRadius: '30px',
                  padding: '8px 16px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#c0392b'
                  }
                }}
              >
                로그아웃
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
