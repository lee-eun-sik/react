import { useTestResultQuery } from "../../features/test/testApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import "../../css/testResult.css";

const TestPetResult = () => {
  const { state } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const optionIds = state?.answers || [];
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "N01"; // 기본값 N01

  const isAnimal = tab === "N01";
  const backgroundColor = isAnimal ? "#FFF5D7" : "rgba(113, 197, 92, 0.35)";
  const testQuestionType = state?.testQuestionType || tab;
  const { data, isLoading, error, isSuccess } = useTestResultQuery({
    optionIds,
    testQuestionType,
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setResult(data?.data);
    }
  }, [isSuccess, data]);
  console.log(optionIds);
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생! 😭</div>;
  return (
    <>
      <Box
        className="result-container"
        sx={{
          backgroundColor: backgroundColor,
          height: "100%",
          width: "100%",
          mx: "auto",
            paddingTop: "120px",
            paddingBottom: "120px",
        }}
      >
        {result && (
          <>
            <Typography sx={{ color: "#553211" }}>
              테스트 결과, 당신의 성향은!
            </Typography>
            <Typography
              className="result-name"
              sx={{
                mb: "40px",
                fontSize: "30px",
                fontWeight: "700",
                letterSpacing: "1px",
                color: "#5E350A",
              }}
            >
              {result.testResultName}
            </Typography>
            {result.postFile?.postFileId && (
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${result.postFile.postFileId}`}
                style={{
                  width: "240px",
                  height: "240px",
                  objectFit: "cover",
                  display: "block",
                  marginBottom: "30px",
                }}
              />
            )}
            <Box
              sx={{ width: "80%", display: "flex", justifyContent: "center" }}
            >
              <Typography
                className="result-content"
                sx={{ marginY: "20px", fontWeight: "600" }}
              >
                {result.testResultContent}
              </Typography>
            </Box>
            <Typography className="result-recommend">
              추천: {result.testResultRecommend}
            </Typography>
          </>
        )}
      </Box>
    </>
  );
};
export default TestPetResult;
