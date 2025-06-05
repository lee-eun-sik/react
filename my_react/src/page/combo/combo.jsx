import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import CommonComboBox from './CommonComboBox';
import {
    useComboCreateMutation,
    useComboDeleteMutation,
    useComboListQuery,
    useComboListByGroupQuery,
 } from '../../features/combo/comboApi';

const Combo = ({ groupId }) => {
 
  const { data, isLoading, error } = useComboListByGroupQuery(groupId);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  // const [inputValue, setInputValue] = useState('');
  // const [inputLabel, setInputLabel] = useState('');
  // const [comboCreate] = useComboCreateMutation();
  // const [comboDelete] = useComboDeleteMutation();
  // const { data, isLoading, error } = useComboListQuery();

  // ✅ 불러온 데이터로 items 설정
  useEffect(() => {
    console.log(`groupId(${groupId}) 응답:`, data);
    if (Array.isArray(data?.data)) {
      const formattedItems = data.data.map(item => ({
        value: item.codeId,
        label: item.codeName,
      }));
      setItems(formattedItems);
    }
  }, [data, groupId]); // ✅ groupId 변경에도 반응


    // 컬럼에 추가
  // const handleAddItem = async () => {
  //   const trimmedValue = inputValue.trim();
  //   const trimmedLabel = inputLabel.trim();

  //   if (!trimmedValue || !trimmedLabel) {
  //     alert("Value와 Label을 모두 입력해주세요.");
  //     return;
  //   }

  //   // 중복 검사: 같은 value가 이미 있으면 추가하지 않음
  //   const isDuplicate = items.some(item => item.value === trimmedValue);
  //   if (isDuplicate) {
  //       alert(`이미 존재하는 value입니다: ${trimmedValue}`);
  //       return;
  //   }

  //   // ✅ DB 저장 시도
  //     try {
  //       const formData = {
  //         value: trimmedValue,
  //         label: trimmedLabel,
  //       };

  //       const result = await comboCreate(formData).unwrap(); // RTK Query 호출

  //       console.log('서버 응답:', result); // 성공 시 결과 확인
        
  //       // 성공했을 때만 state에 추가
  //       setItems(prev => [...prev, { value: trimmedValue, label: trimmedLabel }]);
  //       setInputValue('');
  //       setInputLabel('');
  //   } catch (error) {
  //       console.error('저장 실패:', error);
  //       if (error.data) {
  //           console.error('서버 응답 데이터:', error.data);
  //       }
  //       if (error.status) {
  //           console.error('HTTP 상태 코드:', error.status);
  //       }
  //       alert('DB 저장 중 오류가 발생했습니다.');
  //       }
  // };


  //  선택컬럼삭제하는
  // const handleDeleteItem = async () => {
  //   if (!selected) {
  //       alert("삭제할 항목을 선택해주세요.");
  //       return;
  //   }

  //   try {
  //       const itemToDelete = items.find(item => item.value === selected);
  //       if (!itemToDelete) {
  //       alert("해당 항목을 찾을 수 없습니다.");
  //       return;
  //       }

  //       await comboDelete({ label: itemToDelete.label }).unwrap();
  //       setItems(prev => prev.filter(item => item.value !== selected));
  //       setSelected('');
  //       alert('삭제 성공');
  //   } catch (error) {
  //       console.error('삭제 실패:', error);
  //       alert('삭제 중 오류가 발생했습니다.');
  //   }
  // };


  return (
    <Box sx={{ mt: 2 }}>
      {/* <Typography variant="h6">항목 추가</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="small"
        />
        <TextField
          label="Label"
          value={inputLabel}
          onChange={(e) => setInputLabel(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleAddItem}>
          추가
        </Button>
      </Box> */}

      <CommonComboBox options={items} value={selected} onChange={setSelected} />

      {/* <Button variant="outlined" color="error" onClick={handleDeleteItem}>
        삭제
      </Button>   */}
      
    </Box>
  );
};

export default Combo;