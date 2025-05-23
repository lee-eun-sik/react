import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useResetPasswordMutation } from '../../features/find/findApi';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { alert } = useCmDialog();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [ResetPassword] = useResetPasswordMutation();

    const handleReset = async (e) => {
        e.preventDefault();

        // 비밀번호 유효성 검사
        if (!newPassword || !confirmPassword) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!CmUtil.isStrongPassword(newPassword)) {
            alert('비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.');
            return;
        }

        try {
            const response = await ResetPassword({ newPassword, confirmPassword}).unwrap();
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('Reset password error:', error);
            alert(error?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
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