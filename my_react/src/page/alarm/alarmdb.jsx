import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import 'react-toastify/dist/ReactToastify.css';
import {
  useAlarmListQuery,
  useAlarmUpdateMutation
} from "../../features/alarm/alarmApi";
import { Switch } from '@mui/material';


const Alarmdb = () => {
  const { showAlert } = useCmDialog();
  const { data, error, isLoading, refetch } = useAlarmListQuery({});
  const [alarmUpdate] = useAlarmUpdateMutation();
  const [alarmList, setAlarmList] = useState([]);
  // const [formattedTimes, setFormattedTimes] = useState([]);
  // const [alarmData, setAlarmData] = useState([]);
  const newFormattedTimes = [];

  useEffect(() => {
    alarmSet();
  }, []);

  const alarmSet = async () => {
     
    try {
      const response = await refetch();
      console.log('aaaaaaa', response);
      console.log("response.data:", response.data);
      console.log("response.data.success:", response.data.success, typeof response.data.success);
      console.log("response.data.data:", response.data.data, Array.isArray(response.data.data));

      if (response.data && Array.isArray(response.data?.data) && response.data.success) {
      console.log('전체 알람 리스트:', response.data.data);

      const alarms = response.data.data.map((alarm) => {
        const alarmId = parseInt(alarm.alarmId, 10);
        const year = 2000 + parseInt(alarm.year, 10);
        const month = alarm.month;
        const day = parseInt(alarm.day, 10);
        const hour = parseInt(alarm.hour, 10);
        const min = parseInt(alarm.min, 10);

        let cycleDays = 0;
        switch (alarm.alarmCycle) {
          case 'A01': cycleDays = 1; break;
          case 'A02': cycleDays = 2; break;
          case 'A03': cycleDays = 3; break;
          case 'A04': cycleDays = 5; break;
          case 'A05': cycleDays = 7; break;
          case 'A06': cycleDays = 14; break;
          default: cycleDays = 0;
        }

        let isactive;
        switch (alarm.activeYn) {
          case 'Y': isactive = true; break;
          case 'N': isactive = false; break;
        }

        // 시간 문자열 생성
        const formatted = `${year}-${month}-${day} ${hour}:${min} (주기: ${cycleDays}일)`;
        newFormattedTimes.push(formatted);

        return {
          type: "SET_ALARM",
          alarmId,
          year,
          month,
          day,
          hour,
          min,
          alarmCycle: cycleDays,
          enabled: isactive,  // 초기에는 켜져있다고 가정
          message: "알람아이디 : " + alarmId + " // " + cycleDays + "분주기"
          // message: "물 주는 시간입니다!"
        };
      });

      setAlarmList(alarms);
      

      // Android로 넘길 때는 enabled=true인 것만 필터해서 JSON 변환
      const activeData = alarms.filter(alarm => alarm.enabled === true);
      const alarmData = JSON.stringify(activeData);


        try {
          if (window.Android && window.Android.AlarmSet) {
            window.Android.AlarmSet(alarmData);
          } else {
            console.warn("Android 인터페이스를 찾을 수 없습니다.");
          }
        } catch (e) {
          console.error("Android Alarm 호출 중 오류:", e);
          showAlert("Android Alarm 호출 중 오류:");
        }


      } else {
        showAlert('데이터조회실패1');
        console.log('응답 구조 이상:', response.data);
      }
    } catch (error) {
      showAlert('데이터조회실패2');
      console.error(error);
    }
  };


  const toggleAlarm = (alarmId) => {
  setAlarmList(prevList =>
    prevList.map(alarm => {
      if (alarm.alarmId === alarmId) {
        const newEnabled = !alarm.enabled;

        if (newEnabled) {
          // 알람 켜기 - Android AlarmSet 호출
          if (window.Android && window.Android.AlarmSet) {
            const alarmData = JSON.stringify([alarm]);
            window.Android.AlarmSet(alarmData);
          }
        } else {
          // 알람 끄기 - Android cancelAlarm 호출
          if (window.Android && window.Android.cancelAlarm) {
            window.Android.cancelAlarm(String(alarmId));
          }
        }

        // 2. 서버 상태 업데이트
        alarmUpdate({
          alarmId: alarm.alarmId,
          activeYn: newEnabled ? 'Y' : 'N'
        }).unwrap()
          .then(() => {
            console.log(`서버 알람 ${alarmId} 상태 업데이트 완료`);
          })
          .catch(err => {
            console.error('알람 업데이트 실패', err);
            showAlert('알람 상태 업데이트 실패');
          });

        // 3. 프론트 상태 변경
        return { ...alarm, enabled: newEnabled };
      }
      return alarm;
    })
  );
};


  return (
    <>
      
      <Typography variant="h6" gutterBottom>
        알람 시간 목록:
      </Typography>
      {alarmList.map((alarm, idx) => (
        <Typography key={idx} variant="body1" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          • {`${alarm.year}-${alarm.month}-${alarm.day} ${alarm.hour}:${alarm.min} (주기: ${alarm.alarmCycle}일)`} 
          <Switch
            checked={alarm.enabled}
            onChange={() => toggleAlarm(alarm.alarmId)}
            color="primary"
            inputProps={{ 'aria-label': 'toggle alarm' }}
          />
        </Typography>
      ))}

      <button onClick={alarmSet}>
          알람 조회
      </button>




    </>
  );
};

export default Alarmdb;
