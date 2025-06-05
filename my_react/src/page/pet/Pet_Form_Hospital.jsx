import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, InputBase, Button, IconButton
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { Tabs, Tab } from '@mui/material';
import Combo from '../../page/combo/combo';
import { useLocation } from 'react-router-dom';

const FormRow = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  let backgroundColor = '#E0E0E0';
  let border = '1px solid #ccc';
  let borderRadius = '20px';
  let textDecoration = 'none';
  let fontWeight = 'normal';
  let color = 'inherit';
  let minHeight = undefined;

  if (fieldKey === 'notes') {
    backgroundColor = '#D9D9D9';
    fontWeight = 'bold';
    color = '#000';
    minHeight = 80;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:30, top: 7 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: 'center',
            fontSize: '8px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          top: 7,
          left: '20px',  
          width: '70px',
          height: '20px',
          backgroundColor,
          border,
          borderRadius,
          px: 1,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};
const FormRow1 = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  let backgroundColor = '#E0E0E0';
  let border = '1px solid #ccc';
  let borderRadius = '20px';
  let textDecoration = 'none';
  let fontWeight = 'normal';
  let color = 'inherit';
  let minHeight = undefined;

  if (fieldKey === 'notes') {
    backgroundColor = '#D9D9D9';
    fontWeight = 'bold';
    color = '#000';
    minHeight = 80;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:20, top: 5 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: 'center',
            fontSize: '14px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          left: '100px',  
          width: '142px',
          height: '30px',
          backgroundColor,
          border,
          borderRadius: '11px',
          px: 1,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};

const DateInputRow = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography
        sx={{
          width: 66, // 넉넉한 고정 너비
          fontSize: 14,
          fontWeight: 500,
          textAlign: 'center',
          mr: -1, // label과 DatePicker 사이 간격
        }}
      >
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          value={value}
          onChange={onChange}
          format="YYYY.MM.DD"
          slotProps={{
            textField: {
              variant: 'outlined',
              size: 'small',
              fullWidth: false,
              InputProps: {
                readOnly: true,
                sx: {
                
                  left: 133,
                  width: 141,
                  height: 30,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'normal',
                  pr: '12px',
                  pl: '12px',
                  '& input': {
                    textAlign: 'center',
                    padding: 0,
                  },
                },
              },
              inputProps: {
                style: {
                  textAlign: 'center',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

const Pet_Form_Hospital = () => {
  const [animalName, setAnimalName] = useState('');
  const animalNameRef = useRef();
  const location = useLocation();
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState('');
  const [animalVisitDate, setAnimalVisitDate] = useState(dayjs());
  const [imageFile, setImageFile] = useState(null);
  const [animalTreatmentMemo, setAnimalTreatmentMemo] = useState('');
  const animalTreatmentMemoRef = useRef();
  const [animalHospitalName, setAnimalHospitalName] = useState('');
  const animalHospitalNameRef = useRef();
  const [animalTreatmentType, setAnimalTreatmentType] = useState('');
  
  const [animalMedication, setAnimalMedication] = useState('');
  const animalMedicationRef = useRef();
  const { showAlert } = useCmDialog();
  const [selectedTab, setSelectedTab] = useState(0);
  
  useEffect(() => {
    // 수정 페이지에서 전달된 날짜 적용
    if (location.state?.updatedDate) {
      setAnimalAdoptionDate(location.state.updatedDate);
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (CmUtil.isEmpty(animalName)) {
      showAlert('동물 이름을 입력해주세요.');
      animalNameRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(animalHospitalName)) {
      showAlert('병원 이름을 입력해주세요.');
      animalHospitalNameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(animalMedication)) {
      showAlert('처방약을 입력해주세요.');
      animalMedicationRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append('animalTreatment/Type', animalTreatmentType);
    // TODO: submit logic
    
  };
   
  

  return (
  <Box>
    {/* 전체 폼 박스 */}
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 360, // Android 화면 폭
        height: 640,   // Android 화면 높이
        margin: '0 auto',
        overflowY: 'auto', // 스크롤 가능하게
        borderRadius: '12px',
        backgroundColor: '#fff',
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        padding: 2,
      }}
    >
      {/* 왼쪽 입력 */}
      <Box>
        <FormRow label="동물 이름" value={animalName} onChange={setAnimalName} inputRef={animalNameRef} />
        <FormRow label="날짜" value={animalAdoptionDate} onChange={setAnimalAdoptionDate} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bottom: 3,
              left: 25,
              backgroundColor: '#88AE97',
              borderRadius: '30px',
              width: 150,
              height: 20,
              px: 6,
              py: 1.5,
              fontSize: 13,
              fontWeight: 'bold',
            }}
          >
            산책하기
          </Button>
        </Box>
      </Box>

      {/* 오른쪽 이미지 */}
      <Box sx={{ position: 'relative', left: '35px', top: 8 }}>
        <Box
          sx={{
            width: 100,
            height: 76,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid white',
            backgroundColor: '#A5B1AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : '/default-dog.jpg'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            position: 'relative',
            top: -101,
            right: -80,
            backgroundColor: '#889F7F',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'normal',
            borderRadius: '55%',
            width: 40,
            height: 26,
            minWidth: 'unset',
            padding: 0,
            zIndex: 2,
            textTransform: 'none',
          }}
          component="label"
        >
          수정
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
      </Box>
    </Box>

    {/* ✅ 탭은 폼 바깥에 위치 */}
    {/* 폼 컴포넌트 아래 탭 - 간격 좁히기 */}
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: -70 }}>
        <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
            width: 360,
            minHeight: '36px',
            '& .MuiTab-root': {
                fontSize: '13px',
                color: '#777',
                fontWeight: 500,
                minHeight: '36px',
                borderBottom: '2px solid transparent',
            },
            '& .Mui-selected': {
                color: '#000',
                fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
                backgroundColor: '#000',
            },
            }}
        >
            <Tab label="병원진료" />
            <Tab label="먹이알림" />
            <Tab label="훈련/행동" />
        </Tabs>
    </Box>
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 2 }}>
      <DateInputRow label="날짜" value={animalVisitDate} onChange={setAnimalVisitDate} />
      <FormRow1 label="병원 이름" value={animalHospitalName} onChange={setAnimalHospitalName} inputRef={animalHospitalNameRef} />
      <FormRow1 label="처방약" value={animalMedication} onChange={setAnimalMedication} inputRef={animalMedicationRef} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 13 }}>
        <Typography
          sx={{
            width: 92,
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            height: 30,
          }}
        >
          진료 내용
        </Typography>
        <Combo groupId="Medical"/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          <InputBase
            value={animalTreatmentMemo}
            onChange={(e) => setAnimalTreatmentMemo(e.target.value)}
            inputRef={animalTreatmentMemoRef}
            multiline
            inputProps={{
              style: {
                padding: 0,
                paddingTop: 4,
                fontSize: 13,
              }
            }}
            sx={{
              backgroundColor: '#D9D9D9',
              borderRadius: '12px',
              px: 2,
              py: 1,
              left: 18,
              width : 314,
              minHeight: 70,
              textDecoration: 'none',
              fontWeight: 'normal',
              color: '#000',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              left: -3,
              backgroundColor: '#556B2F',
              borderRadius: '20px',
              px: 4,
              py: 1,
              fontSize: 14,
            }}
          >
            저장
          </Button>
        </Box>
    </Box>
    
  </Box>
);
};
export default Pet_Form_Hospital; 