import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import {
  useBoardViewQuery,
  useBoardUpdateMutation,
  useBoardDeleteMutation
} from "../../features/board/boardApi";
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const BoardUpdate = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); 
  const navigate = useNavigate();
  const editorRef = useRef();
  const titleRef = useRef();
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
  const { showAlert, showConfirm } = useCmDialog();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [remainingFileIds, setRemainingFileIds] = useState([]);
  const [title, setTitle] = useState("");
  const [editorValue, setEditorValue] = useState("");

  const { data, isLoading } = useBoardViewQuery({ boardId: id });
  const [boardUpdate] = useBoardUpdateMutation();
  const [boardDelete] = useBoardDeleteMutation();

  const [board, setBoard] = useState(null);

  useEffect(() => {
    if (data?.success) {
      console.log(data.data);
      setBoard(data.data);
      setTitle(data.data.title);
      setEditorValue(data.data.content);
      setExistingFiles(data.data.postFiles || []);
      setRemainingFileIds(data.data.postFiles?.map(file => file.fileId) || []);
    }
  }, [data]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  const handleRemoveUploadedFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveExistingFile = (fileId) => {
    setRemainingFileIds((prevIds) => prevIds.filter((id) => id !== fileId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    formData.append("boardId", id);
    formData.append("title", title);
    formData.append("content", contentHtml);
    formData.append("viewCount", 0);
    formData.append("remainingFileIds", remainingFileIds.join(","));

    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const res = await boardUpdate(formData).unwrap();
    if (res.success) {
      showAlert("게시글 수정 성공! 게시판 목록으로 이동합니다.", ()=> navigate("/board/list.do"));
      
    } else {
      showAlert("게시글 수정 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    showConfirm('정말 삭제하시겠습니까?',async ()=>
      { 
        const res = await boardDelete({ boardId: id }).unwrap();
        if (res.success) {
          showAlert("게시글 삭제 성공! 게시판 목록으로 이동합니다.", () => navigate("/board/list.do"));
        } else {
          showAlert("게시글 삭제 실패했습니다.");
        }
     }
   );

   
  };

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor value={editorValue} setValue={setEditorValue} ref={editorRef} max={2000} />
        </Box>
        {existingFiles && (
        <Box mb={3}>
          <Typography gutterBottom>기존 파일</Typography>
          <List>
            {existingFiles.map((file) => (
              remainingFileIds.includes(file.fileId) && (
                <ListItem
                  key={file.fileId}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveExistingFile(file.fileId)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <a href={`${process.env.REACT_APP_API_BASE_URL}/api/file/down.do?fileId=${file.fileId}`} target="_blank" rel="noopener noreferrer">
                        {file.fileName}
                      </a>
                    }
                  />
                </ListItem>
              )
            ))}
          </List>
        </Box>
        )}
        <Box mb={3}>
          <Typography gutterBottom>파일 업로드</Typography>
          <Paper variant="outlined" sx={{ p: 2, borderStyle: 'dashed', cursor: 'pointer' }} {...getRootProps()}>
            <input {...getInputProps()} />
            <Typography>파일을 이곳에 드래그하거나 클릭하여 업로드하세요.</Typography>
          </Paper>
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveUploadedFile(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box display="flex" gap={1} mt={2}>
          {user?.userId === board?.createId && (
            <>
            <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            >
              수정
            </Button>
            <Button 
            variant="outlined" 
            color="error" 
            onClick={handleDelete}
            >
              삭제
            </Button>
            </>
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

export default BoardUpdate;