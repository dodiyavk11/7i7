require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const db = require("./models/index");
const cors = require("cors");
const config = require("./config/config.js")

const app = express();
const PORT = 8000;
const router = express.Router();

const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH'],
};


app.use(cors(corsOpts));
app.use(/\/((?!webhooks).)*/, express.json());
app.use(helmet());
app.use(compression());
app.use(router);

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);

  });

require("./routes")(router);

app.get("/", (req, res) => res.send("Hello, world!"));

app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log("Server connected to port " + PORT);
  }
});

app.use((req,res)=>{
    res.status(404).send(JSON.stringify(config))
})

