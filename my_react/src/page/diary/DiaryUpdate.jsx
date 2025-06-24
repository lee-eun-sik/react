import { Box, TextField, Typography, IconButton, Button } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { CmUtil } from "../../cm/CmUtil";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCmDialog } from "../../cm/CmDialogUtil";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import back from "../../image/back.png";
import pet from "../../image/animalFootprintWhite.png";
import plant from "../../image/plantWhite.png";
import image from "../../image/imageAdd.png";
import imgDelete from "../../image/imageDelete.png";
import "../../css/toggleSwitch.css";
import "../../css/diaryCreate.css";
import {
  useDiaryUpdateMutation,
  useDiaryDeleteMutation,
  useDiaryViewQuery,
} from "../../features/diary/diaryApi";

const DiaryUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const titleRef = useRef();
  const contentRef = useRef();
  const dateRef = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(dayjs());
  const [diaryType, setDiaryType] = useState("N01");
  const [files, setFiles] = useState([]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [diaryUpdate] = useDiaryUpdateMutation();
  const [diaryDelete] = useDiaryDeleteMutation();
  const { data, isLoading } = useDiaryViewQuery({ diaryId: id });
  const [diary, setDiary] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [remainingFileIds, setRemainingFileIds] = useState([]);

  useEffect(() => {
    if (data?.success) {
      const dayjsDate = data.data.diaryDate?.substring(0, 10);
      setDiary(data.data);
      setTitle(data.data.diaryTitle);
      setContent(data.data.diaryContent);
      setDate(dayjs(dayjsDate));
      setDiaryType(data.data.diaryType);
      setIsOn(data.data.diaryType === "N01");
      setExistingFiles(data.data.postFiles || []);
      setRemainingFileIds(
        data.data.postFiles?.map((file) => file.postFileId) || []
      );
      console.log("📦 data from useDiaryViewQuery", data);
    }
  }, [data]);

  const { showAlert, showConfirm } = useCmDialog();

  const navigate = useNavigate();
  const maxFile = 5;
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = existingFiles.length + files.length + newFiles.length;
    if (totalFiles > maxFile) {
      showAlert(`사진은 최대 ${maxFile}장까지 업로드 할 수 있습니다.`);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleFileDelete = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    if (CmUtil.isEmpty(title)) {
      showAlert("제목을 입력해주세요");
      titleRef.current?.focus();
      return;
    }
    if (!CmUtil.maxLength(title, 30)) {
      showAlert("제목을 최대 30자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(date)) {
      showAlert("날짜를 입력해주세요");
      dateRef.current?.focus();
      return;
    }
    if (CmUtil.isDateFuture(date)) {
      showAlert("미래 날짜는 선택할 수 없습니다.");
      dateRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(content)) {
      showAlert("내용을 입력해주세요", () => {
        contentRef?.current?.focus();
      });
      return;
    }
    if (!CmUtil.maxLength(content, 1000)) {
      showAlert("내용은 최대 1000자까지 입력할 수 있습니다.", () => {
        contentRef?.current?.focus();
      });
      return;
    }

    const formData = new FormData();
    formData.append("diaryId", id);
    formData.append("diaryTitle", title);
    formData.append("diaryDate", date.format("YYYY-MM-DD"));
    formData.append("diaryContent", content);
    formData.append("diaryType", diaryType);
    formData.append("remainingFileIds", remainingFileIds.join(","));
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await diaryUpdate(formData).unwrap();

      showAlert("일기 저장 성공! 일기 목록으로 이동합니다.", () =>
        navigate("/diary/list.do")
      );
    } catch (error) {
      console.error("요청 실패:", error);
      showAlert("서버 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    showConfirm("정말 삭제하시겠습니까?", async () => {
      const res = await diaryDelete({ diaryId: id }).unwrap();
      if (res.success) {
        showAlert("일기 삭제 성공! 일기 목록으로 이동합니다.", () =>
          navigate("/diary/list.do")
        );
      } else {
        showAlert("일기 삭제 실패했습니다.");
      }
    });
  };

  const [isOn, setIsOn] = useState(true);
  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    setDiaryType(newState ? "N01" : "N02");
    //true=동물=N01
    //false=식물=N02
  };

  return (
    <>
      <Box sx={{ maxWidth: 360, width: "100%", mx: "auto" }}>
        <Box mt={3} mb={3} className="diary-top-section">
          <Button
            onClick={() => navigate(-1)}
            // variant="contained"
            sx={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "10px",
              height: "35px",
              minWidth: "0",
              width: "35px",
              "&:hover": {
                backgroundColor: "#363636",
              },
              backgroundColor: "rgba(54, 54, 54, 0.4)",
            }}
          >
            <img src={back} alt="" sx={{ pl: "2px" }}></img>
          </Button>
          <Typography variant="h5" gutterBottom sx={{ ml: "28px" }}>
            일기 수정
          </Typography>
          <div
            className={`toggle-container ${isOn ? "on" : ""}`}
            onClick={handleToggle}
          >
            <div className="toggle-circle" />
            {
              <img
                src={isOn ? pet : plant}
                alt="toggle icon"
                className={`toggle-img ${isOn ? "pet" : "plant"}`}
              />
            }
          </div>
        </Box>
        {/* <Typography mt={1} fontSize="14px" align="center">
          현재 선택된 다이어리 타입: {diaryType === "D01" ? "반려동물" : "반려식물"}
        </Typography> */}
        <Box component="form" onSubmit={handleEdit} noValidate>
          <Box mr={1.5} gap={1} className="diary-title">
            <Typography variant="h6" alignContent={"center"}>
              제목
            </Typography>
            <TextField
              inputRef={titleRef}
              value={title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 100, style: { textAlign: "center" } }}
              InputProps={{
                sx: {
                  textAlign: "center",
                  height: "35px",
                  width: "280px",
                  borderRadius: "15px",
                  backgroundColor: "#F8F8F8",
                },
              }}
            />
          </Box>
          <Box mt={-4.5} mr={1.5} gap={1} className="diary-date">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <Typography variant="h6" alignContent={"center"}>
                날짜
              </Typography>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                format="YYYY.MM.DD"
                slotProps={{
                  textField: {
                    size: "small",
                    InputProps: {
                      sx: {
                        borderRadius: "20px",
                        backgroundColor: "#F8F8F8",
                        width: "160px",
                        pl:'28px',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box
            m={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto", //가로 스크롤
              gap: 2,
              padding: 1,
              "&::-webkit-scrollbar": {
                height: "1px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "4px",
              },
            }}
          >
            {/* 사진 리스트 */}
            {existingFiles.map((file, index) => (
              <Box
                key={`existing-${index}`}
                sx={{
                  position: "relative",
                  minWidth: 140,
                  height: 140,
                  borderRadius: "5px",
                  overflow: "hidden",
                  backgroundColor: "#ccc",
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                }}
              >
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${file.postFileId}`}
                  alt={`file-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <IconButton
                  onClick={() => {
                    setExistingFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                    setRemainingFileIds((prev) =>
                      prev.filter((id) => id !== file.postFileId)
                    );
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 0,
                    "&:hover": {
                      backgroundColor: "rgba(255, 100, 100, 0.8)",
                    },
                  }}
                >
                  <img
                    src={imgDelete}
                    alt="삭제"
                    style={{ width: 20, height: 20 }}
                  />
                </IconButton>
              </Box>
            ))}
            {/* 이미지 미리보기 리스트 */}
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  minWidth: 140,
                  height: 140,
                  borderRadius: "5px",
                  overflow: "hidden",
                  backgroundColor: "#ccc",
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <IconButton
                  onClick={() => handleFileDelete(index)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 0,
                    "&:hover": {
                      backgroundColor: "rgba(255, 100, 100, 0.8)",
                    },
                  }}
                >
                  <img
                    src={imgDelete}
                    alt="삭제"
                    style={{ width: 20, height: 20 }}
                  />
                </IconButton>
              </Box>
            ))}

            {/* 사진 추가 버튼 */}
            <label htmlFor="fileInput">
              <Button
                component="span"
                sx={{
                  minWidth: 0,
                  width: 140,
                  height: 140,
                  borderRadius: "5px",
                  backgroundColor: "rgba(54, 54, 54, 0.2)",
                  "&:hover": { backgroundColor: "#363636" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={image} alt="add" />
              </Button>
            </label>

            <input
              id="fileInput"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
          <Box m={3}>
            <Typography gutterBottom>내용</Typography>
            <TextField
              inputRef={contentRef}
              value={content ?? ""}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={8}
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 1300,}}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "#F8F8F8",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 2,
              mt: 2,
            }}
          >
            {user && (
              <Button
                onClick={handleEdit}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "20px",
                  height: "38px",
                  width: "170px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#57866a",
                  },
                  backgroundColor: "#88AE97",
                }}
              >
                <Typography className="diary-save-text">수정</Typography>
              </Button>
            )}
            {user && (
              <Button
                onClick={handleDelete}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "20px",
                  height: "38px",
                  width: "170px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#7a3636",
                  },
                  backgroundColor: "#A44D4D",
                }}
              >
                <Typography className="diary-save-text">삭제</Typography>
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default DiaryUpdate;
