import * as express from "express";
import dotenv = require("dotenv");
import database = require("./database");
import login = require("./login");


const appRoot:string = process.env.appRoot;
const appRoute:string = process.env.appRoute;

export const register = ( app: express.Application ) => {
    app.route(appRoute + '/login')
    .get((req:any, res:any) => {
        res.render('pages/login', {
            correct: ''
        });
    })
    .post((req:any, res:any) => {
        if(req.body.ID != undefined ){
            login.checkGuest(req.body.ID).then( access => {
                if(access){
                    req.session.guest = req.body.ID;
                    res.redirect('/guest');
                } else {
                    res.render('pages/login', {
                        correct: 'ID increct'
                    });
                }
            }
            ).catch(err => console.log(err))
        } else {
            login.loginUser(req.body.user,req.body.pass).then( access => {
                if(access){
                    req.session.user = req.body.user;
                    res.redirect('/');
                } else {
                    res.render('pages/login', {
                        correct: 'username or password increct'
                    });
                }
            }
            ).catch(err => console.log(err))
        }
    })

app.all(appRoute + '/logout', (req:any, res:any) => {
    req.session.reset();
    res.redirect('/login');
});

app.use(appRoute + '/static',express.static('static'));
app.use(appRoute + '/login',express.static('static/login'));

app.all('/favicon.ico', (req:any, res:any) => res.sendFile(appRoot + 'static/images/favicon.ico'));

app.all(appRoute + '/media',(req:any, res:any) => {

    database.getMedia(req.query.title).then( media => {
        if(media != null && parseInt(req.query.part,10) < media.parts.length){
            res.sendFile(media.dir + "/" + media.parts[parseInt(req.query.part,10)]);
        } else {
            res.render("pages/404");
        }
    }).catch(err => {
        console.log("database error");
    })
});

app.all(appRoute + '/poster',(req:any, res:any) => {

    database.getMedia(req.query.title).then( media => {
        if(media != null){
            res.sendFile(media.dir + "/" + media.poster);
        } else {
            res.render("pages/404");
        }
    }).catch(err => {
        console.log("database error");
    })
});



app.use(appRoute + '/guest',(req:any, res:any) => {
    database.getGuest(req.session.guest).then( guest => {
        if(guest != null){
            res.render("pages/guest",{
                media: guest.media
            });
        } else {
            res.send("you are not a guest please login");
        }
    }).catch(err => {
        console.log("database error");
    })
});
app.get(appRoute + '/watch', (req:any, res:any) => {
    if(req.session.user){
        database.getUser(req.session.user).then( user => {
            if(user.style){
                res.render("pages/watch",{
                    style:user.style
                });
            }else{
                res.render("pages/watch",{
                    style:"light"
                });
            }
        }).catch(err => {
            console.log("database error");
        })
    } else {
        res.render("pages/watch",{
            style:"light"
        });
    }

});

app.get(appRoute + '/', (req:any, res:any) => {
    try {//TODO
        database.media.find({}).toArray(function(err,mList){
            if (err) throw err;
            res.render("pages/home",{mList:mList});
        });
    }
    catch(err) {
        console.log(err);
    }

});

   
};