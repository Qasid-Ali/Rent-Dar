import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function SearchMessage(props) {
  const [data, setData] = useState({});
  const [itemEmail, setItemEmail] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    db.collection("messages")
      .where("itemEmail", "==", currentUser.email)
      .onSnapshot((snapshot) => {
        setItemEmail(snapshot.docs.map((doc) => doc.data().email));
      });
  }, []);

  useEffect(() => {
    db.collection("messages")
      .where("itemEmail", "==", currentUser.email)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  }, []);

  console.log(data);
  return (
    <div>
      {Object.keys(data).map((id, index) => {
        return (
          <>
            <p>
              {data[index].email != itemEmail[index + 1]
                ? data[index].email
                : ""}
            </p>
          </>
        );
      })}
    </div>
  );
}

export default SearchMessage;
