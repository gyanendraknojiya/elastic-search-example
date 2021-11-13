require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Notes = require("./models/notes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let PORT = process.env.PORT || 8080;

app.get("/", async (req, res, next) => {
  const response = await Notes.find();
  return res.status(200).json({
    response,
  });
});

app.post("/add", async (req, res, next) => {
  const { title, body } = req.body;
  const response = await Notes.create({
    title,
    body,
  });
  return res.status(201).json({
    response,
  });
});

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true },
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('connected to the database');
});

      app.listen(PORT, () => {
        console.log("server is running at port: " + PORT);
      })


