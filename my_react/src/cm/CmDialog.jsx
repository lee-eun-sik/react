import { Dialog, DialogTitle, DialogActions, Button, Typography, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from 'react';
const CmDialog = ({ title = "알림", isOpen, setIsOpen, message, yesCallBack, noCallBack, type = 'alert', children}) => {
        // 다이얼로그 닫기
        const handleClose = () => {
          setIsOpen(false);
          if(type === "alert" && yesCallBack) {
            setTimeout(() => {
              yesCallBack();  
            }, 500);
          } 
          if(type !== "alert" && noCallBack) {
            setTimeout(() => {
              noCallBack();  
            }, 500);
          } 
        };

        // 확인 버튼 클릭 시
        const handleConfirm = () => {
          setIsOpen(false);
          if (yesCallBack) {
            setTimeout(() => {
              yesCallBack();  
            }, 500);
          }  
        };

        // 취소 버튼 클릭 시
        const handleCancel = () => {
          setIsOpen(false);
          if (noCallBack) {
            setTimeout(() => {
              noCallBack();  
            }, 500);
          } 
        };

        useEffect(() => {
         
        }, [yesCallBack, noCallBack]); 
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          borderBottom: '1px solid #e0e0e0',
          pb: 1,
        }}
      >
        {title}
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '20px 24px' }}>
        <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>
          {message}
          {children}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: type === 'alert' ? 'center' : 'flex-end', px: 3, pb: 2 }}>
        {type === 'alert' ? (
          <Button onClick={handleClose} variant="contained" sx={{backgroundColor:'#88AE97'}}>
            확인
          </Button>
        ) : (
          <>
            <Button onClick={handleCancel} variant="outlined" sx={{color:'#A44D4D', borderColor:'#A44D4D'}}>
              취소
            </Button>
            <Button onClick={handleConfirm} variant="contained" sx={{backgroundColor:'#88AE97'}}>
              확인
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CmDialog;
