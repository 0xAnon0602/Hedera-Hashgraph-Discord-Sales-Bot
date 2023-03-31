const {MessageEmbed } = require('discord.js');
const getChannels = require('../Database_Functions/getChannels.js')

const listCollectionFunction = async(_interaction) => {

    var perms = ((_interaction.member.permissions))
    let manage_server = perms.has("MANAGE_GUILD");

    if(manage_server){

    try{

        var rows = await getChannels(String(_interaction.channelId))
        
        if(rows.length!=0){

            if(rows[0]["channelID"]==_interaction.channelId){

                if (rows[0]["allCollection"]==true){

                    var exampleEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`You have added ALL contracts to this channel`)  

                }
                else{

                    if((rows[0]['contracts'].length!=0)){

                        var dataToSend=""
                        for(var contract of rows[0]['contracts']){
                            for(var letter of contract){
                                dataToSend+=letter
                            }
                            dataToSend+="\n"
                        }

                        var exampleEmbed = new MessageEmbed()
                        .setColor('#00ff00')
                        .setDescription(dataToSend)

                    }else{

                        var exampleEmbed = new MessageEmbed()
                        .setColor('#00ff00')
                        .setDescription(`No contracts has been added to this channel`)

                    }

                 }

            }
            
            
            }else{

                var exampleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`No contracts has been added to this channel`)

            }

            await _interaction.reply({ embeds: [exampleEmbed], ephemeral: true }).catch(e =>{console.log(e)})               

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

module.exports = listCollectionFunction
