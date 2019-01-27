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
const database_1 = require("./database");
class getMedia {
    constructor() {
        this.database = new database_1.database(); //TODO reuse connection
        this.database.connect();
    }
    sarch(q) {
        return __awaiter(this, void 0, void 0, function* () {
            let re = [];
            yield this.database.db.collection('media').find({ title: { $regex: q + '.*' } }).then(results => {
                re = results;
            }).catch(err => {
                console.log("no results");
            });
            return re;
        });
    }
    geturl(title, part) {
        return __awaiter(this, void 0, void 0, function* () {
            let re = "";
            yield this.database.db.collection('media').findOne({ title: title }).then(results => {
                re = results.url[part];
            }).catch(err => {
                console.log("no results");
            });
            return re;
        });
    }
    getdir(title, part) {
        return __awaiter(this, void 0, void 0, function* () {
            let re = "";
            yield this.database.db.collection('media').findOne({ title: title }).then(results => {
                re = results.dir[part];
            }).catch(err => {
                console.log("no results");
            });
            return re;
        });
    }
    init() {
    }
}
exports.getMedia = getMedia;
//# sourceMappingURL=getMedia.js.map