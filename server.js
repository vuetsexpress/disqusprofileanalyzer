const express = require("express");
const app = express();
const port = parseInt(process.env.PORT || "3000");
const path = require("path");
const DISQUS_API_KEY = process.env.DISQUS_API_KEY;
const fetch = require("node-fetch");
const { MongoClient } = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db, users;

app.get("/users", (req, res) => {
  users
    .find({})
    .toArray()
    .then((result) => {
      result = result.filter((item) => item.code === 0);
      console.log(result);
      res.send(JSON.stringify(result));
    });
});

app.get("/", async (req, res) => {
  const user = req.query.user;
  if (user) {
    try {
      const parts = user
        .split("/")
        .filter((part) => part.length)
        .filter((part) => !part.match(/^\?/));
      const username = parts.pop();
      console.log({ username });
      const url = `https://disqus.com/api/3.0/users/details.json?api_key=${DISQUS_API_KEY}&user=username:${username}`;
      const resp = await fetch(url);
      console.log(resp);
      const profile = await resp.json();
      console.log({ profile });
      users
        .updateOne(
          { _id: username },
          {
            $set: profile,
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          console.log({ result });
        });
    } catch (err) {
      console.error(err);
    }
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "index.js"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

client.connect((err) => {
  if (err) {
    console.error("MongoDb connection failed!");
  } else {
    console.log("MongoDb connected!");

    db = client.db("disqusprofile");

    users = db.collection("users");

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
});
