import React, { useEffect } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FindId = () => {
  const [method, setMethod] = React.useState("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (method === 'email') {
      navigate("/find/email.do");
    } else if (method === 'phone') {
      navigate("/find/phone.do");
    }
  }, [method, navigate]);

  return (
    <Box sx={{ p: 4, maxWidth: '400px', mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>아이디 찾기</Typography>
      <RadioGroup row value={method} onChange={(e) => setMethod(e.target.value)} sx={{ mb: 2 }}>
        <FormControlLabel value="email" control={<Radio />} label="이메일로 찾기" />
        <FormControlLabel value="phone" control={<Radio />} label="휴대폰 문자로 찾기" />
      </RadioGroup>
    </Box>
  );
};

export default FindId;