let es = require("./index");
let express = require("express");
let app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.get("/elastic/ping", (req, res) => {
  es.ping(req, res);
});

app.post("/elastic/index/init", (req, res) => {
  console.log("body", req.body);
  var index = req.body.index_name;
  es.initIndex(req, res, index);
});

app.post("/elastic/index/check", (req, res) => {
  var index = req.body.index_name;
  es.indexExists(req, res, index);
});

app.post("/elastic/index/mapping", function(req, res) {
  //  [ 3 ] Preparing index and its mapping (basically setting data-types of each attributes and more)
  var payload = req.body.payload;
  var index = req.body.index_name;
  es.initMapping(req, res, index, payload);
  return null;
});

app.post("/elastic/add", function(req, res) {
  //  [ 4 ] Add data to index
  var payload = req.body.payload;
  var index = req.body.index_name;
  var _id = req.body._id;
  var docType = req.body.type;
  es.addDocument(req, res, index, _id, docType, payload);
  return null;
});

app.put("/elastic/update", function(req, res) {
  //  [ 5 ] Update a document
  var payload = req.body.payload;
  var index = req.body.index_name;
  var _id = req.body._id;
  var docType = req.body.type;
  es.updateDocument(req, res, index, _id, docType, payload);
  return null;
});

app.post("/elastic/search", function(req, res, next) {
  // [ 6 ] Search an index
  var payload = req.body.payload;
  var index = req.body.index_name;
  var docType = req.body.type;
  es.search(req, res, index, docType, payload);
});

app.listen(3000);
