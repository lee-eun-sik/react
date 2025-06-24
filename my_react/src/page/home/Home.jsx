import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TabCombo from "../../page/combo/TabCombo";
import { useAnimalListQuery, usePlantListQuery } from "../../features/home/homeApi";
import PetTestMain from "../../image/petTestMain.png";
import PlantTestMain from "../../image/plantTestMain.png";
import DefaultPlant from "../../image/default-plant.png";
import DefaultAnimal from "../../image/dafault-animal.png";

const Home = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("N01"); // "N01": 동물, "N02": 식물
  const [sortBy, setSortBy] = useState("name"); // 정렬 기준: 'name' (이름순), 'date' (등록일순)
  const [sortOrder, setSortOrder] = useState("ASC"); // 정렬 순서: 'ASC' (오름차순), 'DESC' (내림차순)

  const user = useSelector((state) => state.user.user);
  const currentFrontendUserId = user ? user.users_id : null;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");

    if (tabParam === "N02") {
      setActiveTab("N02");
    } else {
      setActiveTab("N01"); // 기본값 또는 'N01'일 때
    }
  }, [location.search]);


  const queryParams = {
    usersId: currentFrontendUserId,
    sortField: activeTab === "N01"
      ? (sortBy === "name" ? "ANIMAL_NAME" : "CREATE_DT")
      : (sortBy === "name" ? "PLANT_NAME" : "PLANT_PURCHASE_DATE"),
    sortOrder: sortOrder,
  };

  const {
    data: animalData,
    error: animalError,
    isLoading: isAnimalLoading,
    isFetching: isAnimalFetching,
  } = useAnimalListQuery(queryParams, { skip: activeTab !== "N01" });

  const {
    data: plantData,
    error: plantError,
    isLoading: isPlantLoading,
    isFetching: isPlantFetching,
  } = usePlantListQuery(queryParams, { skip: activeTab !== "N02" });

  // 현재 활성화된 탭에 따라 데이터, 로딩 상태, 에러 상태 결정
  const currentData = activeTab === "N01" ? animalData : plantData;
  const currentError = activeTab === "N01" ? animalError : plantError;
  const currentIsLoading = activeTab === "N01" ? isAnimalLoading || isAnimalFetching : isPlantLoading || isPlantFetching;
  const currentDefaultImage = activeTab === "N01" ? DefaultAnimal : DefaultPlant;

  // 정렬 기준 변경 핸들러
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
      setSortBy(newSortBy);
      setSortOrder("ASC");
  };

  useEffect(() => {
    if (plantData != 0) {
      console.log("확인하고 싶은", plantData);
    }
  }, [plantData])

  // 탭 변경 핸들러
  const handleTabChange = useCallback((selectedTabValue) => {
    setActiveTab(selectedTabValue);
    window.history.pushState(null, "", `/?tab=${selectedTabValue}`);
  }, []);
  const currentTestImage = activeTab === "N01" ? PetTestMain : PlantTestMain;
  const currentTestLink = `/test/main.do?tab=${activeTab}`;

  return (
    <Box sx={{ width: "100%" ,marginTop:"0.5px"}}>
      {/* 테스트 이미지 및 버튼 섹션 */}
      <Box
        sx={{
          backgroundImage: `url(${currentTestImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "235px"
        }}
      >
        <Link to={currentTestLink} style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              padding: "5px 20px",
              backgroundColor: "white",
              color: "#583403",
              fontWeight: "bold",
              border: "2px solid #583403",
              borderRadius: "10px",
              cursor: "pointer",
              marginTop: "170px",
              marginLeft: "10px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            테스트 시작
          </Button>
        </Link>
      </Box>

      {/* TabCombo 컴포넌트 삽입 */}
      <Box >
        <TabCombo onChange={handleTabChange} defaultValue={activeTab} />
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: '10px' }}>
        {/* 정렬 셀렉트 박스 */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
          <Select
            labelId="sort-by-label"
            id="sort-by-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <MenuItem value="name">이름 순</MenuItem>
            <MenuItem value="date">등록일 순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 로딩/오류/데이터 표시 및 추가 버튼 */}
      {currentIsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', mt: 2 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
            데이터를 불러오는 중...
          </Typography>
        </Box>
      ) : currentError ? (
        <Alert severity="error" sx={{ my: 2 }}>
          <Typography variant="h6">데이터를 불러오는 데 실패했습니다.</Typography>
          <Typography variant="body2">
            {currentError.message || "알 수 없는 오류가 발생했습니다."}
          </Typography>
          <Typography variant="body2">
            백엔드 서버가 실행 중인지 확인하고, API 경로와 네트워크 연결을 확인해주세요.
          </Typography>
        </Alert>
      ) : (
        // 데이터를 표시할 그리드 컨테이너와 '+' 추가 버튼
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            mt: 1,
            px: 1,
            pb: 8, // 하단 패딩은 필요에 따라 조정
          }}
        >
          {/* 실제 아이템 렌더링 */}
          {currentData?.data && currentData.data.length > 0 ? (
            currentData.data.map((item) => {
              console.log("확인해야 할 PostFiles 콘솔", item.postFiles); 

              const itemId = activeTab === "N01" ? item.animalId : item.plantId;
              const itemName = activeTab === "N01" ? item.animalName : item.plantName;

              const imageUrl =
                item.postFiles && item.postFiles.length > 0 && item.postFiles[0].postFileId
                  ? `${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${item.postFiles[0].postFileId}`
                  : currentDefaultImage;

              const itemLink =
                activeTab === "N01"
                  ? `/pet/petFormHospital.do?animalId=${itemId}`
                  : `/plantwatering.do?plantId=${itemId}`;


              return (
                <Link to={itemLink} key={itemId} style={{ textDecoration: "none", color: "inherit" }}>
                  <Box
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                      textAlign: "center",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "70px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize:'cover',
                        backgroundPosition: "center",
                        textDecoration: "none"
                      }}
                    />
                    <Typography
                      component="div"
                      sx={{ fontSize: "15px", mt: "5px", mb: "5px", textDecoration: "none", color: 'inherit' }}
                    >
                      {itemName || "이름 없음"}
                    </Typography>
                  </Box>
                </Link>
              );
            })
          ) : (
            // 데이터가 없을 때 "데이터가 없습니다" 메시지를 그리드 내의 독립적인 Box로 렌더링
            <Box sx={{ gridColumn: 'span 4', textAlign: 'center'}}>
            </Box>
          )}

          {/* '+' 추가 버튼은 항상 이 그리드 컨테이너 내부에 렌더링 */}
          <Link
            to={activeTab === "N01" ? "/pet/petForm.do" : "/PlantCreate.do"}
            style={{ textDecoration: "none" }}
          >
            <Box
              sx={{
                border: "1px dashed #ccc",
                borderRadius: "8px",
                height: "110px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                bgcolor: "#f9f9f9",
                "&:hover": { bgcolor: "#f0f0f0" },
                boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "#2ecc71", fontSize: "3rem" }}
              >
                +
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeTab === "N01" ? "동물 추가" : "식물 추가"}
              </Typography>
            </Box>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Home;