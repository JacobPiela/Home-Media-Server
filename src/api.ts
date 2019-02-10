import * as express from "express";
import database = require("./database");
import dotenv = require("dotenv");

const appRoute:string = process.env.appRoute;

export const register = ( app: express.Application ) => {
    app.route(appRoute + '/api')
    .get((req:any, res:any) => {
        database.media.findOne({title: req.query.title.replace(/_/g," ")}).then( media => {
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