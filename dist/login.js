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
exports.requireLogin = (req, res, next) => {
    if (req.originalUrl.startsWith(appRoute + publicRoute) || req.originalUrl.startsWith("/favicon.ico")) {
        next();
    }
    else if (req.session.guest) {
        checkGuest(req.session.guest, req.originalUrl).then(access => {
            if (access) {
                next();
            }
        });
    }
    else if (req.session.user) {
        checkUser(req.session.user, req.originalUrl).then(access => {
            if (access) {
                next();
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
        yield database.users.findOne({ name: username }).then(user => {
            console.log(user + " T");
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
function checkUser(username, page = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = false;
        yield database.users.findOne({ name: 'username' }).then(user => {
            access = true;
        }).catch(err => {
            console.log("user (" + username + ") tried to load a page but failed");
        });
        return access;
    });
}
exports.checkUser = checkUser;
;
function checkGuest(id, page = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = false;
        yield database.guests.findOne({ ID: id }).then(guest => {
            if (guest != null) {
                access = true;
            }
            else {
                console.log("guest (" + id + ") tried to load a page but failed");
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