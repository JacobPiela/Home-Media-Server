import winston = require('winston');
import express = require('express');
import sessions = require("client-sessions");
import bodyParser = require("body-parser");
import fs = require('fs');
import dotenv = require("dotenv");
import database = require("./database");
import { login as loginManager } from "./login";
import * as routes from "./routes";

dotenv.config();

const appRoot:string = process.env.appRoot;
const appRoute:string = process.env.appRoute;
const app = express();
const port:string = process.env.SERVER_PORT;


const logger = winston.createLogger({
    format: winston.format.printf((info) => {
        return `${info.message}`;
      }),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'log' })
    ],
    exitOnError:false
  });



let login:any = new loginManager();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(sessions({//TODO check security
    cookieName: 'session', 
    secret: 'aEUcwGJV5CMTI08LZ9jCmbocVhMTH8c1TMR8RWnfg8EA0l9EGM',
    duration: 3 * 24 * 60 * 60 * 1000,
  }));

app.use(login.requireLogin);

routes.register( app );


database.connect().then(() =>
    app.listen(port, () => logger.info(`running at port ${port}`))
);
