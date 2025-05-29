import React, { useState } from 'react';
// MUI 컴포넌트 불러오기
import {
  Box,             // 레이아웃 용도 div 역할, 스타일 쉽게 적용 가능
  Typography,      // 텍스트 요소, 폰트 스타일 쉽게 지정
  InputBase,       // 텍스트 입력 필드, 기본 스타일이 없는 인풋
  Button,          // 버튼 컴포넌트
  Radio, RadioGroup, FormControlLabel, // 라디오 버튼 관련 컴포넌트
  Avatar,          // 원형 이미지(프로필 등) 표시
  IconButton       // 아이콘 버튼, 클릭 영역이 아이콘 크기만큼 작음
} from '@mui/material';

// Redux Toolkit Query에서 만든 반려동물 등록 API 호출 훅
import { usePet_Form_UpdateMutation } from '../../features/pet/petApi';

// 커스텀 알림 다이얼로그 훅 (예: alert 같은 모달창 띄우기)
import { useCmDialog } from '../../cm/CmDialogUtil';

// react-router-dom의 네비게이트 훅, 페이지 강제 이동 용도
import { useNavigate } from 'react-router-dom';

// 날짜 선택 컴포넌트와 관련 프로바이더
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale'; // 한국어 로케일


const Pet_Form_Update = () => {
  // 반려동물 등록 폼 입력값 상태
  // 초기값은 빈 문자열로 세팅 (초기화 용)
  const [formData, setFormData] = useState({
    name: '',         // 동물 이름
    species: '',      // 동물 종류
    adoptionDate: '', // 입양일 (yyyy-MM-dd 형식 저장)
    birthDate: '',    // 생일 (yyyy-MM-dd 형식 저장)
    gender: '',       // 성별 ('암컷' 또는 '수컷')
    notes: ''         // 특이사항 (자유 입력 텍스트)
  });

  // 이미지 파일을 저장하는 상태 (File 객체)
  const [imageFile, setImageFile] = useState(null);

  // RTK Query에서 제공하는 반려동물 등록 API mutation 훅
  // 호출하면 Promise 반환 (unwrap() 사용해 결과 직접 받음)
  const [updatePet] = usePet_Form_UpdateMutation();

  // 커스텀 알림 다이얼로그 훅 (간단히 alert 띄우는 용도)
  const cmDialog = useCmDialog();

  // 페이지 강제 이동을 위한 훅 (등록 성공 후 리스트로 이동)
  const navigate = useNavigate();

  // 일반 텍스트, 라디오 등의 onChange 핸들러 함수
  // e.target.name: 변경된 input name, e.target.value: 새 값
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 기존 formData 복사 후 변경된 필드만 덮어쓰기
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 입력(이미지 업로드) 변경 이벤트 핸들러
  const handleImageChange = (e) => {
    // 선택된 파일이 있을 때만 상태에 저장
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 폼 제출 이벤트 핸들러
  // 기본 제출 이벤트 막고 직접 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성 (이미지 + 텍스트 필드 혼합 전송 가능)
    const data = new FormData();

    // 이미지 파일 있으면 'profileImage' 키로 추가 (서버에서 받을 키 이름)
    if (imageFile) data.append('profileImage', imageFile);

    // formData 객체의 모든 key-value를 FormData에 추가
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      // API 호출, unwrap()으로 실제 응답/에러를 받음
      await updatePet(data).unwrap();

      // 성공 알림 띄우기
      cmDialog.alert('등록 성공!');

      // 등록 후 반려동물 리스트 페이지로 이동
      navigate('/pet-list');
    } catch (err) {
      // 에러 메시지 있으면 보여주고 없으면 기본 메시지
      cmDialog.alert('등록 실패: ' + (err?.data?.message || '오류가 발생했습니다.'));
    }
  };

  // 반복되는 텍스트 입력 폼 행 컴포넌트
  // label: 표시할 텍스트, name: formData 필드명
  // multiline: 여러 줄 입력 여부, 기본은 단일 라인
  // type: input 타입 (text, number 등)
  const FormRow = ({ label, name, type = 'text', multiline = false }) => (
    <Box
      sx={{
        display: 'flex',
        // multiline이면 라벨 위, 아니면 라벨 옆 배치
        flexDirection: multiline ? 'column' : 'row',
        // multiline이면 라벨 왼쪽 정렬, 아니면 수직 중앙 정렬
        alignItems: multiline ? 'flex-start' : 'center',
        mb: 2, // 아래쪽 마진(간격)
      }}
    >
      {/* 라벨 텍스트 */}
      <Typography
        sx={{
          width: multiline ? '100%' : '90px', // multiline이면 전체 너비
          fontSize: 14,
          fontWeight: 500,
          mb: multiline ? 1 : 0, // multiline일 때 밑 여백
        }}
      >
        {label}
      </Typography>

      {/* 입력 필드 */}
      <InputBase
        name={name}                   // 입력 name 지정
        value={formData[name]}        // formData에서 값 읽기
        onChange={handleChange}       // 값 변경 시 handleChange 호출
        type={type}                   // input 타입 지정
        placeholder={`${label} 입력`}  // 플레이스홀더 텍스트
        multiline={multiline}         // 멀티라인 여부
        rows={multiline ? 3 : 1}      // 멀티라인 행 개수 지정
        sx={{
          flex: 1,                    // 남은 공간 꽉 채우기
          backgroundColor: '#E0E0E0', // 연한 회색 배경
          borderRadius: '20px',       // 둥근 모서리
          px: 2,                     // 좌우 padding
          py: multiline ? 1.5 : 0.8, // 상하 padding (멀티라인은 좀 더 넓게)
          fontWeight: 'bold',
          textAlign: 'center',        // 글자 가운데 정렬
          width: '100%',
        }}
      />
    </Box>
  );

  // 날짜 입력 폼 행 컴포넌트 (MUI DatePicker 사용)
  const DateInputRow = ({ label, name }) => {
    // 날짜 선택 시 호출되는 함수, date는 Date 객체 또는 null
    const handleDateChange = (date) => {
      // 선택한 날짜를 ISO 문자열(yyyy-MM-dd)로 변환해 상태 저장
      const formatted = date?.toISOString().split('T')[0] || '';
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {/* 라벨 */}
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>
          {label}
        </Typography>

        {/* 날짜 선택 컴포넌트는 LocalizationProvider로 감싸야 함 */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <DatePicker
            value={formData[name] ? new Date(formData[name]) : null} // DatePicker에 Date 객체 전달
            onChange={handleDateChange}      // 날짜 변경 시 호출
            inputFormat="yyyy.MM.dd"          // 입력 포맷 지정
            enableAccessibleFieldDOMStructure={false} // 접근성 관련 옵션

            // TextField 관련 스타일 및 옵션
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: {
                  disableUnderline: true,    // 밑줄 제거
                },
                placeholder: 'YYYY.MM.DD',
                sx: {
                  flex: 1,
                  backgroundColor: '#E0E0E0',
                  borderRadius: '13px',
                  px: 2,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  input: {
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }
                }
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    );
  };

  return (
    // 최상위 박스: form 역할 및 스타일 적용
    <Box
      sx={{
        width: '100vw',             // 화면 전체 너비
        height: '100vh',            // 화면 전체 높이
        maxWidth: 360,              // 최대 너비 360px 제한 (모바일 최적화)
        margin: '0 auto',           // 수평 중앙 정렬
        overflowY: 'auto',          // 세로 스크롤 가능
        backgroundColor: '#fff',    // 흰색 배경
        p: 2,                      // padding 16px (theme.spacing(2))
        boxSizing: 'border-box'     // padding 포함한 크기 계산
      }}
      component="form"
      onSubmit={handleSubmit}       // 폼 제출 이벤트 핸들러 연결
    >
      {/* 프로필 이미지 및 업로드 버튼 영역 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',   // 세로 배치
          alignItems: 'center',      // 가로 중앙 정렬
          mb: 2,                     // 아래 마진
          position: 'relative'       // IconButton 위치 절대 위치 지정 위해 필요
        }}
      >
        {/* 선택한 이미지 미리보기 아바타 (없으면 빈) */}
        <Avatar
          src={imageFile ? URL.createObjectURL(imageFile) : ''}
          sx={{ width: 100, height: 100 }}
        />
        {/* 이미지 업로드 아이콘 버튼 (Avatar 아래 오른쪽 중앙 위치) */}
        <IconButton
          component="label"         // 내부의 input[type=file] 연결 역할 (클릭시 파일 선택창 열림)
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 'calc(50% - 50px)',  // Avatar 정중앙 하단에 위치시키기 위한 계산
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: 1,
            p: 0,
          }}
        >
          {/* 아이콘 이미지 */}
          <Box
            component="img"
            src="/icons/image-edit.png"
            alt="사진 업로드"
            sx={{ width: 30, height: 30 }}
          />
          {/* 실제 파일 선택 input, 화면에 보이지 않음 */}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </IconButton>
      </Box>

      {/* 동물 이름 입력 */}
      <FormRow label="동물 이름" name="name" />

      {/* 동물 종류 입력 */}
      <FormRow label="동물 종류" name="species" />

      {/* 입양일 입력 (날짜 선택) */}
      <DateInputRow label="동물 입양일" name="adoptionDate" />

      {/* 생일 입력 (날짜 선택) */}
      <DateInputRow label="생일" name="birthDate" />

      {/* 성별 라디오 그룹 (암컷 / 수컷) */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>성별</Typography>
        <RadioGroup
          row                        // 가로 배치
          name="gender"
          onChange={handleChange}    // 선택 변경 시 상태 업데이트
          value={formData.gender}    // 현재 선택된 값 반영
        >
          {/* 각각 라디오 버튼과 라벨 */}
          <FormControlLabel value="암컷" control={<Radio size="small" />} label="암컷" />
          <FormControlLabel value="수컷" control={<Radio size="small" />} label="수컷" />
        </RadioGroup>
      </Box>

      {/* 특이사항 멀티라인 입력 */}
      <FormRow label="특이사항" name="notes" multiline />

      {/* 제출 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          type="submit"               // 폼 제출 버튼임을 명시
          variant="contained"         // 채워진 스타일 버튼
          sx={{
            backgroundColor: '88AE97',  // 진한 올리브 그린 색상
            borderRadius: '20px',        // 둥근 모서리
            px: 4,                       // 좌우 패딩 (약 32px)
            py: 1,                       // 상하 패딩 (약 8px)
            fontSize: 14
          }}
        >
          수정
        </Button>
        <Button
          type="submit"               // 폼 제출 버튼임을 명시
          variant="contained"         // 채워진 스타일 버튼
          sx={{
            backgroundColor: '88AE97',  // 진한 올리브 그린 색상
            borderRadius: '20px',        // 둥근 모서리
            px: 4,                       // 좌우 패딩 (약 32px)
            py: 1,                       // 상하 패딩 (약 8px)
            fontSize: 14
          }}
        >
          삭제
        </Button>
      </Box>
    </Box>
  );
};

export default Pet_Form_Update;