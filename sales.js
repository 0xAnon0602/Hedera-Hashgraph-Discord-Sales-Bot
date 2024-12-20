const axios = require('axios')
const getContracts = require('./Database_Functions/getContracts.js')
const addCollection = require('./Functions/addCollection.js')
const addAllCollection = require('./Functions/addAllCollection.js')
const deleteAllCollection  = require('./Functions/deleteAllCollection.js');
const deleteCollection = require('./Functions/deleteCollection.js');
const listCollection = require('./Functions/listCollection.js');

const { Client, Intents,MessageEmbed } = require('discord.js');

const discord_api=process.env.DISCORD_API
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getKabilaContract(str) {
    const regex = /(?:[^.]*\.){2}(.*)/;
    const match = str.match(regex);
    return match ? match[1] : null;
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
var timestampKabila = Math.floor(Date.now() / 1000)

try{

    var GUILD_ID = client.guilds.cache.map(guild => guild.id);
    client.user.setActivity(`Sales On ${GUILD_ID.length} Servers`, { type: 'WATCHING' });
        
}catch(e){console.log(`Error in updating status!`)}

while(true){

// FOR SENTIENT MARKETPLACE

    try{    

        var url=`https://api.sentx.io/v1/public/market/activity?apikey=${process.env.SENTX_API}&activityFilter=Sales&amount=50&page=1`

        var response = await axios.get(url) 
        var transactions = (response.data['marketActivity'])
        let reversedTransactions = transactions.map((e, i, a)=> a[(a.length -1) -i])
        let tempSentientTimestamp = 0;

        for(var tx of reversedTransactions){

            var txTimestampTemp = new Date(tx['saleDate'])
            var txTimestamp = parseInt(txTimestampTemp.getTime()/1000);

            if(txTimestamp>=timeStampSentient){

                var nftTokenId = tx['nftTokenAddress']
                var nftSerial = tx['nftSerialId'] 
                var buyer = tx['buyerAddress']
                var seller = tx['sellerAddress']
                var nftName = tx['collectionName']
                var nftImage=tx['imageCDN']
                var value = Math.abs(parseInt(tx['salePrice']))
                var txID = tx['saleTransactionId']
                var tokenName = tx['paymentToken']['symbol']
                if(tokenName == 'HBAR') tokenName = 'ℏ'
                else tokenName = ` ${tokenName}`

                if(tokenName!=null){

                    try{
                        const extension = nftImage.slice(-3)
                        if(extension=="jpg"){
                            nftImage = nftImage.replace("w32","w500")
                        }
                    }catch(e){
                        console.log(e)
                        console.log('Something Went Wrong in SENTX Image')
                        nftImage = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvUio5S_e5H0Yo2B0dBsEC09oLUDIOORQM4w&usqp=CAU`
                    }

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
                    .setDescription(`\n**__Collection__**\n[${nftName}](https://sentx.io/nft-marketplace/${nftTokenId})\n\n**__Price__**\n${value}${tokenName} \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/mainnet/account/${seller})\n`)
                    .setImage(nftImage)
                    .setURL(`https://hederaexplorer.io/search-details/transaction/${txID}`)
                    .setTimestamp(new Date())
                    .setFooter({ text: 'Made by 0xAnon'});


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

                    if(value>=150){
                        client.channels.cache.get(`1125884996624855110`).send({ embeds: [exampleEmbed] }).catch(e =>{
                        console.log(`Error in sending to server`)
                        })
                    }
                
                }

                tempSentientTimestamp=txTimestamp

            }
        }

        if(tempSentientTimestamp > timeStampSentient) timeStampSentient = tempSentientTimestamp
        timeStampSentient++

    }catch(e){
        console.log(e)
        console.log(`ERROR IN SENTX`)
        timeStampSentient = Math.floor(Date.now() / 1000)
    }

// FOR KABILA MARKETPLACE     

    try{

        let url=`https://labs.kabila.app/api/marketplace/analytics/activity?skip=0&limit=25&timeRange=2m&format=JSONEachRow&fields=tokenId%2CcollectionName%2CserialNumber%2Cname%2CimageCid%2CactivityType%2CsubactivityType%2CverificationType%2Cprice%2Ccurrency%2CbuyerId%2CsellerId%2Crank%2CcreatedAt&activityType=SALE`

        let response = await axios.get(url)
        response =response.data
        let reversedTransactions = response.map((e, i, a)=> a[(a.length -1) -i])
        let tempKabilaTimestamp = 0;
        
        for(const nftSale of reversedTransactions){

            const nftSaleTimestamp = new Date(nftSale.createdAt) / 1000
            
            if(nftSaleTimestamp > timestampKabila){

                var nftTokenId = nftSale.tokenId
                var nftSerial = nftSale.serialNumber
                var buyer = nftSale.buyerId
                var seller = nftSale.sellerId
                var nftName = nftSale.collectionName
                var nftImageTemp= nftSale.imageCid
                var value = nftSale.price
                var rank = nftSale.rank
                let nftImage

                if(nftImageTemp.includes("ipfs.io")){
                    nftImage = `https://cdn.kabila.app/ipfs/${nftImageTemp.substring(21)}?class=medium&optimizer=image`
                }else if(nftImageTemp.includes("ar://")){
                    nftImage = `https://akrd.net/${nftImageTemp.substring(5)}`
                }else{
                    nftImage = `https://cdn.kabila.app/ipfs/${nftImageTemp.substring(7)}?class=medium&optimizer=image`
                }

                nftImage = nftImage.replace(/\s/g, '%20')

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
                .setAuthor({ name: 'Kabila Market Sales', iconURL: 'https://pbs.twimg.com/profile_images/1719698453721137152/yF_-T1X9_400x400.jpg'})
                .setTitle(`${nftName} ${nftSerial} SOLD!`)
                .setDescription(`\n**__Collection__**\n[${nftName}](https://market.kabila.app/en/collections/${getKabilaContract(nftTokenId)})\n\n**__Price__**\n${value}ℏ ${ rank!=0 ? `\n\n**__Rank__**\n${rank}`: ''} \n\n**__Buyer__**\n[${buyer}](https://hashscan.io/mainnet/account/${buyer})\n\n**__Seller__**\n[${seller}](https://hashscan.io/mainnet/account/${seller})\n`)
                .setImage(nftImage)
                .setTimestamp(new Date())
                .setFooter({ text: 'Made by 0xAnon'});

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

                client.channels.cache.get(`1226909437491544139`).send({ embeds: [exampleEmbed] }).catch(e =>{
                    console.log(`Error in sending to server`)
                })

                tempKabilaTimestamp = nftSaleTimestamp

            }

        }

        if(tempKabilaTimestamp > timestampKabila) timestampKabila = tempKabilaTimestamp

    }catch(e){
        console.log(e)
        console.log(`ERROR IN KABILA`)
        timestampKabila = Math.floor(Date.now() / 1000)
    }

    await sleep(10*1000)

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

