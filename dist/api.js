"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./database");
const appRoute = process.env.appRoute;
exports.register = (app) => {
    app.route(appRoute + '/api')
        .post((req, res) => {
        database.getMedia(req.query.title).then(media => {
            if (media != null) {
                res.send(media);
            }
            else {
                res.render("pages/404");
            }
        }).catch(err => {
            console.log("database error");
        });
    })
        .get((req, res) => {
        database.getMedia(req.query.title).then(media => {
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
};
//# sourceMappingURL=api.js.map