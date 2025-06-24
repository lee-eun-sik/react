import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';


const StyledTextField = styled(TextField)({
  '& .MuiFilledInput-root': {
    backgroundColor: '#D9D9D9',
    borderRadius: '20px',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: '#D9D9D9',
    },
    '&.Mui-focused': {
      backgroundColor: '#D9D9D9',
    },
    '&:before': {
      borderBottom: 'none !important', 
    },
    '&:after': {
      borderBottom: 'none !important',
    },
    '& input:-webkit-autofill': {
      boxShadow: '0 0 0 1000px #D9D9D9 inset',
      WebkitTextFillColor: 'black',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',  
  },
  '& .MuiInputLabel-root': {
    display: 'none',
  },
});

const UserTextField = ({ 
  type = 'text', 
  value, 
  onChange, 
  inputRef, 
  ...props 
}) => {
  return (
    <StyledTextField
      variant="filled" 
      type={type}
      value={value}
      onChange={onChange}
      inputRef={inputRef}
      disableUnderline={true} 
      hiddenLabel 
      InputProps={{ 
        disableUnderline: true, 
      }}
      {...props}
    />
  );
};

export default UserTextField;