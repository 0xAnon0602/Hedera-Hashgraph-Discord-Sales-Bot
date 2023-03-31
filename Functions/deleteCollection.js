const {MessageEmbed } = require('discord.js');
const getChannels = require('../Database_Functions/getChannels.js')
const updateContracts = require('../Database_Functions/updateContracts.js')

const deleteCollectionFunction = async(_interaction) => {

    var perms = ((_interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){

        var nftContract = (_interaction.options["_hoistedOptions"][0]['value']).toLocaleLowerCase()

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
                    var newContract = []
                    for(contract of rows[0]['contracts']){
                        if(contract!=nftContract){
                            newContract.push(contract)
                        }
                    }
                    nftAlreadyExits=true
                }else{                
                    nftAlreadyExits=false
                }
                 }

            }

        }


        if(nftAlreadyExits == true && channelAlreadyExists == true && allCollection == false){
        
            await updateContracts(
                {
                    "channelID":String(_interaction.channelId)
                },
                {
                    $set:{"contracts":newContract}
                }
            )

            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`Contract deleted!`)     
            await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)}) 

        }

        if(channelAlreadyExists == false){

            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`No such contract exits in database for this channel!`)     
            await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        }


        if(nftAlreadyExits == false && channelAlreadyExists == true && allCollection==false){
                
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`No such contract exits in database for this channel!`)     
            await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               
        
        }

        if(allCollection==true){
            var exampleEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`You have added for all contracts , to disable it use /deleteallcollections`)     
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

module.exports = deleteCollectionFunction
