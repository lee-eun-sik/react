import React, { useState, useRef } from 'react';
import {
  Box, Typography, InputBase, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { Tabs, Tab } from '@mui/material';
import Combo from '../../page/combo/combo';

const MAX_VISIBLE_RECORDS = 5;

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
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:38 }}>
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
          left: '32px',  
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
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', left: 1 }}>
      <Typography
        sx={{
          width: 100, // 넉넉한 고정 너비
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
                  width: 160,
                  height: 30,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '10px',
                  fontSize: '13px',
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

  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(null);
  const [animalVisitDate, setAnimalVisitDate] = useState(dayjs());
  const [imageFile, setImageFile] = useState(null);
  const [animalTreatmentMemo, setAnimalTreatmentMemo] = useState('');
  const animalTreatmentMemoRef = useRef();
  const [animalHospitalName, setAnimalHospitalName] = useState('');
  const animalHospitalNameRef = useRef();

  const [records, setRecords] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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
    handleSave();
  };
   const handleDelete = (id) => {
    setRecords(prev => prev.filter(rec => rec.id !== id));
  };

  const handleEdit = (record) => {
    setAnimalName(record.animalName);
    setAnimalVisitDate(dayjs(record.animalVisitDate));
    setAnimalHospitalName(record.animalHospitalName);
    setAnimalMedication(record.animalMedication);
    setAnimalTreatmentMemo(record.animalTreatmentMemo);
    setImageFile(null); // 실제 이미지 편집은 따로 처리해야 함
    setIsEditing(true);
    setEditId(record.id);
  };
  // 새 기록 추가
    // 새 기록 추가 또는 수정 저장
  const handleSave = () => {
    const newRecord = {
      id: isEditing ? editId : Date.now(),
      animalName,
      animalVisitDate: animalVisitDate?.format('YYYY.MM.DD'),
      animalHospitalName,
      animalMedication,
      animalTreatmentMemo,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : '/default-dog.jpg',
    };

    if (isEditing) {
      setRecords(prev =>
        prev.map(rec => (rec.id === editId ? newRecord : rec))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setRecords(prev => [newRecord, ...prev]);
    }

    // 입력값 초기화
    setAnimalName('');
    setAnimalHospitalName('');
    setAnimalMedication('');
    setAnimalTreatmentMemo('');
    setAnimalVisitDate(dayjs());
    setImageFile(null);
  };  
  const visibleRecords = showAll ? records : records.slice(0, MAX_VISIBLE_RECORDS);

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
        <DateInputRowCustom label="날짜" value={animalAdoptionDate} onChange={setAnimalAdoptionDate} />
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
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 5 }}>
      <DateInputRow label="날짜" value={animalVisitDate} onChange={setAnimalVisitDate} />
      <FormRow1 label="병원 이름" value={animalHospitalName} onChange={setAnimalHospitalName} inputRef={animalHospitalNameRef} />
      <FormRow1 label="처방약" value={animalMedication} onChange={setAnimalMedication} inputRef={animalMedicationRef} />
      <Typography>진료 내용<Combo></Combo></Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>특이사항</Typography>
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
            onClick={handleSave}
            variant="contained"
            sx={{
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
      {/* ▼ 기록 리스트 표시 부분 */}
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>진료 기록 목록</Typography>

      {records.length === 0 ? (
        <Typography sx={{ fontSize: 14, color: '#999' }}>등록된 기록이 없습니다.</Typography>
      ) : (
        <>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {visibleRecords.map((record) => (
              <Box
                key={record.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  mb: 2,
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  backgroundColor: '#F7F7F7',
                }}
              >
                <img
                  src={record.imageUrl}
                  alt="animal"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                    {record.animalName} ({record.animalVisitDate})
                  </Typography>
                  <Typography sx={{ fontSize: 13, mt: 0.5 }}>
                    병원: {record.animalHospitalName}
                  </Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    처방약: {record.animalMedication}
                  </Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    메모: {record.animalTreatmentMemo}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(record)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(record.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ▼ 더보기 버튼 */}
          {records.length > MAX_VISIBLE_RECORDS && !showAll && (
            <Button onClick={() => setShowAll(true)} sx={{ mt: 1 }}>
              + 더보기
            </Button>
          )}
        </>
      )}
    </Box>
  </Box>
);
};
export default Pet_Form_Hospital;  