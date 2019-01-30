"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const express = require("express");
const sessions = require("client-sessions");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const database = require("./database");
const login_1 = require("./login");
const routes = require("./routes");
dotenv.config();
const appRoot = "/home/jacob/projects/HomeServer/";
const appRoute = "";
const app = express();
const port = process.env.SERVER_PORT;
const logger = winston.createLogger({
    format: winston.format.printf((info) => {
        return `${info.message}`;
    }),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' })
    ],
    exitOnError: false
});
let login = new login_1.login();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessions({
    cookieName: 'session',
    secret: 'aEUcwGJV5CMTI08LZ9jCmbocVhMTH8c1TMR8RWnfg8EA0l9EGM',
    duration: 3 * 24 * 60 * 60 * 1000,
}));
app.use(login.requireLogin);
routes.register(app);
database.connect().then(() => app.listen(port, () => logger.info(`running at port ${port}`)));
//# sourceMappingURL=app.js.map