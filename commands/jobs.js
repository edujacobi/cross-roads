const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const embed = new Discord.RichEmbed()

		.setTitle(bot.config.bulldozer + " Trabalhos")
		.setDescription("Você não pode apostar enquanto trabalha!")
		.setColor(message.member.displayColor)

		.addField(`1: ${bot.jobs.desc[0]}`, "Duração: 1h\n" + `Salário: ${bot.jobs.payment[0].toLocaleString().replace(/,/g, ".")}` + bot.config.coin, true)
		.addField(`2: ${bot.jobs.desc[1]}`, "Duração: 2h\n" + `Salário: ${bot.jobs.payment[1].toLocaleString().replace(/,/g, ".")}` + bot.config.coin, true)
		.addField(`3: ${bot.jobs.desc[2]}`, "Duração: 3h\n" + `Salário: ${bot.jobs.payment[2].toLocaleString().replace(/,/g, ".")}` + bot.config.coin, true)
		.addField(`4: ${bot.jobs.desc[3]}`, "Duração: 4h\n" + `Salário: ${bot.jobs.payment[3].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.faca, true)
		.addField(`5: ${bot.jobs.desc[4]}`, "Duração: 6h\n" + `Salário: ${bot.jobs.payment[4].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config._9mm, true)
		.addField(`6: ${bot.jobs.desc[5]}`, "Duração: 8h\n" + `Salário: ${bot.jobs.payment[5].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.tec9, true)
		.addField(`7: ${bot.jobs.desc[6]}`, "Duração: 1h\n" + `Salário: ${bot.jobs.payment[6].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.rifle, true)
		.addField(`8: ${bot.jobs.desc[7]}`, "Duração: 3h\n" + `Salário: ${bot.jobs.payment[7].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.escopeta, true)
		.addField(`9: ${bot.jobs.desc[8]}`, "Duração: 12h\n" + `Salário: ${bot.jobs.payment[8].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.mp5, true)
		.addField(`10: ${bot.jobs.desc[9]}`, "Duração: 18h\n" + `Salário: ${bot.jobs.payment[9].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.ak47, true)
		.addField(`11: ${bot.jobs.desc[10]}`, "Duração: 24h\n" + `Salário: ${bot.jobs.payment[10].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.m4, true)
		.addField(`12: ${bot.jobs.desc[11]}`, "Duração: 40h\n" + `Salário: ${bot.jobs.payment[11].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.goggles, true)
		.addField(`13: ${bot.jobs.desc[12]}`, "Duração: 60h\n" + `Salário: ${bot.jobs.payment[12].toLocaleString().replace(/,/g, ".")}` + bot.config.coin + "\nNecessário: " + bot.config.rpg, true)

		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();

	message.channel.send({
		embed
	})
}