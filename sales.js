const fetch = require('node-fetch')

const sqlite3= require("sqlite3").verbose();
require('dotenv').config()

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const { Client, Intents,MessageEmbed } = require('discord.js');

const discord_api=process.env.DISCORD_API
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var mainZuseAccount = `0.0.703235`
var mainSentientAccount = `0.0.1223480`

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


web_call = async (url,opts) => {
  
    let response_daily = await fetch(url,opts,{ mode: 'no-cors'});
    const result_daily = await response_daily.json();
    return result_daily

}    

client.on('ready',  async () => {

    console.log(` 

    ----Bot is connected to Discord----
    
    Below are the ongoing sales on Hedera Hashgraph -> 

    `)

client.api.applications(client.user.id).commands.post({data:
    
    {
        "name": "addcollection",
        "description": "To add a collections",
        "options": [
          {
            "type": 3,
            "name": "contract",
            "description": "Contract of NFT you want to add",
            "required": true
          }
        ]
      }


})



client.api.applications(client.user.id).commands.post({data:

    {
        "name": "addallcollection",
        "description": "Add all contracts pings"
      }
      

})


client.api.applications(client.user.id).commands.post({data:

    {
        "name": "deleteallcollection",
        "description": "Delete all contracts pings"
      }
      

})


client.api.applications(client.user.id).commands.post({data:

    {
        "name": "deletecollection",
        "description": "To add a collections",
        "options": [
          {
            "type": 3,
            "name": "contract",
            "description": "Contract of NFT you want to delete",
            "required": true
          }
        ]
      }


})



client.api.applications(client.user.id).commands.post({data:

    {
        "name": "listaddedcollection",
        "description": "To show added integrations"
      }
      

})

client.api.applications(client.user.id).commands.post({data:

    {
        "name": "help",
        "description": "To show the help message"
      }
      

})

var timeStampZuse = Math.floor(Date.now() / 1000)
var timeStampHashguild = Math.floor(Date.now() / 1000)
var timeStampSentient = Math.floor(Date.now() / 1000)


try{

    var GUILD_ID = client.guilds.cache.map(guild => guild.id);
    client.user.setActivity(`Sales On ${GUILD_ID.length} Servers`, { type: 'WATCHING' });
        
    }catch(e){console.log(`Error in updating status!`)}

while(true){

// FOR ZUSE MARKETPLACE

while(true){
    try{

// To get new transactions in interval of 1 second

var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?account.id=${mainZuseAccount}&limit=100&order=desc&timestamp=gt%3A${timeStampZuse}&transactiontype=cryptotransfer&result=success`


var opts = {
    headers:{
        'accept': 'application/json'
    }
}

var response = await web_call(url,opts)


var transactions = (response['transactions'])

for(var tx of transactions){

    var txID = tx['transaction_id']

    while(true){
        try{

    // To get each transactions info

    var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/${txID}?nonce=0`

    var opts = {
        headers:{
            'accept': 'application/json'
        }
    }
    
    var response = await web_call(url,opts)
    break

        }catch(e){console.log(e)
        console.log(`Retrying API request (2)`)
        }
    }
    


    var mainTx = (response['transactions'][0]['nft_transfers'])
    var mainTransfers = (response['transactions'][0]['transfers'])

    for (nftTx of mainTx){
        var nftTokenId = nftTx['token_id']
        var nftSerial = nftTx['serial_number'] 
        var buyer = nftTx['receiver_account_id']
        var seller = nftTx['sender_account_id']
    }

    for(transfers of mainTransfers){
        if (transfers['account']==buyer){
            var value = Math.abs(parseInt(transfers['amount']))/10**8
        }
    }


    while(true){
        try{

    // To get NFT NAME from TOKEN ID 

    var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${nftTokenId}`

    var opts = {
        headers:{
            'accept': 'application/json'
        }
    }
    
    var response = await web_call(url,opts)


    break

        }catch(e){console.log(e)
        console.log(`Retrying API request (3)`)
        }
    }

    var nftName = response['name']

    // TO GET NFT IMAGE 

    var nftImage = `https://zmedia.b-cdn.net/file/z35e-awg5/media/${nftTokenId}/${nftSerial}`

    // TO GET HBAR PRICE

    // while(true){
    //     try{

    // var priceData = await CoinGeckoClient.simple.price({
    //     ids: ['hedera-hashgraph'],
    //     vs_currencies: ['usd'],
    // }); 
    
    // var coinPrice = (priceData['data']['hedera-hashgraph']['usd']*value).toFixed(2)
    // break

    //     }catch(e){
    //         console.log(e)
    //         console.log(`Retrying Coingecko API`)
    //     }
    // }

    var nftImage = `https://zmedia.b-cdn.net/file/z35e-awg5/media/${nftTokenId}/${nftSerial}`



    console.log(
    ` 
    Name -> ${nftName}
    Buyer -> ${buyer}
    Seller -> ${seller}
    Nft Contract ->  ${nftTokenId}
    Token ID ->  ${nftSerial}
    Value -> ${value}
    Image -> ${nftImage}
    Tx ID -> ${txID}
    `)
    

    const exampleEmbed = new MessageEmbed()
    .setColor('#808080')
    .setAuthor({ name: 'Zuse Sales', iconURL: 'https://zuse.market/img/zuse_logo.2031c4b5.png'})
    .setTitle(`${nftName} ${nftSerial} SOLD!`)
    .setDescription(`\n**__Collection__**\n[${nftName}](https://zuse.market/collection/${nftTokenId})\n\n**__Price__**\n${value}ℏ \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/#/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/#/mainnet/account/${seller})\n`)
    .setImage(nftImage)
    .setURL(`https://hederaexplorer.io/search-details/transaction/${txID}`)
    .setTimestamp(new Date())
    .setFooter({ text: 'Made by 0xAnon#0602'});


    var db = new sqlite3.Database('servers.db');

    db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        rows.forEach((row) =>{
            channelContract=[]
            var channelContractTemp=row['contracts'].split(','); 
            channelContractTemp.forEach(element => {
                if (element!=''){
                    channelContract.push(element)
                }
            });


            if (row['allCollection']==true){
                try{
                var channelInfo = client.channels.cache.get(row['channelID'])
                client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                   console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
               })
                    }catch(e){
                        if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
                        else{
                        console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                        }
                    }

            }else{
            if (channelContract.length!=0){
                if (channelContract.includes(nftTokenId)){
                    try{
                    var channelInfo = client.channels.cache.get(row['channelID'])
                    client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                       console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                   })
                        }catch(e){
                            if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
                            else{
                            console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                            }

                        }
                }
         }

            }

        });

        });
    })


     
    
}

