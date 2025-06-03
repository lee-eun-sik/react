import React, { useState, useRef } from 'react';
import {
  Box, Typography, InputBase, Button,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { Tabs, Tab } from '@mui/material';
import Combo from '../../page/combo/combo';
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
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:50 }}>
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
            fontSize: '13px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          left: '38px',  
          width: '101px',
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

const DateInputRowCustom = ({ label, value, onChange }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${year}.${month}.${day}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography sx={{ width: '80px', fontSize: '13px', fontWeight: '500', mt: -1 , position: 'relative', left: 50}}> 
        {label}
      </Typography>
      <Box sx={{ position: 'relative', width: '100px', height: '18px', left: '47px',top:-6 }}>
        {/* 실제 date input */}
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
        {/* 보이는 커스텀 레이어 */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#E0E0E0',
            borderRadius: '20px',
            border: '1px solid #ccc',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pointerEvents: 'none', // input이 클릭되도록
          }}
        >
          {formatDate(value)}
        </Box>
      </Box>
    </Box>
  );
};
const DateInputRow = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>
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
                  width: 160,
                  height: 40,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '13px',
                  fontSize: '13px',
                  fontWeight: 'normal', // ✅ 진하지 않게
                  pr: '12px', // 아이콘 공간 확보
                  pl: '33px', // 좌측 패딩 확보 날짜 텍스트 정중앙에 오게하기.
                  '& input': {
                    textAlign: 'center', // ✅ 날짜 가운데 정렬
                    padding: 0,          // ✅ 모든 방향 패딩 제거
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

  const [notes, setNotes] = useState('');
  const notesRef = useRef();

  const [birthDate, setBirthDate] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [animalHospitalName, setAnimalHospitalName] = useState('');
  const animalHospitalNameRef = useRef();

  const [animalMedication, setAnimalMedication] = useState('');
  const animalMedicationRef = useRef();
  const { showAlert } = useCmDialog();
  const [selectedTab, setSelectedTab] = useState(0);

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
        maxWidth: 420,
        margin: '0 auto',
        padding: 2,
        backgroundColor: '#fff',
        borderRadius: '12px',
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      {/* 왼쪽 입력 */}
      <Box>
        <FormRow label="동물 이름" value={animalName} onChange={setAnimalName} inputRef={animalNameRef} />
        <DateInputRowCustom label="날짜" value={birthDate} onChange={setBirthDate} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bottom: 10,
              left: 44,
              backgroundColor: '#88AE97',
              borderRadius: '30px',
              width: 180,
              height: 20,
              px: 6,
              py: 1.5,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            산책하기
          </Button>
        </Box>
      </Box>

      {/* 오른쪽 이미지 */}
      <Box sx={{ position: 'relative', left: '54px' }}>
        <Box
          sx={{
            width: 110,
            height: 85,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid white',
            backgroundColor: '#f3d9dc',
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
            top: -120,
            right: -100,
            backgroundColor: '#A5B1AA',
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
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: -5 }}>
        <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
            height: '36px',
            minHeight: '36px',
            '& .MuiTab-root': {
                fontSize: '13px',
                color: '#777',
                fontWeight: 500,
                minHeight: '36px',
                height: '36px',
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
    <DateInputRow label="생일" value={birthDate} onChange={setBirthDate} />
    <FormRow label="병원 이름" value={animalHospitalName} onChange={setAnimalHospitalName} inputRef={animalHospitalNameRef} />
    <FormRow label="처방약" value={animalMedication} onChange={setAnimalMedication} inputRef={animalMedicationRef} />
    <Combo></Combo>
  </Box>
);
};

export default Pet_Form_Hospital;  