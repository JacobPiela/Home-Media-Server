import { MongoClient, Db, Collection } from "mongodb";
const url = 'mongodb://localhost:27017';
export let db = null;
export let users = null;
export let guests = null;
export let media = null;

export let connect = async function() { 
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