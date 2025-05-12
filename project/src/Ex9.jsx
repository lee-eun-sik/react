import React, { useState, useMemo, useEffect } from 'react';

const Ex9 = () => {
    console.log("Ex9 랜더링");
    const [number, setNumber] = useState(0);

    const slowSquare = useMemo(() => {
        console.log(" 무거운 계산 시작...");
        for (let i = 0; i < 2000000000; i++) {} // 일부러 느리게
        return number * number;
    }, [number]); // number가 바뀔 때만 다시 계산!

    const [time, setTime] = useState(0);
    useEffect(() => {
        console.log("안 time", time);
    }, [time]);

    return (
        <>
            <input 
                type="number" 
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
            />
            결과 : {slowSquare} <br/>

            <input 
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
            시간 : {time}<br/>
        </>
    );
}

export default Ex9;