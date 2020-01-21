const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    const embed = new Discord.RichEmbed()
    
        .setTitle(bot.config.car + " Concessionária [em breve]")
        .setDescription("Reduza o tempo dos jobs!\nCada carro tem duração de 7 dias.\n\n")
        .setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/569148638899601418/radar_spray.png")
        .setColor(message.member.displayColor)
    
        .addField("1: Chevrolet Onix",      `50.000${bot.config.coin}\nRedução: 7%`, true)
        .addField("2: Hyundai HB20",        `250.000${bot.config.coin}\nRedução: 14%`, true)
        .addField("3: Toyota Corolla",      `750.000${bot.config.coin}\nRedução: 21%`, true)
        .addField("4: Nissan GT-R",         `2.500.000${bot.config.coin}\nRedução: 28%`, true)
        .addField("5: Ferrari Berlinetta",  `7.500.000${bot.config.coin}\nRedução: 35%`, true)
        .addField("6: Bugatti Veyron",      `25.000.000${bot.config.coin}\nRedução: 42%`, true)
    
        .setFooter(message.author.username + " • Money: " + uData.moni.toLocaleString().replace(/,/g, "."), message.member.user.avatarURL)
	    .setTimestamp();

    message.channel.send({embed})
}
