let elasticsearch = require("elasticsearch");
let elasticClient = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

/*
client.ping(
  {
    requestTimeout: 3000
  },
  function(error) {
    if (error) {
      console.error("elastic search cluster is down");
    } else {
      console.log("we are up!");
    }
  }
);

client
  .search({
    q: "pants"
  })
  .then(
    function(body) {
      console.log(body);
    },
    function(error) {
      console.trace(error);
    }
  );

client.indices
  .delete({
    index: "test_index",
    ignore: [404]
  })
  .then(
    function(body) {
      console.log("index was deleted or never exsisted");
    },
    function(error) {
      console.log("error: ", error);
    }
  );

client
  .bulk({
    body: [
      { index: { _index: "myindex", _type: "mytype", _id: 1 } },
      { title: "foo" },
      { update: { _index: "myindex", _type: "mytype", _id: 2 } },
      { doc: { title: "foo" } }
    ]
  })
  .then(function(err, resp) {
    if (err) {
      console.log("error: ", err);
    } else {
      console.log("response: ", resp);
    }
  });
*/

module.exports = {
  ping: function(req, res) {
    elasticClient.ping(
      {
        requestTimeout: 30000
      },
      function(error) {
        if (error) {
          res.status(500);
          res.send("elasticsearch cluster not up!!");
        }
        res.status(200);
        res.send("els_srch up!");
      }
    );
  },

  initIndex: function(req, res, indexName) {
    elasticClient.indices
      .create({
        index: indexName
      })
      .then(
        function(resp) {
          res.status(200);
          res.json(resp);
        },
        function(error) {
          res.status(500);
          res.json(error);
        }
      );
  },

  indexExists: function(req, res, indexName) {
    elasticClient.indices
      .exists({
        index: indexName
      })
      .then(
        function(resp) {
          res.status(200);
          res.json(resp);
        },
        function(error) {
          res.status(500);
          res.json(error);
        }
      );
  },

  initMapping: function(req, res, indexName, docType, payload) {
    elasticClient.indices
      .putMapping({
        index: indexName,
        type: docType,
        body: payload
      })
      .then(
        function(resp) {
          res.status(200);
          res.json(resp);
        },
        function(error) {
          res.status(500);
          res.json(error);
        }
      );
  },

  addDocument: function(req, res, indexName, _id, docType, payload) {
    elasticClient
      .index({
        index: indexName,
        type: docType,
        id: _id,
        body: payload
      })
      .then(
        function(resp) {
          // console.log(resp);
          res.status(200);
          return res.json(resp);
        },
        function(err) {
          // console.log(err.message);
          res.status(500);
          return res.json(err);
        }
      );
  },

  updateDocument: function(req, res, index, _id, docType, payload) {
    elasticClient.update(
      {
        index: index,
        type: docType,
        id: _id,
        body: payload
      },
      function(err, resp) {
        if (err) return res.json(err);
        return res.json(resp);
      }
    );
  },

  search: function(req, res, indexName, docType, payload) {
    elasticClient
      .search({
        index: indexName,
        type: docType,
        body: payload
      })
      .then(
        function(resp) {
          console.log(resp);
          return res.json(resp);
        },
        function(err) {
          console.log(err.message);
          return res.json(err.message);
        }
      );
  }
};
