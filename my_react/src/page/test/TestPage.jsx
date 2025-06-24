import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import "../../css/testPage.css";

const TestPetPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const location = useLocation();
  console.log("📦 location.state:", state);
  const questionData = state?.questionData || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "N01"; // 기본값 N01

  const isAnimal = tab === "N01";
  const backgroundColor = isAnimal ? "#FFF5D7" : "rgba(113, 197, 92, 0.35)";
  const titleColor = isAnimal ? "#553211" : "#2E501C";
  const buttonColor = isAnimal ? "#553211" : "#2E501C";
  if (questionData.length === 0) {
    return <div>질문을 불러오는 중이에요...</div>;
  }
  const current = questionData[currentIndex];
  const options = current?.options || [];

  const handleOptionClick = (selectedOptionId) => {
    const newAnswers = [...answers, selectedOptionId];
    if (currentIndex === questionData.length - 1) {
      navigate(`/test/result.do?tab=${tab}`, {
        state: { answers: newAnswers, testQuestiontype: tab },
      });
    } else {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor,
          height: "100%",
          width: "100%",
          mx: "auto",
            paddingTop: "150px",
            paddingBottom: "135px",
        }}
        className="test-container"
      >
        <Box sx={{ margin: "0px 30px 50px 30px" }}>
          <Typography
            className="question"
            sx={{
              color: titleColor,
              fontSize: "24px",
              fontWeight: "700",
              wordBreak: "keep-all",
              whiteSpace: "normal",
            }}
          >
            {current.question.testQuestionContent}
          </Typography>
        </Box>
        {options.map((opt) => (
          <button
            key={opt.testOptionId}
            onClick={() => handleOptionClick(opt.testOptionId)}
            className="option"
            style={{
              backgroundColor: buttonColor,
              wordBreak: "keep-all",
              whiteSpace: "normal",
            }}
          >
            {opt.testOptionContent}
          </button>
        ))}
      </Box>
    </>
  );
};
export default TestPetPage;