break

}catch(e){console.log(e)
console.log(`Retrying API request (1)`)
}

}

if (transactions.length!=0){
    timeStampZuse = parseInt(transactions[0]['consensus_timestamp'])+1
    try{

        var GUILD_ID = client.guilds.cache.map(guild => guild.id);
        client.user.setActivity(`Sales On ${GUILD_ID.length} Servers`, { type: 'WATCHING' });
            
        }catch(e){console.log(`Error in updating status!`)}
}


// FOR SENTIENT MARKETPLACE

while(true){
    try{

// To get new transactions in interval of 1 second

var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?account.id=${mainSentientAccount}&limit=100&order=desc&timestamp=gt%3A${timeStampSentient}&transactiontype=cryptotransfer&result=success`


var opts = {
    headers:{
        'accept': 'application/json'
    }
}

var response = await web_call(url,opts)


var transactions = (response['transactions'])


for(var tx of transactions){

    var txID = tx['transaction_id']

    while(true){
        try{

    // To get each transactions info

    var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/${txID}?nonce=0`

    var opts = {
        headers:{
            'accept': 'application/json'
        }
    }
    
    var response = await web_call(url,opts)
    break

        }catch(e){console.log(e)
        console.log(`Retrying API request (2)`)
        }
    }
    
    var memo64 = response['transactions'][0]['memo_base64']
    var isMint = (atob(memo64)).includes("Mint")

    if(!isMint){

    var mainTx = (response['transactions'][0]['nft_transfers'])
    var mainTransfers = (response['transactions'][0]['transfers'])

    for (nftTx of mainTx){
        var nftTokenId = nftTx['token_id']
        var nftSerial = nftTx['serial_number'] 
        var buyer = nftTx['receiver_account_id']
        var seller = nftTx['sender_account_id']
    }

    for(transfers of mainTransfers){
        if (transfers['account']==buyer){
            var value = Math.abs(parseInt(transfers['amount']))/10**8
        }
    }


    while(true){
        try{

    // To get NFT NAME from TOKEN ID 

    var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${nftTokenId}`

    var opts = {
        headers:{
            'accept': 'application/json'
        }
    }
    
    var response = await web_call(url,opts)
    break

        }catch(e){console.log(e)
        console.log(`Retrying API request (3)`)
        }
    }

    var nftName = response['name']

    // TO GET NFT IMAGE 

    var sentientImgName=(nftName.toLocaleLowerCase()).replace(' ','-')

    var url=`https://hederasentientbackend.azurewebsites.net/nftexplorer-nft`

    var opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "friendlyurl": sentientImgName,
            "serialId": nftSerial,
            "ismarket": false
        })
    }
    
    
    var response = await web_call(url,opts)

    var nftImage = response['response']['imageCDNURL']

    // TO GET HBAR PRICE

    // while(true){
    //     try{

    // var priceData = await CoinGeckoClient.simple.price({
    //     ids: ['hedera-hashgraph'],
    //     vs_currencies: ['usd'],
    // }); 
    
    // var coinPrice = (priceData['data']['hedera-hashgraph']['usd']*value).toFixed(2)
    // break

    //     }catch(e){
    //         console.log(e)
    //         console.log(`Retrying Coingecko API`)
    //     }
    // }




    console.log(
    ` 
    Name -> ${nftName}
    Buyer -> ${buyer}
    Seller -> ${seller}
    Nft Contract ->  ${nftTokenId}
    Token ID ->  ${nftSerial}
    Value -> ${value}
    Image -> ${nftImage}
    Tx ID -> ${txID}
    `)
    

    const exampleEmbed = new MessageEmbed()
    .setColor('#808080')
    .setAuthor({ name: 'Sentient Sales', iconURL: 'https://hederasentient.com/assets/images/logo-dark.png'})
    .setTitle(`${nftName} ${nftSerial} SOLD!`)
    .setDescription(`\n**__Collection__**\n[${nftName}](https://hederasentient.com/nft-explorer/${sentientImgName})\n\n**__Price__**\n${value}ℏ \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/#/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/#/mainnet/account/${seller})\n`)
    .setImage(nftImage)
    .setURL(`https://hederaexplorer.io/search-details/transaction/${txID}`)
    .setTimestamp(new Date())
    .setFooter({ text: 'Made by 0xAnon#0602'});


    var db = new sqlite3.Database('servers.db');

    db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        rows.forEach((row) =>{
            channelContract=[]
            var channelContractTemp=row['contracts'].split(','); 
            channelContractTemp.forEach(element => {
                if (element!=''){
                    channelContract.push(element)
                }
            });


            if (row['allCollection']==true){
                try{
                var channelInfo = client.channels.cache.get(row['channelID'])
                client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                   console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
               })
                    }catch(e){
                        if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
                        else{
                        console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                        }
                    }

            }else{
            if (channelContract.length!=0){
                if (channelContract.includes(nftTokenId)){
                    try{
                    var channelInfo = client.channels.cache.get(row['channelID'])
                    client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                       console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                   })
                        }catch(e){
                            if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
                            else{
                            console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                            }

                        }
                }
         }

            }

        });

        });
    })

     
}

}

