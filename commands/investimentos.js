const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	const embed = new Discord.RichEmbed()

		.setTitle(bot.config.propertyG + " Investimentos")
		.setDescription("Você receberá lucros a cada hora. Cada investimento dura 7 dias.")
		.setThumbnail("https://cdn.discordapp.com/attachments/333060149105131521/527535932581085184/golfclubicon.png")
		.setColor(message.member.displayColor)

		.addField(`1: ${bot.investments.desc[0]}`, 	`${bot.investments.price[0].toLocaleString().replace(/,/g, ".")}${bot.config.coin}\nLucro/h: ${bot.investments.income[0].toLocaleString().replace(/,/g, ".")}${bot.config.coin}`, true)
		.addField(`2: ${bot.investments.desc[1]}`, 	`${bot.investments.price[1].toLocaleString().replace(/,/g, ".")}${bot.config.coin}\nLucro/h: ${bot.investments.income[1].toLocaleString().replace(/,/g, ".")}${bot.config.coin}`, true)
		.addField(`3: ${bot.investments.desc[2]}`, 	`${bot.investments.price[2].toLocaleString().replace(/,/g, ".")}${bot.config.coin}\nLucro/h: ${bot.investments.income[2].toLocaleString().replace(/,/g, ".")}${bot.config.coin}`, true)
		.addField(`4: ${bot.investments.desc[3]}`, 	`${bot.investments.price[3].toLocaleString().replace(/,/g, ".")}${bot.config.coin}\nLucro/h: ${bot.investments.income[3].toLocaleString().replace(/,/g, ".")}${bot.config.coin}`, true)
		.addField(`5: ${bot.investments.desc[4]}`, 	`${bot.investments.price[4].toLocaleString().replace(/,/g, ".")}${bot.config.coin}\nLucro/h: ${bot.investments.income[4].toLocaleString().replace(/,/g, ".")}${bot.config.coin}`, true)
		.addField(`6: ${bot.investments.desc[5]}`, 	`${bot.investments.price[5].toLocaleString().replace(/,/g, ".")}${bot.config.coin}\nLucro/h: ${bot.investments.income[5].toLocaleString().replace(/,/g, ".")}${bot.config.coin}`, true)

		.setFooter(message.author.username + " • Dinheiro: " + uData.moni.toLocaleString().replace(/,/g, "."), message.member.user.avatarURL)
		.setTimestamp();

	message.channel.send({
		embed
	})
}