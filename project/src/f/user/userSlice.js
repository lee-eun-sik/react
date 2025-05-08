import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        alertCheck: false, // Corrected spelling of alertCheck
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setAlertCheck: (state, action) => {
            state.alertCheck = action.payload; // Corrected spelling of alertCheck
        },
    }
});

export const { setUser, clearUser, setAlertCheck } = userSlice.actions; // Corrected structure
export default userSlice.reducer;