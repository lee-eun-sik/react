import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  InputBase,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Avatar,
  IconButton,
} from "@mui/material";
import { usePetDeleteAlarmMutation } from "../../features/alarm/alarmApi";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usePet_Form_UpdateMutation } from "../../features/pet/petApi"; // RTK Query 훅 임포트
import { useDeletePetMutation } from "../../features/pet/petApi";
import { useGetPetByIdQuery } from "../../features/pet/petApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import back from "../../image/back.png";

import DefaultAnimal from "../../image/dafault-animal.png";

const Pet_Form_Update = () => {
  const { showConfirm } = useCmDialog();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const animalIdStr = searchParams.get("animalId");
  const animalId =
    !animalIdStr || animalIdStr === "null" || isNaN(Number(animalIdStr))
      ? null
      : Number(animalIdStr);
  const [animalName, setAnimalName] = useState("");
  const animalNameRef = useRef();
  const [animalSpecies, setAnimalSpecies] = useState("");
  const animalSpeciesRef = useRef();
  const [animalMemo, setAnimalMemo] = useState("");
  const animalMemoRef = useRef();
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState();
  const normalizedFileUrl = fileUrl?.replace(/\\/g, "/");
  console.log("동물 ID 확인:", animalId); // → 8이어야 정상
  const { showAlert } = useCmDialog();
  // RTK Query mutation 훅
  const [petFormUpdate, { isLoading }] = usePet_Form_UpdateMutation();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
  // animalId가 null이면 쿼리 실행하지 않음
  const { data, isLoading: isPetLoading } = useGetPetByIdQuery(animalId, {
    skip: !animalId,
  });

  const [petDeleteAlarm] = usePetDeleteAlarmMutation();

  const handleImageChange = (e) => {
    console.log("선택한파일 : ", e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
    setFileUrl(null);
  };
  useEffect(() => {
    if (data?.data) {
      const fetchedPet = data.data;
      setAnimalName(fetchedPet.animalName || "");
      setAnimalSpecies(fetchedPet.animalSpecies || "");
      setAnimalMemo(fetchedPet.animalMemo || "");
      setAnimalAdoptionDate(
        fetchedPet.animalAdoptionDate
          ? dayjs(fetchedPet.animalAdoptionDate)
          : null
      );
      setBirthDate(fetchedPet.birthDate ? dayjs(fetchedPet.birthDate) : null);
      setGender(fetchedPet.gender?.trim() || "");
      console.log("fileUrl", fileUrl);
      if (fetchedPet.fileUrl) {
        setFileUrl(fetchedPet.fileUrl); // ✅ 이거 추가
        console.log("fileUrl", fetchedPet.fileUrl);
      } else {
        setExistingImageUrl("");
      }
    }
  }, [data]);

  useEffect(() => {
    console.log("existingImageUrl 상태 업데이트 됨:", existingImageUrl);
  }, [existingImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (CmUtil.isEmpty(animalName)) {
      showAlert("이름을 입력해주세요.");
      animalNameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(animalSpecies)) {
      showAlert("종류를 입력해주세요.");
      animalSpeciesRef.current?.focus();
      return;
    }

    try {
      const formData = new FormData();
      console.log("animalId", animalId);
      console.log("animalName", animalName);
      console.log("animalSpecies", animalSpecies);
      console.log("animalMemo", animalMemo);

      formData.append("animalId", animalId);
      formData.append("animalName", animalName);
      formData.append("animalSpecies", animalSpecies);
      formData.append("animalMemo", animalMemo);
      formData.append("gender", gender);
      formData.append(
        "animalAdoptionDate",
        animalAdoptionDate.format("YYYY-MM-DD")
      );
      formData.append("birthDate", birthDate.format("YYYY-MM-DD"));

      if (imageFile) {
        formData.append("files", imageFile);
      }

      // RTK Query mutation 호출
      const result = await petFormUpdate(formData).unwrap();

      if (result.success) {
        showAlert("수정 성공!");
        navigate(-1);
      } else {
        showAlert(result.message || "수정 실패");
      }
    } catch (err) {
      console.error(err);
      showAlert("오류가 발생했습니다.");
    }
  };

  // 삭제 함수
  const handleDelete = async () => {
    if (!animalId) {
      showAlert("삭제할 동물 ID가 없습니다.");
      return;
    }

    showConfirm(
      "알람을 삭제하시겠습니까?",
      async () => {
        // yes callback - 실행
        console.log("실행 확인");
        try {
          petDeleteAlarm({
            petId: animalId,
            category: "ANI",
          })
            .unwrap()
            .then((response) => {
              console.log(
                `동물아이디${animalId}의 모든알람 상태 업데이트 완료`
              );
              console.log("전체 응답:", response);

              // 알람 끄기 - Android cancelAlarm 호출
              if (window.Android && window.Android.cancelAlarm) {
                console.log("response.data.length = ", response.data.length);
                for (let i = 0; i < response?.data?.length; i++) {
                  const alarmId = response.data[i].alarmId;
                  window.Android.cancelAlarm(String(alarmId));
                }
              }
            })
            .catch((err) => {
              console.error("알람 업데이트 실패", err);
              showAlert("알람 상태 업데이트 실패");
            });

          const result = await deletePet({ animalId }).unwrap();
          if (result.success) {
            showAlert("삭제 성공!");
            navigate("/home.do");
          } else {
            showAlert(result.message || "삭제 실패");
          }
        } catch (err) {
          console.error(err);
          showAlert("삭제 중 오류가 발생했습니다.");
        }
      },
      () => {
        // no callback - 취소
        console.log("실행 취소");
      }
    );
  };
  return (
    <>
      <Button
        onClick={() => navigate(-1)}
        sx={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "10px",
          height: "35px",
          minWidth: "0",
          width: "35px",
          marginLeft: "30px",
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
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100vw",
          height: "100vh",
          maxWidth: 360,
          margin: "0 auto",
          overflowY: "auto",
          backgroundColor: "#fff",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
            position: "relative",
          }}
        >
          <Avatar
            src={
              fileUrl
                ? "http://192.168.0.30:8081" + fileUrl
                : imageFile
                ? URL.createObjectURL(imageFile)
                : DefaultAnimal
            }
            sx={{ width: 100, height: 100 }}
          />

          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: "calc(50% - 50px)",
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: 1,
              p: 0,
            }}
          >
            <Box
              component="img"
              src="/icons/image-edit.png"
              alt="사진 업로드"
              sx={{ width: 30, height: 30 }}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </IconButton>
        </Box>

        <FormRow
          label="동물 이름"
          value={animalName}
          onChange={setAnimalName}
          inputRef={animalNameRef}
        />
        <FormRow
          label="동물 종류"
          value={animalSpecies}
          onChange={setAnimalSpecies}
          inputRef={animalSpeciesRef}
        />

        <DateInputRow
          label="동물 입양일"
          value={animalAdoptionDate}
          onChange={setAnimalAdoptionDate}
        />
        <DateInputRow label="생일" value={birthDate} onChange={setBirthDate} />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography sx={{ width: "90px", fontSize: 14, fontWeight: 500 }}>
            성별
          </Typography>
          <RadioGroup
            row
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel
              value="F"
              control={<Radio size="small" />}
              label="암컷"
            />
            <FormControlLabel
              value="M"
              control={<Radio size="small" />}
              label="수컷"
            />
          </RadioGroup>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>
            특이 사항
          </Typography>
          <InputBase
            value={animalMemo}
            onChange={(e) => setAnimalMemo(e.target.value)}
            inputRef={animalMemoRef}
            multiline
            inputProps={{
              style: {
                padding: 0,
                paddingTop: 4, // 첫 줄 여유
                fontSize: 13,
              },
            }}
            sx={{
              backgroundColor: "#F8F8F8",
              borderRadius: "8px",
              px: 2,
              py: 1,
              minHeight: 70,
              textDecoration: "none",
              fontWeight: "normal",
              display: "flex",
              alignItems: "flex-start", // 텍스트 상단 정렬
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 5 }}>
          <Button
            onClick={handleSubmit} // ✅ 직접 이벤트 연결
            variant="contained"
            sx={{
              backgroundColor: "#88AE97",
              borderRadius: "8px",
              px: 6,
              py: 1,
              fontSize: 14,
            }}
          >
            수정
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={{
              backgroundColor: "#A44D4D",
              borderRadius: "8px",
              px: 6,
              py: 1,
              fontSize: 14,
            }}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            삭제
          </Button>
        </Box>
      </Box>
    </>
  );
};

