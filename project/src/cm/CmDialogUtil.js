// src/cm/useCmDialog.js
import React, { createContext, useContext, useState } from 'react';
import CmDialog from './CmDialog'; // 다이얼로그 컴포넌트

const DialogContext = createContext();// 전역 관리할 때, 공통을 만들때 쓴다.

export const DialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('alert');
  const [title, setTitle] = useState('알림');
  const [yesCallBack, setYesCallBack] = useState(null);
  const [noCallBack, setNoCallBack] = useState(null);

  const showAlert = (msg, cb, dialogTitle = '알림') => {
    setTitle(dialogTitle);
    setMessage(msg);
    setType('alert');
    setYesCallBack(() => cb);
    setIsOpen(true);
  };

  const showConfirm = (msg, yCb, nCb, dialogTitle = '확인') => {
    setTitle(dialogTitle);
    setMessage(msg);
    setType('confirm');
    setYesCallBack(() => yCb);
    setNoCallBack(() => nCb);
    setIsOpen(true);
  };

  const DialogComponent = (
    <CmDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      message={message}
      title={title}
      type={type}
      yesCallBack={yesCallBack}
      noCallBack={noCallBack}
    />
  );

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, DialogComponent }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useCmDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useCmDialog must be used within DialogProvider');
  return ctx;
};
