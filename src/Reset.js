import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "./firebase";
import { Card, Container, Button } from "react-bootstrap";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/dashboard");
  }, [user, loading]);

  return (
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
              <h4 className="mt-2">Reset Your Password</h4>
              <hr />
              <form autoComplete="off">
                <label className="label-form">Enter Email</label>
                <input
                  type="text"
                  className="form-control mt-3 p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  className="mt-5 p-2"
                  style={{ backgroundColor: "#5469D4", width: "100%" }}
                  onClick={() => sendPasswordResetEmail(email)}
                >
                  Send password reset email
                </Button>
              </form>
            </Card.Body>
          </Card>
          <div className="text-center my-3">
            Don't have an account?
            <Link className="form-link" to="/register">
              &nbsp;Register
            </Link>
            &nbsp;now.
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Reset;
