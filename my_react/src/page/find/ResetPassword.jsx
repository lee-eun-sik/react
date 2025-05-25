import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useResetPasswordMutation } from '../../features/find/findApi';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showAlert } = useCmDialog();

  // Redux store에서 로그인된 사용자 정보 가져오기
  const userState = useSelector((state) => state.user);
  const user = userState.user;  // 실제 로그인된 유저 정보
  const userId = user?.userId || user?.id;
  console.log('Redux user:', user);
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

    if (!userId) {
      showAlert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      await resetPassword({ userId, newPassword, confirmPassword }).unwrap();
      showAlert('비밀번호가 성공적으로 변경되었습니다.');

      // 보안상 비밀번호 재설정 후 로그아웃 처리 권장
      // 예: dispatch(logoutAction());

      navigate('/');
    } catch (error) {
      console.error('Reset password error:', error);
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