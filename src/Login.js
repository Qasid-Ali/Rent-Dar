import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Card, Container, Carousel } from "react-bootstrap";
import GoogleIcon from "@mui/icons-material/Google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const history = useHistory();

  useEffect(() => {
    if (loading) {
      return;
    }
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
                <h4 className="mt-2">Sign in to your account</h4>
                <hr />
                <form autoComplete="off">
                  <label className="label-form">Email</label>
                  <input
                    type="text"
                    className="form-control mt-3 p-2"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="form-label-pass label-form">
                    <label>Password</label>
                    <Link to="/reset">Forgot Password</Link>
                  </div>
                  <input
                    type="password"
                    className="form-control mt-3 p-2"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="mt-5 p-2"
                    style={{ backgroundColor: "#5469D4", width: "100%" }}
                    onClick={() => signInWithEmailAndPassword(email, password)}
                  >
                    Login
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
                    Sign to Your Google Account <GoogleIcon />
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
            <div className="text-center">
              <Link className="form-link" to="/home">
                &copy;Rent-dar
              </Link>
              &nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Login;
