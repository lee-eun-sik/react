import React, { useState, useRef } from 'react';
import {
  Box, Typography, InputBase, Button,
  Radio, RadioGroup, FormControlLabel,
  Avatar, IconButton
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';  
const Pet_Form_Update = () => {
  const [name, setName] = useState('');
  const nameRef = useRef();
  const [species, setSpecies] = useState('');
  const speciesRef = useRef();
  const [notes, setNotes] = useState('');
  const notesRef = useRef();
  const [adoptionDate, setAdoptionDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const { showAlert } = useCmDialog();
   
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (CmUtil.isEmpty(name)) {
      showAlert('이름을 입력해주세요.');
      nameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(species)) {
      showAlert('종류를 입력해주세요.');
      speciesRef.current?.focus();
      return;
    }
    // TODO: submit logic 추가
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, position: 'relative' }}>
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
          <Box component="img" src="/icons/image-edit.png" alt="사진 업로드" sx={{ width: 30, height: 30 }} />
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </IconButton>
      </Box>

      <FormRow label="동물 이름" value={name} onChange={setName} inputRef={nameRef} />
      <FormRow label="동물 종류" value={species} onChange={setSpecies} inputRef={speciesRef} />
      

      <DateInputRow label="동물 입양일" value={adoptionDate} onChange={setAdoptionDate} />
      <DateInputRow label="생일" value={birthDate} onChange={setBirthDate} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>성별</Typography>
        <RadioGroup row name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
          <FormControlLabel value="암컷" control={<Radio size="small" />} label="암컷" />
          <FormControlLabel value="수컷" control={<Radio size="small" />} label="수컷" />
        </RadioGroup>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>특이 사항</Typography>
          <InputBase
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            inputRef={notesRef}
            multiline
            inputProps={{
              style: {
                padding: 0,
                paddingTop: 4, // 첫 줄 여유
                fontSize: 13,
              }
            }}
            sx={{
              backgroundColor: '#D9D9D9',
              borderRadius: '12px',
              px: 2,
              py: 1,
              minHeight: 70,
              textDecoration: 'none',
              fontWeight: 'normal',
              color: '#000',
              display: 'flex',
              alignItems: 'flex-start', // 텍스트 상단 정렬
            }}
          />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 5 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#88AE97',
            borderRadius: '20px',
            px: 6,
            py: 1,
            fontSize: 14
            
          }}
        >
          수정
        </Button>
        <Button
          type="button"
          variant="contained"
          sx={{
            backgroundColor: '#A44D4D',
            borderRadius: '20px',
            px: 6,
            py: 1,
            fontSize: 14
            
          }}
          onClick={() => {
            // 삭제 로직 추가 예정
          }}
        >
          삭제
        </Button>
        </Box>
    </Box>
  );
};

const FormRow = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  // 필드 조건별 스타일 정의
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
    minHeight = 80;  // 3줄 정도 여유
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2}}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0 }}>
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
            textAlign: 'center', // <-- 중앙 정렬
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          width: '160px',
          backgroundColor,
          border,
          borderRadius,
          px: 2,
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
export default Pet_Form_Update;