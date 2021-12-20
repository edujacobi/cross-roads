const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    let server = bot.guilds.cache.get('529674666692837378')
    let canal = server.channels.cache.get('529676748422512661')
    let ultimoUpdate
    let date

    canal.messages.fetch(canal.lastMessageId).then(m => {
        ultimoUpdate = m.content
        date = m.createdTimestamp

    }).then(() => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${bot.badges.dev} Updates`)
            //.setThumbnail("https://cdn.discordapp.com/attachments/453314806674358292/526265639552417802/GTD.png")
            .setColor('GREEN')
            .setDescription(ultimoUpdate)
            .addField("Para ver todos os updates", "Entre no servidor oficial do Cross Roads: https://discord.gg/sNf8avn")
            .setFooter(`${bot.user.username} • #${canal.name}`, bot.user.avatarURL())
            .setTimestamp(date);

        return message.channel.send({
            embeds: [embed]
        }).catch(err => console.log("Não consegui enviar mensagem `updates`"))
    })
}