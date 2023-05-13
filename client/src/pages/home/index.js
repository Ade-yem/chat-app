import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";

const Home = ({ userName, setUserName, room, setRoom, socket }) => {

    const navigate= useNavigate();

    const joinRoom = () => {
        if (userName !== "" && room !== "") {
          console.log(userName)
          socket.emit("join_room", {userName, room});
        };
        
        navigate("/chat");
        
    };
  return (
    <div className={styles.container}>
      <form className={styles.formContainer} >
        <h1>{`<>DevRooms</>`}</h1>
        <input className={styles.input} onChange={(e)=> setUserName(e.target.value)} placeholder="Username..." />

        <select className={styles.input} onChange={(e)=> setRoom(e.target.value)}>
          <option>-- Select Room --</option>
          <option value="javascript">JavaScript</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="react">React</option>
        </select>

        <button className="btn btn-secondary" style={{ width: "100%" }} onClick={joinRoom}>
          Join Room
        </button>
      </form>
    </div>
  );
};

export default Home;

/* export default class Home extends React.Component{
  render() {
    const { userName, setUserName, room, setRoom, socket } = this.props;
    // const navigate= useNavigate();

    const joinRoom = () => {
        if (userName !== "" && room !== "") {
          console.log(userName)
            socket.emit("join_room", {userName, room});
        };
        return <Redirect to={("/chat", { replace: true })} />;
        // navigate("/chat", { replace: true });
    };

    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>{`<>DevRooms</>`}</h1>
          <input
            className={styles.input}
            onChange={(e) => {
              setUserName(e.target.value);
              console.log(userName);
            }}
            placeholder="Username..."
          />

          <select
            className={styles.input}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option>-- Select Room --</option>
            <option value="javascript">JavaScript</option>
            <option value="node">Node</option>
            <option value="express">Express</option>
            <option value="react">React</option>
          </select>

          <button
            className="btn btn-secondary"
            style={{ width: "100%" }}
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }
} */
