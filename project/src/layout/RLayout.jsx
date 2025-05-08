// src/components/Layout.jsx
import React from "react";
import Header from './H';
import Footer from './F';
import { Outlet } from "react-router-dom";
const RLayout = () => {

    return (
        <div>

            <Header />
            <Outlet/> 
            <Footer />
        </div>
    );
};
// 감싸면 화면이 구성됨. 조립가능 


export default RLayout;