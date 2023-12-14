const {MongoClient} = require('mongodb')
require('dotenv').config()

const MongoDBclient = new MongoClient(process.env.MONGODB)

const connect = async () =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
        await MongoDBclient.close()
        console.log("Закрыли подключение")
        return true
    } catch (e) {
        console.log(e)
        return false
    }
 }

 const Insert = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.insertOne(data)
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
    } catch (e) {
        console.log(e)
    }
 }

 const InsertAll = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.insertMany(data)
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
    } catch (e) {
        console.log(e)
    }
 }
 
 const Count = async (coll) =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
 
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find().toArray()
        console.log("Количество документов в базе данных:", AllDocuments.length)
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
    } catch (e) {
        console.log(e)
    }
 }

 const Find = async (coll,data) =>{

    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
 
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        console.log(AllDocuments)
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
    } catch (e) {
        console.log(e)
    }
 }

 const Update = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.findOneAndUpdate(data , newdata)
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
    } catch (e) {
        console.log(e)
    }
 }

 Insert()
 
 connect()