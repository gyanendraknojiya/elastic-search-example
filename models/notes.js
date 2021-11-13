const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notes = new Schema(
  {
    title: String,
    body: String,
  },
  {
    timestamp: true,
  }
);

const NotesModel = mongoose.model("Notes", Notes);

module.exports = NotesModel;
