import React, { useState, useEffect, useRef } from 'react';
import { useUserUpdateMutation, useViewQuery } from '../../features/user/userApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Avatar, IconButton } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import back from '../../image/backWhite.png';
import Plus from '../../image/imagePlus.png';
import Delete from '../../image/imageDelete.png'

const LabeledTextFieldRow = ({ label, value, onChange, inputRef, disabled = false, type = 'text' }) => {
  const commonContentWrapperStyle = {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '20px',
    minHeight: '30px',
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(217, 217, 217, 0.21)",
        paddingX: "10px",
        paddingY: "5px",
        borderRadius: '20px',
        width: '90%',
      }}
    >
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{
          flexShrink: 0,
          mr: 2,
          minWidth: '90px',
        }}
      >
        {label}
      </Typography>

      {disabled ? (
        <Typography
          variant="body1"
          sx={{
            ...commonContentWrapperStyle,
            color: 'black',
            opacity: 1,
            boxShadow: 'none',
            padding: '0 12px',
            justifyContent: 'flex-end'
          }}
        >
          {value}
        </Typography>
      ) : (
        <Box
          sx={{
            ...commonContentWrapperStyle,
            backgroundColor: 'white',
            '&:focus-within': {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
            padding: '0 12px',
          }}
        >
          <Box
            component="input"
            ref={inputRef}
            value={value}
            onChange={onChange}
            type={type}
            sx={{
              flexGrow: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              padding: '0',
              height: '100%',
              fontSize: '1rem',
              color: 'rgba(0, 0, 0, 0.87)',
              cursor: 'text',
              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
              opacity: 1,
              '&::placeholder': {
                fontSize: '10px',  // 원하는 placeholder 크기
                color: '#888',
                textAlign:'center'
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

const UserUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const [usersConfirmPassword, setUsersConfirmPassword] = useState('');
  const [usersName, setUsersName] = useState('');
  const [usersEmail, setUsersEmail] = useState('');
  const [usersFileId, setUsersFileId] = useState(0);

  // 단일 프로필 이미지 관리를 위한 상태:
  const [selectedNewFile, setSelectedNewFile] = useState(null); // 사용자가 새로 선택한 단일 File 객체
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // 프로필 이미지 미리보기를 위한 URL

  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const usersConfirmPasswordRef = useRef();
  const usersNameRef = useRef();
  const usersEmailRef = useRef();
  const usersFileInputRef = useRef();

  const { showAlert } = useCmDialog();

  const [userUpdate] = useUserUpdateMutation();
  const { data, isSuccess } = useViewQuery({ usersId: user?.usersId });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      setUsersId(info.usersId);
      setUsersName(info.usersName);
      setUsersEmail(info.usersEmail);
      if (info.usersFileId && info.usersFileId !== 0) {
        setImagePreviewUrl(`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${info.usersFileId}`);
      } else {
        setImagePreviewUrl(null);
      }
    }
  }, [isSuccess, data]);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedNewFile(file); // 실제 파일 객체 저장
      setImagePreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    } else {
      // 파일 선택 취소 시
      setSelectedNewFile(null);
      // 기존 usersFileId가 있다면 기존 이미지로 복원, 없으면 null
      if (usersFileId && usersFileId !== 0) {
        setImagePreviewUrl(`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${usersFileId}`);
      } else {
        setImagePreviewUrl(null);
      }
    }
  };

  // 프로필 이미지 제거 핸들러
  const handleRemoveProfileImage = () => {
    setSelectedNewFile(null); // 새로 선택된 파일 제거
    setUsersFileId(0); // 기존 파일 ID를 0으로 설정하여 백엔드에 삭제 요청 신호
    setImagePreviewUrl(null); // 미리보기 이미지 제거
    // 파일 input의 값도 초기화하여 동일한 파일을 다시 선택할 수 있도록 함
    if (usersFileInputRef.current) {
      usersFileInputRef.current.value = '';
    }
  };

  const handleUpdateClick = async () => {
    if (CmUtil.isEmpty(usersId)) {
      showAlert('아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersName)) {
      showAlert('이름을 입력해주세요.');
      usersNameRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersEmail)) {
      showAlert('이메일을 입력해주세요.');
      usersEmailRef.current?.focus();
      return;
    }

    if (!CmUtil.isEmail(usersEmail)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      usersEmailRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(usersPassword)) {
      showAlert('비밀번호를 입력해주세요.');
      usersPasswordRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(usersConfirmPassword)) {
      showAlert('비밀번호 확인을 입력해주세요.');
      usersConfirmPasswordRef.current?.focus();
      return;
    }
    if (usersPassword !== usersConfirmPassword) {
      showAlert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      usersPasswordRef.current?.focus();
      return;
    }
    if (!CmUtil.isStrongPassword(usersPassword)) {
      showAlert('비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('usersId', usersId);
    formData.append('usersPassword', usersPassword);
    formData.append('usersName', usersName);
    formData.append('usersEmail', usersEmail);
    if (selectedNewFile) {
      formData.append('files', selectedNewFile);
    } else if (usersFileId === 0 && data?.data?.usersFileId !== 0) {
      formData.append('remainingFileIds', '0');
    }
    try {
      const response = await userUpdate(formData).unwrap();
      if (response.success) {
        showAlert("회원정보 수정에 성공 하셨습니다. 홈화면으로 이동합니다.", () => navigate('/'));
      } else {
        showAlert(response.message || '회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert(error.data?.message || '회원정보 수정에 실패했습니다. 서버 오류 또는 네트워크 문제.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '640px',
        width: '100%',
        margin: '0 auto'
      }}
    >
      {/* 상단 배경색 영역 */}
      <Box
        sx={{
          width: '100%',
          height: '140px',
          backgroundColor: '#385C4F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* 헤더 섹션: 뒤로가기 버튼과 중앙 정렬된 마이페이지 제목 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            mb: 3,
            position: 'absolute',
            top: 10,
            justifyContent: 'space-between',
          }}
        >
          {/* 뒤로가기 버튼 - 왼쪽 끝 */}
          <Button
            onClick={() => navigate(-1)}
            sx={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "10px",
              height: "30px",
              minWidth: "0",
              width: "30px",
              marginLeft: "10px",
              "&:hover": {
                backgroundColor: "#363636",
              },
            }}
          >
            {/* img 태그에 style 속성을 직접 적용 */}
            <img src={back} alt="뒤로가기" style={{ height: "20px" }}></img>
          </Button>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 0, color: "white" , marginLeft: '-10px'}}>
              마이페이지
            </Typography>
          </Box>
          <Box sx={{ width: '30px', flexShrink: 0 }} />
        </Box>

        {/* 프로필 이미지 섹션 */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Avatar
            src={imagePreviewUrl}
            alt="Profile Preview"
            sx={{ width: 100, height: 100, mt: 10 }}
          />
          <input
            type="file"
            hidden
            ref={usersFileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: -10,
              right: -15,
              color: 'white',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => usersFileInputRef.current.click()}
          >
            <img alt="" src={Plus} style={{ width: '30px' }} />
          </IconButton>
          {imagePreviewUrl && (
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 15,
                right: -23,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={handleRemoveProfileImage}
            >

            </IconButton>
          )}
        </Box>
      </Box>
      {/* TextField들을 감싸는 Box에 gap을 적용하여 간격 제어 */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: "center",
          gap: '30px',
          mt: 9
        }}>
        <LabeledTextFieldRow
          label="닉네임"
          value={usersName}
          inputRef={usersNameRef}
          onChange={(e) => setUsersName(e.target.value)}
        />

        <LabeledTextFieldRow
          label="아이디"
          disabled
          value={usersId}
        />

        <LabeledTextFieldRow
          label="이메일"
          disabled
          value={usersEmail}
        />
        <Typography
        sx={{
          position:"absolute",
          marginTop:24,
          marginRight:-20,
          fontSize:13,
        }}>영문,숫자,특수문자 조합 8자 이상</Typography>
        <LabeledTextFieldRow
          label="비밀번호"
          type="password"
          value={usersPassword}
          inputRef={usersPasswordRef}
          onChange={(e) => setUsersPassword(e.target.value)}


        />


        <LabeledTextFieldRow
          label="비밀번호 확인"
          type="password"
          value={usersConfirmPassword}
          inputRef={usersConfirmPasswordRef}
          onChange={(e) => setUsersConfirmPassword(e.target.value)}
        />
      </Box>
      <Button
        onClick={handleUpdateClick}
        variant="contained"
        sx={{
          marginTop: 4,
          backgroundColor: '#385C4F',
          borderRadius: '15px',
          width: "150px"
        }}
      >
        저장
      </Button>
    </Box>
  );
};

export default UserUpdate
