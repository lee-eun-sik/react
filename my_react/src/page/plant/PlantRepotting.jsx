import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DefaultImage from "../../image/default-plant.png";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

//훅
import {
  useRepottingLogsQuery,
  useDeleteRepottingLogsMutation,
  useRepottingUpdateLogsMutation,
  useRepottingBlistQuery,
  useSaveRepottingInfoMutation,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
import "../../css/plantRepotting.css";

import PlantWatering from "./PlantWatering"; // 물주기 탭
import PlantSunlighting from "./PlantSunlighting"; // 일조량 탭
import PlantPest from "./PlantPest"; // 병충해 탭

const RepottingContent = ({
  repottingDate,
  setRepottingDate,
  soilConditionText,
  setSoilConditionText,
  repottingMemoText,
  setRepottingMemoText,
  handleSave,
  editingLog,
  repottingLogs,
  onDeleteLog,
  onEditLog,
  showWaterLogs,
  setShowWaterLogs,
}) => (
  <Box className="repotting-tab-content">
    <Box
      className="repotting-date"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography className="date-label">분갈이 날짜</Typography>
      <Box sx={{ marginTop: "10px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            value={dayjs(repottingDate)}
            onChange={(newValue) => setRepottingDate(newValue)}
            format="YYYY.MM.DD"
            sx={{
              width: 270,
              backgroundColor: "#F8F8F8",
              borderRadius: "8px",
              marginBottom: "10px",
              marginLeft: 1,
            }}
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small",
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Box>

    <Box
      className="soil-status-section"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", // 수직 가운데 정렬
        gap: 1, // 요소 사이 간격
      }}
    >
      <Typography
        className="soil-status-label"
        sx={{ marginBottom: "25px", marginLeft: "1px" }}
      >
        흙종류
      </Typography>
      <TextField
        className="soil-status-textfield"
        multiline
        rows={1}
        value={soilConditionText}
        onChange={(e) => setSoilConditionText(e.target.value)}
        variant="outlined"
        sx={{
          marginLeft: "33px",
          width: 270,
        }}
      />
    </Box>

    <Box className="repotting-memo">
      <Typography className="repotting-memo-label">메모</Typography>
      <TextField
        sx={{
          backgroundColor: "#F8F8F8",
          width: "100%",
          mb: 1.5,
        }}
        multiline
        rows={5}
        value={repottingMemoText}
        onChange={(e) => setRepottingMemoText(e.target.value)}
        variant="outlined"
      />
    </Box>

    <Button
      variant="contained"
      className="save-button"
      onClick={handleSave}
      sx={
        editingLog !== false
          ? {
              backgroundColor: "#4B6044 !important", // 저장
              "&:hover": {
                backgroundColor: "#88AE97 !important",
              },
            }
          : {
              backgroundColor: "#86ad97 !important", // 수정
              "&:hover": {
                backgroundColor: "#88AE97 !important",
              },
            }
      }
    >
      {editingLog !== false ? "저장" : "수정"}
    </Button>

    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton onClick={() => setShowWaterLogs(!showWaterLogs)}>
          <ArrowDropDownIcon />
        </IconButton>
        <Typography>기록 리스트</Typography>
      </Box>

      {showWaterLogs &&
        (!repottingLogs || repottingLogs.length === 0 ? (
          <Typography>일지가 없습니다.</Typography>
        ) : (
          repottingLogs.map((log) => (
            <Box
              key={log.plantRepottingId}
              className="log-entry"
              component="fieldset"
              sx={{
                mb: 2,
                border: "1px solid #ccc",
                p: 2,
              }}
            >
              <legend
                style={{
                  fontWeight: "bold",
                  padding: "0 8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CheckBoxIcon sx={{ fontSize: 18, color: "#333", mr: 1 }} />
                분갈이 확인
              </legend>

              <Box className="log-details">
                <Typography>
                  {log.repottingDate} | {log.soilCondition}
                </Typography>
                <Typography>{log.repottingMemo}</Typography>
              </Box>
              <Box className="log-actions">
                <Button
                  variant="text"
                  className="log-action-button"
                  onClick={() => onDeleteLog(log.plantRepottingId)}
                >
                  삭제
                </Button>
                <Button
                  variant="text"
                  className="log-action-button"
                  onClick={() => onEditLog(log.plantRepottingId)}
                >
                  수정
                </Button>
              </Box>
            </Box>
          ))
        ))}
    </Box>
  </Box>
);

// 메인 컴포넌트
const PlantRepotting = () => {
  const { showConfirm } = useCmDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useCmDialog();
  const [saveRepottingInfo] = useSaveRepottingInfoMutation(); // 등록용
  const [repottingUpdateLogs] = useRepottingUpdateLogsMutation(); // 수정용

  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장
  const [plantName] = useState("몬스테라");
  const [purchaseDate] = useState(null);
  // const [currentTab, setCurrentTab] = useState(2); // 일조량 탭이 기본 선택

  const [repottingDate, setRepottingDate] = useState(dayjs());
  const [soilConditionText, setSoilConditionText] = useState("");
  const [repottingMemoText, setRepottingMemoText] = useState("");

  const [plantRepottingId, setPlantRepottingId] = useState();
  const [repottingLogs, setRepottingLogs] = useState([]);
  const [deleteRepottingLogs] = useDeleteRepottingLogsMutation();
  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const [editingLog, setEditingLog] = useState(true); // true저장   false 수정
  const [editStatus, setStatus] = useState("");
  const [editMemo, setMemo] = useState("");

  const pathToTabIndex = {
    "/plant/PlantWatering.do": 0,
    "/plant/PlantSunlighting.do": 1,
    "/plant/PlantRepotting.do": 2,
    "/plant/PlantPest.do": 3,
  };

  const [currentTab, setCurrentTab] = useState(2);

  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  const [showWaterLogs, setShowWaterLogs] = useState({});
  const {
    data: fetchedLogs,
    error,
    refetch,
  } = useRepottingLogsQuery({ plantId: plantId });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setRepottingLogs(fetchedLogs.data);
    }
  }, [fetchedLogs, refetch]);

  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setCurrentTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);

  const handleSave = () => {
    const formData = {
      plantId: parseInt(plantId),
      repottingDate: repottingDate ? repottingDate.format("YYYY-MM-DD") : null,
      soilCondition: soilConditionText,
      repottingMemo: repottingMemoText,
    };

    if (editingLog !== true) {
      //수정
      formData.plantRepottingId = plantRepottingId;
      repottingUpdateLogs(formData)
        .unwrap()
        .then((res) => {
          // showAlert(res.message);
          showAlert("수정 성공!");
          setRepottingDate(dayjs());
          setSoilConditionText("");
          setRepottingMemoText("");
          setEditingLog(true);
          refetch();
        })
        .catch((err) => {
          console.error("수정 실패:", err);
          showAlert("수정 실패");
        });
    } else {
      //저장
      saveRepottingInfo(formData)
        .unwrap()
        .then((res) => {
          // showAlert(res.message);
          showAlert("저장 성공!");
          setRepottingDate(dayjs());
          setSoilConditionText("");
          setRepottingMemoText("");
          setEditingLog(true);

          refetch();
        })
        .catch((err) => {
          console.error("저장 실패:", err);
          showAlert("저장 실패");
        });
    }
  };

  const handleDeleteLog = async (id) => {
    showConfirm(
      "알람을 삭제하시겠습니까?",
      async () => {
        // yes callback - 실행
        console.log("실행 확인");
        try {
          await deleteRepottingLogs(id).unwrap(); // 삭제 요청
          showAlert("삭제 성공!");

          setRepottingDate(dayjs());
          setSoilConditionText("");
          setRepottingMemoText("");
          setEditingLog(true);

          refetch();
        } catch (error) {
          console.error("삭제실패:", error);
          showAlert("삭제 중 오류 발생");
        }
      },
      () => {
        // no callback - 취소
        console.log("실행 취소");
      }
    );
  };

  const handleEditLog = (id) => {
    const logToEdit = repottingLogs.find((log) => log.plantRepottingId === id);
    if (logToEdit) {
      setRepottingDate(dayjs(logToEdit.repottingDate));
      setSoilConditionText(logToEdit.soilCondition);
      setRepottingMemoText(logToEdit.repottingMemo);
      setPlantRepottingId(id);
      setEditingLog(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        {/*식물 정보 수정 버튼*/}
        <Button
          sx={{
            marginTop: "10",
            marginLeft: 40,
            backgroundColor: "#889F7F",
            width: 40,
            height: 30,
            minWidth: "unset",
            padding: 0,
            fontSize: "12px",
            borderRadius: "55%",
            color: "#fff",
          }}
          onClick={() => {
            navigate(`/PlantUpdate.do?plantId=${plantId}`);
          }}
        >
          수정
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "60%",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography className="plant-label">동물 이름</Typography>
              <Box
                sx={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "5px",
                  padding: "4px 12px",
                  display: "inline-block",
                  width: 100,
                }}
              >
                <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                  {/* 배열안에 데이터 있음 */}
                  {plantInfo?.data && plantInfo.data.length > 0
                    ? plantInfo.data[0].plantName
                    : "정보 없음"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography className="plant-label">입양일 날짜</Typography>
              <Box
                sx={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "5px",
                  padding: "4px 12px",
                  display: "inline-block",
                  width: 100,
                }}
              >
                <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                  {/* 배열안에 데이터 있음 */}
                  {plantInfo?.data && plantInfo.data.length > 0
                    ? plantInfo.data[0].plantPurchaseDate
                    : "정보 없음"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Avatar
            sx={{
              width: "110px",
              height: "110px",
              border: "1px solid #e0e0e0",
            }}
            src={
              plantInfo?.data[0]?.fileId && plantInfo.data.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${plantInfo.data[0].fileId}`
                : DefaultImage
            }
          />
        </Box>

        <Box className="tab-menu-container">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="plant-care-tabs"
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
            sx={{
              "& .MuiTab-root": {
                color: "#aaa", // 기본 글자 색
              },
              "& .Mui-selected": {
                color: "#303030",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#000",
              },
            }}
          >
            <Tab label="물주기" />
            <Tab label="일조량" />
            <Tab label="분갈이" />
            <Tab label="병충해" />
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          <RepottingContent
            repottingDate={repottingDate}
            setRepottingDate={setRepottingDate}
            soilConditionText={soilConditionText}
            setSoilConditionText={setSoilConditionText}
            repottingMemoText={repottingMemoText}
            setRepottingMemoText={setRepottingMemoText}
            handleSave={handleSave}
            repottingLogs={repottingLogs}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
            editingLog={editingLog}
            showWaterLogs={showWaterLogs}
            setShowWaterLogs={setShowWaterLogs}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantRepotting;
