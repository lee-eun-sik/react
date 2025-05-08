import React, { useRef, useState, useEffect } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import { useBoardUpdateMutation, useBoardDeleteMutation, useBoardViewQuery } from "../../features/board/boardApi";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Box, TextField, Typography, List, ListItem, ListItemText, IconButton, Paper, Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";
import { navigateTo } from "../../cm/CmNavigateUtil";

const NewBoardUpdate = () => {
    const user = useSelector((state)=>state.user.user);

    const editorRef = useRef();
    const titleRef = useRef();
    const [editor, setEditor] = useState("");
    const [title, setTitle] = useState("");

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [BoardUpdate] = useBoardUpdateMutation();
    const [BoardDelete] = useBoardDeleteMutation();
    const { data, isLoading } = useBoardViewQuery({ boardId: id});

    const [board, setBoard] = useState(null);
    const [existingFiles, setExistingFiles] = useState([]);
    const [remainingFileIds, setRemainingFileIds] = useState([]);
    useEffect(() => { //넣는 부분
        if (data?.success) {
            console.log(data.data);
            setBoard(data.data);
            setTitle(data.data.title);
            setEditor(data.data.content);
            setExistingFiles(data.data.postFiles || []);
            setRemainingFileIds(data.data.postFiles?.map(file => file.fileId) || []);
        }
    }, [data]);

    const { showAlert, showConfirm } = useCmDialog();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const contentText = editorRef.current?.getContent({ format: 'text'});
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
            showAlert("내용은 최대 2000자까지 입력할 수 있습니다.",
                () => {editorRef?.current?.focus();});
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
        })

        const res = await BoardUpdate(formData).unwrap();
        if (res.success) {
            showAlert("게시글 수정 성공! 게시판 목록으로 이동합니다.", () => navigateTo("/newBoard/list.do"));
        } else {
            showAlert("게시글 생성 실패 했습니다.");
        }
    };

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        },
        multiple: true,
        maxSize: 10 * 1024 * 1024,
    });

    const handleRemoveFile = (indexToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove) //배열,인덱스를 넘김. 같은 것을 지워줌.
        );
    };

    const handleRemoveExistingFile = (fileId) => {
        setRemainingFileIds((prevIds) => prevIds.filter((id) => id !== fileId));
    };

    const handleDelete = async () => {
        showConfirm('정말 삭제하시겠습니?', async () => 
        {
            const res = await BoardDelete({ boardId: id }).unwrap();
            if (res.success) {
                showAlert("게시글 삭제 성공! 게시판 목록으로 이동합니다.", () => navigate("/newBoard/list.do"));
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
        <>
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        게시글 수정
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box mb={3}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="제목"
                                variant="outlined"
                                inputProps={{ maxLength: 100 }}
                                inputRef={titleRef}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />    
                        </Box>
        
                        <Box mb={3}>
                            <Typography gutterBottom>내용</Typography>
                            <CmTinyMCEEditor
                                value={editor}
                                setValue={setEditor}
                                ref={editorRef}
                                max={2000}
                            />
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
                                                        <DeleteIcon color="error"/>
                                                    </IconButton>
                                                }
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <a
                                                            href={`${process.env.REACT_APP_API_BASE_URL}/api/file/down.do?fileId=${file.fileId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer">
                                                                {file.fileName}
                                                            </a>
                                                        }
                                                    />    
                                            </ListItem>
                                        )
                                        ))
                                    }
                                </List>
                            </Box>    
                        )}
        
                        <Box mb={3}>
                            <Typography gutterBottom>파일 업로드 </Typography>
        
                            <Paper variant="outlined"
                            sx={{ p: 3, textAlign: "center", BorderStyle: "dashed"}}
                            {...getRootProps()}
                        >
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
                                            <DeleteIcon color="error"/>
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
                                onClick={() => navigateTo('/newBoard/list.do')}
                            >
                                목록    
                            </Button>    
                    </Box>
                </Box>
             </Box>
        </>
    );
}

export default NewBoardUpdate;