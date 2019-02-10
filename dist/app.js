"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const sessions = require("client-sessions");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const database = require("./database");
const login = require("./login");
const api = require("./api");
const routes = require("./routes");
dotenv.config();
const appRoot = process.env.appRoot;
const appRoute = process.env.appRoute;
const app = express();
const port = process.env.SERVER_PORT;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessions({
    cookieName: 'session',
    secret: process.env.secret,
    duration: 3 * 24 * 60 * 60 * 1000,
}));
app.use(login.requireLogin);
routes.register(app);
api.register(app);
database.connect().then(() => app.listen(port, () => console.log(`running at port ${port}`)));
//# sourceMappingURL=app.js.map