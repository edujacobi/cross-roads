const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    // if (message.author.id != bot.config.adminID)
    return bot.createEmbed(message, `${bot.config.car} Carros em breve!`, "Mas sabe-se lá quando", 'GREEN')

    let uData = bot.data.get(message.author.id)
    const embed = new Discord.MessageEmbed()

        .setTitle(`${bot.config.car} Concessionária [em breve]`)
        .setDescription("Reduza o tempo dos jobs!\nCada carro tem duração de 7 dias.\n")
        .setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/738571318865428500/radar_impound.png")
        .setColor(bot.colors.darkGrey)

        .addField("1: Chevrolet Onix", `R$ 50.000\nRedução: 5%`, true)
        .addField("2: Hyundai HB20", `R$ 250.000\nRedução: 10%`, true)
        .addField("3: Toyota Corolla", `R$ 750.000\nRedução: 15%`, true)
        .addField("4: Nissan GT-R", `R$ 2.500.000\nRedução: 20%`, true)
        .addField("5: Ferrari Berlinetta", `R$ 7.500.000\nRedução: 25%`, true)
        .addField("6: Bugatti Veyron", `R$ 25.000.000\nRedução: 30%`, true)

        .setFooter(`${bot.data.get(message.author.id, "username")} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
        .setTimestamp();

    message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `cars`"))
}
exports.config = {
	alias: ['carro', 'carros', 'concessionaria']
};