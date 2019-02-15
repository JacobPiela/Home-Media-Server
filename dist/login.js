"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha512 = require("js-sha512");
const database = require("./database");
const appRoute = "";
let publicRoute = "/login";
//makes a random string of upper lower case letters and numbers
function makeRandomChar(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let out = "";
    for (let i = 0; i < length; i++) {
        out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
}
;
const pageAccess = {
    guestPages: [
        "/api",
        "/guest",
        "/logout",
        "/watch",
        "/media",
        "/poster"
    ],
    userPages: [
        "/api",
        "/",
        "",
        "/logout",
        "/watch",
        "/media",
        "/poster"
    ]
};
exports.requireLogin = (req, res, next) => {
    if (req.originalUrl.startsWith(appRoute + publicRoute) || req.originalUrl.startsWith("/favicon.ico")) {
        next();
    }
    else if (req.session.guest) {
        checkGuest(req.session.guest, req).then(access => {
            if (access) {
                next();
            }
            else {
                res.send("access denied");
            }
        });
    }
    else if (req.session.user) {
        checkUser(req.session.user, req).then(access => {
            if (access) {
                next();
            }
            else {
                res.send("access denied");
            }
        });
    }
    else {
        res.redirect('/login');
    }
};
function loginUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = false;
        yield database.getUser(username).then(user => {
            if (user != null && sha512.sha512(password + user.salt) == user.hash) {
                access = true;
            }
            else {
                console.log("user <" + username + "> tried to login but failed");
            }
        }).catch(err => {
            console.log("database error");
        });
        return access;
    });
}
exports.loginUser = loginUser;
;
function checkUser(username, req = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = false;
        yield database.getUser(username).then(user => {
            if (user != null) {
                if (req === null) { //if user logging in don't check page
                    access = true;
                }
                else {
                    if (req.path.startsWith("/static") || pageAccess.userPages.indexOf(req.path) != -1) { //can the user access the page
                        access = true;
                    }
                    else if (false) { //TODO admin
                    }
                }
            }
        }).catch(err => {
            console.log("user (" + username + ") tried to load a page but failed");
        });
        return access;
    });
}
exports.checkUser = checkUser;
;
function checkGuest(id, req = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = false;
        yield database.getGuest(id).then(guest => {
            if (guest != null) {
                if (guest.expire < Date.now()) {
                    database.guests.deleteOne({ ID: id });
                }
                else {
                    if (req === null) { //if guest logging in don't check page
                        access = true;
                    }
                    else if (pageAccess.guestPages.indexOf(req.path) != -1 || (req.path === "/media" && guest.media.indexOf(req.query.title) != -1)) { //can the guest access the page
                        access = true;
                    }
                    else {
                        console.log("guest (" + id + ") tried to load a page but failed");
                    }
                }
            }
        }).catch(err => {
            console.log("database error");
        });
        return access;
    });
}
exports.checkGuest = checkGuest;
;
//# sourceMappingURL=login.js.map