const FormRow = ({
  label,
  value = "",
  onChange,
  multiline = false,
  inputRef,
  fieldKey = "",
}) => {
  // 필드 조건별 스타일 정의
  let backgroundColor = "#F8F8F8";
  let border = "1px solid #ccc";
  let borderRadius = "8px";
  let textDecoration = "none";
  let fontWeight = "normal";
  let color = "inherit";
  let minHeight = undefined;

  if (fieldKey === "notes") {
    backgroundColor = "#F4EEEE";
    fontWeight = "bold";
    color = "#000";
    minHeight = 80; // 3줄 정도 여유
  }

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
      <Typography
        sx={{
          width: "90px",
          fontSize: 14,
          fontWeight: 500,
          mt: multiline ? "6px" : 0,
        }}
      >
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: "center", // <-- 중앙 정렬
            ...(multiline ? { paddingTop: 4 } : {}),
          },
        }}
        sx={{
          width: "240px",
          backgroundColor,
          border,
          borderRadius,
          px: 2,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};

const DateInputRow = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography sx={{ width: "90px", fontSize: 14, fontWeight: 500 }}>
        {label}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          value={value}
          onChange={onChange}
          format="YYYY.MM.DD"
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              fullWidth: false,
              InputProps: {
                readOnly: true,
                sx: {
                  width: "240px",
                  height: "40px",
                  backgroundColor: "#F8F8F8",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "normal", // ✅ 진하지 않게
                  pr: "12px", // 아이콘 공간 확보
                  pl: "33px", // 좌측 패딩 확보 날짜 텍스트 정중앙에 오게하기.
                  "& input": {
                    textAlign: "center", // ✅ 날짜 가운데 정렬
                    padding: 0, // ✅ 모든 방향 패딩 제거
                  },
                },
              },
              inputProps: {
                style: {
                  textAlign: "center",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
export default Pet_Form_Update;
