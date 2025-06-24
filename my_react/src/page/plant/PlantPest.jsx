import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { FaCamera } from "react-icons/fa";

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
import image from "../../image/imageAdd.png";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
//훅
import {
  useSavePestInfoMutation,
  usePestLogsQuery,
  useDeletePestLogsMutation,
  useUpdatePestLogsMutation,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
// import "../../css/plantPest.css";

const PestContent = ({
  plantPestDate,
  setPlantPestDate,
  plantPestMemo,
  setPlantPestMemo,
  pestLogs,
  handleSave,
  editingLog,
  onDeleteLog,
  onEditLog,
  selectedFileName,
  handleFileChange,
  showWaterLogs,
  setShowWaterLogs,
}) => (
  <Box className="pest-tab-content">
    <Box
      className="pest-date"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography className="date-label">병충해 날짜</Typography>
      <Box sx={{ marginTop: "10px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            value={dayjs(plantPestDate)}
            onChange={(newValue) => setPlantPestDate(newValue)}
            format="YYYY.MM.DD"
            sx={{
              width: 272,
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

    {/* 파일 업로드 */}
    <Box sx={{ marginTop: 2 }}>
      {/* 텍스트와 아이콘을 수평 배치 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // 수직 가운데 정렬
          justifyContent: "space-between", // 좌우 정렬 옵션
          marginBottom: 1,
        }}
      >
        <Typography sx={{ marginLeft: "1px", marginTop: -1, fontWeight: 600 }}>
          사진
        </Typography>

        <label htmlFor="file">
          <img
            src={image}
            alt="카메라 아이콘"
            style={{
              width: 20,
              height: 20,
              cursor: "pointer",
              marginRight: "33px",
            }}
          />
        </label>
      </Box>

      {/* 파일명 표시 */}
      {selectedFileName && (
        <Typography sx={{ marginTop: 1, ml: 8 }}>
          선택된 파일: {selectedFileName}
        </Typography>
      )}

      {/* 실제 input (숨김 처리) */}
      <input
        id="file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>

    <Box>
      <Typography sx={{ fontWeight: 600 }}>메모</Typography>
      <TextField
        sx={{
          backgroundColor: "#F8F8F8",
          width: "100%",
          mb: 1.5,
        }}
        multiline
        rows={5}
        value={plantPestMemo}
        onChange={(e) => setPlantPestMemo(e.target.value)}
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
        (!pestLogs || pestLogs.length === 0 ? (
          <Typography>일지가 없습니다.</Typography>
        ) : (
          pestLogs.map((log) => (
            <Box
              key={log.plantPestId}
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
                병충해 확인
              </legend>

              <Box className="log-details">
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>
                    {dayjs(log.plantPestDate).format("YYYY.MM.DD")}
                  </Typography>
                  <Box className="log-actions" sx={{ marginTop: "-40px" }}>
                    <Button
                      variant="text"
                      className="log-action-button"
                      onClick={() => onDeleteLog(log.plantPestId)}
                    >
                      삭제
                    </Button>
                    <Button
                      variant="text"
                      className="log-action-button"
                      onClick={() => onEditLog(log.plantPestId)}
                    >
                      수정
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                  {log.fileId && (
                    <img
                      src={`${
                        process.env.REACT_APP_API_BASE_URL
                      }/file/imgDown.do?fileId=${log.fileId}&t=${Date.now()}`}
                      alt="Pest Log"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "4px",
                        marginRight: "8px",
                        marginBlock: "auto",
                      }}
                    />
                  )}
                  <Box>
                    <Typography>{log.plantPestMemo}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ))}
    </Box>
  </Box>
);

// 메인 컴포넌트
const PlantPest = () => {
  const { showConfirm } = useCmDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useCmDialog();
  const [savePestInfo] = useSavePestInfoMutation(); // 등록용
  const [updatePestLogs] = useUpdatePestLogsMutation(); // 수정용

  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장

  // 중앙에서 탭 상태를 관리합니다.
  // const [currentTab, setCurrentTab] = useState(3); // 일조량 탭이 기본 선택

  const [editPlantPestId, setEditPlantPestId] = useState();
  const [plantPestDate, setPlantPestDate] = useState(dayjs());
  const [plantPestMemo, setPlantPestMemo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const [pestLogs, setPestLogs] = useState([]); // 로그 조회용
  const [deletePestLogs] = useDeletePestLogsMutation(); // 로그 삭제용
  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const [editingLog, setEditingLog] = useState(true); // true저장   false 수정
  const [editStatus, setStatus] = useState("");
  const [editMemo, setMemo] = useState("");
  const [fileId, setFileId] = useState();

  const pathToTabIndex = {
    "/plant/PlantWatering.do": 0,
    "/plant/PlantSunlighting.do": 1,
    "/plant/PlantRepotting.do": 2,
    "/plant/PlantPest.do": 3,
  };
  const [showWaterLogs, setShowWaterLogs] = useState({});

  const [currentTab, setCurrentTab] = useState(3);

  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  const id = searchParams.get("id");
  const { data: fetchedLogs, error, refetch } = usePestLogsQuery({ plantId });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setPestLogs(fetchedLogs.data);
    }
  }, [fetchedLogs]);

  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setCurrentTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);

  const handleSave = () => {
    const formData = new FormData();

    formData.append("plantId", plantId);
    formData.append(
      "plantPestDate",
      plantPestDate ? plantPestDate.format("YYYY-MM-DD") : ""
    );
    formData.append("plantPestMemo", plantPestMemo);

    if (selectedFile) {
      formData.append("files", selectedFile);
    }

    if (editingLog != true) {
      console.log("수정시작");
      formData.append("plantPestId", editPlantPestId);
      formData.append("fileId", fileId);

      updatePestLogs(formData)
        .unwrap()
        .then((res) => {
          // showAlert(res.message);
          showAlert("수정 성공!");
          setPlantPestDate(dayjs());
          setPlantPestMemo("");
          setEditingLog(true);
          setSelectedFile(null);
          setSelectedFileName("");

          refetch();
        })
        .catch((err) => {
          console.error("수정 실패:", err);
          showAlert("수정 실패");
        });
    } else {
      console.log("저장 시작");
      savePestInfo(formData)
        .unwrap()
        .then((res) => {
          // showAlert(res.message);
          showAlert("저장 성공!");
          setPlantPestDate(dayjs());
          setPlantPestMemo("");
          setEditingLog(true);
          setSelectedFile(null);
          setSelectedFileName("");

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
          await deletePestLogs(id).unwrap(); // 삭제 요청
          showAlert("삭제 성공!");

          setPlantPestDate(dayjs());
          setPlantPestMemo("");
          setEditingLog(true);
          setSelectedFile(null);
          setSelectedFileName("");

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
    const logToEdit = pestLogs.find((log) => log.plantPestId === id);
    if (logToEdit) {
      console.log("logToEdit", logToEdit);
      setPlantPestDate(dayjs(logToEdit.plantPestDate));
      setPlantPestMemo(logToEdit.plantPestMemo);
      setEditingLog(false);
      setEditPlantPestId(id);
      setFileId(logToEdit.fileId);
      if (logToEdit.fileOriginName) {
        setSelectedFileName(logToEdit.fileOriginName);
        // 만약 기존 파일을 미리보기로 보여주고 싶다면 여기에서 URL을 설정해야 할 수 있습니다.
        // setSelectedFile(null); // 새 파일 선택을 위해 null로 초기화
      } else {
        setSelectedFileName(""); // 기존 파일이 없다면 파일명도 초기화
      }
      setSelectedFile(null); // 새 파일 선택을 위해 기존 선택된 파일 초기화
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file : ", file);
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } else {
      setSelectedFile(null); // 선택된 파일 저장
      setSelectedFileName(""); // 파일 이름 저장
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
          <PestContent
            plantPestDate={plantPestDate}
            setPlantPestDate={setPlantPestDate}
            plantPestMemo={plantPestMemo}
            setPlantPestMemo={setPlantPestMemo}
            handleSave={handleSave}
            pestLogs={pestLogs}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
            selectedFileName={selectedFileName}
            handleFileChange={handleFileChange}
            editingLog={editingLog}
            showWaterLogs={showWaterLogs}
            setShowWaterLogs={setShowWaterLogs}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantPest;
