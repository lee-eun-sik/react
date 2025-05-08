import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserUpdateMutation } from './f/user/userApi';
import { setUser } from './f/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Update = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.user); // 로그인된 사용자 정보
    const [userId] = useState(currentUser?.userId || "");
    const [name, setName] = useState(currentUser?.username || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState(""); // 새 비밀번호

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [updateUser] = useUserUpdateMutation();

    const handleUpdate = async () => {
        try {
            // Basic validation
            if (!name) {
                alert("이름을 입력해주세요.");
                nameRef.current.focus();
                return;
            }

            if (!email) {
                alert("이메일을 입력해주세요.");
                emailRef.current.focus();
                return;
            }

            if (!password) {
                alert("비밀번호를 입력해주세요.");
                passwordRef.current.focus();
                return;
            }

            // Send request to update user data
            const response = await updateUser({
                userId,
                username: name,
                email,
                password,
                updateId: userId
            }).unwrap();

            if (response.success) {
                alert("회원정보가 성공적으로 수정되었습니다.");
                dispatch(setUser(response.data)); // 수정된 유저 정보 저장
                navigate("/"); // 홈으로 이동
            } else {
                alert("회원정보 수정 실패");
            }
        } catch (error) {
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div>
            <h2>회원정보 수정</h2>
            <label>*아이디</label>
            <input type="text" value={userId} disabled /><br />
            <label>*이름</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ref={nameRef}
            /><br />
            <label>*이메일</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
            /><br />
            <label>*비밀번호</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
            /><br />
            <button onClick={handleUpdate}>정보 수정</button>
        </div>
    );
};

export default Update;