// Combo.js
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material"; // Box는 Material-UI 컴포넌트이므로 유지
import CommonComboBox from "./CommonComboBox";
import { useComboListByGroupQuery } from "../../features/combo/combo";

// Combo 컴포넌트가 sx prop을 받도록 정의
const Combo = ({ groupId, onSelectionChange, defaultValue = "", sx }) => {
  // sx prop 추가
  const { data, isLoading } = useComboListByGroupQuery(groupId);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      const formattedItems = data.data.map((item) => ({
        value: item.codeId,
        label: item.codeName,
      }));
      setItems(formattedItems);
    }
  }, [data]);

  useEffect(() => {
    if (defaultValue && items.length > 0) {
      const found = items.find((item) => item.value === defaultValue);
      if (found) {
        setSelected(found.value);
        onSelectionChange?.(found.value);
      }
    } else if (!defaultValue && items.length > 0) {
        setSelected(""); 
        onSelectionChange?.("");
    }
  }, [defaultValue, items]);

  const handleComboBoxChange = (newValue) => {
    setSelected(newValue);
    onSelectionChange?.(newValue);
  };

  const getPlaceholder = () => {
    if (groupId === "AlarmCycle") return "주기 선택";
    if (groupId === "Community") return "카테고리 선택";
    if (groupId === "WritingSortation") return "종류 선택";
    if (groupId === "EatType") return "먹이 선택";
    return "선택하세요";
  };

  return (
    <Box sx={{ mt: 2 }}>
      <CommonComboBox
        options={items}
        value={selected}
        onChange={handleComboBoxChange}
        placeholder={getPlaceholder()}
        disabled={isLoading}
        sx={sx}
      />
    </Box>
  );
};

export default Combo;