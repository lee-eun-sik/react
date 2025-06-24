import React, { useRef, useState, useEffect } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import { useWriteCreateMutation } from "../../features/write/writeApi";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import Combo from "../combo/combo";
import back from "../../image/back.png";
import ToggleCombo from "../../page/combo/ToggleCombo";
import image from "../../image/imageAdd.png";
import imgDelete from "../../image/imageDelete.png";

const WriteCreate = () => {
  const user = useSelector((state) => state.user.user);
  const editorRef = useRef();
  const writingTitleRef = useRef();
  const [editor, setEditor] = useState("");
  const [Title, setWritingTitle] = useState("");
  const [writingSortation, setWritingSortation] = useState("N01"); // 선택된 게시판 종류
  const [writingCategory, setWritingCategory] = useState("C02"); // 선택된 카테고리
  const [writeCreate] = useWriteCreateMutation();
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState([]);

  // ToggleCombo에서 값이 변경될 때 호출될 핸들러
  const handleWritingSortationChange = (newValue) => {
    setWritingSortation(newValue);
  };


   const maxFile = 5;
  const handleFileChange = (e) => {
     const newFiles = Array.from(e.target.files);
     const totalFiles = files.length + newFiles.length;
      if (totalFiles > maxFile) {
      showAlert(`사진은 최대 ${maxFile}장까지 업로드 할 수 있습니다.`);
       e.target.value = null;
      return;
    }
     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
     e.target.value = null;
  };

  const handleFileDelete = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortationParam = params.get("sortation");
    const categoryParam = params.get("category");

    if (sortationParam) {
      setWritingSortation(sortationParam);
    }
    if (categoryParam) {
      setWritingCategory(categoryParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentText = editorRef.current?.getContent({ format: "text" });
    const contentHtml = editorRef.current?.getContent();

    // 제목이 비어있는지 체크
    if (CmUtil.isEmpty(Title)) {
      showAlert("제목을 입력해주세요.");
      writingTitleRef.current?.focus();
      return;
    }

    // 제목 길이 체크
    if (!CmUtil.maxLength(Title, 30)) {
      showAlert("제목은 최대 30자까지 입력할 수 있습니다.", () =>
        writingTitleRef.current?.focus()
      );
      return;
    }

    // 내용이 비어있는지 체크
    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => editorRef.current?.focus());
      return;
    }

    const formData = new FormData();
    formData.append("writingTitle", Title);
    formData.append("writingContent", contentHtml);
    formData.append("writingSortation", writingSortation); // WRITING_SORTATION 추가
    formData.append("writingCategory", writingCategory); // WRITING_CATEGORY 추가
    formData.append("writingViewCount", 0);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await writeCreate(formData).unwrap();
    if (res.success) {
      showAlert("게시글 생성 성공! 게시판 목록으로 이동합니다.", () =>
        navigate("/write/list.do")
      );
    } else {
      showAlert("게시글 생성 실패 했습니다.");
    }
  };

  return (
    <Box sx={{padding: "20px"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          mb: "5px",
        }}
      >
        {/*뒤로가기 버튼*/}
        <Button
          onClick={() => navigate(
                  `/write/list.do?sortation=${writingSortation}&category=${writingCategory}`
                )}
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

        <Typography variant="h5" gutterBottom>
          게시글 작성
        </Typography>

        {/*동식물 선택 토글 콤보박스*/}
        {/* onSelectionChange prop을 통해 Combo에서 선택된 값을 받아 writingSortation 상태에 업데이트 */}
        <ToggleCombo
          onToggleChange={handleWritingSortationChange}
          defaultValue={writingSortation}
        />
      </Box>
      {/*form 박스*/}
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/*제목*/}
          <Typography gutterBottom sx={{ mt: "20px", mr:"10px", fontWeight: "600", fontSize: "20px", whiteSpace: "nowrap" }}>
            제목
          </Typography>
          {/*제목 입력란*/}
          <Box mb={1}>
            <TextField
              fullWidth
              id="title"
              name="title"
              inputProps={{ maxLength: 100 }}
              inputRef={writingTitleRef}
              value={Title}
              onChange={(e) => setWritingTitle(e.target.value)}
              variant="standard"
              sx={{
                mt: "15px",
                width: "96%",
                textAlign:'center',
                "& .MuiInput-root": {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "20px",
                  height: "40px",
                  "&::before": {
                    borderBottom: "none !important",
                  },
                  "&::after": {
                    borderBottom: "none !important",
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "none !important",
                  },
                  "& .MuiInputBase-input": {
                    padding: "0 10px",
                    flexGrow: 1,
                    textAlign:'center'
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(0, 0, 0, 0.5)",
                  opacity: 1,
                },
              }}
            />
          </Box>
          {/*카테고리 콤보박스*/}
          <Combo
            groupId="Community"
            onSelectionChange={setWritingCategory}
            defaultValue={writingCategory}
            sx={{
              // 이 Combo 인스턴스에만 적용될 스타일
              borderRadius: "20px",
              backgroundColor: "#f5f5f5",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": { padding: "8px 14px" },
              "& .MuiSelect-icon": { color: "#888" },
              flex: 1,
            }}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* 사진 리스트 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto", // 가로 스크롤
            gap: 2,
            whiteSpace: "nowrap", // 스크롤 허용
            maxWidth: "100%", // 부모 너비 기준
            pb: 1, // 아래 여백
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "4px",
            },
          }}
        >
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
        {/* 게시물 입력(TinyMCEEditor)*/}
        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor
            value={editor}
            setValue={setEditor}
            ref={editorRef}
            max={2000}
          />
        </Box>
        {/* 저장 버튼 */}
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          {user && (
            <Button
              onClick={handleSubmit}
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "20px",
                height: "38px",
                width: "170px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#3B4C34",
                },
                backgroundColor: "#4B6044",
              }}
            >
              <Typography sx={{ color: "white" }}>저장</Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default WriteCreate;
