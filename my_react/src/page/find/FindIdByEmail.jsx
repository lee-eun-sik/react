// src/features/find/FindIdByEmail.jsx
import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useFindIdByEmailMutation } from "../../features/find/findApi";
import { useCmDialog } from "../../cm/CmDialogUtil";

const FindIdByEmail = () => {
  const [email, setEmail] = useState('');
  const [findIdByEmail] = useFindIdByEmailMutation();
  const { showAlert } = useCmDialog();
  const [method, setMethod] = useState("email");
  const handleFindId = async () => {
    if (method === 'email') {
        if (!email) return showAlert('이메일을 입력해주세요.');
        try {
        const res = await findIdByEmail({ email }).unwrap();
        if (res.success) {
            const ids = res.data;
            const message = Array.isArray(ids)
            ? `회원님의 아이디는 다음과 같습니다:\n\n${ids.join('\n')}`
            : `회원님의 아이디는 ${ids}입니다.`;
            showAlert(message);
        } else {
            showAlert('해당 이메일로 등록된 아이디가 없습니다.');
        }
        } catch {
        showAlert('아이디 찾기에 실패했습니다. 다시 시도해주세요.');
        }
    }
    // ... (전화번호 로직 동일)
    };

  return (
    <Box sx={{ p: 4, maxWidth: "400px", mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>이메일로 아이디 찾기</Typography>
      <TextField
        label="가입한 이메일"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleFindId}
        sx={{ mt: 2 }}
      >
        아이디 찾기
      </Button>
    </Box>
  );
};

export default FindIdByEmail;