import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserDeleteMutation } from './f/user/userApi';
import { setUser } from './f/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.user);
    const [userId] = useState(currentUser?.userId || "");
    const [name, setName] = useState(currentUser?.username || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState(""); // 사용자 입력용

    const passwordRef = useRef(null);

    const [deleteUser] = useUserDeleteMutation();

    const handleDelete = async () => {
        try {
            if (!password) {
                alert("비밀번호를 입력해주세요.");
                passwordRef.current.focus();
                return;
            }

            const response = await deleteUser({
                userId,
                username: name,
                email,
                password,
                updateId: userId
            }).unwrap();

            if (response.success) {
                alert("회원정보가 성공적으로 탈퇴되었습니다.");
                dispatch(setUser(null)); // 로그인 상태 초기화
                navigate("/");
            } else {
                alert("회원정보 탈퇴 실패");
            }
        } catch (error) {
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
            <h2>회원정보 탈퇴</h2>
            *아이디 <input type="text" value={userId} disabled /><br />
            *이름 <input type="text" value={name} disabled /><br />
            *이메일 <input type="email" value={email} disabled /><br />
            *비밀번호 <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                placeholder="비밀번호를 입력하세요"
            /><br />
            <button onClick={handleDelete}>회원 탈퇴</button>
        </>
    );
};

export default Delete;