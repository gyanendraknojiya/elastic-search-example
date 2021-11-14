require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Notes = require("./models/notes");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

Notes.createMapping(function (err, mapping) {
  if (err) {
    console.log("error creating mapping");
    console.log(err);
  } else {
    console.log("mapping created!");
    console.log(mapping);
  }
});

Notes.on("es-indexed", (err, res) => console.log(res));

let PORT = process.env.PORT || 8080;

app.get("/", async (req, res, next) => {
  const result = await client.search({
    index: "notes",
    body: {},
  });

  return res.status(200).json({
    res: result.body.hits.hits,
  });
});

app.get("/by-title/:title", async (req, res, next) => {
  const { title } = req.params;
  const result = await client.search({
    index: "my-index",
    body: {
      query: {
        match: { title },
      },
    },
  });

  return res.status(200).json({
    result,
  });
});

// app.post("/add", async (req, res, next) => {
//   const { title, body } = req.body;
//   await Notes.create({
//     title,
//     body,
//   });

//   const d = await client.index({
//     index: "my-index",
//     body: {
//       title,
//       body,
//     },
//   });

//   return res.status(201).json({
//     d,
//   });
// });

// Invoke-WebRequest -method DELETE http://localhost:9200/_all

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

app.put("/update/", async (req, res, next) => {
  const { id } = req.body;

  const response = await Notes.findByIdAndRemove(id, {
    ...req.body,
  });

  return res.status(201).json({
    response,
  });
});

app.delete("/delete/", async (req, res, next) => {
  const { id } = req.body;

  const response = await Notes.findByIdAndDelete(id);

  return res.status(201).json({
    response,
  });
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("connected to the database");
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