break

}catch(e){console.log(e)
console.log(`Retrying API request (1)`)
}

}


if (transactions.length!=0){
    timeStampSentient = parseInt(transactions[0]['consensus_timestamp'])+1
    try{

        var GUILD_ID = client.guilds.cache.map(guild => guild.id);
        client.user.setActivity(`Sales On ${GUILD_ID.length} Servers`, { type: 'WATCHING' });
            
        }catch(e){console.log(`Error in updating status!`)}
}

// FOR HASHGUILD MARKETPLACE

while(true){
    try{
    
    var query = `
    query GetTransactionActivity($orderBy: [TransactionOrderByWithRelationInput!], $take: Int, $where: TransactionWhereInput) {
      transactions(orderBy: $orderBy, take: $take, where: $where) {
        buyer {
          nickname
          accountId
          __typename
        }
        seller {
          nickname
          accountId
          __typename
        }
        transactedNft {
          token
          serialNo
          name
          listingPrice
          isVerified
          imageUrl
          id
          creator
          favoritedByIds
          isForSale
          isVideoNft
          __typename
        }
        id
        dateOfTransaction
        transactionType
        hbarTransacted {
          price
          __typename
        }
        __typename
      }
    }
    `
    
    var url  = `https://hashguild.xyz/api/graphql`
    var variables = {
        "where": {
            "transactionType": {
                "equals": "SALE"
            },
            "successful": {
                "equals": true
            },
            "transactedNft": {
                "isNot": null
            }
        },
        "orderBy": [
            {
                "dateOfTransaction": "desc"
            }
        ],
        "take": 100
    }
    
    var opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,      
          variables
        })
      }
    

    var response = await web_call(url,opts)
    
    var transactions = (response['data']['transactions'])

    
    var tempTimestamp = timeStampHashguild
    
    for(var tx of transactions){
    
    
        if(parseInt(toTimestamp(tx['dateOfTransaction'])) > timeStampHashguild){
            
    
            if(parseInt(toTimestamp(tx['dateOfTransaction'])) > tempTimestamp){tempTimestamp = parseInt(toTimestamp(tx['dateOfTransaction']))}
    
        
    
                    var nftTokenId = tx['transactedNft']['token']
                    var buyer = tx['buyer']['accountId']
                    var seller = tx['seller']['accountId']
                    var value = tx['hbarTransacted']['price']
                    var nftImage = tx['transactedNft']['imageUrl']
                    var nftSerial = tx['transactedNft']['serialNo']
    
           
                    while(true){
                        try{
        
                    var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${nftTokenId}`
        
                    var opts = {
                        headers:{
                            'accept': 'application/json'
                        }
                    }
                    
                    var response = await web_call(url,opts)
                    break
        
                        }catch(e){console.log(e)}
                    }
    
                    var nftName = response['name']
         
                    // while(true){
                    // try{

                    // var priceData = await CoinGeckoClient.simple.price({
                    //     ids: ['hedera-hashgraph'],
                    //     vs_currencies: ['usd'],
                    // }); 
                    
                    // var coinPrice = (priceData['data']['hedera-hashgraph']['usd']*value).toFixed(2)
                    // break

                    // }catch(e){
                    //     console.log(e)
                    //     console.log(`Retrying Coingecko API`)                        
                    //     }
                    // }   


    

                console.log(
                    ` 
                    Name -> ${nftName}
                    Buyer -> ${buyer}
                    Seller -> ${seller}
                    Nft Contract ->  ${nftTokenId}
                    Token ID ->  ${nftSerial}
                    Value -> ${value}
                    Image -> ${nftImage}
                    `)


                    const exampleEmbed = new MessageEmbed()
                    .setColor('#808080')
                    .setAuthor({ name: 'HashGuild Sales', iconURL: 'https://www.trst-nft.com/wp-content/uploads/2022/05/HG-sponsor-logo.png'})
                    .setTitle(`${nftName} ${nftSerial} SOLD!`)
                    .setDescription(`\n**__Collection__**\n[${nftName}](https://hashguild.xyz/collection/${nftTokenId})\n\n**__Price__**\n${value} HBAR \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/#/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/#/mainnet/account/${seller})\n`)
                    .setImage(nftImage)
                    .setURL(`https://hashguild.xyz/assets/${nftTokenId}/${nftSerial}`)
                    .setTimestamp(new Date())
                    .setFooter({ text: 'Made by 0xAnon#0602'});
    
                    var db = new sqlite3.Database('servers.db');

                    db.serialize(function() {

                        var sql = 'SELECT * FROM users';
                
                        db.all(sql, [], async(err, rows) => {
                
                        if (err) return console.error(err.message);
                
                        rows.forEach((row) =>{
                            channelContract=[]
                            var channelContractTemp=row['contracts'].split(','); 
                            channelContractTemp.forEach(element => {
                                if (element!=''){
                                    channelContract.push(element)
                                }
                            });
                
                
                            if (row['allCollection']==true){
                                try{
                                var channelInfo = client.channels.cache.get(row['channelID'])
                                client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                                   console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                               })
                                    }catch(e){
                                        if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
                                        else{
                                        console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                                        }
                                    }
                
                            }else{
                            if (channelContract.length!=0){
                                if (channelContract.includes(nftTokenId)){
                                    try{
                                    var channelInfo = client.channels.cache.get(row['channelID'])
                                    client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                                       console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                                   })
                                        }catch(e){
                                            if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
                                            else{
                                            console.log(`Error in sending to ${channelInfo.name} channel on ${channelInfo.guild.name} server`)
                                            }
                
                                        }
                                }
                         }
                
                            }
                
                        });
                
                        });
                    })
                
                
    

        }
    }
    
    break
    }catch(e){
        console.log(`Retrying again GRAPHQL request`)
        await sleep(1*1000)
    }
    }

