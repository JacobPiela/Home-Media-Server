/*
|---------------------------------------------------------------------------------------------|
|                                HMS database layout                                          |
|---------------------------------------------------------------------------------------------|
|users                     |guests                           |media                           |
|---------------------------------------------------------------------------------------------|
|name                      |ID                               |title                           |
|hash                      |media[title]                     |type                            |
|salt                      |watchTimes{}                     |genres[]                        |
|blackList[title]          |                                 |parts[fileName]                 |
|maxRating                 |                                 |rating                          |
|privs[]                   |                                 |poster:fileName                 |
|mylist[]                  |                                 |dir                             |
|watchTimes{}              |                                 |description                     |
|recentlyWatched[]         |                                 |                                |
|---------------------------------------------------------------------------------------------|
*/


import { MongoClient, Db, Collection } from "mongodb";
const url = 'mongodb://localhost:27017';
export let db = null;
export let users = null;
export let guests = null;
export let media = null;

export let connect = async function() { //call before useing the database
    try {
        let temp = await MongoClient.connect(url, { useNewUrlParser: true });
        db =  await temp.db('HMS');   
        users = await db.collection('users');
        guests = await db.collection('guests');
        media = await db.collection('media');
        await console.log("Connected to HMS database");
    } catch(err){
        console.log(err);
    }
    return db;
}

export let getGuest = async function(id):Promise<any> { //gets a guest by it's ID. Note Id is not the same as mongo's id
    let found = null;
    await guests.findOne({ID: id}).then( guest => {
        found = guest;
        }).catch(err => {
            console.log(err); 
        })
    return found;
}

export let getUser = async function(username):Promise<any> { //gets a user by it's username
    let found = null;
    await users.findOne({name: username}).then( user => {
        found = user;
        }).catch(err => {
            console.log(err); 
        })
    return found;
}

export let getMedia = async function(title):Promise<any> { //gets a media by it's title
    let found = null;
    await media.findOne({title: title}).then( media => {
        found = media;
        }).catch(err => {
            console.log(err); 
        })
    return found;
}