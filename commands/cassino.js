const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const embed = new Discord.RichEmbed()

		.setTitle(bot.config.mafiaCasino + " Cassino")
		//.setDescription("Aposte, ganhe, perca, quebre a banca!\nAqui você pode apostar suas fichas ou seu dinheiro!")
		.setThumbnail("https://cdn.discordapp.com/attachments/453314806674358292/529390152309538816/cassino-chip.png")
		.setColor(message.member.displayColor)
		.addField("Fichas", "Compre fichas na loja ou use-as na máquina caça-níquel")
		.addField("Cara ou Coroa", "Aposte um valor em dinheiro. Você tem 50% de chance de vencer !\n" +
			"`" + bot.config.prefix + "bet [cara | coroa] [valor]`")
		.addField("Rinha de galos", "Entre em uma sangrenta batalha de galos!!\n" +
			"`" + bot.config.prefix + "galo info`")
		.addField("Caça-níquel", "Acerte um trio e ganhe 150 fichas!\nACERTE UM TRIO DE <:cash:539497634826551307> E GANHE 500!\n" +
			"`" + bot.config.prefix + "niquel`")
		/*.addField("Roulette", "Bet on a number and hope to fall on yours! You get 36 times the bet!\n" +
			"`" + bot.config.prefix + "roulette [number] [ammount]`")*/
		.addField("Câmbio", "Troque suas fichas por dineiro! Cada ficha vale 90" + bot.config.coin + ".\n" +
			"`" + bot.config.prefix + "cambio [quantidade]`")
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send({
		embed
	});
}