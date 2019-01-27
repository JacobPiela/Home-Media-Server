import winston = require('winston');
import express = require('express');
import sessions = require("client-sessions");
import bodyParser = require("body-parser");
import fs = require('fs');
import database = require("./database");
import { login as loginManager } from "./login";

const appRoot:string = "/home/jacob/projects/HomeServer/";
const appRoute:string = "";
const app = express();
const port:number = 3003;

const logger = winston.createLogger({
    format: winston.format.printf((info) => {
        return `${info.message}`;
      }),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'log' })
    ],
    exitOnError:false
  });



let login:any = new loginManager();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(sessions({//TODO check security
    cookieName: 'session', 
    secret: 'aEUcwGJV5CMTI08LZ9jCmbocVhMTH8c1TMR8RWnfg8EA0l9EGM',
    duration: 3 * 24 * 60 * 60 * 1000,
  }));

app.use(login.requireLogin);


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

app.all(appRoute + '/static',express.static('static'));
app.all(appRoute + '/login',express.static('static/login'));
app.all('/favicon.ico', (req:any, res:any) => res.sendFile(appRoot + 'static/images/favicon.ico'));

app.all(appRoute + '/media',(req:any, res:any) => {
    database.media.findOne({title: req.query.title.replace(/_/g," ")}).then( media => {
        if(media != null && parseInt(req.query.part,10) < media.parts.length){

            res.sendFile(media.dir + "/" + media.parts[parseInt(req.query.part,10)]);
        } else {
            res.render("pages/404");
        }
    }).catch(err => {
        console.log("database error");
    })
});

app.use(appRoute + '/meta',(req:any, res:any) => {
    database.media.findOne({title: req.query.title.replace(/_/g," ")}).then( media => {
        if(media != null){
            res.send(media);
        } else {
            res.render("pages/404");
        }
    }).catch(err => {
        console.log("database error");
    })
});


app.use(appRoute + '/guest',(req:any, res:any) => {
    database.guests.findOne({ID: req.session.guest}).then( guest => {
        if(guest != null){
            res.render("pages/guest",{
                media: guest.media
            });
        } else {
            res.render("you are not a guest please login");
        }
    }).catch(err => {
        console.log("database error");
    })
});


app.get(appRoute + '/', (req:any, res:any) => res.send('Hello World!'));

database.connect().then(() =>
    app.listen(port, () => logger.info(`running at port ${port}`))
);
