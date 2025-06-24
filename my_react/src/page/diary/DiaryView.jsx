import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Divider,
    CardMedia
} from '@mui/material';
import { useDiaryViewQuery } from '../../features/diary/diaryApi';
import back from '../../image/back.png';
import edit from '../../image/editBlack.png';
import '../../css/diaryView.css';

const DiaryView = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const user = useSelector((state) => state.user.user)
    const { data, isLoading, error, isSuccess, refetch } = useDiaryViewQuery({ diaryId: id });
    const [diary, setDiary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            setDiary(data?.data);
        }
    }, [isSuccess, data]);
    return (

        <Box sx={{ maxWidth: '360px', mx: 'auto', display: 'flex', flexDirection: 'column' }}>
            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>
            ) : diary ? (
                <>
                    <Box className='diary-top-section'>
                        <Button
                            onClick={() => navigate(-1)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                height: '35px',
                                minWidth: '0',
                                width: '35px',
                                '&:hover': {
                                    backgroundColor: '#363636'
                                },
                                backgroundColor: 'rgba(54, 54, 54, 0.4)'

                            }}
                        >
                            <img src={back} alt="" sx={{ pl: '2px' }}></img>
                        </Button>
                        <Typography variant="h5" sx={{ ml: '28px' }}>
                            {diary.diaryTitle}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Button
                                onClick={() => navigate(`/diary/update.do?id=${diary.diaryId}`)}
                                sx={{
                                    padding: '0',
                                    display: 'flex',
                                    borderRadius: '10px',
                                    height: '30px',
                                    minWidth: '0',
                                    width: '30px',
                                    marginLeft: '43px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(194, 194, 194, 0.4)'
                                    }

                                }}
                            >
                                <img src={edit} alt="" sx={{ pl: '2px' }}></img>
                            </Button>
                            <Box display="flex" justifyContent="space-between" color="text.secondary" fontSize={14}>
                                <span>{diary.diaryDate?.substring(0, 10)}</span>
                            </Box>
                        </Box>
                        
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box>

                        {diary.postFiles && diary.postFiles.length > 0 && (
                            <>
                            <Box
                                m={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflowX: 'auto',
                                    gap: 2,
                                    padding: 1,
                                    '&::-webkit-scrollbar': {
                                        height: '1px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#ccc',
                                        borderRadius: '4px',
                                    }
                                }}
                            >
                                {diary.postFiles.map((file, index) => (
                                    <Box
                                        key={file.postFileId ?? index}
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
                                            alt={`preview-${index}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />




                                    </Box>
                                ))}
                            </Box>
                             <Divider sx={{ mb: 2 }} />
                             </>
                        )}
                        


                        <Box sx={{ minHeight: '200px', maxHeight: '500px', overflow: 'auto', textAlign: 'center' , padding:'0px 30px 30px 30px'}}>
                            {diary.diaryContent}
                        </Box>
                    </Box>
                </>
            ) : null}
        </Box>
    )
};
export default DiaryView;