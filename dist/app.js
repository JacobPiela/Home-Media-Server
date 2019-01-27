"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const express = require("express");
const sessions = require("client-sessions");
const bodyParser = require("body-parser");
const database = require("./database");
const login_1 = require("./login");
const appRoot = "/home/jacob/projects/HomeServer/";
const appRoute = "";
const app = express();
const port = 3003;
const logger = winston.createLogger({
    format: winston.format.printf((info) => {
        return `${info.message}`;
    }),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' })
    ]
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
app.route(appRoute + '/login')
    .get((req, res) => {
    res.render('pages/login', {
        correct: ''
    });
})
    .post((req, res) => {
    if (req.body.ID != undefined) {
        login.checkGuest(req.body.ID).then(access => {
            if (access) {
                req.session.guest = req.body.ID;
                res.redirect('/guest');
            }
            else {
                res.render('pages/login', {
                    correct: 'ID increct'
                });
            }
        }).catch(err => console.log(err));
    }
    else {
        login.loginUser(req.body.user, req.body.pass).then(access => {
            if (access) {
                req.session.user = req.body.user;
                res.redirect('/');
            }
            else {
                res.render('pages/login', {
                    correct: 'username or password increct'
                });
            }
        }).catch(err => console.log(err));
    }
});
app.all(appRoute + '/logout', (req, res) => {
    req.session.reset();
    res.redirect('/login');
});
app.all(appRoute + '/static', express.static('static'));
app.all(appRoute + '/login', express.static('static/login'));
app.all('/favicon.ico', (req, res) => res.sendFile(appRoot + 'static/images/favicon.ico'));
app.all(appRoute + '/media', (req, res) => {
    database.media.findOne({ title: req.query.title.replace(/_/g, " ") }).then(media => {
        if (media != null && parseInt(req.query.part, 10) < media.parts.length) {
            res.sendFile(media.dir + "/" + media.parts[parseInt(req.query.part, 10)]);
        }
        else {
            res.render("pages/404");
        }
    }).catch(err => {
        console.log("database error");
    });
});
app.use(appRoute + '/meta', (req, res) => {
    database.media.findOne({ title: req.query.title.replace(/_/g, " ") }).then(media => {
        if (media != null) {
            res.send(media);
        }
        else {
            res.render("pages/404");
        }
    }).catch(err => {
        console.log("database error");
    });
});
app.use(appRoute + '/guest', (req, res) => {
    database.guests.findOne({ ID: req.session.guest }).then(guest => {
        if (guest != null) {
            res.render("pages/guest", {
                media: guest.media
            });
        }
        else {
            res.render("you are not a guest please login");
        }
    }).catch(err => {
        console.log("database error");
    });
});
app.get(appRoute + '/', (req, res) => res.send('Hello World!'));
database.connect().then(() => app.listen(port, () => logger.warn(`running at port ${port}`)));
//# sourceMappingURL=app.js.map