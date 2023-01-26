import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

import TableList from "../../components/table/Table";
import { noteCreation } from "../../api/note";

const Home = () => {
  const [showaddmodal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchNotes();
    // updateNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async function getNotes() {
    try {
      const { data } = await axios.get("http://localhost:5000/notes");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createNote = async function getNotes(e) {
    e.preventDefault();
    const data = {
      itemName: e.target.itemName.value,
      ownerOfTheItem: e.target.ownerOfTheItem.value,
      venderName: e.target.venderName.value,
      lastServiceDate: e.target.lastServiceDate.value,
    };
    noteCreation(data)
      .then((response) => {
        if(response.status === 200){

          console.log("hello");
          setShowAddModal(false);
          fetchNotes();
        }
      })
      .catch((error)=> {
        console.log(error);
      });
  };

  // const createTicket = (e) => {
  //   e.preventDefault();
  //   const data = {
  //     title: e.target.title.value,
  //     description: e.target.description.value,
  //   };

  //   ticketCreation(data)
  //     .then(function (response) {
  //       setMessage("Ticket Created Successfully!");
  //       setCreateTicketModal(false);
  //       fetchTickets();
  //     })
  //     .catch(function (error) {
  //       if (error.response.status === 400) {
  //         setMessage(error.response.data.message);
  //       } else if (error.response.status === 401) {
  //         logoutFn();
  //       } else {
  //         console.log(error);
  //       }
  //     });
  // };

  return (
    <div>
      <div className="text-center">
        <button
          className="btn btn-lg btn-success"
          onClick={() => setShowAddModal(true)}
        >
          Add Note
        </button>
      </div>
      <div>
        {showaddmodal ? (
          <Modal
            show={showaddmodal}
            backdrop="static"
            centered
            onHide={() => setShowAddModal(false)}
          >
            <Modal.Header closeButton>Create a new Ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={createNote}>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="itemName"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    Owner of the Item
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="ownerOfTheItem"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    Vender Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="venderName"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    lastServiceDate
                  </label>
                  <input
                    type="Date"
                    className="form-control"
                    name="lastServiceDate"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="m-1" type="submit" variant="success">
                    Create
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
      </div>
      <TableList />
    </div>
  );
};

export default Home;
