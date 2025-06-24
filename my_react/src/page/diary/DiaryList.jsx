import { useDiaryListQuery } from "../../features/diary/diaryApi";
import { Box, Typography, Button, CardMedia } from '@mui/material';
import React, { useState, useEffect, useRef, } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import pet from '../../image/animalFootprintWhite.png';
import plant from '../../image/plantWhite.png';
import add from '../../image/add.png'
import '../../css/toggleSwitch.css';
import '../../css/diaryList.css';
import petthumbnail from '../../image/animalDiary.png';
import plantthumbnail from '../../image/plantDiary.png';

const DiaryList = () => {
    const [diaryType, setDiaryType] = useState({ diaryType: 'N01' })
    const createId = useSelector((state) => state.user.usersId);
    const typeRef = useRef(null);
    const user = useSelector((state) => state.user.user);


    const { data, isLoading, refetch } = useDiaryListQuery({
        diaryType: diaryType.diaryType,
        createId:user.usersId
    });

    const navigate = useNavigate();

    useEffect(() => {
        refetch();
    }, [diaryType, refetch]);

    const [isOn, setIsOn] = useState(true);
    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        setDiaryType({ diaryType: newState ? "N01" : "N02" });
        //true=동물=N01
        //false=식물=N02
    };


    return (
        <>
        
            <Box sx={{ maxWidth: 360, width: "100%", mx: "auto" }}>
                <Box className="diary-top-section">
                    <Typography variant="h4" sx={{ml: '8px'}}>
                        일기
                    </Typography>
                    <Box className='diary-top-section-button'>
                        <Button onClick={() => navigate(`/diary/create.do?diaryType=${diaryType.diaryType}`)} className="diary-add-button"
                            sx={{ p: 0, width: '38px', width: '38px', minWidth: '38px' }}>
                            <img src={add} alt="" className="diary-add"></img>
                        </Button>
                        <div className={`toggle-container ${isOn ? 'on' : ''}`} onClick={handleToggle}>
                            <div className="toggle-circle" />
                            {<img src={isOn ? pet : plant} alt="toggle icon" className={`toggle-img ${isOn ? 'pet' : 'plant'}`} />}
                        </div>
                    </Box>
                </Box>
                <Box sx={{ maxWidth: 800 }}>
                    {data?.data?.list?.map((item) => (
                        <Box key={item.diaryId} className="diary-list" onClick={() => navigate(`/diary/view.do?id=${item.diaryId}`)}>
                            {/* 썸네일 */}
                            <CardMedia
                                component="img"
                                image={item.thumbnail
                                    ? `${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${item.thumbnail}`
                                    : (diaryType.diaryType === 'N01' ? petthumbnail : plantthumbnail) // 기본 이미지로 대체
                                }
                                alt={item.diaryTitle}
                                sx={{height:'50px', width:'50px', minHeight:'50px', minWidth:'50px', m:1}}
                            />

                            <Box className="diary-word" key={item.diaryId}>
                                <Typography noWrap className="diary-title" sx={{ fontSize: '18px' }}>
                                    {item.diaryTitle}
                                </Typography>
                                <Typography noWrap className="diary-date" sx={{ fontSize: '12px' }}>
                                    {item.diaryDate?.substring(0, 10)}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

            </Box>
        </>
    );
};
export default DiaryList