timeStampHashguild = tempTimestamp
    

await sleep(1*1000)


}



})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if(interaction.guild != null && interaction.channelId != null){

    if (interaction.commandName === 'addcollection') {

        var perms = ((interaction.member.permissions))
        let manage_server = perms.has("MANAGE_GUILD");
    
        if(manage_server){

    var nftContract = (interaction.options["_hoistedOptions"][0]['value']).toLocaleLowerCase()

    try{


        var db = new sqlite3.Database('servers.db');


        var channelAlreadyExists=false
        var nftAlreadyExits=false
        var allCollection=false
        var channelContracts


        db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        for (row of rows){
            

            if(row["channelID"]==interaction.channelId){
                channelAlreadyExists=true

                if (row["allCollection"]==true){allCollection=true}
                else{

                channelContracts = row["contracts"].split(','); 
                if(channelContracts.includes(nftContract)){
                    nftAlreadyExits=true
                }else{                
                    channelContracts.push(nftContract)
                    nftAlreadyExits=false
                }
            }
                break
            }

        };

        });
    })

        
        await sleep(1*1000)

        db.serialize(async function() {


        if(nftAlreadyExits == false && channelAlreadyExists == true && allCollection == false){
        
        db.serialize(async function() {
        var sqlUpdate = "UPDATE users SET contracts = ? WHERE channelID = ?";
        db.run(sqlUpdate, [channelContracts, interaction.channelId], async function (err) {
        if (err) return console.error(err.message);
        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`Contract added!`)     
         await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
           });
        })
        }

        if(channelAlreadyExists == false){
        var sqlInsert = `INSERT INTO users (serverID, channelID, contracts, allCollection)
        VALUES (?, ?, ?, ?)`;
        db.run(
        sqlInsert,
        [interaction.guildId,interaction.channelId, [nftContract],false],
        async(err) => {
        if (err) return console.error(err.message);
        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`Contract added!`)     
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    })

        }

        if(nftAlreadyExits == true && channelAlreadyExists == true && allCollection==false){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`Contracts already exits!`)     
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        }

        if(allCollection==true){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`All contracts are already added!`)     
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
             }

    })

