import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  TextField,
  Typography,
  InputBase,
  Avatar,
} from "@mui/material";

import { CmUtil } from "../../cm/CmUtil";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { useCmDialog } from "../../cm/CmDialogUtil";
import { Tabs, Tab } from "@mui/material";
import Combo from "../combo/combo";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { usePet_Form_HospitalMutation } from "../../features/pet/petApi"; // 경로는 실제 프로젝트에 맞게 조정
import { usePet_Form_Hospital_UpdateMutation } from "../../features/pet/petApi";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckBoxIcon from "@mui/icons-material/CheckBox"; // 체크된 박스 아이콘
import { useComboListByGroupQuery } from "../../features/combo/combo";
import { useGetPetByIdQuery } from "../../features/pet/petApi";

import DefaultImage from "../../image/dafault-animal.png";

const RepottingContent = ({
  animalVisitDate,
  setAnimalVisitDate,
  animalHospitalName,
  setAnimalHospitalName,
  animalMedication,
  setAnimalMedication,
  animalTreatmentType,
  setAnimalTreatmentType,
  animalTreatmentMemo,
  setAnimalTreatmentMemo,
  handleSubmit,
  toggleDropdown,
  expanded,
  records,
  handleDelete,
  handleEdit,
  visibleCount,
  handleLoadMore,
  treatmentTypeMap,
  isEditing,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <Typography sx={{ fontWeight: "700", marginTop: 1 }}>
          날짜
        </Typography>

        <Box sx={{ marginTop: "10px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              format="YYYY.MM.DD"
              value={dayjs(animalVisitDate)}
              onChange={(newValue) => {
                setAnimalVisitDate(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth />
              )}
              slotProps={{
                textField: {
                  size: "small",
                  InputProps: {
                    sx: {
                      fontSize: 14,
                      borderRadius: "8px",
                      backgroundColor: "#F8F8F8",
                      width: "150px",
                      pl: "28px",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <Typography sx={{ fontWeight: "700", marginTop: 1 }}>
          병원이름
        </Typography>

        <TextField
          className="sunlight-status-textfield"
          multiline
          rows={1.2}
          value={animalHospitalName}
          onChange={(e) => setAnimalHospitalName(e.target.value)}
          variant="outlined"
          sx={{
            width: "150px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F8F8F8",
              borderRadius: "8px",
              padding: "0px", // 내부 패딩 제거
            },
            "& .MuiInputBase-input": {
              padding: "6px 8px", // 텍스트 입력 공간의 패딩 조절
              fontSize: "14px", // 폰트 사이즈 줄이면 높이도 줄어듦
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "700", marginTop: 1 }}>처방약</Typography>

        <TextField
          className="sunlight-status-textfield"
          multiline
          rows={1.2}
          value={animalMedication}
          onChange={(e) => setAnimalMedication(e.target.value)}
          variant="outlined"
          sx={{
            width: "150px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F8F8F8",
              borderRadius: "8px",
              padding: "0px", // 내부 패딩 제거
            },
            "& .MuiInputBase-input": {
              padding: "6px 8px", // 텍스트 입력 공간의 패딩 조절
              fontSize: "14px", // 폰트 사이즈 줄이면 높이도 줄어듦
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography sx={{ marginTop: 2 }}>진료내용</Typography>
        <Combo
          groupId="Medical"
          onSelectionChange={setAnimalTreatmentType}
          defaultValue={animalTreatmentType}
          sx={{
            fontSize: 14,
            width: "150px",
            height: "37px",
            backgroundColor: "#F8F8F8",
            borderRadius: "8px",
          }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <TextField
          className="sunlight-status-textfield"
          multiline
          rows={5}
          value={animalTreatmentMemo}
          onChange={(e) => setAnimalTreatmentMemo(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Button
        variant="contained"
        className="save-button"
        onClick={handleSubmit}
        sx={
          !isEditing
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
        {!isEditing ? "저장" : "수정"}
      </Button>

      <Typography
        variant="h6"
        onClick={toggleDropdown}
        sx={{ cursor: "pointer", fontWeight: "bold", mt: 2 }}
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} 기록 리스트
      </Typography>

      {expanded && (
        <Box mt={3} sx={{ maxHeight: 400, overflowY: "auto" }}>
          {records.slice(0, visibleCount).map((record) => (
            <Box
              component="fieldset"
              key={record.animalHospitalTreatmentId}
              sx={{
                mb: 2,
                border: "1px solid #ccc",
                p: 2,
                position: "relative",
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
                병원 진료 확인
              </legend>
              <Typography variant="subtitle2" sx={{ mb: 3 }}>
                {dayjs(record.animalVisitDate).format("YYYY.MM.DD")}{" "}
                {record.animalHospitalName} |{" "}
                {record.animalTreatmentType
                  ? treatmentTypeMap[record.animalTreatmentType]
                  : "없음"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "normal", mb: 0.5 }}
              >
                처방약 : {record.animalMedication}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                진료 내용 : {record.animalTreatmentMemo}
              </Typography>
              <Box position="absolute" top={8} right={8}>
                <Button color="black">
                  <span
                    onClick={() =>
                      handleDelete(record.animalHospitalTreatmentId)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    삭제
                  </span>
                  <span style={{ margin: "0 6px" }}>|</span>
                  <span
                    onClick={() => handleEdit(record)}
                    style={{ cursor: "pointer" }}
                  >
                    수정
                  </span>
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {expanded && visibleCount < records.length && (
        <Box textAlign="center" mt={1}>
          <Button variant="outlined" onClick={handleLoadMore}>
            + 더보기
          </Button>
        </Box>
      )}
    </Box>
  );
};

const Pet_Form_Hospital = () => {
  const { showConfirm } = useCmDialog(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get("animalId"); // 동물아이디 animalId parm에 저장
  const { data: petInfo, isLoading: isPetLoading } = useGetPetByIdQuery(
    animalId,
    {
      skip: !animalId,
    }
  );
  const pathToTabIndex = {
    "/pet/petFormHospital.do": 0,
    "/pet/petFormEatAlarm.do": 1,
    "/pet/petFormTrainingAndAction.do": 2,
  };

  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(dayjs());
  const [animalVisitDate, setAnimalVisitDate] = useState(dayjs());
  const [animalTreatmentMemo, setAnimalTreatmentMemo] = useState("");
  const animalTreatmentMemoRef = useRef();
  const [animalHospitalName, setAnimalHospitalName] = useState("");
  const animalHospitalNameRef = useRef();
  const [animalTreatmentType, setAnimalTreatmentType] = useState("");
  const [petFormHospital] = usePet_Form_HospitalMutation();
  const [petFormHospitalUpdate] = usePet_Form_Hospital_UpdateMutation();
  const [animalMedication, setAnimalMedication] = useState("");
  const animalMedicationRef = useRef();
  const { showAlert } = useCmDialog();
  const [selectedTab, setSelectedTab] = useState(
    pathToTabIndex[location.pathname] || 0
  );
  const [animalName, setAnimalName] = useState("");
  const [records, setRecords] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // 현재 보여줄 데이터 개수
  const [isEditing, setIsEditing] = useState(false); // true 수정  false 저장
  const [editId, setEditId] = useState(null);
  const [animalHospitalTreatmentId, setAnimalHospitalTreatmentId] =
    useState(null);
  const { data: comboData, isLoading: comboLoading } =
    useComboListByGroupQuery("Medical");

  const [treatmentTypeMap, setTreatmentTypeMap] = useState({}); // codeId → codeName 매핑 객체
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState();

  const tabIndexToPath = [
    `/pet/petFormHospital.do?animalId=${animalId}`,
    `/pet/petFormEatAlarm.do?animalId=${animalId}`,
    `/pet/petFormTrainingAndAction.do?animalId=${animalId}`,
  ];

  console.log("동물 ID 확인:", animalId);
  useEffect(() => {
    if (petInfo?.data) {
      const fetchedPet = petInfo.data;
      console.log("확인해야할 콘솔:", petInfo);
      setAnimalName(fetchedPet.animalName || "");

      setAnimalAdoptionDate(
        fetchedPet.animalAdoptionDate
          ? dayjs(fetchedPet.animalAdoptionDate)
          : null
      );

      // 서버에서 받아온 이미지 URL 저장
      console.log("fileUrl", fileUrl);
      if (fetchedPet.fileUrl) {
        setFileUrl(fetchedPet.fileUrl); // ✅ 이거 추가
        console.log("fileUrl", fetchedPet.fileUrl);
      } else {
        setExistingImageUrl("");
      }
    }
    console.log("✅ RTK Query 응답 data:", petInfo);
    console.log("existingImageUrl:", existingImageUrl);
    console.log("imageFile:", imageFile);
  }, [petInfo]);

  useEffect(() => {
    if (!expanded) {
      setVisibleCount(5);
    }
  }, [expanded]);

  const toggleDropdown = () => {
    setExpanded((prev) => !prev);
  };
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, records.length));
  };

  const handleEdit = (record) => {
    setAnimalVisitDate(dayjs(record.animalVisitDate));
    setAnimalHospitalName(record.animalHospitalName);
    setAnimalMedication(record.animalMedication);
    setAnimalTreatmentMemo(record.animalTreatmentMemo);
    setAnimalTreatmentType(record.animalTreatmentType);
    setIsEditing(true);
    setEditId(record.animalHospitalTreatmentId);
    setExpanded(true);
  };

  const handleDelete = async (id) => {
    showConfirm(
      '알람을 삭제하시겠습니까?',
      () => {
        // yes callback - 실행
        console.log('실행 확인');
        handleDelete2(id);
      },
      () => {
        // no callback - 취소
        console.log('실행 취소');
      }
    );
  }

  const handleDelete2 = async (id) => {
    try {
      // API 호출해서 서버에 del_yn='Y'로 변경 요청
      const response = await fetch(
        `http://192.168.0.30:8081/api/petHospital/delete.do`,
        {
          method: "POST", // 혹은 DELETE (백엔드에 맞게)
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ animalHospitalTreatmentId: id }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("삭제 실패");

      // 성공하면 화면에서 해당 항목 제거
      setRecords((prev) =>
        prev.filter((r) => r.animalHospitalTreatmentId !== id)
      );
      showAlert("삭제 성공!");
      // 초기화
      setAnimalVisitDate(dayjs());
      setAnimalHospitalName("");
      setAnimalMedication("");
      setAnimalTreatmentType("");
      setAnimalTreatmentMemo("");
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("삭제 오류:", error);
      showAlert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    console.log("comboData : " + comboData);
    if (comboData?.data) {
      const map = {};
      comboData.data.forEach((item) => {
        map[item.codeId] = item.codeName;
      });
      setTreatmentTypeMap(map);
    }
  }, [comboData]);

  useEffect(() => {
    if (!animalId) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch(
          "http://192.168.0.30:8081/api/petHospital/list.do",
          {
            method: "GET",
            credentials: "include", // 세션 쿠키 포함
          }
        );
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        console.log("Fetched data:", data);
        const filtered = data.filter(
          (item) => String(item.animalId) === String(animalId)
        );
        const sorted = [...filtered].sort(
          (a, b) => new Date(b.createDt) - new Date(a.createDt)
        );
        setRecords(sorted);
      } catch (err) {
        console.error("Fetch 에러:", err);
      }
    };

    fetchRecords();
  }, [animalId]);
  // 탭 클릭 시 경로 이동
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };
  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setSelectedTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);
  // 각 경로에 대응하는 탭 인덱스 설정

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalId) return showAlert("동물을 선택해주세요.");
    if (!dayjs(animalVisitDate).isValid())
      return showAlert("방문 날짜를 선택해주세요.");
    if (CmUtil.isEmpty(animalHospitalName))
      return showAlert("병원 이름을 입력해주세요.");
    if (CmUtil.isEmpty(animalMedication))
      return showAlert("처방약을 입력해주세요.");

    const formData = new FormData();

    if (isEditing && editId != null) {
      formData.append("animalHospitalTreatmentId", editId);
    }

    formData.append("animalId", animalId);
    formData.append("animalVisitDate", animalVisitDate.format("YYYY-MM-DD"));
    formData.append("animalHospitalName", animalHospitalName);
    formData.append("animalMedication", animalMedication);
    formData.append("animalTreatmentType", animalTreatmentType);
    formData.append("animalTreatmentMemo", animalTreatmentMemo);

    try {
      if (isEditing) {
        const updatedData = await petFormHospitalUpdate(formData).unwrap();
        setRecords((prev) =>
          prev.map((r) =>
            r.animalHospitalTreatmentId === editId ? updatedData : r
          )
        );
        showAlert("수정 성공!");
      } else {
        const result = await petFormHospital(formData).unwrap();
        const newRecord = {
          animalHospitalTreatmentId: result.animalHospitalTreatmentId,
          animalId,
          animalVisitDate: dayjs(animalVisitDate).format("YYYY-MM-DD"),
          animalHospitalName,
          animalMedication,
          animalTreatmentType,
          animalTreatmentMemo,
        };
        setRecords((prev) => [newRecord, ...prev]);
        showAlert("등록 성공!");
      }

      // 초기화
      setAnimalVisitDate(dayjs());
      setAnimalHospitalName("");
      setAnimalMedication("");
      setAnimalTreatmentType("");
      setAnimalTreatmentMemo("");
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("저장 실패:", error);
      showAlert("저장 중 오류가 발생했습니다.");
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
            navigate(`/pet/petFormUpdate.do?animalId=${animalId}`);
          }}
        >
          수정
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: "60%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
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
                  {petInfo?.data ? petInfo.data.animalName : "정보 없음"}
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
                  {petInfo?.data
                    ? petInfo.data.animalAdoptionDate
                    : "정보 없음"}
                </Typography>
              </Box>
            </Box>

            <Button
              sx={{
                color: "white",
                top: 2,
                backgroundColor: "#88AE97",
                borderRadius: "8px",
                width: "100%",
                height: 40,
                fontSize: 13,
                fontWeight: "bold",
              }}
              onClick={() => navigate(`/pet/walk.do?animalId=${animalId}`)}
            >
              산책하기
            </Button>
          </Box>

          <Avatar
            sx={{
              width: "110px",
              height: "110px",
              border: "1px solid #e0e0e0",
            }}
            src={
              petInfo?.data?.fileUrl
                ? "http://192.168.0.30:8081" + petInfo?.data?.fileUrl
                : DefaultImage
            }
          />
        </Box>

        <Box className="tab-menu-container">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            className="plant-care-tabs"
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
          >
            <Tab label="병원진료" />
            <Tab label="먹이알림" />
            <Tab label="훈련/행동" />
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          <RepottingContent
            animalVisitDate={animalVisitDate}
            setAnimalVisitDate={setAnimalVisitDate}
            animalHospitalName={animalHospitalName}
            setAnimalHospitalName={setAnimalHospitalName}
            animalMedication={animalMedication}
            setAnimalMedication={setAnimalMedication}
            animalTreatmentType={animalTreatmentType}
            setAnimalTreatmentType={setAnimalTreatmentType}
            animalTreatmentMemo={animalTreatmentMemo}
            setAnimalTreatmentMemo={setAnimalTreatmentMemo}
            handleSubmit={handleSubmit}
            toggleDropdown={toggleDropdown}
            expanded={expanded}
            records={records}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            visibleCount={visibleCount}
            handleLoadMore={handleLoadMore}
            treatmentTypeMap={treatmentTypeMap}
            isEditing={isEditing}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
export default Pet_Form_Hospital;
