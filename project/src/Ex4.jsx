import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Ex4 = () => {
    const [time, setTime] = useState(0);
    const navigate = useNavigate();

    console.log("밖 time", time);

    useEffect(() => {
        console.log("안 time", time);

        // 타이머 설정
        const timer = setInterval(() => {
            setTime(t => Number(t) + 1);
        }, 1000);

        // 언마운트 시 타이머 제거
        return () => clearInterval(timer);

    }, [time]); // time 값이 바뀔 때마다 이 효과 실행

    return (
        <>
            시간 : {time} <br />
            <input 
                type='text' 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
            />
            <button onClick={() => navigate('/ex1')}>ex1</button>
        </>
    );
};

export default Ex4;