db.close()



}catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Invalid Contract`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }
    
    }else{
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You need "MANAGE_SERVER" permission to use this command!`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}


if (interaction.commandName === 'addallcollection') {

    var perms = ((interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){

    try{


        var db = new sqlite3.Database('servers.db');

        


        var channelAlreadyExists=false
        var allCollection=false

        db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        for (row of rows){
            

            if(row["channelID"]==interaction.channelId){
                channelAlreadyExists=true
                if (rows["allCollection"]==true){allCollection=true}
                break
            }

        };

        });
    })

        
        await sleep(1*1000)

        db.serialize(async function() {




        if(channelAlreadyExists == false){
        var sqlInsert = `INSERT INTO users (serverID, channelID, contracts, allCollection)
        VALUES (?, ?, ?, ?)`;
        db.run(
        sqlInsert,
        [interaction.guildId,interaction.channelId, [nftContract],true],
        async(err) => {
        if (err) return console.error(err.message);
        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`All contracts added!`)     
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    })

        }

        if(allCollection == true && channelAlreadyExists == true){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`All contracts are already added!`)     
             await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });              
               }

        if(allCollection == false && channelAlreadyExists == true){
            db.serialize(async function() {
                var sqlUpdate = "UPDATE users SET allCollection = ? , contracts = ? WHERE channelID = ?";
                db.run(sqlUpdate, [true,[], interaction.channelId], async function (err) {
                if (err) return console.error(err.message);
                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`All contracts added!`)     
                await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
            });
                })           
         }



    })

