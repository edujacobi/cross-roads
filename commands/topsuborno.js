const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobal = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined) {
			if (id != bot.config.adminID) {
				top.push({
					nick: user.username,
					id: id,
					suborno: user.prisaoGastos,
					classe: user.classe
				})
			}
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.deputado_s4} Ranking Subornos`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobal = top.sort((a, b) => b.suborno - a.suborno).slice(start, start + 10)
			let topGlobalString = ""
			let topGlobalStringID = ""

			topGlobal.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} R$ ${user.suborno.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalStringID += `\`${i + start + 1}.\` ${emote}  ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			resultado.setDescription(isID ? topGlobalStringID : topGlobalString, true)
		}

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `topsuborno`", err))

		const filter = (reaction, user) => ['⬅️', '➡️', '🆔'].includes(reaction.emoji.name) && user.id === message.author.id
		const collector = msg.createReactionCollector({
			filter,
			idle: 60000
		})

		let currentIndex = 0

		collector.on('collect', reaction => {
			if (msg) msg.reactions.removeAll().then(async () => {

				if (reaction.emoji.name === '⬅️')
					currentIndex -= 10
				else if (reaction.emoji.name === '➡️')
					currentIndex += 10
				else if (reaction.emoji.name === '🆔')
					isID = !isID

				msg.edit({
					embeds: [generateEmbed(currentIndex)]
				}).catch(err => console.log("Não consegui editar mensagem `topsuborno`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topsuborno`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topsuborno`", err))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topsuborno`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topsuborno`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topsuborno`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topsuborno`", err))
};
//--
exports.config = {
	alias: ['topsubornos', 'tpsb', 'topdeputado', 'topdeputados']
};