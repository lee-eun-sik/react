import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useResetPasswordMutation } from '../../features/find/findApi';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useCmDialog();

    // ✅ useLocation으로 전달된 userId 사용
  const usersId = location.state?.usersId;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword] = useResetPasswordMutation();

  
  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showAlert('모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!CmUtil.isStrongPassword(newPassword)) {
      showAlert('비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.');
      return;
    }

    if (!usersId) {
      showAlert('사용자 정보가 유실되었습니다.');
      navigate('/user/findPw.do');
      return;
    }

    try {
      await resetPassword({ usersId, newPassword, confirmPassword }).unwrap();
      showAlert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/user/login.do');
    } catch (error) {
      showAlert(error?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" gutterBottom>비밀번호 재설정</Typography>
      <form onSubmit={handleReset}>
        <TextField
          label="새 비밀번호"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
          비밀번호 변경
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;