db.close()



}catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Error`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });       
     }


    }else{
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You need "MANAGE_SERVER" permission to use this command!`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}


if (interaction.commandName === 'deleteallcollection') {

    var perms = ((interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){

    try{


        var db = new sqlite3.Database('servers.db');
        
        channelContract=[]
        var channelAlreadyExists=false
        var emptyContract = false
        var allCollection = false

        db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        for (row of rows){ 

            if(row["channelID"]==interaction.channelId){
                channelAlreadyExists=true
                if (row["allCollection"]==true){allCollection=true}
                var channelContractTemp=row['contracts'].split(','); 
                channelContractTemp.forEach(element => {
                    if (element!=''){
                        channelContract.push(element)
                    }                        
                });
                if (channelContract.length==0){
                emptyContract = true
                }
                break
            }

        };

        });
    })
        
        await sleep(1*1000)

        db.serialize(async function() {


        if(channelAlreadyExists == true && emptyContract == false && allCollection==true){
            db.serialize(async function() {
                var sqlUpdate = "UPDATE users SET allCollection = ? , contracts = ? WHERE channelID = ?";
                db.run(sqlUpdate, [false,[], interaction.channelId], async function (err) {
                if (err) return console.error(err.message);
                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`All contracts deleted!`)     
                await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
            });
                })           
        }


        if(channelAlreadyExists == true && emptyContract == true && allCollection==true){
            db.serialize(async function() {
                var sqlUpdate = "UPDATE users SET allCollection = ? , contracts = ? WHERE channelID = ?";
                db.run(sqlUpdate, [false,[], interaction.channelId], async function (err) {
                if (err) return console.error(err.message);
                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`All contracts deleted!`)     
                await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
            });
                })           
        }

        if(channelAlreadyExists == true && emptyContract == false && allCollection==false){
            db.serialize(async function() {
                var sqlUpdate = "UPDATE users SET allCollection = ? , contracts = ? WHERE channelID = ?";
                db.run(sqlUpdate, [false,[], interaction.channelId], async function (err) {
                if (err) return console.error(err.message);
                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`All contracts deleted!`)     
                await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})
            });
                })           
        }


        if(channelAlreadyExists == true && emptyContract == true && allCollection==false){
                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`No contracts exits for this channel in the database!`)     
                 await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });                   
        }
        if(channelAlreadyExists == false){
            var exampleEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(`Error`)
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        }

    })

db.close()



}catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Invalid Contract`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

    }else{
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You need "MANAGE_SERVER" permission to use this command!`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}


