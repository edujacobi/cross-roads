const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let necessario = ""
	let emote = ""
	let classe = bot.data.get(message.author.id, 'classe')

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.bulldozer} Trabalhos`)
		.setDescription(`Você não pode apostar, roubar nem vasculhar enquanto trabalha!`)
		.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/738106899844562984/radar_bulldozer.png")
		.setColor('GREEN')
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();

	Object.entries(bot.jobs).forEach(([key_job, value_job]) => {
		if (key_job != 'mafia' && key_job != 'et') {
			if (value_job.arma != null) {
				Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
					if (key_gun == value_job.arma)
						emote = bot.config[value_gun.emote]
				})
				necessario = `Necessário: ${emote}`
			}
			let pagamento = value_job.pagamento
			let tempo = value_job.time

			if (classe == 'mafioso') {
				pagamento = Math.round(value_job.pagamento * 0.9)
				tempo = value_job.time.toFixed(1)
			}

			if (classe == 'empresario') {
				pagamento = Math.round(value_job.pagamento * 1.05)
				tempo = (value_job.time * 0.95).toFixed(1)
			}
			if (key_job != 'duble' && key_job != 'jacobi')
			embed.addField(`${value_job.id}: ${value_job.desc}`, `Duração: ${tempo/60}h\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\n${necessario}`, true)

			if (key_job == 'duble')
				embed.addField(`${value_job.id}: ${value_job.desc}`, `Duração: ${tempo/60}h\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.config.jetpack}${bot.config.katana}${bot.config.goggles}`, true)

			if (key_job == 'jacobi')
				embed.addField(`${value_job.id}: ${value_job.desc}`, `Duração: ${tempo/60}h\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.config.faca}${bot.config.colt45}${bot.config.tec9}${bot.config.rifle}${bot.config.escopeta}${bot.config.mp5}${bot.config.ak47}${bot.config.m4}${bot.config.sniper}${bot.config.katana}${bot.config.rpg}${bot.config.colete}${bot.config.goggles}`, true)

		}
		// else if (key_job == 'jacobi') {
		// 	let pagamento = bot.jobs.jacobi.pagamento
		// 	let tempo = bot.jobs.jacobi.time

		// 	if (classe == 'mafioso') {
		// 		pagamento = Math.round(bot.jobs.jacobi.pagamento * 0.9)
		// 		tempo = bot.jobs.jacobi.time.toFixed(1)
		// 	}

		// 	if (classe == 'empresario') {
		// 		pagamento = Math.round(bot.jobs.jacobi.pagamento * 1.05)
		// 		tempo = (bot.jobs.jacobi.time * 0.95).toFixed(1)
		// 	}

		// 	embed.addField(`${bot.jobs.jacobi.id}: ${bot.jobs.jacobi.desc}`, `Duração: ${tempo/60}h\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.config.faca}${bot.config.colt45}${bot.config.tec9}${bot.config.rifle}${bot.config.escopeta}${bot.config.mp5}${bot.config.ak47}${bot.config.m4}${bot.config.sniper}${bot.config.katana}${bot.config.rpg}${bot.config.colete}${bot.config.goggles}`, true)
		// }
	});

	return message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `jobs`", err));
}
exports.config = {
	alias: ['trabalhos', 'trabs', 'ts', 'js']
};