// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';

import userReducer from '../features/user/userSlice';
import { userApi } from '../features/user/userApi';
import { boardApi } from '../features/board/boardApi';
import { fileApi } from '../features/file/fileApi';
import { newBoardApi } from '../features/newBoard/newBoardApi';

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ['user']
};

const rootReducer = combineReducers({
  user: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [newBoardApi.reducerPath]: newBoardApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(
        userApi.middleware,
        boardApi.middleware,
        fileApi.middleware,
        newBoardApi.middleware
      )
});

export const persistor = persistStore(store);