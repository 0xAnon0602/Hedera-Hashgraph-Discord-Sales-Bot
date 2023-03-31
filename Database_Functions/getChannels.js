const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const mongoPass = process.env.MONGO_PASS
const uri = `mongodb+srv://root:${mongoPass}@alldatabases.d4ks90c.mongodb.net/?retryWrites=true&w=majority`;
const dbName = "Hedera_Sales"
const colName = "Server_Database"

const client = new MongoClient(uri);

const removeObjectId = (input) =>{
    var finalReturn=[]
    for(const arr in input){
        var tempJSON={}
        const allKeys = (Object.keys(input[arr]))
        allKeys.forEach(key => { 
            if(key!='_id'){tempJSON[key]=input[arr][key]}
        })
        finalReturn.push(tempJSON)
    }
    return finalReturn
}

const getChannelsFunction = async(_channel) =>  {
try{
  await client.connect();
  const db = client.db(dbName);

  const collection = db.collection(colName)

  var query = {"channelID":_channel}
  
  const finalOutputTemp = await collection.find(query).toArray()
  const finalOutput = removeObjectId(finalOutputTemp)
  return finalOutput

    }catch(e){
        console.log(e)
    }finally{
        await client.close()
    }

}

module.exports = getChannelsFunction
