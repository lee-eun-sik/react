import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  IconButton,
  InputBase,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { FaCamera } from "react-icons/fa";
import { useCmDialog } from "../../cm/CmDialogUtil";
import DefaultImage from "../../image/default-plant.png";
import { useCreatePlantMutation } from "../../features/plant/plantApi";
import Combo from "../combo/combo";
import "../../css/plantCreate.css";
import back from "../../image/back.png";

const PlantCreate = () => {
  const [plantName, setPlantName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [plantPurchaseDate, setPlantPurchaseDate] = useState(dayjs());
  const [sunlightPreference, setSunlightPreference] = useState("");
  const [plantGrowthStatus, setPlantGrowthStatus] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [createPlant] = useCreatePlantMutation();
  const navigate = useNavigate();
  const { showAlert } = useCmDialog();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setFiles([selectedFile]);
    } else {
      setImagePreview(null);
      setFiles([]);
    }
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    formData.append("plantName", plantName);
    formData.append("plantType", plantType);
    if (plantPurchaseDate) {
      formData.append(
        "plantPurchaseDate",
        dayjs(plantPurchaseDate).format("YYYY-MM-DD")
      );
    }
    formData.append("plantSunPreference", sunlightPreference);
    formData.append("plantGrowStatus", plantGrowthStatus);

    try {
      await createPlant(formData).unwrap();
      showAlert("등록 성공!");
      setPlantName("");
      setPlantType("");
      setPlantPurchaseDate(null);
      setSunlightPreference("");
      setPlantGrowthStatus("");
      setImagePreview(null);
      setFiles([]);
      navigate("/home.do?tab=N02");
    } catch (err) {
      showAlert("등록 실패");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <div className="header-icon-container">
        <Button
          onClick={() => navigate("/home.do?tab=N02")}
          sx={{
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
            height: "35px",
            minWidth: "0",
            width: "35px",
            marginLeft: "30px",
            marginTop: "25px",

            marginBottom: "20px",
            "&:hover": {
              backgroundColor: "#363636",
            },
            backgroundColor: "rgba(54, 54, 54, 0.4)",
          }}
        >
          <img src={back} alt="" sx={{ pl: "2px" }}></img>
        </Button>
      </div>
      <Box className="plant-create-container">
        <Stack spacing={2} className="plant-form-stack">
          <Box
            sx={{ textAlign: "center", position: "relative", marginBottom: 3 }}
          >
            <Avatar
              src={imagePreview || DefaultImage}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="imageUpload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  top: "65px",
                  left: "calc(50% + 15px)",
                  backgroundColor: "white",
                  boxShadow: 1,
                  width: 30,
                  height: 30,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <FaCamera style={{ fontSize: "1rem" }} />
              </IconButton>
            </label>
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 이름</Typography>
            <TextField
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              variant="outlined"
              size="small"
              className="input-field-wrapper"
              sx={{
                width: "150px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F8F8F8",
                  borderRadius: "8px",
                  padding: "0px", // 내부 패딩 제거
                },
                "& .MuiInputBase-input": {
                  padding: "6px 8px", // 텍스트 입력 공간의 패딩 조절
                  fontSize: "14px", // 폰트 사이즈 줄이면 높이도 줄어듦
                },
              }}
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 종류</Typography>
            <Combo
              groupId="PlantType"
              onSelectionChange={setPlantType}
              defaultValue={plantType}
              sx={{
                fontSize: 14,
                width: "210px",
                height: "37px",
                backgroundColor: "#F8F8F8",
                borderRadius: "8px",
                mt: -2,
              }}
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 입수일</Typography>
            <DatePicker
              value={dayjs(plantPurchaseDate)}
              onChange={(newValue) => setPlantPurchaseDate(newValue)}
              format="YYYY.MM.DD"
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth />
              )}
              slotProps={{
                textField: {
                  size: "small",
                  InputProps: {
                    sx: {
                      fontSize: 14,
                      borderRadius: "8px",
                      backgroundColor: "#F8F8F8",
                      width: "210px",
                      height: "38px",
                      pl: "72px",
                    },
                  },
                },
              }}
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">햇빛/그늘 선호</Typography>
            <Combo
              groupId="SunType"
              onSelectionChange={setSunlightPreference}
              defaultValue={sunlightPreference}
              sx={{
                fontSize: 14,
                width: "210px",
                height: "37px",
                backgroundColor: "#F8F8F8",
                borderRadius: "8px",
                mt: -2,
              }}
            />
          </Box>

          <Box
            sx={{
              alignItems: "center",
              mb: 1.5,
            }}
            className="status-field"
          >
            <Typography className="label-text">생육 상태</Typography>
            <InputBase
              value={plantGrowthStatus}
              onChange={(e) => setPlantGrowthStatus(e.target.value)}
              multiline
              inputProps={{
                style: {
                  padding: 0,
                  paddingTop: 4,
                  fontSize: 13,
                },
              }}
              sx={{
                backgroundColor: "#F8F8F8",
                borderRadius: "8px",
                px: 2,
                py: 1,
                minHeight: 70,
                textDecoration: "none",
                fontWeight: "normal",
                color: "#000",
                display: "flex",
                alignItems: "flex-start",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#556B2F",
                borderRadius: "8px",
                px: 4,
                py: 1,
                fontSize: 14,
              }}
            >
              식물 등록
            </Button>
          </Box>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantCreate;
