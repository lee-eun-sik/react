import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewQuery } from '../../features/user/userApi';
import { Paper, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';

const UserView = () => {
  const { data, isLoading, error, isSuccess } = useViewQuery({});
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setUserInfo(data?.data);
    }
  }, [isSuccess, data]);

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
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">회원 정보를 불러오는 데 실패했습니다.</Alert>
      ) : userInfo ? (
        <>
        <Typography variant="h4" gutterBottom>회원 정보</Typography>
        <Paper
            elevation={3}
            sx={{
            width: '100%',
            p: 3,
            borderRadius: 2,
            backgroundColor: '#f9f9f9'
            }}
        >
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            아이디
            </Typography>
            <Typography variant="body1" fontWeight="500" gutterBottom>
            {userInfo.userId}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            이름
            </Typography>
            <Typography variant="body1" fontWeight="500" gutterBottom>
            {userInfo.username}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            이메일
            </Typography>
            <Typography variant="body1" fontWeight="500" gutterBottom>
            {userInfo.email}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            가입일
            </Typography>
            <Typography variant="body1" fontWeight="500">
            {userInfo.createDt}
            </Typography>
        </Paper>
        
        <Button
          onClick={() => navigate('/user/update.do')}
          variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
        >
          수정
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
        </>
    ) : null}
    </Box>
  );
};

export default UserView;
