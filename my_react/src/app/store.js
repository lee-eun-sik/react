// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../features/user/userApi";
import { boardApi } from "../features/board/boardApi";
import { fileApi } from "../features/file/fileApi";
import { findApi} from "../features/find/findApi";
import useReducer from "../features/user/userSlice";
import storageSession from "redux-persist/lib/storage/session"; // sessionStorage로 변경
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { reservationApi } from "../features/reservation/reservationApi";
import { memberApi } from "../features/member/memberApi";
import { chatApi } from "../features/chat/chatApi";
import { petApi } from "../features/pet/petApi";
const persistConfig = {
    key: 'root',
    storage: storageSession, // sessionStorage로 변경
    whitelist: ['user'] // user slice만 저장
};

const rootReducer = combineReducers({
    user: useReducer,
    [userApi.reducerPath]: userApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [reservationApi.reducerPath]: reservationApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [findApi.reducerPath]: findApi.reducer,
    [petApi.reducerPath]: petApi.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(userApi.middleware, boardApi.middleware, fileApi.middleware, reservationApi.middleware, memberApi.middleware
            , findApi.middleware, chatApi.middleware, petApi.middleware 
        )// 넣어주고 관리하기
});

export const persistor = persistStore(store);