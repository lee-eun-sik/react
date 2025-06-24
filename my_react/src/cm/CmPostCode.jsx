
import DaumPostcode from 'react-daum-postcode';
import { TextField, Button, Grid } from '@mui/material';
import { useEffect, useState, forwardRef } from 'react';
import CmDialog from './CmDialog';
 
const CmPostCode = forwardRef(({addr, setAddr, addrD, setAddrD, postCode, setPostCode}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const postCodeStyle = {
    width: '400px',
    height: '500px',
  };

  const showPostCode = () => {
    setIsOpen((prevOpenState) => !prevOpenState);
  };

  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setAddr(address);
    setPostCode(zonecode);
  };

  const closeHandler = (state) => {
    if (state === 'FORCE_CLOSE') {
      setIsOpen(false);
    } else if (state === 'COMPLETE_CLOSE') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if(postCode&&!isOpen&&ref?.current)ref.current.focus();
  }, [postCode, isOpen, ref]);

 
  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <TextField type="text"  disabled value={postCode} label="우편번호" sx={{width: '100%'}} />
      </Grid>
      <Grid item xs={4}>
        <Button variant="outlined" onClick={showPostCode} size="large" sx={{height: 56, width: '100%'}} >
              주소 찾기
        </Button>
      </Grid>
      <Grid item xs={12} sx={{width: '100%'}}>
        <TextField type="text"   disabled value={addr} label="주소" sx={{width: '100%'}}/>
      </Grid>
      <Grid item xs={12} sx={{width: '100%'}}>
        <TextField type="text" inputRef={ref}   value={addrD}  inputProps={{maxLength: 30,}} onChange={(e) => setAddrD(e.target.value)} label="상세주소" sx={{width: '100%'}}/>
      </Grid>
    </Grid>  
     <CmDialog title="우편 번호" isOpen={isOpen} setIsOpen={setIsOpen} yesCallBack={ () => {
      setAddr("");
      setPostCode("");
     }}>
      <div>
        <DaumPostcode style={postCodeStyle} onClose={closeHandler} onComplete={completeHandler} />
      </div>
    </CmDialog>
    </>
  );
});

export default CmPostCode;