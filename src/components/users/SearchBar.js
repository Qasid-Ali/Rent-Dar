import React, { useState } from "react";
import { Card, Form, FormControl, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function SearchBar(props) {
  const [search, setSearch] = useState("");
  const history = useHistory();
  //  saerch result
  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/searchUser?name=${search}`);
    setSearch("");
  };

  return (
    <div className="alert_msg my-4 p-3">
      <Form className="d-flex" onSubmit={handleSubmit}>
        <FormControl
          type="search"
          placeholder="Search Users By Name"
          className="me-2"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Button variant="outline-secondary" onClick={handleSubmit}>
          Search
        </Button>
      </Form>
    </div>
  );
}

export default SearchBar;