if (interaction.commandName === 'deletecollection') {

    var perms = ((interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){

    var nftContract = (interaction.options["_hoistedOptions"][0]['value']).toLocaleLowerCase()

    try{


        var db = new sqlite3.Database('servers.db');


        var channelAlreadyExists=false
        var nftAlreadyExits=false
        var allCollection=false
        var channelContracts
        var channelContractTemp=[]


        db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        for (row of rows){
            

            if(row["channelID"]==interaction.channelId){
                channelAlreadyExists=true

                if (row["allCollection"]==true){allCollection=true}
                else{
                channelContracts = row["contracts"].split(','); 
                if(channelContracts.includes(nftContract)){
                    nftAlreadyExits=true
                    channelContracts.forEach(element => {
                        if (element!=''&& element!=nftContract){
                            channelContractTemp.push(element)
                        }
                    });
                }
            }
                break
            }

        };

        });
    })

        
        await sleep(1*1000)

        db.serialize(async function() {


        if(nftAlreadyExits == true && channelAlreadyExists == true && allCollection == false){
        db.serialize(async function() {
        var sqlUpdate = "UPDATE users SET contracts = ? WHERE channelID = ?";
        db.run(sqlUpdate, [channelContractTemp, interaction.channelId], async function (err) {
        if (err) return console.error(err.message);
        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`Contract deleted!`)     
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    });
        })
        
    }

        if(channelAlreadyExists == false){

            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`No such contract exits in database for this channel!`)     
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
         }


        if(nftAlreadyExits == false && channelAlreadyExists == true && allCollection==false){
            
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`No such contract exits in database for this channel!`)     
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
           
        }

        if(allCollection==true){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`You have added for all contracts , to disable it use /deleteallcollections`)     
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        }

    })

db.close()



}catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Invalid Contract`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

    }else{
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You need "MANAGE_SERVER" permission to use this command!`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}


if (interaction.commandName === 'listaddedcollection') {

    try{


        var db = new sqlite3.Database('servers.db');


        var channelAlreadyExists=false
        var allCollection=false
        channelContract=[]

        db.serialize(function() {

        var sql = 'SELECT * FROM users';

        db.all(sql, [], async(err, rows) => {

        if (err) return console.error(err.message);

        for (row of rows){
            
            if(row["channelID"]==interaction.channelId){
                channelAlreadyExists=true
                if(row["allCollection"]==true){
                    allCollection=true
                    var exampleEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`You have added ALL contracts to this channel`)                    
                }
                else{
                
                    var channelContractTemp=row['contracts'].split(','); 
                    channelContractTemp.forEach(element => {
                        if (element!=''){
                            channelContract.push(element)
                        }
                    });
                if (channelContract.length==0){
                    var exampleEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`No contracts has been added to this channel`)
                }
                else{
                    var dataToSend=``
                    channelContract.forEach(contract => {
                        dataToSend+=`${contract}\n`
                    })
                    var exampleEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('**__Contracts Added__**')
                    .setDescription(dataToSend)
                }
            }
                break
            }
            else{
                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`No contracts has been added to this channel`)
        
            }

        };
        await sleep(1*1000)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    });

    })

        



db.close()



}catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Error`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}


if (interaction.commandName === 'help') {

    try{

        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription("1) ** /addcollection** \n-> Takes contract you want to add as input !\n\n2) ** /addallcollection **\n-> No input is required !\n-> Sends all sales from Zuse marketplace !\n\n3) ** /deletecollection **\n-> Takes contract as input which you want to delete !\n-> This command will not work if you have added all contracts using ** /addallcollection** , use ** /deleteallcollection ** for it !\n\n4) ** /deleteallcollection ** \n-> No input is required !\n-> Delete all the contracts at once !\n\n5) ** /help **\n-> This will show this message")
        .setTitle("**__List of Commands Available__**")
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               

    }catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Error`)
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }
}

}

    })

client.login(discord_api);
