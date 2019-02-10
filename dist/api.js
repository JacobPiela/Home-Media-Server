"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appRoute = process.env.appRoute;
exports.register = (app) => {
    app.route(appRoute + '/api')
        .get((req, res) => {
        res.render('pages/login', {
            correct: ''
        });
    });
};
//# sourceMappingURL=api.js.map