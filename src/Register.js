import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert, Image, Container } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./firebase";
import GoogleIcon from "@mui/icons-material/Google";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  const register = () => {
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/dashboard");
  }, [user, loading]);

  return (
    <>
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
                <h4 className="mt-2">Create your account</h4>
                <hr />
                <form autoComplete="off">
                  <label className="label-form">Full Name</label>
                  <input
                    type="text"
                    className="form-control mt-3 p-2"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                  />
                  <label className="label-form">Email</label>
                  <input
                    type="text"
                    className="form-control mt-3 p-2"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                  />
                  <label className="label-form">Password</label>
                  <input
                    type="password"
                    className="form-control mt-3 p-2"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <Button
                    className="mt-5 p-2"
                    style={{ backgroundColor: "#5469D4", width: "100%" }}
                    onClick={register}
                  >
                    Sign Up
                  </Button>
                  <div className="text-center label-form"> Or </div>
                  <Button
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      width: "100%",
                    }}
                    onClick={signInWithGoogle}
                  >
                    Sign Up With Google Account <GoogleIcon />
                  </Button>
                </form>
              </Card.Body>
            </Card>
            <div className="text-center my-3">
              Already have an account?
              <Link className="form-link" to="/">
                &nbsp;Login
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Register;
