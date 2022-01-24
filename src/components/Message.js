import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "../firebase";
import firebase from "firebase";
import { useAuth } from "../context/AuthContext";
import "./Message.css";

import { NotFound } from "./NotFound";
import Left from "@mui/icons-material/ArrowBack";

import { Link, useLocation, useParams } from "react-router-dom";
import NavBar from "../NavBar";

function Message() {
  const [user] = useAuthState(auth);
  const { currentUser } = useAuth();
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  return (
    <>
      <NavBar />
      <div className="mt-4"></div>
      <div className="App">
        <header>
          <Link to="/dashboard" style={{ color: "#fff" }}>
            <Left />
            Go Back
          </Link>
          <h1> Chats 💬</h1>
          <p>You : {currentUser.email}</p>
        </header>

        <section>
          <ChatRoom />
        </section>
      </div>
    </>
  );
}

function ChatRoom() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { currentUser } = useAuth();
  const dummy = useRef();
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: currentUser.uid,
      email: currentUser.email,
      itemEmail: path,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages && messages.map((msg) => <ChatMessage message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form className="form_message" onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type Message .... "
        />

        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, email, itemEmail } = props.message;
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState();

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const messageClass = uid === currentUser.uid ? "sent" : "received";

  return (
    <>
      {path === itemEmail || currentUser.email === itemEmail ? (
        <div className={`message ${messageClass}`}>
          <p className="message_text">{text}</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Message;
