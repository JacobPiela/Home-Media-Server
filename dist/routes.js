"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const database = require("./database");
const login_1 = require("./login");
const appRoot = "/home/jacob/projects/HomeServer/";
const appRoute = "";
let login = new login_1.login();
exports.register = (app) => {
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
    app.use(appRoute + '/static', express.static('static'));
    app.use(appRoute + '/login', express.static('static/login'));
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
};
//# sourceMappingURL=routes.js.map