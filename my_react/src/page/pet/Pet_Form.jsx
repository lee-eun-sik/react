import React, { useState, useRef, forwardRef } from 'react';
import {
  Box, Typography, InputBase, Button,
  Radio, RadioGroup, FormControlLabel,
  Avatar, IconButton
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { usePet_FormMutation } from '../../features/pet/petApi';
dayjs.locale('ko');

const Pet_Form = () => {
  const [animalName, setAnimalName] = useState('');
  const animalNameRef = useRef();
  const [animalSpecies, setAnimalSpecies] = useState('');
  const animalSpecieRef = useRef();
  const [animalMemo, setAnimalMemo] = useState('');
  const animalMemoRef = useRef();
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const { showAlert } = useCmDialog();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };
  const [registerPet] = usePet_FormMutation();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (CmUtil.isEmpty(animalName)) {
      showAlert('이름을 입력해주세요.');
      animalNameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(animalSpecies)) {
      showAlert('종류를 입력해주세요.');
      animalSpecieRef.current?.focus();
      return;
    }

    try {
      const jsonData = {
        animalName,
        animalSpecies,
        animalAdoptionDate: animalAdoptionDate ? animalAdoptionDate.format('YYYY-MM-DD') : '',
        birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : '',
        gender,
        animalMemo
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      // usePet_FormMutation에서 formData를 전송하도록 맞춰야 합니다.
      // 만약 RTK Query를 사용 중이라면, 기본적으로 JSON을 전송하므로,
      // 백엔드가 multipart/form-data를 받게 하려면
      // API slice 쪽에서 header와 body 처리를 수정해야 합니다.

      const res = await registerPet(formData).unwrap();
      showAlert('등록 성공!');
    } catch (err) {
      showAlert('등록 실패: ' + (err?.data?.message || '알 수 없는 오류'));
    }
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

      <FormRow label="동물 이름" value={animalName} onChange={setAnimalName} inputRef={animalNameRef} />
      <FormRow label="동물 종류" value={animalSpecies} onChange={setAnimalSpecies} inputRef={animalSpecieRef} />

      <DateInputRow label="동물 입양일" value={animalAdoptionDate} onChange={setAnimalAdoptionDate} />
      <DateInputRow label="생일" value={birthDate} onChange={setBirthDate} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>성별</Typography>
        <RadioGroup row name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
          <FormControlLabel value="암컷" control={<Radio size="small" />} label="암컷" />
          <FormControlLabel value="수컷" control={<Radio size="small" />} label="수컷" />
        </RadioGroup>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>특이사항</Typography>
        <InputBase
          value={animalMemo}
          onChange={(e) => setAnimalMemo(e.target.value)}
          inputRef={animalMemoRef}
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
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#556B2F', borderRadius: '20px', px: 4, py: 1, fontSize: 14 }}>
          동물 등록
        </Button>
      </Box>
    </Box>
  );
};

const FormRow = ({ label, value = '', onChange, multiline = false, inputRef }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
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
            textAlign: 'center',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          width: '160px',
          backgroundColor: '#E0E0E0',
          border: '1px solid #ccc',
          borderRadius: '20px',
          px: 2,
          py: 1,
          fontWeight: 'normal',
          textDecoration: 'none',
          color: 'inherit',
          ...(multiline && { minHeight: 80 }),
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



export default Pet_Form;