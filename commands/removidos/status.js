const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

	let mention = message.mentions.members.first();
	let user = (mention ? mention.user : message.author);
	let userD = bot.data.get(user.id)
	let time = new Date().getTime();

	if (!userD) {
		if (mention) {
			return createEmbed(message, "Este usuário não tem um inventário.");
		}
	}

	if (userD.recorde < userD.moni) {
		userD.recorde = userD.moni;
	} else {
		userD.recorde = userD.recorde
	}

	const embed = new Discord.RichEmbed()
		.setAuthor("Status de " + user.username, user.avatarURL)
	if (userD.preso > time) {
		embed.setDescription(bot.config.police + " Preso");
	} else if (userD.job >= 0) {
		embed.setDescription(bot.config.bulldozer + " Trabalhando");
	} else {
		embed.setDescription(bot.config.car + " Vadiando");
	}

	embed.setColor(message.member.displayColor)
		.setThumbnail((mention ? mention.user : message.author).avatarURL)

		.addField("Vitórias no cassino", userD.betW.toLocaleString().replace(/,/g, "."), true)
		.addField("Derrotas no cassino", userD.betL.toLocaleString().replace(/,/g, "."), true)
		.addField("Sucessos em roubos", userD.roubosW.toLocaleString().replace(/,/g, "."), true)
		.addField("Falhas em roubos", userD.roubosL.toLocaleString().replace(/,/g, "."), true)
		.addField("Ganhos em trabalhos", userD.jobGanhos.toLocaleString().replace(/,/g, ".") + bot.config.coin, true)
		.addField("Gastos em loja", userD.lojaGastos.toLocaleString().replace(/,/g, ".") + bot.config.coin, true)
		.addField("Lucros", userD.investGanhos.toLocaleString().replace(/,/g, ".") + bot.config.coin, true)
		.addField("Galo", "Nível: " + (userD.galoPower - 30), true)
		.setFooter(message.member.displayName, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send(embed);
}