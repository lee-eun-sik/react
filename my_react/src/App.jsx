
import './App.css';

import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { setNavigate } from './cm/CmNavigateUtil';
import CmRouteChangeNotifier from './cm/CmRouteChangeNotifier';
import Home from './page/home/Home';
import WriteCreate from './page/write/WriteCreate';
import WriteList from './page/write/WriteList';
import WriteUpdate from './page/write/WriteUpdate';
import WriteView from './page/write/WriteView';
import DiaryCreate from './page/diary/DiaryCreate';
import First from './page/First'
import Main from './page/main';
import Position from './page/position/dnlcl';
import Combo from './page/combo/combo'
import Camera from './page/camera/camera'
import Alarm from './page/alarm/alarm'
import Alarmdb from './page/alarm/alarmdb'
import PlantCreate from './page/plant/PlantCreate';
import PlantUpdate from './page/plant/PlantUpdate';
import PlantWatering from './page/plant/PlantWatering';
import PlantSunlighting from './page/plant/PlantSunlighting';
import PlantRepotting from './page/plant/PlantRepotting.jsx';
import PlantPest from './page/plant/PlantPest';


import DiaryList from './page/diary/DiaryList';
import DiaryView from './page/diary/DiaryView';
import DiaryUpdate from './page/diary/DiaryUpdate';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';
import Login from './page/user/Login';
import Register from './page/user/Register';
import UserUpdate from './page/user/UserUpdate';
import UserView from './page/user/UserView';
import Pet_Form from './page/pet/Pet_Form';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Pet_Form_Update from './page/pet/Pet_Form_Update';
import Pet_Form_Hospital from './page/pet/Pet_Form_Hospital';
import Pet_Form_Eat_Alarm from './page/pet/Pet_Form_Eat_Alarm';
import Pet_Form_Training_And_Action from './page/pet/Pet_Form_Training_And_Action';

import FindId from './page/find/FindId';
import FindPw from './page/find/FindPw';
import Walk from './page/walk/walk';
import WalkRecord from './page/walk/walkRecord';
import ResetPassword from './page/find/ResetPassword';


import TestMain from './page/test/TestMain';
import TestPage from './page/test/TestPage';
import TestResult from './page/test/TestResult';
import Calendar from './page/calendar/Calendar';


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* 각페이지로 이동하는 버튼구현 */}
        {/* 안드로이드에서 확인하려는데 기본페이지만떠서 */}

        <Route path="/" element={<First />} />
        {/* <Route path="/" element={<Main />} /> */}

        <Route path="/position" element={<Position />} />
        <Route path="/combo" element={<Combo />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/alarmdb" element={<Alarmdb />} />
        {/* 회원가입, 로그인, 회원정보 */}
        <Route path="/user/join.do" element={<LayoutNoLogin><Register /></LayoutNoLogin>} />
        <Route path="/user/login.do" element={<LayoutNoLogin><Login /></LayoutNoLogin>} />
        <Route path="/user/update.do" element={<UserUpdate />} />
        <Route path="/user/view.do" element={<UserView />} />
        {/* 홈화면 */}
        <Route path="/Home.do" element={<Home />} />

        {/* 식물탭 */}
        <Route path="/PlantCreate.do" element={<PlantCreate />} />
        <Route path="/PlantUpdate.do" element={<PlantUpdate />} />
        <Route path="/PlantWatering.do" element={<PlantWatering />} />
        <Route path="/PlantSunlighting.do" element={<PlantSunlighting />} />
        <Route path="/PlantRepotting.do" element={<PlantRepotting />} />
        <Route path="/PlantPest.do" element={<PlantPest />} />



      
        {/* 게시판 */}
        <Route path="/write/create.do" element={<WriteCreate />} />
        <Route path="/write/list.do" element={<WriteList />} />
        <Route path="/write/update.do" element={<WriteUpdate />} />
        <Route path="/write/view.do" element={<WriteView />} />
        {/* 다이어리 */}
        <Route path="/diary/create.do" element={<DiaryCreate />} />
        <Route path="/diary/list.do" element={<DiaryList />} />
        <Route path="/diary/view.do" element={<DiaryView />} />
        <Route path="/diary/update.do" element={<DiaryUpdate />} />
        {/* 동물 탭*/}
        <Route path="/pet/petForm.do" element={<Pet_Form />} />
        <Route path="/pet/petFormUpdate.do" element={<Pet_Form_Update />} />
        <Route path="/pet/petFormHospital.do" element={<Pet_Form_Hospital />} />
        <Route path="/pet/petFormEatAlarm.do" element={<Pet_Form_Eat_Alarm />} />
        <Route path="/pet/petFormTrainingAndAction.do" element={<Pet_Form_Training_And_Action/>} />
        
        {/*아이디, 비번 찾기*/}
        <Route path="/find/findId.do" element={<FindId />} />
        <Route path="/find/findPw.do" element={<FindPw />} />
        <Route path="/find/resetPassword.do" element={<ResetPassword />} />

        {/*산책*/}
        <Route path="/pet/walk.do" element={<Walk />} />
        <Route path="/pet/walkRecord.do" element={<WalkRecord/>} />

        {/* 테스트 */}
        <Route path="/test/main.do" element={<TestMain/>}/>
        <Route path="/test/page.do" element={<TestPage/>}/>
        <Route path="/test/result.do" element={<TestResult/>}/>

        {/*달력*/}
        <Route path="/calendar.do" element={<Calendar/>}/>
      </Routes>
      <CmRouteChangeNotifier />
    </>

  );
};

export default App;
