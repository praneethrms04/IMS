import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getAllNotes = async () => {
  const url = `${BASE_URL}/notes`;
  return await axios.get(url);
};

// export async function noteCreation(data) {
//   return await axios.post(`${BASE_URL}/addnotes`, data);
// }

export const noteCreation = async (data) => {
  const { itemName, ownerOfTheItem, vendorName } = data;
  const config = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  const body = JSON.stringify({ itemName, ownerOfTheItem, vendorName });
  try {
    return await axios.post(`${BASE_URL}/addnotes`, body, config);
  } catch (error) {
    console.log(error);
  }
};

export const getNoteDetails = async (noteId) => {
  const url = `${BASE_URL}/notes/${noteId}`;
  return await axios.get(url);
};

export const updateNoteDetails = async (noteId) => {
  const url = `${BASE_URL}/notes/${noteId}`;
  return await axios.put(url, noteId);
};

export const removeNote = async (noteId) => {
  const url = `${BASE_URL}/mba/api/v1/movies/${noteId}`;
  return await axios.delete(url, noteId);
};
