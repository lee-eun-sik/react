import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import AnimalIcon from "../../image/Footprint_Icon.png";
import PlantIcon from "../../image/Plant_Icon.png";

const TabCombo = ({ onChange, defaultValue }) => {
  const [activeTab, setActiveTab] = useState("N01");

  useEffect(() => {
    if (defaultValue) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue]);

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    if (onChange) {
      onChange(tabValue);
    }
  };

  const tabs = [
    // 다시 'value'를 "N01"과 "N02"로 변경했습니다.
    { value: "N01", label: "동물", icon: AnimalIcon },
    { value: "N02", label: "식물", icon: PlantIcon },
  ];

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          className={`tab-combo-button ${
            activeTab === tab.value ? "active" : ""
          }`}
          onClick={() => handleTabClick(tab.value)}
          sx={{
            position: "relative",
            width: "120px",
            bgcolor: "#526B5C",
            color: "white",
            display: "flex",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            height: "50px",
            borderRadius: 0,
            transition: "background-color 0.3s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: "10px", // 글자 바로 아래 위치
              left: "50%",
              width: "40%",
              height: "1px", // 언더바 높이
              backgroundColor: "white",
              borderRadius: "1px",
              transform: "translateX(-50%) scaleX(0)", // 처음엔 안 보이게
              transition: "transform 0.3s ease",
            },
            "&.active::before": {
              transform: "translateX(-50%) scaleX(1)", // 활성화될 때 언더바 나타나기
            },
          }}
        >
          <Typography variant="button" sx={{ fontSize: "1rem" }}>
            {tab.label}
          </Typography>
          <img
            src={tab.icon}
            alt={`${tab.label} 아이콘`}
            style={{
              height: "15px",
              marginRight: "6px",
              filter:
                activeTab === tab.value ? "brightness(0) invert(1)" : "none",
            }}
          />
        </Button>
      ))}
    </Box>
  );
};

export default TabCombo;
