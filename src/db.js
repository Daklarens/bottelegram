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

 const insert = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log("Подключение для добавления данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.insertOne(data)
 
        await MongoDBclient.close()
        console.log("Данные внесены! Отключение от базы")
        return true
    } catch (e) {
        console.log(e)
    }
 }

 const insertAll = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log("Подключение для внесения нескольких данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.insertMany(data)
 
        await MongoDBclient.close()
        console.log("Данные внесены! Отключение от базы")
    } catch (e) {
        console.log(e)
    }
 }
 
 const count = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log("Подключения для уточения количества")
 
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        console.log("Количество документов в базе данных:", AllDocuments.length)
 
        await MongoDBclient.close()
        console.log("Отключились")
        return AllDocuments.length
    } catch (e) {
        console.log(e)
    }
 }

 const find = async (coll,data) =>{

    try {
        await MongoDBclient.connect()
        console.log("Подключение для поиска по базе")
 
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        //console.log(AllDocuments)
 
        await MongoDBclient.close()
        return AllDocuments
    } catch (e) {
        console.log(e)
    }
 }

 const update = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        console.log("Подключение для обновления данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.updateOne(data, {$set:newdata})
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
        return true
    } catch (e) {
        console.log(e)
    }
 }

 const deleteOne = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        console.log("Подключение для обновления данных")
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.deleteOne(data, {newdata})
 
        await MongoDBclient.close()
        console.log("Закрыли подключение")
        return true
    } catch (e) {
        console.log(e)
    }
 }

module.exports = {connect, insert, insertAll, count, find, update, deleteOne}