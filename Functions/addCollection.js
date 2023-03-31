const {MessageEmbed } = require('discord.js');
const getChannels = require('../Database_Functions/getChannels.js')
const updateContracts = require('../Database_Functions/updateContracts.js')
const insertChannel = require('../Database_Functions/insertChannel.js')

const addCollectionFunction = async(_interaction) => {

    var perms = ((_interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){

    const nftContract = (_interaction.options["_hoistedOptions"][0]['value']).toLocaleLowerCase()

    try{

        var channelAlreadyExists=false
        var nftAlreadyExits=false
        var allCollection=false

        var rows = await getChannels(String(_interaction.channelId))

        if(rows.length!=0){
            
            if(rows[0]["channelID"]==_interaction.channelId){
                channelAlreadyExists=true

                if (rows[0]["allCollection"]==true){allCollection=true}
                else{
                if((rows[0]['contracts']).includes(nftContract)){
                    nftAlreadyExits=true
                }else{                
                    rows[0]['contracts'].push(nftContract)
                    nftAlreadyExits=false
                }
                 }

            }

        }


        if(nftAlreadyExits == false && channelAlreadyExists == true && allCollection == false){
        
        await updateContracts(
            {
                "channelID":String(_interaction.channelId)
            },
            {
                $set:{"contracts":rows[0]['contracts']}
            }
        )

        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`Contract is added!`)     
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)}) 

        }

        if(channelAlreadyExists == false){

        await insertChannel(
            {
                "serverID":String(_interaction.guildId),
                "channelID":String(_interaction.channelId),
                "contracts":[nftContract],
                "allCollection":0
            }
        )

        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`Contract is added!`)     
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)}) 

        }

        if(nftAlreadyExits == true && channelAlreadyExists == true && allCollection==false){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`Contracts already exits!`)     
            await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        }

        if(allCollection==true){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`All contracts are already added!`)     
            await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        }


    }catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Invalid Contract`)
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

    }else{
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You need "MANAGE_SERVER" permission to use this command!`)
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}

module.exports = addCollectionFunction
