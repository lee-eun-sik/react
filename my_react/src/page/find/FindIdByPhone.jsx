import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const FindIdByPhone = () => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`입력한 휴대폰 번호: ${phone}`);
    // 여기서 서버 요청 로직 추가 가능
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        휴대폰 번호로 아이디 찾기
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="휴대폰 번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth>
          아이디 찾기
        </Button>
      </form>
    </Box>
  );
};

export default FindIdByPhone;