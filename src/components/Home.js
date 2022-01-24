import React from "react";
import HomeProducts from "./HomeProducts";
import { Nav, Navbar, Container } from "react-bootstrap";

function Home(props) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/home">RENT-DAR</Navbar.Brand>
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/register">Sign Up</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <div className="home-image"></div>
      <HomeProducts />
    </>
  );
}

export default Home;
