import React, { useState } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoom = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);

  const connect = () => {
    console.log("connect 함수 호출됨");
    if (!username.trim()) {
      alert("닉네임을 입력하세요");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      debug: (str) => {
        console.log("STOMP debug: ", str);
      },
      onConnect: (frame) => {
        console.log("Connected: ", frame);
        setConnected(true);
        setStompClient(client);

        client.subscribe("/topic/public", (msg) => {
          console.log("Received message:", msg.body);
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        });

        client.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({
            sender: username,
            type: "JOIN"
          }),
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketClose: (evt) => {
        console.log("WebSocket closed", evt);
        setConnected(false);
        setStompClient(null);
      },
      onWebSocketError: (evt) => {
        console.error("WebSocket error", evt);
      },
    });

    client.activate();
  };

  const sendMessage = () => {
    if (message.trim() && stompClient) {
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
          sender: username,
          content: message,
          type: "CHAT"
        }),
      });
      setMessage("");
    }
  };

  return (
    <div>
      {!connected ? (
        <div>
          <input
            placeholder="닉네임 입력"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <button onClick={connect}>입장</button>
        </div>
      ) : (
        <div>
          <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc" }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.type === "JOIN" || msg.type === "LEAVE" ? (
                  <em>{msg.sender}님이 {msg.type === "JOIN" ? "입장" : "퇴장"}하셨습니다.</em>
                ) : (
                  <strong>{msg.sender}: {msg.content}</strong>
                )}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>보내기</button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;