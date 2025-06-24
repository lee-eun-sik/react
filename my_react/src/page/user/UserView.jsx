import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useViewQuery, useLogoutMutation, useUserDeleteMutation } from '../../features/user/userApi';
import { Typography, Box, Button, CircularProgress, Alert, Avatar } from '@mui/material';
import { clearUser, setAlertCheck } from '../../features/user/userSlice';
import { persistor } from '../../app/store';
import { useCmDialog } from '../../cm/CmDialogUtil';
import back from '../../image/backWhite.png';
import {
  useLogoutAlarmMutation,
  useDropAlarmMutation,
} from "../../features/alarm/alarmApi";

 const InfoDisplayRow = ({ label, value }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(217, 217, 217, 0.21)",
          paddingX:"10px",
          paddingY:"5px",
          borderRadius: '20px',
          width: '90%',
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="500"
         sx={{paddingX:"10px", backgroundColor:"white", borderRadius:"20px"}}>
          {value}
        </Typography>
      </Box>
    );
  };

const UserView = () => {
  const user = useSelector((state) => state.user.user);
  const id = user?.usersId;
  const { data, isLoading, error, isSuccess } = useViewQuery({ usersId: id });
  const [logout] = useLogoutMutation();
  const [userDelete] = useUserDeleteMutation();
  const userInfo = data?.data; // userInfo를 useState 없이 data에서 직접 파생
  const [profileImageUrl, setProfileImageUrl] = useState(null); // 프로필 이미지 URL 상태 추가
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert } = useCmDialog();
  const { showConfirm } = useCmDialog(); 
  const [logoutDeleteAlarm] = useLogoutAlarmMutation();
  const [dropDeleteAlarm] = useDropAlarmMutation();

  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      if (info.postFiles && info.postFiles.length > 0 && info.postFiles[0].postFileId) {
        setProfileImageUrl(`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${info.postFiles[0].postFileId}`);
      }
      //postFiles가 없지만 usersFileId는 있다면
      else if (info.usersFileId && info.usersFileId !== 0) {
        setProfileImageUrl(`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${info.usersFileId}`);
      }
      //둘 다 없는 경우
      else {
        setProfileImageUrl(null); // 프로필 이미지 없음
      }
    }
  }, [isSuccess, data]);

  const handleLogout = async () => {

    showConfirm(
      '로그아웃 하시겠습니까?',
      () => {
        // yes callback - 실행
        console.log('실행 확인');
        logOutYesCall();
      },
      () => {
        // no callback - 취소
        console.log('실행 취소');
      }
    );
  };

  const logOutYesCall = async () => {
    try {
      const response = await logoutDeleteAlarm({}).unwrap();
        
          // 알람 끄기 - Android cancelAlarm 호출
          if (window.Android && window.Android.cancelAlarm) {
            for (let i = 0; i < response?.data?.length; i++) {
              const alarmId = response.data[i].alarmId;
              window.Android.cancelAlarm(String(alarmId));
            }
          }

      await logout({}).unwrap();
      await persistor.purge(); //지속된(persisted) 모든 Redux 상태를 스토리지에서 완전히 삭제
    } catch (e) {
      // 실패해도 로그아웃 처리
    } finally {
      dispatch(clearUser());
      dispatch(setAlertCheck(true));
      navigate('/');
    }
  }

  const handleDeleteClick = async () => {
    showConfirm(
      '회원탈퇴 하시겠습니까?',
      () => {
        // yes callback - 실행
        console.log('실행 확인');
        DeleteYesCall();
      },
      () => {
        // no callback - 취소
        console.log('실행 취소');
      }
    );
  };

  const DeleteYesCall = async () => {
    try {

      const response2 = await dropDeleteAlarm({}).unwrap();
      console.log("response2 : ", response2);
        
          // 알람 끄기 - Android cancelAlarm 호출
          if (window.Android && window.Android.cancelAlarm) {
            for (let i = 0; i < response2?.data?.length; i++) {
              const alarmId = response2.data[i].alarmId;
              window.Android.cancelAlarm(String(alarmId));
            }
          }


      const response = await userDelete({ usersId: id }).unwrap();
      if (response.success) {
        dispatch(setAlertCheck(true));
        showAlert("회원탈퇴에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => navigate('/'));
      } else {
        showAlert(response.message || '회원탈퇴에 실패했습니다.');
      }
    } catch (error) {
      showAlert(error.data?.message || '회원탈퇴에 실패했습니다. 서버 오류 또는 네트워크 문제.');
    }
  }

 

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '640px',
        width: '100%',
        margin: '0 auto'
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">회원 정보를 불러오는 데 실패했습니다.</Alert>
      ) : userInfo ? (
        <>
          {/* 상단 배경색 영역 */}
          <Box
            sx={{
              width: '100%',
              height: '140px',
              backgroundColor: '#385C4F',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative', 
            }}
          >
            {/* 헤더 섹션: 뒤로가기 버튼과 중앙 정렬된 마이페이지 제목 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                mb: 3, 
                position: 'absolute', 
                top: 10,
                justifyContent: 'space-between',
              }}
            >
              {/* 뒤로가기 버튼 - 왼쪽 끝 */}
              <Button
                onClick={() => navigate(-1)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "10px",
                  height: "30px",
                  minWidth: "0",
                  width: "30px",
                  marginLeft: "10px",
                  "&:hover": {
                    backgroundColor: "#363636",
                  },
                }}
              >
                {/* img 태그에 style 속성을 직접 적용 */}
                <img src={back} alt="뒤로가기" style={{ height: "20px" }}></img>
              </Button>
              <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 0, color: "white" , marginLeft: '-10px'}}>
                  마이페이지
                </Typography>
              </Box>
              <Box sx={{ width: '30px', flexShrink: 0 }} />
            </Box>
            {/* 프로필 이미지 표시 부분 */}
            <Avatar
              src={profileImageUrl}
              alt="프로필 이미지"
              sx={{ width: 100, height: 100, mt: 10 }} // border 추가
            />
          </Box>
          {/* Information rows container */}
          <Box
            sx={{
              mt: "70px",
              mb: "20px", 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems:"center",
              gap: '40px',
            }}
          >
            <InfoDisplayRow label="닉네임" value={userInfo.usersName} />
            <InfoDisplayRow label="아이디" value={userInfo.usersId} />
            <InfoDisplayRow label="이메일" value={userInfo.usersEmail} />
            <InfoDisplayRow label="비밀번호" value={userInfo.usersPassword ? '********' : ''} />
          </Box>

          <Button
            onClick={() => navigate('/user/update.do')}
            variant="contained"
            sx={{ marginTop: 2, backgroundColor:'#385C4F', borderRadius:'15px', width:"150px"}}
          >
            회원정보 수정
          </Button>

          {/* 아래 추가: 링크 묶음 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
            {userInfo && ( // userInfo가 있을 때만 로그아웃 링크를 표시
              <>
                <Link
                  to="#" // 실제 페이지 이동은 없으므로 '#' 또는 '/' 등으로 설정 (onClick에서 처리)
                  onClick={handleDeleteClick}
                  style={{ 
                    textDecoration: 'underline',
                    textDecorationColor: '#555',
                    textUnderlineOffset: '3px',
                    color: '#555'}}
                >
                  회원 탈퇴
                </Link>
                <span>|</span> {/* 구분선 추가 (선택 사항) */}
                <Link
                  to="#" // 실제 페이지 이동은 없으므로 '#' 또는 '/' 등으로 설정 (onClick에서 처리)
                  onClick={handleLogout}
                  style={{ 
                    textDecoration: 'underline',
                    textDecorationColor: '#555',
                    textUnderlineOffset: '3px',
                    color: '#555' }}
                >
                  로그아웃
                </Link>
              </>
            )}
          </Box>

        </>
      ) : null}
    </Box>
  );
};

export default UserView;
