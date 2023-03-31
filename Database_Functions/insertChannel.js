const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const mongoPass = process.env.MONGO_PASS
const uri = `mongodb+srv://root:${mongoPass}@alldatabases.d4ks90c.mongodb.net/?retryWrites=true&w=majority`;
const dbName = "Hedera_Sales"
const colName = "Server_Database"

const client = new MongoClient(uri);

const insertChannelFunction = async(_query) =>  {
try{
  await client.connect();
  const db = client.db(dbName);

  const collection = db.collection(colName)
  
  const finalOutputTemp = await collection.insertOne(_query)
  console.log(finalOutputTemp)

    }catch(e){
        console.log(e)
    }finally{
        await client.close()
    }

}

module.exports = insertChannelFunction
