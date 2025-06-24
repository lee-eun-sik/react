// src/components/toggle/ToggleCombo.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import pet from '../../image/animalFootprintWhite.png'; // 동물 아이콘 경로
import plant from '../../image/plantWhite.png'; // 식물 아이콘 경로
import '../../css/writeList.css'; // 토글 버튼 스타일 (기존 writeList.css 활용)

const ToggleCombo = ({ onToggleChange, defaultValue }) => {
    // 토글 버튼 상태를 관리하는 상태 (true: 동물(N01), false: 식물(N02))
    const [isOn, setIsOn] = useState(true);

    // defaultValue prop이 변경될 때 isOn 상태를 업데이트합니다.
    useEffect(() => {
        if (defaultValue === 'N01') {
            setIsOn(true);
        } else if (defaultValue === 'N02') {
            setIsOn(false);
        }
    }, [defaultValue]);

    const handleToggle = () => {
        const newState = !isOn; // 현재 상태를 반전
        setIsOn(newState); // 토글 상태 업데이트

        // 부모 컴포넌트로 변경된 writingSortation 값을 전달
        // true이면 'N01'(동물), false이면 'N02'(식물)로 설정
        onToggleChange(newState ? "N01" : "N02");
    };

    return (
        <Box className='write-top-section-button'>
            {/* 동물/식물 토글 버튼 */}
            <div className={`toggle-container ${isOn ? 'on' : ''}`} onClick={handleToggle}>
                <div className="toggle-circle" /> {/* 토글 버튼의 원형 부분 */}
                {<img src={isOn ? pet : plant} alt="toggle icon" className={`toggle-img ${isOn ? 'pet' : 'plant'}`} />}
            </div>
        </Box>
    );
};

export default ToggleCombo;