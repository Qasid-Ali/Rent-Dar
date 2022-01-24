import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useAuth } from "./context/AuthContext";
import { db } from "./firebase";
import { Link, useHistory } from "react-router-dom";
import NavBar from "./NavBar";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [name, setName] = useState("");
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const docRef = db
      .collection("users")
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        setName(doc.data().name);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return docRef;
  }, [currentUser.email]);

  function handleSubmit(e) {
    e.preventDefault();

    if (name) {
      db.collection("users").doc(currentUser.email).update({
        name: name,
      });
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <NavBar />
      <div className="form-container">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "75vh" }}
        >
          <div className="w-100" style={{ maxWidth: "500px" }}>
            <div className="my-4 p-3">
              <h4>Rent-Dar</h4>
            </div>
            <Card className="shadow-lg p-3 mb-2 bg-white rounded">
              <Card.Body className="my-form my-3">
                <h4 className="mt-2">Update Profile</h4>
                <hr />

                {error && <Alert variant="danger">{error}</Alert>}
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  <label>Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    disabled
                    defaultValue={currentUser.email}
                  />

                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                  />

                  <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordConfirmRef}
                      placeholder="Leave blank to keep the same"
                    />
                  </Form.Group>
                  <Button
                    disabled={loading}
                    className="mt-5 p-2"
                    style={{ backgroundColor: "#5469D4", width: "100%" }}
                    type="submit"
                  >
                    Update
                  </Button>
                </Form>
                <div className="w-100 text-center mt-2">
                  <Link to="/">Cancel</Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
}
