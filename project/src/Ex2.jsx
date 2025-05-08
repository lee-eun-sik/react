
import { useNavigate } from 'react-router-dom';
import React from "react";


import { useSelector } from 'react-redux';

const Ex2 = ({isLogin, name }) => {

    const navigate = useNavigate();
    //전역값 꺼내옴
    const user = useSelector((state) => state.user.user);
    return (
 <>
    <p>
    {
        isLogin? (
            <p>{name}</p>
        ):(
            "로그인을 해주세요"
        )    
    }
    </p>
    {user?.name}: {user?.age}<br/>
    <button onClick={() => navigate('/ex3')} >ex3</button>
    </>

    
    );
}

export default Ex2;