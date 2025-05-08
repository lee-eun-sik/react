import React, { useRef, useState } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import { useBoardCreateMutation } from "../../features/board/boardApi";
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';  

const BoardCreate = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const titleRef = useRef();
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [boardCreate] = useBoardCreateMutation();
  const { showAlert } = useCmDialog();
  const [editorValue, setEditorValue] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const contentText = editorRef.current?.getContent({ format: 'text' });
    const contentHtml = editorRef.current?.getContent();

    // 제목이 비어있는지 체크
    if (CmUtil.isEmpty(title)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }

    // 제목 길이 체크
    if (!CmUtil.maxLength(title, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }

    // 내용이 비어있는지 체크
    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => {editorRef?.current?.focus();});
      return;
    }

    // 내용 길이 체크
    if (!CmUtil.maxLength(contentText, 2000)) {
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.",() => {editorRef?.current?.focus();});
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", contentHtml);
    formData.append("viewCount", 0);

    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const res = await boardCreate(formData).unwrap();
    if (res.success) {
      showAlert("게시글 생성 성공! 게시판 목록으로 이동합니다.", () => navigate("/board/list.do"));
      
    } else {
      showAlert("게시글 생성 실패 했습니다.");
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        게시글 작성
      </Typography>
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <Box mb={3}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="제목"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            inputRef={titleRef}
          />
        </Box>

        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor value={editorValue} setValue={setEditorValue} ref={editorRef} max={2000} />
        </Box>

        <Box mb={3}>
          <Typography gutterBottom>파일 업로드</Typography>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderStyle: "dashed" }} {...getRootProps()}>
            <input {...getInputProps()} />
            <Typography variant="body2" color="textSecondary">
              파일을 드래그하거나 클릭하여 업로드하세요.
            </Typography>
          </Paper>

          {uploadedFiles.length > 0 && (
            <List>
              {uploadedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <Box display="flex" gap={1} mt={2}>
          {user && (
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            등록
          </Button>
          )}
          
          <Button
           variant="contained" 
           color="primary"
           onClick={() => navigate('/board/list.do')}
          >
            목록으로
          </Button>
        </Box>
      </Box>
      
    </Box>
  );
};

export default BoardCreate;
