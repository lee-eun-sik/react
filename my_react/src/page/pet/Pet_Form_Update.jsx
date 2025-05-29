import React, { useState, useRef } from 'react';
import {
  Box, Typography, InputBase, Button,
  Radio, RadioGroup, FormControlLabel,
  Avatar, IconButton
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
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

      <FormRow label="이름" value={name} onChange={setName} inputRef={nameRef} />
      <FormRow label="종류" value={species} onChange={setSpecies} inputRef={speciesRef} />
      <FormRow label="특이 사항" value={notes} onChange={setNotes} inputRef={notesRef}/>

      <DateInputRow label="입양일" value={adoptionDate} onChange={setAdoptionDate} />
      <DateInputRow label="생일" value={birthDate} onChange={setBirthDate} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>성별</Typography>
        <RadioGroup row name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
          <FormControlLabel value="암컷" control={<Radio size="small" />} label="암컷" />
          <FormControlLabel value="수컷" control={<Radio size="small" />} label="수컷" />
        </RadioGroup>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#556B2F', borderRadius: '20px', px: 4, py: 1, fontSize: 14 }}>
          수정
        </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#556B2F', borderRadius: '20px', px: 4, py: 1, fontSize: 14 }}>
          삭제
        </Button>
      </Box>
    </Box>
  );
};

const FormRow = ({ label, value = '', onChange, multiline = false, inputRef }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>{label}</Typography>
    <InputBase
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`${label} 입력`}
      multiline={multiline}
      inputRef={inputRef}   // ← 추가
      inputProps={{ style: { padding: 0 } }}
      sx={{
        flex: 1,
        backgroundColor: '#E0E0E0',
        borderRadius: '20px',
        px: 2,
        py: 0.8,
        fontWeight: 'bold',
        textAlign: 'left',
        border: '1px solid #ccc',
        '&:focus-within': { borderColor: '#1976d2' },
        ...(multiline && { minHeight: 60 })
      }}
    />
  </Box>
);

const DateInputRow = ({ label, value, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500 }}>{label}</Typography>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <DatePicker
        value={value}
        onChange={onChange}
        inputFormat="yyyy.MM.dd"
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

export default Pet_Form_Update;