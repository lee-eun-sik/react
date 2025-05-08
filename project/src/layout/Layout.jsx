// src/components/Layout.jsx
import React from "react";

import Header from './H';
import Footer from './F';

const Layout = ({ children}) => {


   
    return (
        <div>
            <Header />
            <div>{children}</div>

            <Footer />
        </div>
    );
};

// 감싸면 화면이 구성됨. 조립가능 
export default Layout;
// 감싸면 화면이 구성됨. 조립가능



