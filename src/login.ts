import sha512 = require('js-sha512');
import  database =  require("./database");

const appRoute:string = "";

export class login {

    public publicRoute = "/login";


    private makeRandomChar(length:number):string {
        const chars:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let out:string = "";
        for(let i=0; i < length; i++){
            out += chars.charAt(Math.floor(Math.random()*chars.length));
        }
        return out;
    };

    constructor(){
    }

    public requireLogin = (req:any, res:any, next:any) => {
        if(req.originalUrl.startsWith(appRoute + this.publicRoute) || req.originalUrl.startsWith("favicon.ico")){
            next();
        } else if(req.session.guest){
            this.checkGuest(req.session.guest,req.originalUrl).then(access => {
                if(access){
                    next();
                }
            })
        } else if (req.session.user ){
            this.checkUser(req.session.user,req.originalUrl).then(access => {
                if(access){
                    next();
                }
            })
        } else {
            res.redirect('/login');
        }
        
    }


    public async loginUser(username:string,password:string):Promise<boolean> {
        let access:boolean = false;
        await database.users.findOne({name: username}).then( user => {
            console.log(user + " T");
            if(user != null && sha512.sha512(password + user.salt) == user.hash){
                access = true;
            } else {
                console.log("user <" + username + "> tried to login but failed"); 
            }
        }).catch(err => {
            console.log("database error"); 
        })
        return access;
    }

    public async checkUser(username:string,page:string=null):Promise<boolean>{//TODO add privs
        let access:boolean = false;
        await database.users.findOne({name: 'username'}).then( user => {
                access = true;
        }).catch(err => {
            console.log("user (" + username + ") tried to load a page but failed"); 
        })
        return access;
    }


    public async checkGuest(id:string,page:string=null):Promise<boolean> {//TODO add privs
        let access:boolean = false;
        await database.guests.findOne({ID: id}).then( guest => {
            if(guest != null){
                access = true;
            } else {
                console.log("guest (" + id + ") tried to load a page but failed");  
            }
        }).catch(err => {
            console.log("database error"); 
        })
        return access;
    }

}