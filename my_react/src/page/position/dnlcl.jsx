import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
//d
const containerStyle = {
  width: '370px',
  height: '400px',
};

const defaultCenter = { lat: 37.5665, lng: 126.9780 };

// 두 좌표 간 거리 계산 함수 (Haversine)
// const getDistanceFromLatLng = (lat1, lng1, lat2, lng2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371000;
//   const dLat = toRad(lat2 - lat1);
//   const dLng = toRad(lng2 - lng1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLng / 2) * Math.sin(dLng / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

const Dnlcl = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [lastRecordedPosition, setLastRecordedPosition] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
   const { showAlert } = useCmDialog();

  // 주변 장소 콜백 등록
  useEffect(() => {
    window.onNearbyPlaces = (json) => {
      try {
        const data = JSON.parse(json);
        console.log("주변 장소 데이터:", data);  // 이 부분 추가
        if (data.results) {
          const places = data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
          }));
          /* 이부분에서 병원 표에 대입할수있음 */
          showAlert("주변 병원:\n" + places.map(p => `${p.name} (${p.address})`).join('\n'));
        }
      } catch (e) {
        console.error("onNearbyPlaces 오류:", e);
      }
    };

    return () => {
      delete window.onNearbyPlaces;
    };
  }, []);

  // 초기 위치 설정
  useEffect(() => {
    if (window.Android?.receiveMessage) {
      try {
        const response = window.Android.receiveMessage(JSON.stringify({ type: "GET_LOCATION" }));
        const result = JSON.parse(response);
        if (!result.error && result.accuracy <= 20) {
          const pos = { lat: result.lat, lng: result.lng };
          setCenter(pos);
          setMarkerPosition(pos);
          setPath([pos]);
        }
      } catch (e) {
        console.error("초기 위치 오류:", e);
      }
    }
  }, []);

  // 위치 요청 함수
  const getCurrentLocation = () => {
    if (window.Android?.receiveMessage) {
      try {
        const response = window.Android.receiveMessage(JSON.stringify({ type: "GET_LOCATION" }));
        const result = JSON.parse(response);
        if (!result.error && result.accuracy <= 20) {
          const pos = { lat: result.lat, lng: result.lng };
          setCenter(pos);
          setMarkerPosition(pos);

          // if (lastRecordedPosition) {
          //   const dist = getDistanceFromLatLng(
          //     lastRecordedPosition.lat, lastRecordedPosition.lng,
          //     pos.lat, pos.lng
          //   );
          //   if (dist >= 5) {
          //     setDistance(prev => prev + dist);
          //     setPath(prev => [...prev, pos]);
          //     setLastRecordedPosition(pos);
          //   }
          // } else {
          //   setPath([pos]);
          //   setLastRecordedPosition(pos);
          // }
        }
      } catch (e) {
        console.error("위치 갱신 오류:", e);
      }
    }
  };

  // 트래킹 시작
  const startTracking = () => {
    if (!running) {
      setRunning(true);
      setEndLocation(null);
      // setDistance(0);
      setPath([]);
      setLastRecordedPosition(null);

      if (window.Android?.receiveMessage) {
        try {
          const response = window.Android.receiveMessage(JSON.stringify({ type: "GET_LOCATION" }));
          const result = JSON.parse(response);
          if (!result.error && result.accuracy <= 20) {
            const pos = { lat: result.lat, lng: result.lng };
            setStartLocation(pos);
            setCenter(pos);
            setMarkerPosition(pos);
            setPath([pos]);
            setLastRecordedPosition(pos);
          }
        } catch (e) {
          console.error("트래킹 시작 오류:", e);
        }
      }

      intervalRef.current = setInterval(getCurrentLocation, 2000);
    }
  };

  // 트래킹 중지
  const stopTracking = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);

      if (window.Android?.receiveMessage) {
        try {
          const response = window.Android.receiveMessage(JSON.stringify({ type: "GET_LOCATION" }));
          const result = JSON.parse(response);
          if (!result.error && result.accuracy <= 20) {
            const pos = { lat: result.lat, lng: result.lng };
            setEndLocation(pos);
            setCenter(pos);
            setMarkerPosition(pos);

            // const dist = lastRecordedPosition
            //   ? getDistanceFromLatLng(lastRecordedPosition.lat, lastRecordedPosition.lng, pos.lat, pos.lng)
            //   : 0;

            // if (dist >= 5) {
            //   // setDistance(prev => prev + dist);
            //   setPath(prev => [...prev, pos]);
            //   setLastRecordedPosition(pos);
            // }
          }
        } catch (e) {
          console.error("트래킹 종료 오류:", e);
        }
      }
    }
  };

  // 주변 병원 요청 버튼 클릭
  const btnClick = () => {
    // if (!markerPosition) {
    //   console.warn("위치 정보가 없습니다.");
    //   return;
    // }

    const { lat, lng } = center;

    if (window.Android?.getNearbyPlaces) {
      try {
        window.Android.getNearbyPlaces(lat, lng, 10000);
      } catch (e) {
        console.error("getNearbyPlaces 호출 실패:", e);
      }
    } else {
      console.warn("Android.getNearbyPlaces 함수 없음");
    }
  };

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBkqvUbxVClcx6PG5TGNx035c9_SZWt_-w">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={18}
          options={{ streetViewControl: false }}
        >
          {startLocation && (
            <Marker
              position={startLocation}
              label={{ text: "시작 위치", color: "black", fontWeight: "bold" }}
              icon={{
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: 'blue',
                fillOpacity: 1,
                strokeColor: 'blue',
                strokeWeight: 1,
                scale: 5,
              }}
            />
          )}

          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: 'black',
                fillOpacity: 1,
                strokeColor: 'black',
                strokeWeight: 1,
                scale: 6,
              }}
            />
          )}

          {endLocation && (
            <Marker
              position={endLocation}
              label={{ text: "종료 위치", color: "black", fontWeight: "bold" }}
              icon={{
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: 'green',
                fillOpacity: 1,
                strokeColor: 'green',
                strokeWeight: 1,
                scale: 5,
              }}
            />
          )}

          {/* 선긋는 코드 */}
          {/* {path.length > 1 && <Polyline path={path} options={{ strokeColor: '#FF0000' }} />} */}
        </GoogleMap>
      </LoadScript>

      <Box sx={{ mt: 2 }}>
        {/* <Typography variant="h6">총 거리: {distance.toFixed(1)}m</Typography> */}
        <Button onClick={startTracking} disabled={running} variant="contained" sx={{ mr: 1 }}>
          Start Tracking
        </Button>
        <Button onClick={stopTracking} disabled={!running} variant="contained" color="secondary">
          Stop Tracking
        </Button>
      </Box>

      <Button onClick={btnClick} color="secondary" sx={{ mt: 1 }}>
        주변 병원 찾기
      </Button>
    </>
  );
};

export default Dnlcl;
