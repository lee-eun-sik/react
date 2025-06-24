import React, { useState, useRef } from "react";
import { useFindPwMutation } from "../../features/find/findApi";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { CmUtil } from "../../cm/CmUtil";
import { useEffect } from "react";
import back from "../../image/back.png";
import Background from "../../image/background.png";
import UserTextField from "../design/UserTextField";

const FindPw = () => {
  const [usersId, setUsersId] = useState("");
  const usersIdRef = useRef();

  const [usersEmail, setUsersEmail] = useState("");
  const usersEmailRef = useRef();

  const [emailCode, setEmailCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailTime, setEmailTime] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [timer, setTimer] = useState(180); // 3분
  const timerRef = useRef();

  const { showAlert } = useCmDialog();
  const [findPw] = useFindPwMutation();
  const navigate = useNavigate();

  const [findSuccess, setFindSuccess] = useState(false); //  ✅ 성공 여부 상태 추가

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };
  const handleFindPwClick = async () => {
    if (CmUtil.isEmpty(usersId)) {
      showAlert("ID를 입력해주세요.");
      usersIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersEmail) || !CmUtil.isEmail(usersEmail)) {
      showAlert("유효한 이메일 형식을 입력해주세요.");
      usersEmailRef.current?.focus();
      return;
    }

    try {
      const BACKEND_URL = "http://192.168.0.30:8081";
      const res = await fetch(`${BACKEND_URL}/api/find/findPw.do`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usersId, usersEmail }),
      });
      const data = await res.json();

      if (data.success) {
        showAlert("계정 확인 완료. 비밀번호를 재설정해주세요.");
        navigate("/find/resetPassword.do", { state: { usersId } }); // ✅ 페이지 이동 + userId 전달
      } else {
        showAlert(data.message || "입력한 정보가 일치하지 않습니다.");
      }
    } catch (e) {
      showAlert("서버 오류가 발생했습니다.");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFindPwClick();
    }
  };
  const handleSendEmailCode = async () => {
    if (!CmUtil.isEmail(usersEmail)) {
      showAlert("유효한 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const BACKEND_URL = "http://192.168.0.30:8081";
      const res = await fetch(`${BACKEND_URL}/api/email/pwfind-send-code.do`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usersEmail }),
      });
      const data = await res.json();

      if (data.success) {
        // 기존 타이머 제거 및 초기화
        clearInterval(timerRef.current);
        setTimer(180);
        setEmailSent(true);
        setEmailTime(true);
        setIsEmailVerified(false);
        setEmailCode("");

        // 타이머 새로 시작
        timerRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setEmailSent(false);
              setEmailTime(false);
              showAlert(
                "인증번호 입력 시간이 만료되었습니다. 다시 요청해주세요."
              );
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        showAlert("인증번호가 이메일로 전송되었습니다.");
      } else {
        showAlert("인증번호 전송에 실패했습니다.");
      }
    } catch (e) {
      showAlert("서버 오류가 발생했습니다.");
    }
  };

  const handleVerifyEmailCode = async () => {
    try {
      const BACKEND_URL = "http://192.168.0.30:8081";
      const res = await fetch(`${BACKEND_URL}/api/email/verify-code.do`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usersEmail, code: emailCode }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailTime(false);
        showAlert("사용자 인증이 완료되었습니다.");
      } else {
        showAlert(data.message || "인증번호를 다시 입력해주세요.");
      }
    } catch (e) {
      showAlert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "360px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        margin: "auto",
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
          // justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          gap: 2,

          paddingBottom: "120px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
          비밀번호 재설정
        </Typography>
        {/* ✅ 성공 시 메시지 표시 */}
        {findSuccess ? (
          <>
            <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
              비밀번호 찾기가 성공했습니다! 임시 비밀번호를 보내드렸으니
              입력하신 이메일 메일함을 열람해주세요.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate("/user/login.do")}
            >
              비밀번호 재설정
            </Button>
          </>
        ) : (
          <>
            <Box sx={{ width: "90%", marginTop: "-10px" }}>
              <Typography sx={{ color: "black", marginBottom: "-10px" }}>
                아이디
              </Typography>
              <UserTextField
                fullWidth
                margin="normal"
                value={usersId}
                inputRef={usersIdRef}
                onChange={(e) => setUsersId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Typography sx={{ color: "black", marginBottom: "-10px" }}>
                이메일
              </Typography>
              <UserTextField
                type="email"
                fullWidth
                margin="normal"
                value={usersEmail}
                inputRef={usersEmailRef}
                onChange={(e) => {
                  setUsersEmail(e.target.value);
                  setIsEmailVerified(false);
                  setEmailSent(false);
                  setEmailCode("");
                }}
                onKeyPress={handleKeyPress}
              />
            </Box>

            <Button
              onClick={handleSendEmailCode}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#889F7F",
                borderRadius: "10px",
                width: "150px",
                marginTop: "-10px",
              }}
            >
              인증번호 전송
            </Button>

            {emailSent && (
              <>
                <Box sx={{ width: "90%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      marginTop: "20px",
                      marginBottom: "-10px",
                    }}
                  >
                    <Typography sx={{ color: "black", marginBottom: "-10px" }}>
                      인증번호 입력
                    </Typography>
                    {emailTime && (
                      <Typography
                        color="error"
                        sx={{ marginLeft: "10px", fontSize: "14px" }}
                      >
                        남은 시간: {formatTime(timer)}
                      </Typography>
                    )}
                  </Box>
                  <UserTextField
                    fullWidth
                    margin="normal"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                  />
                </Box>
                <Button
                  onClick={handleVerifyEmailCode}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#889F7F",
                    borderRadius: "10px",
                    width: "150px",
                  }}
                >
                  인증번호 확인
                </Button>

                <Button
                  onClick={handleFindPwClick}
                  variant="contained"
                  fullWidth
                  sx={{
                    marginTop: 8,
                    backgroundColor: "#4B6044",
                    borderRadius: "10px",
                    width: "180px",
                    height: "45px",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  비밀번호 찾기
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
export default FindPw;
