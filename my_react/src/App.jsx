import './App.css';

import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Login from './page/user/login';
import Join from './page/user/join';
import Manager from './page/user/manager';
import Main from './page/user/main';
import UserInfo from './page/user/userInfo';
import Home from '../../my_react/src/page/Home';
import { setNavigate } from './cm/CmNavigateUtil';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';
import ReservationList from './page/reservation/Reservationlist'; 
import Memberlist from './page/member/Memberlist';

import FindId from './page/find/FindId';
import FindPw from './page/find/FindPw';
import ResetPassword from './page/find/ResetPassword';
import ChatRoom from './page/chat/ChatRoom';
import ActivityList from './page/calendar/CalendarView';
import CalenderDairyPage from './page/calendar/CalendarDairyPage';
import CalenderView from './page/calendar/CalendarView';
import FilterBar from './page/calendar/FilterBar';
import PetForm from './page/pet/Pet_Form';
import PetFormUpdate from './page/pet/Pet_Form_Update';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
      <Routes>

        <Route path="/" element={<LayoutLogin><Home /></LayoutLogin>} />
        <Route path="/user/login.do" element={<LayoutNoLogin><Login /></LayoutNoLogin>} />
        <Route path="/user/join.do" element={<LayoutNoLogin><Join /></LayoutNoLogin>} />
        <Route path="/user/manager.do" element={<LayoutNoLogin><Manager/></LayoutNoLogin>} />
        <Route path="/user/main.do" element={<LayoutNoLogin><Main/></LayoutNoLogin>} />
        <Route path="/user/userInfo.do" element={<LayoutNoLogin><UserInfo/></LayoutNoLogin>} />
        <Route path="/reservation/list.do" element={<LayoutNoLogin><ReservationList/></LayoutNoLogin>} />
        <Route path="/member/list.do" element={<LayoutNoLogin><Memberlist/></LayoutNoLogin>} />
        <Route path="/find/findId.do" element={<LayoutNoLogin><FindId /></LayoutNoLogin>} />
        <Route path="/find/findPw.do" element={<LayoutNoLogin><FindPw /></LayoutNoLogin>} />
        <Route path="/find/resetPassword.do" element={<LayoutNoLogin><ResetPassword /></LayoutNoLogin>} />
        <Route path="/chat/chatRoom.do" element={<LayoutNoLogin><ChatRoom/></LayoutNoLogin>} /> 
        <Route path="/calendar/activityList.do" element={<LayoutNoLogin><ActivityList></ActivityList></LayoutNoLogin>} />
        <Route path="/calendar/calendarDairyPage.do" element={<LayoutNoLogin><CalenderDairyPage></CalenderDairyPage></LayoutNoLogin>} />
        <Route path="/calendar/calendarView.do" element={<LayoutNoLogin><CalenderView></CalenderView></LayoutNoLogin>} />
        <Route path="/calendar/FilterBar.do" element={<LayoutNoLogin><FilterBar></FilterBar></LayoutNoLogin>} />      
        <Route path="/pet/petForm.do" element={<LayoutNoLogin><PetForm></PetForm></LayoutNoLogin>} />
        <Route path="/pet/petFormUpdate.do" element={<LayoutNoLogin><PetFormUpdate></PetFormUpdate></LayoutNoLogin>} />
      </Routes>
      
  );
};

export default App;
