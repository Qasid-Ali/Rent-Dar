import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar";
import { db } from "../../firebase";
import { Button, Alert } from "react-bootstrap";
import ViewCategory from "./ViewCategory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactPaginate from "react-paginate";

export const ManageCategory = (props) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(categories.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  //--------------------------

  const [showModal, setShowModal] = useState(false);
  // trigger modal
  const triggerModal = (id, name) => {
    setShowModal(true);
    setName(name);
    setId(id);
  };
  // hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    db.collection("category").onSnapshot((snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
      );
    });
  }, []);

  const addCategory = (e) => {
    e.preventDefault();

    if (!categoryInput) {
      setError("*Input Field are required !");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      if (categoryInput.length < 3 || categoryInput.length > 20) {
        setError("*Enter correct name! Min 3 letters or Max 20 letters ");
        setTimeout(() => {
          setError("");
        }, 3000);
      } else {
        setError("");
        db.collection("category").add({
          name: categoryInput,
        });
        setSuccessMsg(" Added Category Successfully");
        setTimeout(() => {
          setSuccessMsg("");
          setCategoryInput("");
        }, 1000);
      }
    }
  };

  const deleteCat = (id) => {
    db.collection("category").doc(id).delete();
    setSuccessMsg("Category Deleted Successfully");
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };
  return (
    <>
      <NavBar />

      <div className="alert_msg my-4 p-3">
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        <form className="d-flex">
          <input
            type="text"
            placeholder="Add Category"
            className="form-control me-2"
            onChange={(e) => setCategoryInput(e.target.value)}
            value={categoryInput}
          />
          <Button
            style={{
              width: "40%",
            }}
            onClick={addCategory}
            type="submit"
          >
            Add Category
          </Button>
        </form>
        <p className="red">{error}</p>
      </div>
      <div>
        <table className="styled-table w-50">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map((category) => (
                <>
                  <tr>
                    <td>{category.name}</td>
                    <td>
                      <EditIcon
                        onClick={() => triggerModal(category.id, category.name)}
                        className="grey"
                      />

                      <DeleteIcon
                        onClick={() => deleteCat(category.id)}
                        className="red"
                      />
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
        {showModal === true && (
          <ViewCategory id={id} categoryName={name} hideModal={hideModal} />
        )}
      </div>

      <div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </div>
    </>
  );
};
export default ManageCategory;
