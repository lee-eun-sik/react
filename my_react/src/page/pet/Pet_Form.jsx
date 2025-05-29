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
import { usePet_FormMutation } from '../../features/pet/petApi';

// 커스텀 알림 다이얼로그 훅 (예: alert 같은 모달창 띄우기)
import { useCmDialog } from '../../cm/CmDialogUtil';

// react-router-dom의 네비게이트 훅, 페이지 강제 이동 용도
import { useNavigate } from 'react-router-dom';

// 날짜 선택 컴포넌트와 관련 프로바이더
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale'; // 한국어 로케일




const PetForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    adoptionDate: '',
    birthDate: '',
    gender: '',
    notes: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [createPet] = usePet_FormMutation();
  const cmDialog = useCmDialog();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append('profileImage', imageFile);
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      await createPet(data).unwrap();
      cmDialog.alert('등록 성공!');
      navigate('/pet-list');
    } catch (err) {
      cmDialog.alert('등록 실패: ' + (err?.data?.message || '오류가 발생했습니다.'));
    }
  };

  const FormRow = ({ label, name, formData, handleChange, type = 'text', multiline = false }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: multiline ? 'column' : 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        mb: 2,
        width: '100%',
      }}
    >
      <Typography
        sx={{
          width: multiline ? '100%' : '90px',
          fontSize: 14,
          fontWeight: 500,
          mb: multiline ? 1 : 0,
        }}
      >
        {label}
      </Typography>

      <InputBase
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        type={type}
        placeholder={`${label} 입력`}
        multiline={multiline}
        rows={multiline ? 3 : 1}
        sx={{
          flex: 1,
          minWidth: 0,
          backgroundColor: '#E0E0E0',
          borderRadius: '20px',
          px: 2,
          py: multiline ? 1.5 : 0.8,
          fontWeight: 'bold',
          textAlign: 'left',
          width: '100%',
        }}
      />
    </Box>
  );

  const DateInputRow = ({ label, name }) => {
    const handleDateChange = (date) => {
      const formatted = date?.toISOString().split('T')[0] || '';
      setFormData(prev => ({ ...prev, [name]: formatted }));
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>{label}</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <DatePicker
            value={formData[name] ? new Date(formData[name]) : null}
            onChange={handleDateChange}
            inputFormat="yyyy.MM.dd"
            enableAccessibleFieldDOMStructure={false}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
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
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        maxWidth: 360,
        margin: '0 auto',
        overflowY: 'auto',
        backgroundColor: '#fff',
        p: 2,
        boxSizing: 'border-box'
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 2,
          position: 'relative'
        }}
      >
        <Avatar
          src={imageFile ? URL.createObjectURL(imageFile) : ''}
          sx={{ width: 100, height: 100 }}
        />
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 'calc(50% - 50px)',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: 1,
            p: 0,
          }}
        >
          <Box
            component="img"
            src="/icons/image-edit.png"
            alt="사진 업로드"
            sx={{ width: 30, height: 30 }}
          />
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </IconButton>
      </Box>

      <FormRow label="동물 이름" name="name" formData={formData} handleChange={handleChange} />
      <FormRow label="동물 종류" name="species" formData={formData} handleChange={handleChange} />
      <DateInputRow label="동물 입양일" name="adoptionDate" />
      <DateInputRow label="생일" name="birthDate" />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>성별</Typography>
        <RadioGroup
          row
          name="gender"
          onChange={handleChange}
          value={formData.gender}
        >
          <FormControlLabel value="암컷" control={<Radio size="small" />} label="암컷" />
          <FormControlLabel value="수컷" control={<Radio size="small" />} label="수컷" />
        </RadioGroup>
      </Box>

      <FormRow
        label="특이사항"
        name="notes"
        multiline
        formData={formData}
        handleChange={handleChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#556B2F',
            borderRadius: '20px',
            px: 4,
            py: 1,
            fontSize: 14
          }}
        >
          동물 등록
        </Button>
      </Box>
    </Box>
  );
};

export default PetForm;