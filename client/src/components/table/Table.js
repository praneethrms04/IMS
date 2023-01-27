import MaterialTable from "@material-table/core";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";
import { noteCreation } from "../../api/note";
import axios from "axios";

import { ExportCsv, ExportPdf } from "@material-table/exporters";

import { Delete, Edit } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { updateNoteDetails } from "../../api/note";

const TableList = () => {
  const [notes, setNotes] = useState([]);
  const [noteUpdationModal, setNoteUpdationModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  const [showaddmodal, setShowAddModal] = useState(false);

  // const updateSelectedCurrNote = (data) => setSelectedNote(data);
  const closeNoteUpdationModal = () => setNoteUpdationModal(false);

  useEffect(() => {
    fetchNotes();
    deleteNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // post api
  const createNote = async function getNotes(e) {
    e.preventDefault();
    const data = {
      itemName: e.target.itemName.value,
      ownerOfTheItem: e.target.ownerOfTheItem.value,
      vendorName: e.target.vendorName.value,
      lastServiceDate: e.target.lastServiceDate.value,
    };
    noteCreation(data)
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          alert("you have successfully created ..! please refresh it.");
          setShowAddModal(false);
          fetchNotes();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
// get api grab the data
  const fetchNotes = async function getNotes() {
    try {
      const { data } = await axios.get("http://localhost:5000/notes");
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };

  // update a note
  const editNote = (noteDetail) => {
    // console.log(noteDetail);
    const note = {
      id: noteDetail._id,
      itemName: noteDetail.itemName,
      ownerOfTheItem: noteDetail.ownerOfTheItem,
      vendorName: noteDetail.vendorName,
      lastServiceDate: noteDetail.lastServiceDate,
    };
    setNoteUpdationModal(true);
    setSelectedNote(note);
    console.log(note);
  };

  const handleNoteChange = (e) => {
    const tempNote = { ...selectedNote };
    if (e.target.name === "itemName") {
      selectedNote.itemName = e.target.value;
    } else if (e.target.name === "ownerOfItem") {
      selectedNote.ownerOfTheItem = e.target.value;
    } else if (e.target.name === "vendorName") {
      selectedNote.vendorName = e.target.value;
    } else if (e.target.name === "lastServiceDate") {
      selectedNote.lastServiceDate = e.target.value;
    }
    setSelectedNote(tempNote);
    console.log(tempNote);
  };
  const updateNote = (e) => {
    e.preventDefault();
    const data = {
      itemName: selectedNote.itemName,
      ownerOfTheItem: selectedNote.ownerOfItem,
      vendorName: selectedNote.vendorName,
    };
    try {
      updateNoteDetails(data, selectedNote.id)
        .then((res) => {
          const { status } = res;
          if (status === 200) {
            setNoteUpdationModal(false);
            fetchNotes();
          }
        })

        .catch((error) => {
          console.log(error.message);
        });
    } catch (err) {
      console.log(err);
      // show error in the modal
    }
  };
// Delete an Item
  const deleteNote = async function handleDelete(rowData) {
    try {
      let noteId = rowData._id;
      await axios.delete(`http://localhost:5000/notes/${noteId}`);
      //filter out the deleted note from the state
      // update state to remove the deleted note
      if (window.confirm("Are you sure you want to delete this note?")) {
        alert(
          "you have successfylly deleted ..! refresh the page to see the updated data"
        );
        setNotes(notes.filter((note) => note.id !== noteId));
      } else {
        setNotes(notes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: "itemName", field: "itemName" },
    { title: "ownerOfTheItem", field: "ownerOfTheItem" },
    { title: "vendorName", field: "vendorName" },
    { title: "lastServiceDate", field: "lastServiceDate" },
  ];

  return (
    <>
      <div className="text-center pt-3 pb-3">
        <button
          className="btn btn-lg btn-success"
          onClick={() => setShowAddModal(true)}
        >
          Add Note
        </button>
      </div>

      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={columns}
          data={notes}
          title="Item Details"
          actions={[
            {
              icon: Edit,
              tooltip: "Edit Theater",
              onClick: (event, rowData) => editNote(rowData),
            },

            {
              icon: Delete,
              tooltip: "Delete Theater",
              onClick: (event, rowData) => deleteNote(rowData),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            sorting: true,
            filtering: true,
            exportMenu: [
              {
                label: "Export PDF",
                exportFunc: (cols, datas) =>
                  ExportPdf(cols, datas, "Item Records"),
              },
              {
                label: "Export CSV",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "Item Records"),
              },
            ],
            headerStyle: {
              backgroundColor: "blue",
              color: "#fff",
              marginRight: "50px",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
          }}
        />
      </div>
      {noteUpdationModal && (
        <div>
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={noteUpdationModal}
            // onHide={setNoteUpdationModal(true)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Item Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onsubmit={updateNote}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3">
                    Item Name
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="text"
                      name="itemName"
                      value={selectedNote.itemName}
                      onChange={handleNoteChange}
                      placeholder="Name of the Item"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3">
                    Owner of the Item
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="text"
                      name="ownerOfItem"
                      value={selectedNote.ownerOfTheItem}
                      onChange={handleNoteChange}
                      placeholder="Owner of the Item"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3">
                    Vendor Name
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="text"
                      name="vendorName"
                      value={selectedNote.vendorName}
                      onChange={handleNoteChange}
                      placeholder="Vendor Name"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3">
                    Last Service Date
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="Date"
                      name="lastServiceDate"
                      onChange={handleNoteChange}
                      value={selectedNote.lastServiceDate}
                    />
                  </Col>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeNoteUpdationModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
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
              <form onSubmit={createNote} method="POST">
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
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="vendorName"
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
    </>
  );
};

export default TableList;
