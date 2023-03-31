const {MessageEmbed } = require('discord.js');
const getChannels = require('../Database_Functions/getChannels.js')
const updateContracts = require('../Database_Functions/updateContracts.js')
const insertChannel = require('../Database_Functions/insertChannel.js')

const deleteAllCollectionFunction = async(_interaction) => {

    var perms = ((_interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){


    try{

        var channelAlreadyExists=false
        var allCollection=false

        var rows = await getChannels(String(_interaction.channelId))

        if(rows.length!=0){
            
            if(rows[0]["channelID"]==_interaction.channelId){
                channelAlreadyExists=true

                if (rows[0]["allCollection"]==true){allCollection=true}

            }

        }



        if(channelAlreadyExists == true){
        
        await updateContracts(
            {
                "channelID":String(_interaction.channelId)
            },
            {
                $set:{"contracts":[],"allCollection":0}
            }
        )

        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`All contracts are  deleted!`)     
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)}) 

        }

        if(channelAlreadyExists == false){

        await insertChannel(
            {
                "serverID":String(_interaction.guildId),
                "channelID":String(_interaction.channelId),
                "contracts":[],
                "allCollection":0
            }
        )

        var exampleEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`All contracts are  deleted!`)     
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)}) 


        }

    }catch(e){
        console.log(e)
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Something Went Wrong!`)
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

    }else{
        var exampleEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You need "MANAGE_SERVER" permission to use this command!`)
        await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
    }

}

module.exports = deleteAllCollectionFunction
