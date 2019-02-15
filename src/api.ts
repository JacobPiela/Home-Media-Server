import * as express from "express";
import database = require("./database");
import login = require("./login");
import dotenv = require("dotenv");
import querystring = require('querystring');

const appRoute:string = process.env.appRoute;


const makeRes = (error:boolean, res:any="") => {
    return JSON.stringify({'error': error ,'res': res });
};


export const register = ( app: express.Application ) => {//TODO api
    app.route(appRoute + '/api')
    .get((req:any, res:any) => {
        if(req.query.get === "canAccess"){
            if(req.session.guest){
                database.getGuest(req.session.guest).then( guest => {
                    if(guest != null){
                            res.send(makeRes(false,guest.media));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                })
            }
        } else if(req.query.get === "mediaMeta"){

            let sendmeta = (req:any, res:any) => {
                database.getMedia(req.query.title).then( media => {
                    if(media != null){
                        res.send(makeRes(false,media));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                });
            };

            if(req.session.user){
                sendmeta(req,res)
            }else{
                database.getGuest(req.session.guest).then( guest => {
                    if(guest != null){
                        if(guest.media.indexOf != -1){
                            sendmeta(req,res)
                        }
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                })
            }
        } else if(req.query.get === "getTimeStamp"){
            if(req.session.user){
                database.getUser(req.session.user).then( user => {
                    if(user != null){
                            res.send(makeRes(false,user.watchTimes[req.query.title][parseInt(req.query.part,10)]));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                })
            }
        } else if(req.query.get === "me"){
            if(req.session.user){
                res.send(makeRes(false,"user"));
            } else {
                res.send(makeRes(false,"guest"));
            }
        } else if(req.query.get === "mylist"){
            if(req.session.user){
                database.getUser(req.session.user).then( user => {
                    if(user != null){
                            res.send(makeRes(false,user.myList));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                })
            } else {
                res.send(makeRes(true));
            }
        } else if(req.query.get === "recentlyWatched"){
            if(req.session.user){
                database.getUser(req.session.user).then( user => {
                    if(user != null){
                            res.send(makeRes(false,user.recentlyWatched));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                })
            } else {
                res.send(makeRes(true));
            }
        } else if(req.query.get === "privs"){
            if(req.session.user){
                database.getUser(req.session.user).then( user => {
                    if(user != null){
                            res.send(makeRes(false,user.privs));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                    res.send(makeRes(true));
                })
            } else {
                res.send(makeRes(true));
            }
        } else {
            res.send(makeRes(true));
        }
    })//TODO admin
    .post((req:any, res:any) => {
        /*database.getMedia(req.body.title).then( media => {
            if(media != null){
                res.send(media);
            } else {
                res.render("pages/404");
            }
        }).catch(err => {
            console.log("database error");
        })*/
        if(req.body.update === "addMyList"){
            if(req.session.user){
                database.getUser(req.session.user).then( user => {
                    if(user != null){
                            res.send(makeRes(false,"OK"));
                    } else {
                        res.send(makeRes(true));
                    }
                }).catch(err => {
                    console.log("database error");
                })
            } else {
                res.send(makeRes(true));
            }
        }

        



    })
}