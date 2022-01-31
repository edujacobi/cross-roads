const Discord = require("discord.js")

const minToHuman = (time) => {
	if (time % 60 === 0)
		return `${time / 60}h`

	let minutes = Math.floor(time % 60)
	time = Math.floor(time / 60)

	return `${time}h${minutes}min`
}

exports.run = async (bot, message, args) => {
	let necessario = ""
	let emote = ""
	let uData = bot.data.get(message.author.id)

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.bulldozer} Trabalhos`)
		.setDescription(`Você não pode apostar, roubar nem vasculhar enquanto trabalha!`)
		.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/738106899844562984/radar_bulldozer.png")
		.setColor('GREEN')
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp()

	Object.entries(bot.jobs).forEach(([key_job, value_job]) => {
		if (!['mafia', 'et', 'conquistador'].includes(key_job)) {
			if (value_job.arma != null) {
				Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
					if (key_gun === value_job.arma)
						emote = value_gun.skins[uData.arma[value_gun.data].skinAtual].emote
				})
				necessario = `Necessário: ${emote}`
			}
			let pagamento = value_job.pagamento
			let tempo = value_job.time

			if (uData.classe === 'mafioso') {
				pagamento = Math.round(value_job.pagamento * 0.9)
				tempo = value_job.time
			}

			if (uData.classe === 'empresario') {
				pagamento = Math.round(value_job.pagamento * 1.05)
				// tempo = (value_job.time * 0.95)
			}
			if (key_job !== 'duble' && key_job !== 'jacobi')
				embed.addField(`${value_job.id}: ${value_job.desc}`, `Duração: ${minToHuman(tempo)}\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\n${necessario}`, true)

			if (key_job === 'duble')
				embed.addField(`${value_job.id}: ${value_job.desc}`, `Duração: ${minToHuman(tempo)}\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote}${bot.guns.katana.skins[uData.arma.katana.skinAtual].emote}${bot.guns.goggles.skins[uData.arma.goggles.skinAtual].emote}`, true)

			if (key_job === 'jacobi')
				embed.addField(`${value_job.id}: ${value_job.desc}`, `Duração: ${minToHuman(tempo)}\nSalário: R$ ${pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.guns.faca.skins[uData.arma.faca.skinAtual].emote}${bot.guns.colt45.skins[uData.arma.colt45.skinAtual].emote}${bot.guns.tec9.skins[uData.arma.tec9.skinAtual].emote}${bot.guns.rifle.skins[uData.arma.rifle.skinAtual].emote}${bot.guns.shotgun.skins[uData.arma.shotgun.skinAtual].emote}${bot.guns.mp5.skins[uData.arma.mp5.skinAtual].emote}${bot.guns.ak47.skins[uData.arma.ak47.skinAtual].emote}${bot.guns.m4.skins[uData.arma.m4.skinAtual].emote}${bot.guns.sniper.skins[uData.arma.sniper.skinAtual].emote}${bot.guns.katana.skins[uData.arma.katana.skinAtual].emote}${bot.guns.rpg.skins[uData.arma.rpg.skinAtual].emote}${bot.guns.colete.skins[uData.arma.colete.skinAtual].emote}${bot.guns.goggles.skins[uData.arma.goggles.skinAtual].emote}`, true)

		}
	})

	return message.channel.send({embeds: [embed]})
		.catch(err => console.log("Não consegui enviar mensagem `jobs`"))
}
exports.config = {
	alias: ['trabalhos', 'trabs', 'ts', 'js']
}