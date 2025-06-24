// src/components/Layout.jsx
import React from 'react';
import { useCmDialog } from '../cm/CmDialogUtil';  

const LayoutNoLogin = ({ children }) => {
     const { DialogComponent } = useCmDialog();
  return (
    <div className="layout">
      <main>{children}{DialogComponent}</main>
    </div>
  );
};

export default LayoutNoLogin;
