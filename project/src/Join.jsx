import { useDispatch } from "react-redux";
import { useRegisterMutation } from "./f/user/userApi";
import { useNavigate } from "react-router-dom";
import { setUser } from './f/user/userSlice';
import React, { useState, useRef } from 'react';

const Join = () => {
    const [userId, setUserId] = useState("");
    const userIdRef = useRef(null);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(null);

    const [password_confirm, setPassword_confirm] = useState("");
    const password_confirmRef = useRef(null);

    const [name, setName] = useState("");
    const nameRef = useRef(null);

    const [gender, setGender] = useState("");
    const genderRef = useRef(null);

    const [phonenumber, setPhonenumber] = useState("");
    const phonenumberRef = useRef(null);

    const [email, setEmail] = useState("");
    const emailRef = useRef(null);

    const [birthday, setBirthday] = useState("");
    const birthdayRef = useRef(null);

    const [register] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegisterClick = async () => {
        try {
            if (!userId) {
                alert("아이디를 입력해주세요.");
                userIdRef.current?.focus();
                return;
            }

            if (!password) {
                alert("비밀번호를 입력해주세요.");
                passwordRef.current?.focus();
                return;
            }
            if (!password_confirm) {
                alert("비밀번호 확인을 입력해주세요.");
                password_confirmRef.current?.focus();
                return;
            }
            if (!name) {
                alert("이름을 입력해주세요.");
                nameRef.current?.focus();
                return;
            }
            if (!gender) {
                alert("성별을 입력해주세요.");
                genderRef.current?.focus();
                return;
            }
            if (!phonenumber) {
                alert("전화번호를 입력해주세요.");
                phonenumberRef.current?.focus();
                return;
            }
            if (!email) {
                alert("이메일을 입력해주세요.");
                emailRef.current?.focus();
                return;
            }
            if (!birthday) {
                alert("생년월일을 입력해주세요.");
                birthdayRef.current?.focus();
                return;
            }

            const response = await register({
                userId,
                password,
                password_confirm,
                name,
                gender,
                phonenumber,
                email,
                birthday
            }).unwrap();

            if (response.success) {
                alert("회원가입 성공! 홈으로 이동합니다.");
                dispatch(setUser(response.data));
                navigate("/");
            } else {
                alert("회원가입 실패");
            }
        } catch (error) {
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            *아이디 <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} ref={userIdRef} /><br />
            *비밀번호 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} ref={passwordRef} /><br />
            *비밀번호 확인 <input type="password" value={password_confirm} onChange={(e) => setPassword_confirm(e.target.value)} ref={password_confirmRef} /><br />
            *이름 <input type="text" value={name} onChange={(e) => setName(e.target.value)} ref={nameRef} /><br />
            *성별 <input type="radio" name="gender" value="남" onChange={(e) => setGender(e.target.value)} /> 남
                  <input type="radio" name="gender" value="여" onChange={(e) => setGender(e.target.value)} /> 여<br />
            *전화번호 <input type="tel" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} ref={phonenumberRef} /><br />
            *이메일 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} ref={emailRef} /><br />
            *생년월일 <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} ref={birthdayRef} /><br />
            <button type='button' onClick={handleRegisterClick}>가입하기</button>
        </>
    );
};

export default Join;