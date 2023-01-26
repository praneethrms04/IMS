import MaterialTable from "@material-table/core";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

import { Delete, Edit } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { updateNoteDetails } from "../../api/note";

const TableList = () => {
  const [notes, setNotes] = useState([]);
  const [noteUpdationModal, setNoteUpdationModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  // const updateSelectedCurrNote = (data) => setSelectedNote(data);
  const closeNoteUpdationModal = () => setNoteUpdationModal(false);

  useEffect(() => {
    fetchNotes();
    deleteNote();
    // updateNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async function getNotes() {
    try {
      const { data } = await axios.get("http://localhost:5000/notes");
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };
  // const updateNote = async function handleEdit(id, updatedNote) {
  //   console.log(id);
  //   try {
  //     await axios.put(`http://localhost:5000/notes/${id}`, updatedNote);
  //     //find the index of the note to be edited
  //     const index = notes.findIndex((note) => note.id === id);
  //     //create a new array with the edited note
  //     const updatedNotes = [
  //       ...notes.slice(0, index),
  //       updatedNote,
  //       ...notes.slice(index + 1),
  //     ];
  //     setNotes(updatedNotes);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const editNote = (noteDetail) => {
    // console.log(noteDetail);
    const note = {
      id: noteDetail._id,
      itemName: noteDetail.itemName,
      ownerOfItem: noteDetail.ownerOfItem,
      vendorName: noteDetail.vendorName,
      lastServiceDate: noteDetail.lastServiceDate,
    };
    setNoteUpdationModal(true);
    setSelectedNote(note);
    console.log(note);
  };

  // const updateNote = (noteDetail) => {
  //   setSelectedNote({ ...noteDetail });
  //   setNoteUpdationModal(true);
  // };

  const handleNoteChange = (e) => {
    const tempNote = { ...selectedNote };
    if (e.target.name === "itemName") {
      selectedNote.itemName = e.target.value;
    } else if (e.target.name === "ownerOfItem") {
      selectedNote.ownerOfItem = e.target.value;
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
      ownerOfItem: selectedNote.ownerOfItem,
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

  const deleteNote = async function handleDelete(rowData) {
    try {
      let noteId = rowData._id;
      await axios.delete(`http://localhost:5000/notes/${noteId}`);
      //filter out the deleted note from the state
      // update state to remove the deleted note
      if (window.confirm("Are you sure you want to delete this note?")) {
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
    { title: "ownerOfItem", field: "ownerOfItem" },
    { title: "vendorName", field: "vendorName" },
    { title: "lastServiceDate", field: "lastServiceDate" },
  ];

  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={columns}
          data={notes}
          title="Inventory Manaement System"
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
                  ExportPdf(cols, datas, "UserRecords"),
              },
              {
                label: "Export CSV",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "userRecords"),
              },
            ],
            headerStyle: {
              backgroundColor: "#000",
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
                      value={selectedNote.ownerOfItem}
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
    </>
  );
};

export default TableList;
