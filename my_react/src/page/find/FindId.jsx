import React, { useState, useRef } from "react";
import { useFindIdMutation } from "../../features/find/findApi";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { CmUtil } from "../../cm/CmUtil";
import { useEffect } from "react";
import back from "../../image/back.png";
import Background from "../../image/background.png";
import UserTextField from "../design/UserTextField";
import dayjs from "dayjs";

const FindId = () => {
  const [usersEmail, setUsersEmail] = useState("");
  const emailRef = useRef();

  const [emailCode, setEmailCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailTime, setEmailTime] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [foundId, setFoundId] = useState(null);

  const [timer, setTimer] = useState(180); // 3분
  const timerRef = useRef();

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };
  const { showAlert } = useCmDialog();
  const [findId] = useFindIdMutation();
  const navigate = useNavigate();

  const handleFindIdClick = async () => {
    if (!isEmailVerified) {
      showAlert("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    if (CmUtil.isEmpty(usersEmail) || !CmUtil.isEmail(usersEmail)) {
      showAlert("유효한 이메일 형식을 입력해주세요.");
      emailRef.current?.focus();
      return;
    }

    try {
      const BACKEND_URL = "http://192.168.0.30:8081";
      const res = await fetch(`${BACKEND_URL}/api/find/findId.do`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usersEmail,
        }),
      });

      const data = await res.json();
      console.log("아이디찾기버튼후 data : " + data);

      if (data.success && data.data?.list && data.data.list.length > 0) {
        setFoundId(data.data.list[0]); // 첫째 배열 그대로 저장 (userId, createDt 포함)
        setShowResult(true);
      } else {
        showAlert(data.message || "일치하는 사용자 정보를 찾을 수 없습니다.");
      }
    } catch (e) {
      showAlert("서버 오류가 발생했습니다.");
    }
  };

  const handleSendEmailCode = async () => {
    if (!CmUtil.isEmail(usersEmail)) {
      showAlert("유효한 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const BACKEND_URL = "http://192.168.0.30:8081";
      const res = await fetch(`${BACKEND_URL}/api/email/idfind-send-code.do`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usersEmail }),
      });
      const data = await res.json();
      console.log("data:", data);
      console.log("data.message:", data.message);

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
        setIsEmailVerified(true);
        setEmailTime(false);
        showAlert("유효한 사용자입니다.");
      } else {
        showAlert("인증번호가 일치하지 않습니다.");
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
        height: "100%",
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
          gap: 1,
          paddingBottom: "100px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
          아이디 찾기
        </Typography>

        {!showResult && (
          <>
            <Box sx={{ width: "90%" }}>
              <Typography sx={{ color: "black", marginBottom: "-10px" }}>
                이메일
              </Typography>

              <UserTextField
                type="email"
                fullWidth
                margin="normal"
                value={usersEmail}
                inputRef={emailRef}
                onChange={(e) => {
                  setUsersEmail(e.target.value);
                  setIsEmailVerified(false);
                  setEmailSent(false);
                  setEmailCode("");
                }}
              />
            </Box>
            <Button
              onClick={handleSendEmailCode}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#889F7F",
                borderRadius: "10px",
                width: "150px",
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
                    <Typography sx={{ color: "black" }}>
                      인증번호 입력{" "}
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
                  onClick={handleFindIdClick}
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
                  아이디 찾기
                </Button>
              </>
            )}
          </>
        )}

        {/* 결과 출력부 */}
        {showResult && foundId && (
          <>
            <Typography variant="h7" sx={{ mt: 4, color: "black" }}>
              회원님의 아이디는 다음과 같습니다.
            </Typography>
            <Box sx={{ mt: 2, textAlign: "left" }}>
              <Typography
                variant="body1"
                sx={{ color: "black", fontWeight: "bold" }}
              >
                아이디: {foundId.usersId}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "black", fontWeight: "bold", mt: 1 }}
              >
                가입일자: {dayjs(foundId.createDt).format("YYYY.MM.DD")}
              </Typography>
            </Box>
            <Button
              onClick={() => navigate("/user/login.do")}
              variant="contained"
              fullWidth
              sx={{
                position: "absolute",
                bottom: "80px",
                backgroundColor: "#4B6044",
                borderRadius: "10px",
                width: "180px",
                height: "45px",
                fontSize: "20px",
                fontWeight: "400",
              }}
            >
              로그인
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default FindId;
