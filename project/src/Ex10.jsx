import { useDispatch } from "react-redux";
import { useLoginMutation } from "./f/user/userApi";
import { useNavigate } from "react-router-dom";
import { setUser } from "./f/user/userSlice";
import React, { useState, useRef } from "react";

const Ex10 = () => {
    const [userId, setUserId] = useState("");
    const userIdRef = useRef(null);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(null);

    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        try {
            if (!userId) {
                alert("ID를 입력해주세요.");
                userIdRef.current?.focus();
                return;
            }

            if (!password) {
                alert("Password를 입력해주세요.");
                passwordRef.current?.focus();
                return;
            }

            const response = await login({ userId, password }).unwrap();
            if (response.success) {
                alert("로그인 성공! 홈으로 이동합니다.");
                dispatch(setUser(response.data));
                navigate("/");
            } else {
                alert("로그인 실패: 아이디와 비밀번호를 확인해주세요.");
            }
        } catch (error) {
            alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
            ID: <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                ref={userIdRef}
            /><br />
            비밀번호: <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
            /><br />
            <button type="button" onClick={handleLoginClick}>
                로그인
            </button>
        </>
    );
};

export default Ex10;