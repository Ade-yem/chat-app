import styles from "./styles.module.css";
import React, { useState, useEffect, useRef } from "react";


const Messages = ({socket}) => {
  const [messagesReceived, setMessagesReceived] = useState(
    JSON.parse(localStorage.messagesReceived) || []
  );
  const messagesColumnRef = useRef(null);
  const [typing, setTyping] = useState();
  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    //like componentDidMount
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          userName: data.userName,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });
    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);
  
    useEffect(() => {
      localStorage.setItem("messages", JSON.stringify(messagesReceived));
    }, [messagesReceived]);


  useEffect(() => {
    socket.on("typing_message", (data) => {
      console.log(data)
      setTyping(data);
    });
    return () => socket.off("typing_message");
  }, [socket]);

  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesReceived]);


  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }



  
  return (
    <div>
      <div>
        <p>{typing}</p>
      </div>
      <div className={styles.messagesColumn} ref={messagesColumnRef}>
        {messagesReceived.map((msg, i) => (
          <div className={styles.message} key={i}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={styles.msgMeta}>{msg.userName}</span>
              <span className={styles.msgMeta}>
                {formatDateFromTimestamp(msg.__createdtime__)}
              </span>
            </div>
            <p className={styles.msgText}>{msg.message}</p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;