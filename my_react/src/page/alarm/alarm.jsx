import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { Button, Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCmDialog } from '../../cm/CmDialogUtil';

const Alarm = () => {
  const [formattedTime, setFormattedTime] = useState('');
  const { showAlert } = useCmDialog();

  useEffect(() => {
  const alarmData = {
    type: "SET_ALARM",
    time: "2025-06-04T14:00:30",
    message: "물 주는 시간입니다!"
  };

  const jsonString = JSON.stringify(alarmData);
  console.log("전달할 알람 JSON:", jsonString);

  // 시간 포맷 변환
    const date = new Date(alarmData.time);
    const formatted = `${date.getFullYear()}.
                      ${String(date.getMonth() + 1).padStart(2, '0')}.
                      ${String(date.getDate()).padStart(2, '0')}
                      ${String(date.getHours()).padStart(2, '0')}:
                      ${String(date.getMinutes()).padStart(2, '0')}:
                      ${String(date.getSeconds()).padStart(2, '0')}`;
    setFormattedTime(formatted);

  try {
    if (window.Android && window.Android.Alarm) {
      window.Android.Alarm(jsonString);
    } else {
      console.warn("Android 인터페이스를 찾을 수 없습니다.");
    }
  } catch (e) {
    console.error("Android Alarm 호출 중 오류:", e);
    showAlert("Android Alarm 호출 중 오류:");
  }
}, []);


  const showToast = () => {
    toast.success("물 주는 시간입니다!", {
      icon: <span style={{ fontSize: "20px" }}>🌱</span>
      // <img src="../../icon/Plant_Icon.png" alt="plant icon" width={24} height={24} />
    });
  };


  return (
    <>
      
      <Typography variant="h6" gutterBottom>
        알람 시간: {formattedTime}
      </Typography>

      <Button variant="contained" onClick={showToast}>
        알람 토스트 띄우기
      </Button>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}  //false로 설정하면 자동 닫힘 안 함.
        hideProgressBar={true}  //false이므로 진행바가 보임. true로 바꾸면 진행바 숨김.
        newestOnTop={false}  //새 토스트를 위에 쌓을지 여부    true이면 최신 알림이 위로 올라옴.
        closeOnClick    //토스트 클릭 시 닫히게 할지 여부.  이 속성이 포함되어 있으므로 클릭하면 닫힘.
        rtl={false}
        pauseOnFocusLoss  //브라우저 탭을 벗어났을 때(포커스를 잃었을 때) 토스트의 자동 닫힘 타이머를 일시 정지할지 여부. 기본적으로 true
        draggable   //사용자가 토스트를 마우스로 드래그해서 위치 이동 가능하게 할지 여부.
        pauseOnHover  //마우스를 올렸을 때 자동 닫힘 타이머를 멈출지 여부. 마우스를 올려두면 닫히지 않고 유지됩니다.

        // toastStyle={{
        //   borderRadius: "12px",
        //   backgroundColor: "#333",
        //   color: "#fff",
        // }}
      />

      <button onClick={() => {
          if (window.Android && window.Android.cancelAlarm) {
              window.Android.cancelAlarm();
          } else {
              showAlert("AndroidInterface is not available.");
          }
      }}>
          알람 취소
      </button>



    </>
  );
};

export default Alarm;
