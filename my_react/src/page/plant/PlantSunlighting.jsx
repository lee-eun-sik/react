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
import { FaSun, FaTint, FaCloud, FaSnowflake } from "react-icons/fa";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DefaultImage from "../../image/default-plant.png";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
//훅
import {
  useSaveSunlightInfoMutation,
  useSunlightLogsQuery,
  useDeleteSunlightLogsMutation,
  useUpdateSunlightLogsMutation,
  useSunlightAlistQuery,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
import "../../css/plantSunlighting.css";

import PlantWatering from "./PlantWatering"; // 물주기 탭
import PlantRepotting from "./PlantRepotting"; // 분갈이 탭
import PlantPest from "./PlantPest"; // 병충해 탭

const sunlightOptions = [
  { id: "W01", icon: <FaSun />, label: "맑음", className: "selected-sun" },
  { id: "W02", icon: <FaTint />, label: "흐림", className: "selected-tint" },
  {
    id: "W03",
    icon: <FaCloud />,
    label: "구름 많음",
    className: "selected-cloud",
  },
  {
    id: "W04",
    icon: <FaSnowflake />,
    label: "눈/비",
    className: "selected-snow",
  },
];

const SunlightContent = ({
  sunlightStatusText,
  setSunlightStatusText,
  selectedSunlight,
  setSelectedSunlight,
  handleSave,
  sunlightLogs,
  onDeleteLog,
  onEditLog,
  editingLog,
  showWaterLogs,
  setShowWaterLogs,
}) => (
  <Box className="sunlight-tab-content">
    <Box
      className="daily-status-section"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: "10px",
        paddingBottom: "15px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Typography
        className="status-label"
        sx={{
          marginLeft: "10px",
          marginRight: "20px",
          fontWeitht: "600",
          color: "#333",
          minWidth: "80px",
          fontSize: "0.95rem",
        }}
      >
        일조상태
      </Typography>
      <div
        className="icon-group"
        style={{ marginLeft: "30px" }}
        sx={{
          disPlay: "flex",
          gap: "25px",
        }}
      >
        {sunlightOptions.map((opt) => (
          <div
            key={opt.id}
            className={`status-icon ${
              selectedSunlight === opt.id ? opt.className : ""
            }`}
            onClick={() => setSelectedSunlight(opt.id)}
            style={{ cursor: "pointer" }}
            title={opt.label}
          >
            {opt.icon}
          </div>
        ))}
      </div>
    </Box>

    <Box className="light-status-section">
      <Typography
        className="light-status-title"
        sx={{ marginBottom: "25px", marginLeft: "11px" }}
      >
        빛의 상태
      </Typography>
      <TextField
        sx={{
          backgroundColor: "#F8F8F8",
          width: "100%",
          mb: 1.5,
        }}
        multiline
        rows={5}
        value={sunlightStatusText}
        onChange={(e) => setSunlightStatusText(e.target.value)}
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
        <Typography>일조량 일지</Typography>
      </Box>

      {showWaterLogs &&
        (!sunlightLogs || sunlightLogs.length === 0 ? (
          <Typography>일지가 없습니다.</Typography>
        ) : (
          sunlightLogs.map((log) => (
            <Box
              key={log.plantSunlightingId}
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
                일조량 확인
              </legend>
              <Box className="log-details">
                <Typography>
                  {
                    sunlightOptions.find((opt) => opt.id === log.sunlightStatus)
                      ?.icon
                  }
                  {log.createDt}
                </Typography>

                <Typography> {log.sunlightMemo}</Typography>
              </Box>

              <Box className="log-actions" sx={{ marginTop: "-60px" }}>
                <Button
                  variant="text"
                  className="log-action-button"
                  onClick={() => onDeleteLog(log.plantSunlightingId)}
                >
                  삭제
                </Button>
                <Button
                  variant="text"
                  className="log-action-button"
                  onClick={() => onEditLog(log.plantSunlightingId)}
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
const PlantSunlighting = () => {
  const { showConfirm } = useCmDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useCmDialog();
  const [saveSunlightInfo] = useSaveSunlightInfoMutation(); // 등록용
  const [updateSunlightLogs] = useUpdateSunlightLogsMutation(); // 수정용

  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장
  const [plantName] = useState("몬스테라");
  const [purchaseDate] = useState("2023-01-15");
  // const [currentTab, setCurrentTab] = useState(1); // 분갈이 탭

  const [selectedSunlight, setSelectedSunlight] = useState(null);
  const [sunlightStatusText, setSunlightStatusText] = useState("");

  const [plantSunlightingId, setPlantSunlightingId] = useState();
  const [sunlightLogs, setSunlightLogs] = useState([]);
  const [deleteSunlightLogs] = useDeleteSunlightLogsMutation();
  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const [editingLog, setEditingLog] = useState(true); // true저장   false 수정
  const [editStatus, setStatus] = useState(""); // 수정할 상태
  const [editMemo, setMemo] = useState(""); // 수정할 메모

  const [waterList, setWaterList] = useState([]);
  const [showWaterLogs, setShowWaterLogs] = useState({});

  const pathToTabIndex = {
    "/plant/PlantWatering.do": 0,
    "/plant/PlantSunlighting.do": 1,
    "/plant/PlantRepotting.do": 2,
    "/plant/PlantPest.do": 3,
  };

  const [currentTab, setCurrentTab] = useState(1);

  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  // const { data, isLoading } = useSunlightAlistQuery({ plantSunlightingId: id });
  const {
    data: fetchedLogs,
    error,
    refetch,
  } = useSunlightLogsQuery({ plantId: plantId });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setSunlightLogs(fetchedLogs.data);
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
      sunlightStatus: selectedSunlight,
      sunlightMemo: sunlightStatusText,
    };

    if (editingLog !== true) {
      //수정
      formData.plantSunlightingId = plantSunlightingId;
      updateSunlightLogs(formData)
        .unwrap()
        .then((res) => {
          // showAlert(res.message);
          showAlert("수정 성공!");
          setSelectedSunlight(null);
          setSunlightStatusText("");
          setEditingLog(true);
          refetch();
        })
        .catch((err) => {
          console.error("수정 실패:", err);
          showAlert("수정 실패");
        });
    } else {
      //저장
      saveSunlightInfo(formData)
        .unwrap()
        .then((res) => {
          // showAlert(res.message);
          showAlert("저장 성공!");
          setSelectedSunlight(null);
          setSunlightStatusText("");
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
          await deleteSunlightLogs(id).unwrap(); // 삭제 요청
          showAlert("삭제 성공!");

          // 삭제 성공 후, 서버에서 최신 일지 목록을 다시 가져와 UI 업데이트
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
    const logToEdit = sunlightLogs.find((log) => log.plantSunlightingId === id);
    if (logToEdit) {
      setSelectedSunlight(logToEdit.sunlightStatus); // ☀️ 선택된 아이콘 세팅
      setSunlightStatusText(logToEdit.sunlightMemo); // ✍️ 메모 세팅
      setPlantSunlightingId(id);
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
          <SunlightContent
            sunlightStatusText={sunlightStatusText}
            setSunlightStatusText={setSunlightStatusText}
            selectedSunlight={selectedSunlight}
            setSelectedSunlight={setSelectedSunlight}
            handleSave={handleSave}
            sunlightLogs={sunlightLogs}
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

export default PlantSunlighting;
