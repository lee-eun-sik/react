import React, { useState, useEffect, useRef, useMemo } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import MapContainer from "./MapContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useCmDialog } from "../../cm/CmDialogUtil";
import {
  usePetWalkSaveMutation,
  usePetWalkUpdateMutation,
  usePetImgSaveMutation,
  usePetWalkLoadQuery,
} from "../../features/pet/petWalkApi";

import back from "../../image/back.png";
import camera from "../../image/camera.png";

const WalkTracker = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get("animalId"); // 동물아이디 animalId parm에 저장
  const {
    data: IdResult,
    refetch: refetch2,
    isLoading: isLoading2,
  } = usePetWalkLoadQuery({
    animalId: animalId, // < 동물 아이디   로 산책아이디 조회해올거임
  });
  const [walkId, setWalkId] = useState();

  const [menuOpen, setMenuOpen] = useState(false); // 드롭다운 열림 여부
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행 여부
  const prevIsRunning = useRef(false); // 타이머시작시에만 저장하기위함
  const [saveFirst, setSaveFirst] = useState(false); // 저장먼저하려고
  const [time, setTime] = useState(0); // 경과 시간 (초 단위)
  const [formattedTime, setFormattedTime] = useState("00:00:00");
  const [selectedItem, setSelectedItem] = useState("동물 병원 찾기"); // 현재 선택된 항목
  const menuItems = ["동물 병원 찾기", "꽃집 찾기", "공원 찾기"]; // 고정된 전체 항목
  const timerRef = useRef(null); // 타이머 ID 저장

  // 구글맵 관련 상태
  const [googleMaps, setGoogleMaps] = useState(null);
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(18); // 기본 줌 레벨
  const [markerPosition, setMarkerPosition] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null); // 위치 정확도 저장
  const [mapInstance, setMapInstance] = useState(null);

  const [nearbyMarkers, setNearbyMarkers] = useState([]);
  const locationRetryRef2 = useRef(null); // 2초마다위치 재요청 타이머 ID
  const locationRetryRef = useRef(null); // 위치 재요청 타이머 ID
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 카메라 관련
  const [isUploading, setIsUploading] = useState(false);
  const [imgSave] = usePetImgSaveMutation(); // 산책ID별 이미지저장

  const [petWalkSave] = usePetWalkSaveMutation(); // 산책ID별 정보임시저장 (walkId꼬임방지)
  const [petWalkUpdate] = usePetWalkUpdateMutation(); // 산책ID별 정보최종저장 (update로)

  const { showAlert } = useCmDialog();

  // 공통 버튼 스타일
  const buttonBaseStyle = {
    backgroundColor: "#889F7F",
    color: "white",
    padding: "0px 2px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
    height: "32px",
    width: "120px",
    textAlign: "",
  };

  // 초기 로딩 시 map 인스턴스를 설정한다.
  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(!mapLoaded); // 지도 로딩 완료 플래그
  };

  // center state가 변경되면 인스턴스를 통해 직접 업데이트
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setCenter(center);
    }
  }, [center]);

  // 가급적 객체 재생성을 피하기 위해 center를 useMemo로 관리
  const memoizedCenter = useMemo(() => center, [center]);

  // 타이머 작동 로직
  useEffect(() => {
    clearInterval(timerRef.current);
    if (isRunning) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // 초(seconds)가 변할 때마다 formattedTime 업데이트
  useEffect(() => {
    setFormattedTime(formatTime(time));
  }, [time]);

  // 타이머시작시 2초에한번 위치요청
  useEffect(() => {
    if (isRunning) {
      requestLocation2();
      // 타이머 시작 시 위치요청 반복 시작
      const interval = setInterval(() => {
        requestLocation2();
      }, 2000);
      locationRetryRef2.current = interval;

      return () => {
        clearInterval(interval);
        locationRetryRef2.current = null;
      };
    } else {
      // 타이머 종료 → 위치요청 중지
      if (locationRetryRef2.current) {
        clearInterval(locationRetryRef2.current);
        locationRetryRef2.current = null;
      }
    }
  }, [isRunning]);

  // 위치 요청 함수 (2초마다 호출)
  const requestLocation2 = () => {
    if (window.Android?.requestLocationUpdate2) {
      window.Android.requestLocationUpdate2(); // 요청만 함
    } else {
      console.warn("Android 인터페이스 사용 불가");
    }
  };
  // 위치 콜백 (Android에서 호출)
  window.onLocationUpdate = (jsonString) => {
    try {
      const json = JSON.parse(jsonString);
      if (json.error) {
        console.warn("위치 없음");
      } else {
        const pos = { lat: json.lat, lng: json.lng };
        setMarkerPosition(pos);
        // alert(JSON.stringify(pos)); //위치띄우기
      }
    } catch (e) {
      console.error("위치 JSON 파싱 에러:", e);
    }
  };

  // // 2초마다 위치 요청 함수
  // const requestLocation2 = () => {
  //   if (window.Android?.receiveMessage2) {
  //     const result = window.Android.receiveMessage2(JSON.stringify({ type: "GET_LOCATION2" }));
  //       try {
  //         const json = JSON.parse(result);

  //         if (json.error) {
  //           // 위치가 아직 없을 경우 → 1초 후 재시도
  //           console.warn("위치 없음, 재시도 예정");
  //           setTimeout(requestLocation2, 1000);
  //         } else {
  //           // TODO: 위치 상태 저장 or 지도 갱신 등 처리
  //           const pos = { lat: json.lat, lng: json.lng };
  //           setMarkerPosition(pos);

  //           alert("현재 위치:" + json.lat + " / "+ json.lng);

  //         }
  //       } catch (e) {
  //         console.error("위치 JSON 파싱 에러:", e);
  //       }
  //   } else {
  //     console.warn("Android 인터페이스 사용 불가");
  //   }
  // };

  // 타이머 종료시 종료위치저장
  useEffect(() => {
    if (!isRunning && markerPosition) {
      setEndLocation(markerPosition);
      setNearbyMarkers([]); // 주변건물마커 삭제

      // 🔥 위치 요청 중단
      if (locationRetryRef2.current) {
        clearInterval(locationRetryRef2.current);
        locationRetryRef2.current = null;
        console.log("⛔ 위치 요청 반복 종료됨");
      }
    }
  }, [isRunning, saveFirst]);

  // 산책종료시 시작/종료 위치 보이기
  useEffect(() => {
    if (mapRef.current && startLocation && endLocation) {
      setTimeout(() => {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(startLocation);
        bounds.extend(endLocation);
        mapRef.current.fitBounds(bounds);
      }, 300); // 지도 로딩 완료까지 잠깐 대기
    }
  }, [endLocation, saveFirst, mapLoaded]);

  // 시:분:초 형식으로 변환
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleWalkAction = async (action) => {
    console.log("실행");
    if (action === "종료") {
      setIsRunning(!isRunning);

      try {
        const formData = new FormData();
        formData.append("walkId", walkId); // 임시저장한 산책 walkId로 찾기
        formData.append("walkTime", formatTime(time));

        setSaveFirst(!saveFirst);
        const result = await petWalkUpdate(formData).unwrap();
        showAlert("산책 정보가 저장되었습니다.");
        setTime(0);
      } catch (error) {
        console.error("산책정보 저장 실패:", error);
        if (error.data) {
          console.error("서버 응답:", error.data);
        }
        showAlert("산책정보 저장 중 오류가 발생했습니다.");
      }
    } else if (action === "시작") {
      if (markerPosition) {
        setIsRunning(!isRunning);
        setStartLocation(markerPosition);
        setZoom(10); // 다른 값으로 임시 변경
        setTimeout(() => setZoom(18), 100); // 다시 18로 설정
        setCenter(markerPosition);
        setEndLocation(null);
        setNearbyMarkers([]); // 주변건물마커 삭제

        try {
          const formData = new FormData();
          formData.append("animalId", animalId); // << 동물아이디 변수 넘기면됨
          formData.append("walkTime", "NOT RECORD");

          const result = await petWalkSave(formData).unwrap();
          console.log("산책정보 저장 성공", result.data.walkId);
          setWalkId(result.data.walkId);
        } catch (error) {
          console.error("산책정보 저장 실패:", error);
          if (error.data) {
            console.error("서버 응답:", error.data);
          }
          showAlert("산책정보 저장 중 오류가 발생했습니다.");
        }
      } else {
        showAlert("위치 없음");
      }
    }
  };

  // 드롭다운 항목 클릭 시 선택 항목 변경
  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
    setMenuOpen(false); // 선택 후 드롭다운 닫기

    if (center && window.Android?.getNearbyPlaces) {
      const { lat, lng } = center;
      const typeMap = {
        "동물 병원 찾기": "veterinary_care",
        "꽃집 찾기": "florist",
        "공원 찾기": "park",
      };
      const placeType = typeMap[item];
      try {
        window.Android.getNearbyPlaces(lat, lng, 5000, placeType); // 1000 = 반경 1km
      } catch (e) {
        console.error("getNearbyPlaces 호출 실패:", e);
      }
    }
    //산책 시작누르고 종료는 안눌렀을때 시작위치삭제 안함
    if(startLocation !=null && endLocation == null){
      setEndLocation(null);
    } else {  // 시작중이아닐때는 시작위치, 종료위치 마커 삭제
      setStartLocation(null);
      setEndLocation(null);
    }
    
    mapRef.current.panTo(markerPosition); // 내위치 정중앙이동
  };

  //주변건물찾기
  useEffect(() => {
    window.onNearbyPlaces = (placesJson) => {
      try {
        const data = JSON.parse(placesJson);
        if (data.status === "OK") {
          const newMarkers = data.results.map((place) => ({
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            name: place.name,
          }));
          setNearbyMarkers(newMarkers);
          setZoom(10); // 다른 값으로 임시 변경
          setTimeout(() => setZoom(13), 100); // 다시 13로 설정
        } else {
          console.warn("Places API 실패:", data.status);
          setNearbyMarkers([]);
        }
      } catch (e) {
        console.error("onNearbyPlaces 파싱 오류:", e);
        setNearbyMarkers([]);
      }
    };
  }, []);

  // 현재 선택된 항목을 제외한 드롭다운 메뉴 구성
  const dropdownItems = menuItems.filter((item) => item !== selectedItem);

  // 위치 요청 함수
  const requestLocation = () => {
    if (window.Android?.receiveMessage) {
      window.Android.receiveMessage(JSON.stringify({ type: "GET_LOCATION" }));
    }
  };

  // 처음 렌더링 시 실행
  useEffect(() => {
    setZoom(10); // 다른 값으로 임시 변경
    setTimeout(() => setZoom(18), 100); // 다시 18로 설정
    firstMapping();
    return () => {
      if (locationRetryRef.current) {
        clearInterval(locationRetryRef.current);
      }
    };
  }, []);

  const firstMapping = () => {
    window.onLocationReceived = (locationJson) => {
      try {
        const result = JSON.parse(locationJson);
        if (!result.error && result.lat && result.lng) {
          const pos = { lat: result.lat, lng: result.lng };
          setCenter(pos);
          setMarkerPosition(pos);
          setAccuracy(result.accuracy || null);

          if (locationRetryRef.current) {
            clearInterval(locationRetryRef.current);
            locationRetryRef.current = null;
          }
        } else {
          showAlert("위치 정보를 가져올 수 없습니다. GPS를 확인해주세요.");
          setAccuracy(null);
        }
      } catch (e) {
        console.error("콜백 파싱 오류", e);
        setAccuracy(null);
      }
    };

    requestLocation();

    const maxRetry = 10;
    let retryCount = 0;

    locationRetryRef.current = setInterval(() => {
      if (retryCount >= maxRetry) {
        clearInterval(locationRetryRef.current);
        showAlert("위치 정보를 가져올 수 없습니다. GPS 상태를 확인해주세요.");
        return;
      }
      retryCount++;
      requestLocation();
    }, 2000);
  };

  // 버튼 클릭 핸들러 예시
  const onClickCurrentLocation = () => {
    if (!mapRef.current || !markerPosition) {
      console.warn("Map or markerPosition is not ready");
      return;
    }

    mapRef.current.panTo(markerPosition);
    setZoom(10); // 다른 값으로 임시 변경
    setTimeout(() => setZoom(18), 100); // 다시 18로 설정
    setNearbyMarkers([]); // 주변건물마커 삭제

    if(isRunning && startLocation && timerRef.current != null) {
      console.log("타이머 돌아가는중");
      return;
    }

    setStartLocation(null);
    setEndLocation(null);

    // firstMapping();
  };

  // 카메라기능
  useEffect(() => {
    // Android에서 사진을 받는 함수 등록
    window.onCameraImageReceived = (base64Image, walkId) => {
      uploadImageToServer(base64Image, walkId); // 서버로 업로드
    };

    // 컴포넌트 언마운트 시 함수 해제 (메모리 누수 방지)
    return () => {
      window.onCameraImageReceived = null;
    };
  }, []);

  // 카메라 열기 함수
  const openCamera = () => {
    if (isRunning) {
      // 안드로이드 WebView의 JavaScript 인터페이스가 있을 경우에만 호출
      if (window.Android && typeof window.Android.openCamera === "function") {
        window.Android.openCamera(walkId + ""); // 안드로이드 함수 호출
      } else {
        showAlert("Android 인터페이스를 사용할 수 없습니다.");
      }
    } else {
      showAlert("카메라는 산책전용기능입니다.\n 산책중에 이용해주세요.");
    }
  };

  // 서버로 Base64 이미지 업로드
  const uploadImageToServer = async (base64Image, walkId) => {
    if (isUploading) return; // ✅ 중복 방지
    setIsUploading(true);

    try {
      // base64 → Blob
      const blob = base64ToBlob(base64Image);

      // Blob → File 객체로 변환 (선택 사항)
      const file = new File([blob], "captured_image.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("files", file); // 서버에서 "files"라는 key로 받을 것
      formData.append("walkId", walkId); //  << 고유  WALKID 변수 넘기면됨

      if (!walkId) {
        console.error("walkId가 유효하지 않음:", walkId);
        showAlert(
          "walkId를 아직 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      const result = await imgSave(formData).unwrap();
      console.log("이미지 업로드 성공:", result);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      if (error.data) {
        console.error("서버 응답:", error.data);
      }
      showAlert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false); // ✅ 업로드 상태 해제
    }
  };

  // Base64 → Blob 변환 함수
  const base64ToBlob = (base64Data, contentType = "image/jpeg/jpg") => {
    const byteCharacters = atob(base64Data.split(",")[1]); // 헤더 제거 후 디코딩
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "800px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            fontFamily: "sans-serif",
          }}
        >
          {/* 상단 헤더 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Button
              onClick={() => navigate(-1)}
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "10px",
                height: "35px",
                minWidth: "0",
                width: "35px",
                marginLeft: "15px",
                marginTop: "10px",

                marginBottom: "20px",
                "&:hover": {
                  backgroundColor: "#363636",
                },
                backgroundColor: "rgba(54, 54, 54, 0.4)",
              }}
            >
              <img src={back} alt="" sx={{ pl: "2px" }}></img>
            </Button>

            <h2 style={{ flex: 1, textAlign: "center", margin: 0 }}>
              산책 기록
            </h2>
            <button
              onClick={openCamera}
              style={{ background: "none", border: "none", fontSize: "20px" }}
            >
              <img src={camera} slt=""
              style={{width:'30px', height:'30px'}}/>
            </button>
          </div>

          {/* 드롭다운 영역 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            {/* ⬅️ 내 위치로 이동 버튼 */}
            <button
              onClick={onClickCurrentLocation}
              style={{
                backgroundColor: "#889F7F",
                color: "white",
                padding: "1px 5px",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                whiteSpace: "nowrap",
                height: "32px",
                width: "80px",
                textAlign: "center",
              }}
            >
              내 위치
            </button>

            <div style={{ position: "relative" }}>
              {/* 현재 선택된 항목 버튼 */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={buttonBaseStyle}
              >
                {selectedItem}<span style={{position:'relative',fontSize:'10px',top:'-1px', }}> ▼</span>
              </button>

              {/* 드롭다운 메뉴 */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  width: "120px",
                  maxHeight: menuOpen ? "300px" : "0px",
                  opacity: menuOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  backgroundColor: "#889F7F",
                  borderRadius: "8px",
                  padding: menuOpen ? "4px 0" : "0",
                  boxShadow: menuOpen ? "0px 2px 5px rgba(0,0,0,0.1)" : "none",
                  zIndex: 10,
                }}
              >
                {dropdownItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    style={buttonBaseStyle}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 지도 영역 */}
          <div>
            <div style={{ width: "100%", height: "400px"}}>
              {center ? (
                <LoadScript googleMapsApiKey="AIzaSyBkqvUbxVClcx6PG5TGNx035c9_SZWt_-w">
                  <MapContainer
                    center={center}
                    zoom={zoom}
                    markerPosition={center}
                    startLocation={startLocation}
                    endLocation={endLocation}
                    nearbyMarkers={nearbyMarkers}
                    onMapLoad={handleMapLoad} // map 인스턴스 전달받기
                  />
                </LoadScript>
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  위치 찾는 중
                </div>
              )}
            </div>
          </div>

          {/* 위치 정확도 표시 */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "13px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            {/* 위치 정확도: {accuracy !== null ? `${accuracy} m` : "-"} */}
          </div>

          {/* 시작/종료 버튼 */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              onClick={() => {
                const action = isRunning ? "종료" : "시작";
                console.log(`${action} 버튼 클릭`);
                handleWalkAction(action); // 예: 백엔드 전송 등
              }}
              style={{
                backgroundColor: "#889F7F",
                color: "white",
                padding: "10px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              {isRunning ? "종료" : "시작"}
            </button>
          </div>

          {/* 스톱워치 */}
          <div
            style={{
              textAlign: "center",
              fontSize: "28px",
              fontFamily: "monospace",
              fontWeight:'700',
            }}
          >
            {formattedTime}
          </div>
        </div>
      </Box>
    </>
  );
};

export default WalkTracker;
