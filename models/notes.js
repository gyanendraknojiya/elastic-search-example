const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const Schema = mongoose.Schema;

const NotesSchema = new Schema(
  {
    title: { type: String, es_indexed: true },
    body: { type: String, es_indexed: true },
  },
  {
    timestamp: true,
  }
);
NotesSchema.plugin(mongoosastic, {
  host: "localhost",
  port: 9200,
});




const NotesModel = mongoose.model("Note", NotesSchema);
var stream = NotesModel.synchronize(function(err){
  console.log(err);
})
, count = 0;
stream.on('data', function (err, doc) {
count++;
});
stream.on('close', function () {
console.log('indexed ' + count + ' documents from LeadSearch!');
});
stream.on('error', function (err) {
console.log(err);
});
module.exports = NotesModel;
