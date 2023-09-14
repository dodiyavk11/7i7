require('dotenv').config();
const express = require("express");
const helmet = require("helmet")
const compression = require("compression")
const db = require("./models/index")
const cors = require("cors")

const app = express();
const PORT = 8000;
const router = express.Router()

const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
    'PATCH'
  ]
};



console.log(process.env.DB_USERNAME,
     process.env.DB_PASSWORD,
 process.env.DB_NAME,
     process.env.DB_HOST)


app.use(/\/((?!webhooks).)*/, express.json()); //the RegExp for skip this middleware for /webhooks route bcz this middleware is not applicable for stipe webhook api 
app.use(cors(corsOpts));
app.use(helmet())
app.use(compression())
app.use(router);

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch(err => {
    if (err) throw err
    console.error('Unable to connect to the database :', err);
  });

require("./routes")(router)

app.get("/", (req, res) => res.send("hello world"))

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("server connected tp port " + PORT)
})

