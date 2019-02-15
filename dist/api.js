"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./database");
const appRoute = process.env.appRoute;
const makeRes = (error, res = "") => {
    return JSON.stringify({ 'error': error, 'res': res });
};
exports.register = (app) => {
    app.route(appRoute + '/api')
        .get((req, res) => {
        if (req.query.get === "canAccess") {
            if (req.session.guest) {
                database.getGuest(req.session.guest).then(guest => {
                    if (guest != null) {
                        res.send(makeRes(false, guest.media));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            }
        }
        else if (req.query.get === "mediaMeta") {
            let sendmeta = (req, res) => {
                database.getMedia(req.query.title).then(media => {
                    if (media != null) {
                        media.dir = undefined;
                        res.send(makeRes(false, media));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            };
            if (req.session.user) {
                sendmeta(req, res);
            }
            else {
                database.getGuest(req.session.guest).then(guest => {
                    if (guest != null) {
                        if (guest.media.indexOf != -1) {
                            sendmeta(req, res);
                        }
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            }
        }
        else if (req.query.get === "getTimeStamp") {
            if (req.session.user) {
                database.getUser(req.session.user).then(user => {
                    if (user != null) {
                        res.send(makeRes(false, user.watchTimes[decodeURI(req.query.title)][parseInt(req.query.part, 10)]));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            }
        }
        else if (req.query.get === "me") {
            if (req.session.user) {
                res.send(makeRes(false, "user"));
            }
            else {
                res.send(makeRes(false, "guest"));
            }
        }
        else if (req.query.get === "mylist") {
            if (req.session.user) {
                database.getUser(req.session.user).then(user => {
                    if (user != null) {
                        res.send(makeRes(false, user.myList));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            }
            else {
                res.send(makeRes(true));
            }
        }
        else if (req.query.get === "recentlyWatched") {
            if (req.session.user) {
                database.getUser(req.session.user).then(user => {
                    if (user != null) {
                        res.send(makeRes(false, user.recentlyWatched));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            }
            else {
                res.send(makeRes(true));
            }
        }
        else if (req.query.get === "privs") {
            if (req.session.user) {
                database.getUser(req.session.user).then(user => {
                    if (user != null) {
                        res.send(makeRes(false, user.privs));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            }
            else {
                res.send(makeRes(true));
            }
        }
        else {
            res.send(makeRes(true));
        }
    }) //TODO admin
        .post((req, res) => {
        /*database.getMedia(req.body.title).then( media => {
            if(media != null){
                res.send(media);
            } else {
                res.render("pages/404");
            }
        }).catch(err => {
            console.log("database error");
        })*/
        if (req.body.update === "addMyList") {
            if (req.session.user) {
                database.getUser(req.session.user).then(user => {
                    if (user != null) {
                        res.send(makeRes(false, "OK"));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                });
            }
            else {
                res.send(makeRes(true));
            }
        }
        else if (req.body.update === "setTimeStamp") {
            if (req.session.user) {
                database.users.updateOne({ name: req.session.user }, { $set: JSON.parse("{\"watchTimes." + req.body.title + "." + req.body.part + "\":" + req.body.time + "}") }).then(ok => {
                    if (ok != null) {
                        res.send(makeRes(false, "OK"));
                    }
                    else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                });
            }
            else {
                res.send(makeRes(true));
            }
        }
    });
};
//# sourceMappingURL=api.js.map