import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect("http://localhost:4000");

function App() {
  const [userName, setUserName] = useState(
    JSON.parse(localStorage.userName) || ""
  );
  const [room, setRoom] = useState(JSON.parse(localStorage.room) || "");
  
  useEffect(() => {
    localStorage.setItem("userName", JSON.stringify(userName));
  }, [userName]);
  
  useEffect(() => {
    localStorage.setItem("room", JSON.stringify(room));
  }, [room]);

  


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                userName={userName}
                setUserName={setUserName}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />

          <Route
            path="/chat"
            element={<Chat userName={userName} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
