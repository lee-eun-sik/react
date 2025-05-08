import { useNavigate } from 'react-router-dom';
import React from "react";

import { useSelector } from 'react-redux';
//import { setUser } from './f/user/userSlice';

const Ex1 = (props) => {// 구조 분해 할당 넣어줌 props.과 같다.

    const navigate = useNavigate();
    //const dispatch = useDispatch();
    //전역값넣어줌
    //dispatch(setUser({name:"이은식", age:25}));
    //전역값 꺼내옴
    const user = useSelector((state) => state.user.user);

    return (
        <>
            {props.ex1} : {props.ex2}

            <button onClick={() => navigate('/admin/ex2')}>ex2</button>
            <br/>
            {user?.username} : {user?.userId}
        </>
    );
}

export default Ex1;