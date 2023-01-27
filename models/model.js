const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  ownerOfTheItem: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  lastServiceDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
