import * as express from "express";
import database = require("./database");
import login = require("./login");
import dotenv = require("dotenv");
import querystring = require('querystring');

const appRoute:string = process.env.appRoute;

export const register = ( app: express.Application ) => {
    app.route(appRoute + '/api')
    .post((req:any, res:any) => {
        database.getMedia(req.query.title).then( media => {
            if(media != null){
                res.send(media);
            } else {
                res.render("pages/404");
            }
        }).catch(err => {
            console.log("database error");
        })
    })
    .get((req:any, res:any) => {
        database.getMedia(req.query.title).then( media => {
            if(media != null){
                res.send(media);
            } else {
                res.render("pages/404");
            }
        }).catch(err => {
            console.log("database error");
        })
    })
}