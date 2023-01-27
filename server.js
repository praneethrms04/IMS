const express = require("express");
const cors = require("cors");
const NoteSchema = require("./models/model");
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://PraneethKumar:PraneethKumar@cluster0.otqzddb.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.get("/notes", (req, res) => {
  NoteSchema.find({}, (err, notes) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(notes);
    }
  });
});

// get all notes
app.get("/notes", async (req, res) => {
  try {
    const allData = await NoteSchema.find();
    return res.json(allData);
  } catch (error) {
    console.log(error.message);
  }
});
// get only one id
app.get("/notes/:id", (req, res) => {
  NoteSchema.findById(req.params.id, (err, note) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(note);
    }
  });
});

// Create a new note
app.post("/addnotes", async (req, res) => {
  try {
    const { itemName, ownerOfTheItem, vendorName } = req.body;
    console.log('data from frontend', req.body)
    const newNote =await new NoteSchema({
      itemName,
      ownerOfTheItem,
      vendorName,
    }).save();
    return res.json({newNote, message :"new note created" });
  } catch (error) {
    console.log(error.message);
    res.json('failed to create a note')
  }
});
// Delete a note
app.delete("/notes/:id", (req, res) => {
  NoteSchema.findByIdAndRemove(req.params.id, (err, note) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(note);
    }
  });
});
// update a note
app.put("/notes/:id", (req, res) => {
  NoteSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, note) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(note);
      }
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
