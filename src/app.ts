import express = require('express');
import sessions = require("client-sessions");
import bodyParser = require("body-parser");
import fs = require('fs');
import dotenv = require("dotenv");
import database = require("./database");
import login = require("./login");
import * as api from "./api";
import * as routes from "./routes";

dotenv.config();

const appRoot:string = process.env.appRoot;
const appRoute:string = process.env.appRoute;
const app = express();
const port:string = process.env.SERVER_PORT;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(sessions({//TODO check security
    cookieName: 'session', 
    secret: process.env.secret,
    duration: 3 * 24 * 60 * 60 * 1000,
  }));

app.use(login.requireLogin);

routes.register( app );
routes.register( api );


database.connect().then(() =>
    app.listen(port, () => console.log(`running at port ${port}`))
);
