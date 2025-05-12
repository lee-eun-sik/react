import React from 'react';
import { Box } from '@mui/material';
import back from '../back.jpg'; // 이미지 파일 경로

const Home = () => {
  return (
    <Box
      sx={{
        padding: 0, // padding을 0으로 설정하여 불필요한 여백 제거
        margin: 0,  // margin도 제거
        height: 'calc(100vh - 200px - 40px)', // 헤더(60px)와 풋터(40px)를 고려하여 높이 설정
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // 화면을 벗어난 부분이 스크롤로 표시되지 않도록 함
      }}
    >
      <img 
        src={back} 
        alt="Background scenery" 
        style={{
          width: '100%', // 화면에 맞게 가로 크기 조정
          height: '100%', // 화면에 맞게 세로 크기 조정
          objectFit: 'cover', // 이미지 비율을 유지하며 화면 크기에 맞게 채움
        }} 
      />
    </Box>
  );
};

export default Home;
