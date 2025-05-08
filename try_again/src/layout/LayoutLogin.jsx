// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useCmDialog } from '../cm/CmDialogUtil';  

const LayoutLogin = ({ children }) => {
     const { DialogComponent } = useCmDialog();
  return (
    <div className="layout">
      <Header />
      <main style={{ padding: '20px' }}>{children}</main>
      <Footer />
      {DialogComponent}
    </div>
  );
};

export default LayoutLogin;
