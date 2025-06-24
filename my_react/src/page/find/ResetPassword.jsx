import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useResetPasswordMutation } from "../../features/find/findApi";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { CmUtil } from "../../cm/CmUtil";
import back from "../../image/back.png";
import Background from "../../image/background.png";
import UserTextField from "../design/UserTextField";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useCmDialog();

  // ✅ useLocation으로 전달된 userId 사용
  const usersId = location.state?.usersId;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showAlert("모든 항목을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!CmUtil.isStrongPassword(newPassword)) {
      showAlert("비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.");
      return;
    }

    if (!usersId) {
      showAlert("사용자 정보가 유실되었습니다.");
      navigate("/user/findPw.do");
      return;
    }

    // const formData = new FormData();
    // formData.append("usersId", usersId);
    // formData.append("newPassword", newPassword);
    // formData.append("confirmPassword", confirmPassword);

    try {
      await resetPassword({ usersId, newPassword, confirmPassword }).unwrap();
      showAlert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/user/login.do");
    } catch (error) {
      console.log("error : " + error?.[0]);
      showAlert(
        error?.data?.message || "비밀번호 변경 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "360px",
        width: "100%",
        height: "640px",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        alignContent: "center",
        margin: "auto",
        paddingBottom: "30px",
      }}
    >
      <Button
        onClick={() => navigate(-1)}
        sx={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "10px",
          height: "35px",
          minWidth: "0",
          width: "35px",
          marginLeft: "0px",
          marginTop: "25px",

          marginBottom: "20px",
          "&:hover": {
            backgroundColor: "#363636",
          },
          backgroundColor: "rgba(54, 54, 54, 0.4)",
        }}
      >
        <img src={back} alt="" sx={{ pl: "2px" }}></img>
      </Button>
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
          비밀번호 재설정
        </Typography>
        <Box sx={{ padding: "20px" }}>
          <form onSubmit={handleReset}>
            <Box sx={{ display: "flex", marginTop: "5px" }}>
              <Typography
                sx={{
                  color: "black",
                  marginBottom: "-8px",
                  marginRight: "5px",
                }}
              >
                새 비밀번호
              </Typography>
              <Typography
                sx={{ color: "black", fontSize: "10px", marginTop: "5px" }}
              >
                영문, 숫자, 특수문자 조합 8자 이상
              </Typography>
            </Box>
            <UserTextField
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Typography sx={{ color: "black", marginBottom: "-10px" }}>
              비밀번호 확인
            </Typography>
            <UserTextField
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: "#4B6044",
                  borderRadius: "10px",
                  width: "180px",
                  height: "45px",
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                비밀번호 변경
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
