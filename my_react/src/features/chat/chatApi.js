// src/features/chat/chatApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (roomId) => `/chat/messages/${roomId}`,
    }),
    postMessage: builder.mutation({
      query: (messageData) => ({
        url: '/chat/message',
        method: 'POST',
        body: messageData,
      }),
    }),
    getChatRooms: builder.query({
      query: () => '/chat/rooms',
    }),
    createChatRoom: builder.mutation({
      query: (roomData) => ({
        url: '/chat/room',
        method: 'POST',
        body: roomData,
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  usePostMessageMutation,
  useGetChatRoomsQuery,
  useCreateChatRoomMutation,
} = chatApi;