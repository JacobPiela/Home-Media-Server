import sha512 = require('js-sha512');
import  database =  require("./database");

const appRoute:string = "";


let publicRoute = "/login";

//makes a random string of upper lower case letters and numbers
function makeRandomChar(length:number):string {
    const chars:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let out:string = "";
    for(let i=0; i < length; i++){
        out += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return out;
};

const pageAccess = { 
    guestPages: [
        "/api",
        "/guest",
        "/logout",
        "/watch",
        "/media",
        "/poster"
    ],
    userPages: [
        "/api",
        "/",
        "",
        "/logout",
        "/watch",
        "/media",
        "/poster"
    ]
};

export let requireLogin = (req:any, res:any, next:any) => {
    if(req.originalUrl.startsWith(appRoute + publicRoute) || req.originalUrl.startsWith("/favicon.ico")){
        next();
    } else if(req.session.guest){
        checkGuest(req.session.guest,req).then(access => {
            if(access){
                next();
            } else {
                res.send("access denied");
            }
        })
    } else if (req.session.user ){
        checkUser(req.session.user,req).then(access => {
            if(access){
                next();
            } else {
                res.send("access denied");
            }
        })
    } else {
        res.redirect('/login');
    }
    
}


export async function loginUser(username:string,password:string):Promise<boolean> {
    let access:boolean = false;
    await database.getUser(username).then( user => {
        if(user != null && sha512.sha512(password + user.salt) == user.hash){
            access = true;
        } else {
            console.log("user <" + username + "> tried to login but failed"); 
        }
    }).catch(err => {
        console.log("database error"); 
    })
    return access;
};

export async function checkUser(username:string,req:any=null):Promise<boolean>{
    let access:boolean = false;
    await database.getUser(username).then( user => {
        if(user != null){
            if(req === null){//if user logging in don't check page
                access = true;
            }else{
                if(req.path.startsWith("/static") || pageAccess.userPages.indexOf(req.path) != -1){//can the user access the page
                    access = true;
                } else if (false){//TODO admin
                    
                }
            }
        }
    }).catch(err => {
        console.log("user (" + username + ") tried to load a page but failed"); 
    })
    return access;
};


export async function checkGuest(id:string,req:any=null):Promise<boolean> {
    let access:boolean = false;
    await database.getGuest(id).then( guest => {
        if(guest != null){
            if(guest.expire < Date.now()){
                database.guests.deleteOne( {ID: id} );
            } else {
                if(req === null){//if guest logging in don't check page
                    access = true;
                }else if(pageAccess.guestPages.indexOf(req.path) != -1 || (req.path === "/media" && guest.media.indexOf(req.query.title) != -1)){//can the guest access the page
                        access = true;
                    } else {
                    console.log("guest (" + id + ") tried to load a page but failed");  
                }
            }
        }
    }).catch(err => {
        console.log("database error"); 
    })
    return access;
};

