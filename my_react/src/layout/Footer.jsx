import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2c3e50', // 헤더와 같은 배경 색상
        padding: '20px 0', // 충분한 패딩
        marginTop: '20px', // 상단 여백
        textAlign: 'center', // 가운데 정렬
        color: '#ecf0f1', // 글자 색상
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'light' }}>
        © 2025 MyApp. All rights reserved.
      </Typography>
    </Box>
  );
}
