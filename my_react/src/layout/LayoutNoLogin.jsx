// src/components/Layout.jsx
import React from 'react';
import { useCmDialog } from '../cm/CmDialogUtil';  

const LayoutNoLogin = ({ children }) => {
     const { DialogComponent } = useCmDialog();
  return (
    <div className="layout">
      <main style={{ padding: '20px' }}>{children}{DialogComponent}</main>
    </div>
  );
};

export default LayoutNoLogin;
