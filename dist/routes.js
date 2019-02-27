"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const database = require("./database");
const login = require("./login");
const appRoot = process.env.appRoot;
const appRoute = process.env.appRoute;
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
        database.getMedia(req.query.title).then(media => {
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
    app.all(appRoute + '/poster', (req, res) => {
        database.getMedia(req.query.title).then(media => {
            if (media != null) {
                res.sendFile(media.dir + "/" + media.poster);
            }
            else {
                res.render("pages/404");
            }
        }).catch(err => {
            console.log("database error");
        });
    });
    app.use(appRoute + '/guest', (req, res) => {
        database.getGuest(req.session.guest).then(guest => {
            if (guest != null) {
                res.render("pages/guest", {
                    media: guest.media
                });
            }
            else {
                res.send("you are not a guest please login");
            }
        }).catch(err => {
            console.log("database error");
        });
    });
    app.get(appRoute + '/watch', (req, res) => {
        if (req.session.user) {
            database.getUser(req.session.user).then(user => {
                if (user.style) {
                    res.render("pages/watch", {
                        style: user.style
                    });
                }
                else {
                    res.render("pages/watch", {
                        style: "light"
                    });
                }
            }).catch(err => {
                console.log("database error");
            });
        }
        else {
            res.render("pages/watch", {
                style: "light"
            });
        }
    });
    app.get(appRoute + '/', (req, res) => {
        try { //TODO
            database.media.find({}).toArray(function (err, mList) {
                if (err)
                    throw err;
                res.render("pages/home", { mList: mList });
                //let html = "<body><div style=\" after {\
                //    content: \"\";\
                //    clear: both;\
                //    display: table;\
                //  } \">";
                //for(let i=0; i<mList.length; i++){
                //    html += "<img style=\"float: left; padding: 5px; width:150px; height:200px; \" src='/poster?title=" + mList[i].title + "' onclick='window.location =\"/watch?title=" + mList[i].title + "\"'><span>" + "<span/></img>";
                //}
                //html += "</div></body>";
                //res.send(html);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
};
//# sourceMappingURL=routes.js.map