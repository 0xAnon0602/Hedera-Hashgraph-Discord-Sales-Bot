const fetch = require('node-fetch')
const getContracts = require('./Database_Functions/getContracts.js')
const addCollection = require('./Functions/addCollection.js')
const addAllCollection = require('./Functions/addAllCollection.js')
const deleteAllCollection  = require('./Functions/deleteAllCollection.js');
const deleteCollection = require('./Functions/deleteCollection.js');
const listCollection = require('./Functions/listCollection.js');

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const { Client, Intents,MessageEmbed } = require('discord.js');

const discord_api=process.env.DISCORD_API
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var mainZuseAccount = `0.0.703235`

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
    .setDescription(`\n**__Collection__**\n[${nftName}](https://zuse.market/collection/${nftTokenId})\n\n**__Price__**\n${value}ℏ \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/mainnet/account/${seller})\n`)
    .setImage(nftImage)
    .setURL(`https://hederaexplorer.io/search-details/transaction/${txID}`)
    .setTimestamp(new Date())
    .setFooter({ text: 'Made by 0xAnon#0602'});

    var allMatching = await getContracts(nftTokenId)

    for(const row of allMatching){
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
var url=`https://hederasentientbackend.azurewebsites.net/getactivityMarketplace`


var opts = {
    method: "POST",
    headers:{
        'accept': 'application/json'
    },       
    body: JSON.stringify({
        "f": null,
        "a": null,
        "page": 1,
        "amount": 25,
        "activityFilter": "Sales"
    })
}

var response = await web_call(url,opts)


var transactions = (response['response'])
let reversedTransactions = transactions.map((e, i, a)=> a[(a.length -1) -i])

for(var tx of reversedTransactions){

        var saleTypeId = tx['saleTypeId']
        var txTimestampTemp = new Date(tx['saleDate'])
        var txTimestamp = parseInt(txTimestampTemp.getTime()/1000);

        if(txTimestamp>=timeStampSentient && saleTypeId==1){

        var nftTokenId = tx['tokenAddress']
        var nftSerial = tx['serialId'] 
        var buyer = tx['buyerAddress']
        var seller = tx['sellerAddress']
        var nftName = tx['name']
        var nftImage=tx['imageParsed']
        var value = Math.abs(parseInt(tx['salePrice']))
        var txID = tx['saleTransactionId']


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
    .setDescription(`\n**__Collection__**\n[${nftName}](https://hederasentient.com/nft-marketplace/${nftTokenId})\n\n**__Price__**\n${value}ℏ \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/mainnet/account/${seller})\n`)
    .setImage(nftImage)
    .setURL(`https://hederaexplorer.io/search-details/transaction/${txID}`)
    .setTimestamp(new Date())
    .setFooter({ text: 'Made by 0xAnon#0602'});


    var allMatching = await getContracts(nftTokenId)

    for(const row of allMatching){
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

    
    timeStampSentient=txTimestamp

}


}
timeStampSentient++

break

}catch(e){console.log(e)
console.log(`Retrying API request (1)`)
}

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
                    .setDescription(`\n**__Collection__**\n[${nftName}](https://hashguild.xyz/collection/${nftTokenId})\n\n**__Price__**\n${value} HBAR \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/mainnet/account/${seller})\n`)
                    .setImage(nftImage)
                    .setURL(`https://hashguild.xyz/assets/${nftTokenId}/${nftSerial}`)
                    .setTimestamp(new Date())
                    .setFooter({ text: 'Made by 0xAnon#0602'});
    
                    var allMatching = await getContracts(nftTokenId)

                    for(const row of allMatching){
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

        await addCollection(interaction)

    }

    if (interaction.commandName === 'addallcollection') {

        await addAllCollection(interaction)

    }

    if (interaction.commandName === 'deleteallcollection') {

        await deleteAllCollection(interaction)

    }

    if (interaction.commandName === 'deletecollection') {

        await deleteCollection(interaction)

    }

    if (interaction.commandName === 'listaddedcollection') {

    await listCollection(interaction)

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
