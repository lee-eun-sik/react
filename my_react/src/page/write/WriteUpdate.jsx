import React, { useEffect, useRef, useState } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import {
  useWriteViewQuery,
  useWriteUpdateMutation,
  useWriteDeleteMutation,
} from "../../features/write/writeApi";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import ToggleCombo from "../../page/combo/ToggleCombo";
import back from "../../image/back.png";
import image from "../../image/imageAdd.png";
import imgDelete from "../../image/imageDelete.png";

const WriteUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const editorRef = useRef();
  const titleRef = useRef();
  const [editor, setEditor] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  // RTK Query 뮤테이션 훅 초기화
  const [writeUpdate] = useWriteUpdateMutation();
  const [writeDelete] = useWriteDeleteMutation();

  // 게시글 상세 정보를 가져오기 위한 RTK Query 훅
  const { data } = useWriteViewQuery({ writingId: id });
  const [writing, setWrite] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [remainingFileIds, setRemainingFileIds] = useState([]);
  const [writingSortation, setWritingSortation] = useState("");
  const [writingCategory, setWritingCategory] = useState("");

  useEffect(() => {
    if (data?.success) {
      console.log(data.data);
      setWrite(data.data);
      setTitle(data.data.writingTitle);
      setEditor(data.data.writingContent);
      setExistingFiles(data.data.postFiles || []);
      // 기존 첨부 파일들의 ID를 추출하여 `remainingFileIds` 초기화
      setRemainingFileIds(
        data.data.postFiles?.map((file) => file.postFileId) || []
      );
      setWritingSortation(data.data.writingSortation);
      setWritingCategory(data.data.writingCategory);
    }
  }, [data]); // `data`가 변경될 때마다 이펙트 실행

  useEffect(() => {
    console.log("writingSortation 변경됨:", writingSortation);
  }, [writingSortation]);

  useEffect(() => {
    console.log("writingCategory 변경됨:", writingCategory);
  }, [writingCategory]);

  const { showAlert, showConfirm } = useCmDialog();
  const navigate = useNavigate();


    const maxFile = 5;
  const handleFileChange = (e) => {
     const newFiles = Array.from(e.target.files);
     const totalFiles = existingFiles.length+files.length + newFiles.length;
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

  // 폼 제출(게시글 수정) 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    const contentText = editorRef.current?.getContent({ format: "text" });
    const contentHtml = editorRef.current?.getContent();

    // 제목 유효성 검사
    if (CmUtil.isEmpty(title)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus(); // 제목 필드로 포커스
      return;
    }

    // 제목 길이 검사
    if (!CmUtil.maxLength(title, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }

    // 내용 유효성 검사
    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => editorRef.current?.focus()); // 내용 필드로 포커스
      return;
    }

    // 내용 길이 검사
    if (!CmUtil.maxLength(contentText, 2000)) {
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.", () =>
        editorRef.current?.focus()
      );
      return;
    }

    const formData = new FormData();
    formData.append("writingId", id); // 게시글 ID 추가
    formData.append("writingTitle", title); // 수정된 제목 추가
    formData.append("writingContent", contentHtml); // 수정된 HTML 내용 추가
    formData.append("writingSortation", writingSortation);
    formData.append("writingCategory", writingCategory);

    // 유지할 파일 ID 목록을 콤마로 구분된 문자열로 변환하여 추가
    formData.append("remainingFileIds", remainingFileIds.join(","));

    // 새로 업로드된 파일들을 FormData에 추가
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 게시글 수정 API 호출 및 결과 처리
      const res = await writeUpdate(formData).unwrap(); // unwrap()을 사용하여 성공/실패 직접 처리
      if (res.success) {
        showAlert("게시글 수정 성공! 게시판 목록으로 이동합니다.", () =>
          navigate("/write/list.do")
        );
      } else {
        showAlert("게시글 수정 실패 했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error); // 에러 로깅
      showAlert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    // 삭제 확인 다이얼로그 표시
    showConfirm("정말 삭제하시겠습니까?", async () => {
      try {
        const formData = new FormData();
        formData.append("writingId", id); //게시글 id를 FormData에 추가

        const res = await writeDelete(formData).unwrap(); // 게시글 삭제 API 호출
        if (res.success) {
          showAlert("게시글 삭제 성공! 게시판 목록으로 이동합니다.", () =>
            navigate("/write/list.do")
          );
        } else {
          showAlert("게시글 삭제 실패했습니다.");
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error); // 에러 로깅
        showAlert("게시글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  // ToggleCombo에서 값이 변경될 때 호출될 핸들러
  const handleWritingSortationChange = (newValue) => {
    setWritingSortation(newValue);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          mb: "5px",
        }}
      >
        <Button
          onClick={() => window.history.back()}
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
          게시글 수정
        </Typography>
        <ToggleCombo
          onToggleChange={handleWritingSortationChange}
          defaultValue={writingSortation}
        />
      </Box>

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
          <Typography variant="h6" gutterBottom sx={{ mt: "20px", mr:"10px", fontWeight: "600", fontSize: "20px", whiteSpace: "nowrap" }}>
            제목
          </Typography>
          {/* 제목 입력 필드 */}
          <Box mb={1}>
            <TextField
              fullWidth
              id="title"
              name="title"
              inputProps={{ maxLength: 100 }}
              inputRef={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              sx={{
                mt: "15px",
                width: "96%",
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
                    textAlign:'center',
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(0, 0, 0, 0.5)",
                  opacity: 1,
                },
              }}
            />
          </Box>
          <Combo
            groupId="Community"
            defaultValue={writingCategory}
            onSelectionChange={setWritingCategory}
            sx={{
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
          {existingFiles.map((file, index) => (
            <Box
              key={`existing-${index}`}
              sx={{
                position: 'relative',
                  minWidth: 140,
                  height: 140,
                  borderRadius: '5px',
                  overflow: 'hidden',
                  backgroundColor: '#ccc',
                  scrollSnapAlign: 'start',
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
                  display: "flex",
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
      </Box>
      {/* 내용(TinyMCE 에디터) 영역 */}
      <Box mb={3}>
        <Typography gutterBottom>내용</Typography>
        <CmTinyMCEEditor
          value={editor}
          setValue={setEditor}
          ref={editorRef}
          max={2000}
        />
      </Box>

      {/* 액션 버튼들 (수정, 삭제, 목록) */}
      <Box display="flex" gap={1} mt={2}>
        {/* 현재 로그인된 사용자와 게시글 작성자가 동일할 때만 수정/삭제 버튼 표시 */}
        {user?.usersId === writing?.createId && (
          <>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={handleSubmit}
               sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "20px",
                height: "38px",
                width: "170px",
                textTransform: "none",
                ml:"10px",
                "&:hover": {
                  backgroundColor: "#3B4C34",
                },
                backgroundColor: "#4B6044",
              }}
            >
              수정
            </Button>

            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "20px",
                height: "38px",
                width: "170px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#A44D4F",
                },
                backgroundColor: "#A44D4D",
              }}
            >
              삭제
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
export default WriteUpdate;
