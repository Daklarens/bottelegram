const {MongoClient} = require('mongodb')
require('dotenv').config()

const MongoDBclient = new MongoClient(process.env.MONGODB)

const connect = async () =>{
    try {
        await MongoDBclient.connect()
        console.log("connect")
        return true
    } catch (e) {
        console.log(e)
        return false
    }
 }

 const insert = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.insertOne(data)
 
        console.log(`Add DB in ${coll} `)
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
 
      
        console.log("Данные внесены! Отключение от базы")
    } catch (e) {
        console.log(e)
    }
 }
 
 const count = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        console.log("count - ", `${coll} - ${AllDocuments.length}`)
        return AllDocuments.length
    } catch (e) {
        console.log(e)
    }
 }

 const find = async (coll,data) =>{

    try {
        await MongoDBclient.connect()
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        console.log(`Find - ${coll}`)
 
        return AllDocuments
    } catch (e) {
        console.log(e)
    }
 }

 const update = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.updateOne(data, {$set:newdata})
        console.log(`Update - ${coll}`)
        return true
    } catch (e) {
        console.log(e)
    }
 }

 const deleteOne = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.deleteOne(data, {newdata})
        console.log(`Delete - ${coll}`)
        return true
    } catch (e) {
        console.log(e)
    }
 }

module.exports = {connect, insert, insertAll, count, find, update, deleteOne}