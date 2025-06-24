import petImage from "../../image/testPetMain.png";
import plantImage from "../../image/testPlantMain.png";
import back from "../../image/back.png";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/testMain.css";
import { useTestQuestionOptionMutation } from "../../features/test/testApi";

const TestMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fetchQuestoinOption] = useTestQuestionOptionMutation();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "N01"; // 기본값 N01

  const isAnimal = tab === "N01";
  const backgroundImage = isAnimal ? petImage : plantImage;
  const backgroundColor = isAnimal ? "#FFD355" : "#FFCE49";
  

  const handleStart = async () => {
    try {
      const res = await fetchQuestoinOption({ testQuestionType: tab }).unwrap();
      navigate(`/test/page.do?tab=${tab}`, {
        state: { questionData: res.data },
      });
    } catch (err) {
      console.error("질문+보기 불러오기 실패", err);
    }
  };
  return (
    <>
      <Box sx={{ 
        width: "100%", 
        height: "100%", 
        mx: "auto" , 
        backgroundColor: backgroundColor,
        paddingTop: "10px",
        paddingBottom: "50px",
        }}
        >

        <Button
          className="back-test-button"
          onClick={() => navigate(-1)}
          sx={{
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
            height: "35px",
            minWidth: "0",
            width: "35px",
            marginLeft: "20px",
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

        <div
          className="background-img"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            height: "640px",
          }}
        >
          <button className="test-button" onClick={handleStart}>
            <Typography
              sx={{ fontWeight: "800", fontSize: "26px", color: "#583403"}}
            >
              테스트 시작하기
            </Typography>
          </button>
        </div>
      </Box>
    </>
  );
};
export default TestMain;
