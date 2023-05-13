import styles from './styles.module.css';
import React, { useState } from 'react';

const SendMessage = ({ socket, userName, room }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      console.log(message)
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { userName, room, message, __createdtime__ });
      setMessage('');
    }
  };

  const handleTyping =() => {
    socket.emit("typing", {userName, room});
  }

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyDown={handleTyping}
      />
      <button className='btn btn-primary' onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default SendMessage;