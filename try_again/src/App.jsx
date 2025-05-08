import './App.css';

import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Login from './page/user/Login';
import Register from './page/user/Register';
import UserUpdate from './page/user/UserUpdate';
import UserView from './page/user/UserView';
import BoardList from './page/board/BoardList';
import BoardView from './page/board/BoardView';
import BoardCreate from './page/board/BoardCreate';
import BoardUpdate from './page/board/BoardUpdate';
import Home from './page/Home';
import { setNavigate } from './cm/CmNavigateUtil';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';
import NewBoardList from './page/newboard/NewBoardList';
import NewBoardCreate from './page/newboard/NewBoardCreate';
import NewBoardUpdate from './page/newboard/NewBoardUpdate';
import NewBoardView from './page/newboard/NewBoardView';
const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
      <Routes>
        <Route path="/user/login.do" element={<LayoutNoLogin><Login /></LayoutNoLogin>} />
        <Route path="/" element={<LayoutLogin><Home /></LayoutLogin>} />
        <Route path="/user/join.do" element={<LayoutNoLogin><Register /></LayoutNoLogin>} />
        <Route path="/user/update.do" element={<LayoutLogin><UserUpdate /></LayoutLogin>} />
        <Route path="/user/view.do" element={<LayoutLogin><UserView /></LayoutLogin>} />
        <Route path="/board/list.do" element={<LayoutLogin><BoardList /></LayoutLogin>} />
        <Route path="/board/view.do" element={<LayoutLogin><BoardView /></LayoutLogin>} />
        <Route path="/board/create.do" element={<LayoutLogin><BoardCreate /></LayoutLogin>} />
        <Route path="/board/update.do" element={<LayoutLogin><BoardUpdate /></LayoutLogin>} />
        <Route path="/newBoard/list.do" element={<LayoutLogin><NewBoardList/></LayoutLogin>}/>
        <Route path="/newBoard/create.do" element={<LayoutLogin><NewBoardCreate/></LayoutLogin>}/>
        <Route path="/newBoard/update.do" element={<LayoutLogin><NewBoardUpdate/></LayoutLogin>}/>
        <Route path="/newBoard/view.do" element={<LayoutLogin><NewBoardView/></LayoutLogin>}/>
      </Routes>
      
  );
};

export default App;
