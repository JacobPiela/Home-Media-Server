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
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27017';
exports.db = null;
exports.users = null;
exports.guests = null;
exports.media = null;
exports.connect = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let temp = yield mongodb_1.MongoClient.connect(url, { useNewUrlParser: true });
            exports.db = yield temp.db('HMS');
            exports.users = yield exports.db.collection('users');
            exports.guests = yield exports.db.collection('guests');
            exports.media = yield exports.db.collection('media');
            yield console.log("Connected to HMS database");
        }
        catch (err) {
            console.log(err);
        }
        return exports.db;
    });
};
exports.getGuest = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        let found = null;
        yield exports.guests.findOne({ ID: id }).then(guest => {
            found = guest;
        }).catch(err => {
            console.log(err);
        });
        return found;
    });
};
exports.getUser = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        let found = null;
        yield exports.guests.findOne({ name: username }).then(user => {
            found = user;
        }).catch(err => {
            console.log(err);
        });
        return found;
    });
};
exports.getMedia = function (title) {
    return __awaiter(this, void 0, void 0, function* () {
        let found = null;
        yield exports.guests.findOne({ name: title }).then(media => {
            found = media;
        }).catch(err => {
            console.log(err);
        });
        return found;
    });
};
//# sourceMappingURL=database.js.map