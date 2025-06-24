import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: '12px', marginTop: '40px' }}>
      <button onClick={() => navigate('/position')} style={{ padding: '12px 24px' }}>
        위치 페이지 이동
      </button>
      <button onClick={() => navigate('/combo')} style={{ padding: '12px 24px' }}>
        콤보 페이지 이동
      </button>
      <button onClick={() => navigate('/camera')} style={{ padding: '12px 24px' }}>
        카메라 페이지 이동
      </button>
      <button onClick={() => navigate('/alarm')} style={{ padding: '12px 24px' }}>
        알람 페이지 이동
      </button>
      <button onClick={() => navigate('/alarmdb')} style={{ padding: '12px 24px' }}>
        알람db조회 페이지 이동
      </button>
      <button onClick={() => navigate('/plantcreate.do')} style={{ padding: '12px 24px' }}>
        식물 등록 페이지 이동
      </button>
      <button onClick={() => navigate('/diary/create.do')} style={{ padding: '12px 24px' }}>
        일기 등록 페이지 이동
      </button>
      <button onClick={() => navigate('/user/join.do')} style={{ padding: '12px 24px' }}>
        회원가입 페이지 이동
      </button>
      <button onClick={() => navigate('/user/login.do')} style={{ padding: '12px 24px' }}>
        로그인 페이지 이동
      </button>
      <button onClick={() => navigate('/plantwatering.do')} style={{ padding: '12px 24px' }}>
        식물 물주기 페이지 이동
      </button>
      <button onClick={() => navigate('/pet/petForm.do')} style={{ padding: '12px 24px' }}>
        동물 등록 페이지 이동
      </button>
      <button onClick={() => navigate('/pet/petFormUpdate.do')} style={{ padding: '12px 24px' }}>
        동물 등록 수정 페이지 이동
      </button>
      <button onClick={() => navigate('/pet/petFormHospital.do')} style={{ padding: '12px 24px' }}>
        동물 등록 병원진료 페이지 이동
      </button>
      <button onClick={() => navigate('/pet/walk.do?id=1')} style={{ padding: '12px 24px' }}>
        펫산책 페이지 이동
      </button>
    </div>
  );
};

export default Main;
