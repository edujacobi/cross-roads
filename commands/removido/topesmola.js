const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobalDado = []
	let topGlobalRec = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined && (user.qtEsmolasDadas > 0 || user.qtEsmolasRecebidas > 0)) {
			if (id != bot.config.adminID) {
				top.push({
					nick: user.username,
					id: id,
					vezesDado: user.qtEsmolasDadas,
					vezesRec: user.qtEsmolasRecebidas,
					classe: user.classe
				})
			}
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.filantropo_s4} Ranking Esmolas`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobalDado = top.sort((a, b) => b.vezesDado - a.vezesDado).slice(start, start + 10)
			topGlobalRec = top.sort((a, b) => b.vezesRec - a.vezesRec).slice(start, start + 10)

			let userComando
			if (!topGlobalDado.some(user => user.id === message.author.id))
				userComando = top.find(user => user.id === message.author.id)

			let topGlobalStringDado = ""
			let topGlobalStringDadoID = ""
			let topGlobalStringRec = ""
			let topGlobalStringRecID = ""

			topGlobalDado.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalStringDado += `\`${i+1}.\` ${emote} ${mod}**${user.nick}**${mod} R$ ${user.vezesDado.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalStringDadoID += `\`${i+1}.\` ${emote}  ${mod}**${user.nick}**${mod} ${user.id}\n`
			})
			topGlobalRec.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalStringRec += `\`${i+1}.\` ${emote} ${mod}**${user.nick}**${mod} R$ ${user.vezesRec.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalStringRecID += `\`${i+1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			if (userComando) {
				let user = bot.data.get(userComando.id)
				const i = top.indexOf(userComando)
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				topGlobalStringDado += `\`${i + 1}.\` ${emote} __**${user.username}**__ R$ ${(user.qtEsmolasDadas).toLocaleString().replace(/,/g, ".")}\n`;
				topGlobalStringRec += `\`${i + 1}.\` ${emote} __**${user.username}**__ R$ ${(user.qtEsmolasRecebidas).toLocaleString().replace(/,/g, ".")}\n`;

			}

			resultado
				.addField(`Top Filantropos`, isID ? topGlobalStringDadoID : topGlobalStringDado, true)
				.addField(`Top Mendigos`, isID ? topGlobalStringRec : topGlobalStringRec, true)
		}

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `topesmola`"))

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
				}).catch(err => console.log("Não consegui editar mensagem `topesmola`"))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topesmola`"))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topesmola`"))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topesmola`"))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topesmola`"))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topesmola`"))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topesmola`"))
};
// --
exports.config = {
	alias: ['topesm', 'tpes']
};