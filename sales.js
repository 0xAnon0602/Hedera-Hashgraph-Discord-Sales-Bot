const fetch = require('node-fetch')
const getContracts = require('./Database_Functions/getContracts.js')
const addCollection = require('./Functions/addCollection.js')
const addAllCollection = require('./Functions/addAllCollection.js')
const deleteAllCollection  = require('./Functions/deleteAllCollection.js');
const deleteCollection = require('./Functions/deleteCollection.js');
const listCollection = require('./Functions/listCollection.js');

const { Client, Intents,MessageEmbed } = require('discord.js');

const discord_api=process.env.DISCORD_API
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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

var timeStampSentient = Math.floor(Date.now() / 1000)

try{

    var GUILD_ID = client.guilds.cache.map(guild => guild.id);
    client.user.setActivity(`Sales On ${GUILD_ID.length} Servers`, { type: 'WATCHING' });
        
}catch(e){console.log(`Error in updating status!`)}

while(true){


// FOR SENTIENT MARKETPLACE

    try{    

    // To get new transactions in interval of 1 second
    var url=`https://gbackend.sentx.io/getactivityMarketplace`


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

            var saleTypeId = tx['nftSaleTypeId']
            var txTimestampTemp = new Date(tx['saleDate'])
            var txTimestamp = parseInt(txTimestampTemp.getTime()/1000);

            if(txTimestamp>=timeStampSentient && saleTypeId==1){

            var nftTokenId = tx['tokenAddress']
            var nftSerial = tx['serialId'] 
            var buyer = tx['buyerAddress']
            var seller = tx['sellerAddress']
            var nftName = tx['cname']
            var nftImage=tx['imageCDN']
            var value = Math.abs(parseInt(tx['salePrice']))
            var txID = tx['saleTransactionId']

            const extension = nftImage.slice(-3)
            if(extension=="jpg"){
                nftImage = nftImage.replace("w32","w500")
            }

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
        .setAuthor({ name: 'SentX Sales', iconURL: 'https://blob.sentx.io/media/web/logo-sm-notrans.png?width=128'})
        .setTitle(`${nftName} ${nftSerial} SOLD!`)
        .setDescription(`\n**__Collection__**\n[${nftName}](https://sentx.io/nft-marketplace/${nftTokenId})\n\n**__Price__**\n${value}ℏ \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/mainnet/account/${seller})\n`)
        .setImage(nftImage)
        .setURL(`https://hederaexplorer.io/search-details/tran7576saction/${txID}`)
        .setTimestamp(new Date())
        .setFooter({ text: 'Made by 0xAnon#0602'});


        var allMatching = await getContracts(nftTokenId)

        for(const row of allMatching){
            try{
                var channelInfo = client.channels.cache.get(row['channelID'])
                client.channels.cache.get(row['channelID']).send({ embeds: [exampleEmbed] }).catch(e =>{
                console.log(`Error in sending to server`)
            })
            }catch(e){
                if(channelInfo==undefined){console.log(`Error in sending to unknown Channel`)}
            }

        }
        
        timeStampSentient=txTimestamp

    }


    }
    timeStampSentient++

}catch(e){console.log(e)
    console.log(`ERROR IN SENTX`)
    timeStampSentient = Math.floor(Date.now() / 1000)
}


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

