
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    alertCheck: false, 
    alertCheckPoint: "",  
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.alertCheck = false;
      state.alertCheckPoint = "";
    },
    setAlertCheck: (state, action) => {
      state.alertCheck = action.payload; 
    },
    setAlertCheckPoint: (state, action) => {
      state.alertCheckPoint = action.payload; 
    }
  }
});

export const { setUser, clearUser, setAlertCheck, setAlertCheckPoint } = userSlice.actions;
export default userSlice.reducer;
