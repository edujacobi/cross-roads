const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobal = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined && user.ficha != 0) {
			if (id != bot.config.adminID)
				top.push({
					nick: user.username,
					id: id,
					fichas: user.ficha,
					classe: user.classe
				})
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.config.ficha} Ranking Fichas`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobal = top.sort((a, b) => b.fichas - a.fichas).slice(start, start + 10)

			let userComando
			if (!topGlobal.some(user => user.id === message.author.id))
				userComando = top.find(user => user.id === message.author.id)

			let topGlobalString = ""
			let topGlobalStringID = ""

			topGlobal.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				let viagem = bot.isPlayerViajando(bot.data.get(user.id)) ? `${bot.config.aviao} ` : ''
				topGlobalString += `\`${i + start + 1}.\` ${viagem}${emote} ${mod}**${user.nick}**${mod} ${user.fichas.toLocaleString().replace(/,/g, ".")}\n`;
				topGlobalStringID += `\`${i + start + 1}.\` ${viagem}${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`;
			});

			if (userComando) {
				let user = bot.data.get(userComando.id)
				const i = top.indexOf(userComando)
				let viagem = bot.isPlayerViajando(user) ? `${bot.config.aviao} ` : ''
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				topGlobalString += `\`${i + 1}.\` ${viagem}${emote} __**${user.username}**__ ${user.ficha.toLocaleString().replace(/,/g, ".")}\n`;
			}

			resultado.setDescription(`${isID ? topGlobalStringID : topGlobalString}`)

		} else
			resultado.addField("\u200b", 'Ninguém tem ficha nessa porra?')

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `topficha`"))

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
				}).catch(err => console.log("Não consegui editar mensagem `topficha`"))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topficha`"))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topficha`"))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topficha`"))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topficha`"))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topficha`"))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topficha`"))
};
//--
exports.config = {
	alias: ['topf', 'tpf']
};