import { TextField, Box, Typography, Button } from "@mui/material";
import logo from "../../src/image/greenDay.png";
import '../../src/css/firstMain.css';
import { useNavigate } from 'react-router-dom'

const First = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Typography className="information"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '80px 10px 10px 10px',
            color: '#889F7F',
            fontWeight: '600',
            fontSize: '20px',
            lineHeight: '55px',
            letterSpacing: '1px'
          }}>
          우리 반려친구를 위한 소중한 하루<br />
          로그인하고 만나보세요
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <img src={logo} alt="" className="logo"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '350px',
            height: '350px'
          }}></img>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button className='login-btn'
          sx={{
            position: 'absolute',
            bottom: '70px',
            backgroundColor: '#4B6044',
            width: "180px",
            height: '45px',
            color: 'white',
            fontSize: '20px',
            fontWeight: '400',
            borderRadius: '10px'
          }}
          onClick={() => navigate(`/user/login.do`)}
        >
          로그인
        </Button>
      </Box>
    </>
  )
}
export default First;