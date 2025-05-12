import './App.css'; // 큰 태그를 만들어서 쓴다. 컴포넌트는 태그를 만든다. 컴포넌트 = 태그, 재사용성 공용 컴포넌트를 다른 컴포넌트에 가져다 씀.
// 가상 DOM을 띄워줌. 변경된 애만 교체해서 새로 만든다. 부분만 새로 그림 메모리적으로 효율적으로 쓴다. 
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';

import Ex1 from './Ex1';
import Ex2 from './Ex2';
import Ex3 from './Ex3';
import Ex4 from './Ex4';
import Ex5 from './Ex5';
import Ex7 from './Ex7';
import Ex8 from './Ex8';
import Ex9 from './Ex9';
import Ex10 from './Ex10';
import Ex11 from './Ex11';
import Ex12 from './page/newboard/Ex12';

import Join from './Join';
import Update from './Update';
import Delete from './Delete';

import Layout from './layout/Layout';
import RLayout from './layout/RLayout';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';

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

import NewBoardList from './page/newboard/NewBoardList';
import NewBoardCreate from './page/newboard/NewBoardCreate';
import NewBoardUpdate from './page/newboard/NewBoardUpdate';
import NewBoardView from './page/newboard/NewBoardView';

const App = () => {
  const [isLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Ex routes */}
      <Route path="/" element={<Ex1 ex1="123" ex2="456" />} />
      <Route path="/ex1" element={<Layout><Ex1 ex1="123" ex2="456" /></Layout>} />
      <Route path="admin" element={<RLayout />}>
        <Route path="ex2" element={<Ex2 isLogin={isLogin} name="최재길" />} />
        <Route path="ex3" element={<Ex3 />} />
        <Route path="ex4" element={<Ex4 />} />
      </Route>
      <Route path="/ex5/:id/:pw" element={<Ex5 />} />
      <Route path="/ex7" element={<Ex7 />} />
      <Route path="/ex8" element={<Ex8 />} />
      <Route path="/ex9" element={<Ex9 />} />
      <Route path="/ex10" element={<Ex10 />} />
      <Route path="/ex11" element={<Ex11 />} />
      <Route path="/join" element={<Join />} />
      <Route path="/update" element={<Update />} />
      <Route path="/Delete" element={<Delete />} />
      <Route path="*" element={<h1>페이지를 찾을 수 없습니다</h1>} />

      {/* User routes */}
      <Route path="/user/login.do" element={<LayoutNoLogin><Login /></LayoutNoLogin>} />
      <Route path="/user/join.do" element={<LayoutNoLogin><Register /></LayoutNoLogin>} />
      <Route path="/user/update.do" element={<LayoutLogin><UserUpdate /></LayoutLogin>} />
      <Route path="/user/view.do" element={<LayoutLogin><UserView /></LayoutLogin>} />

      {/* Home */}
      <Route path="/home" element={<LayoutLogin><Home /></LayoutLogin>} />

      {/* Board routes */}
      <Route path="/board/list.do" element={<LayoutLogin><BoardList /></LayoutLogin>} />
      <Route path="/board/view.do" element={<LayoutLogin><BoardView /></LayoutLogin>} />
      <Route path="/board/create.do" element={<LayoutLogin><BoardCreate /></LayoutLogin>} />
      <Route path="/board/update.do" element={<LayoutLogin><BoardUpdate /></LayoutLogin>} />

      {/* NewBoard routes */}
      <Route path="/newBoard/list.do" element={<LayoutLogin><NewBoardList /></LayoutLogin>} />
      <Route path="/newBoard/create.do" element={<LayoutLogin><NewBoardCreate /></LayoutLogin>} />
      <Route path="/newBoard/update.do" element={<LayoutLogin><NewBoardUpdate /></LayoutLogin>} />
      <Route path="/newBoard/view.do" element={<LayoutLogin><NewBoardView /></LayoutLogin>} />
      <Route path="/newBoard/Ex12" element={<LayoutLogin><Ex12 /></LayoutLogin>} />
    </Routes>
  );
};

// 루트에 BrowserRouter로 App을 감싸기
export default App; 