const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobalW = []
	let topGlobalL = []
	let topValor = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined) {
			if (id != bot.config.adminID) {
				top.push({
					nick: user.username,
					id: id,
					vezes: user.roubosL,
					fugiu: user.qtFugas,
					roubosW: user.roubosW,
					roubosL: user.qtRoubado,
					valor: user.valorRoubado,
					classe: user.classe
				})
			}
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.maoBoba_s4} Ranking Roubos`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobalW = top.sort((a, b) => b.roubosW - a.roubosW).slice(start, start + 10)
			topGlobalL = top.sort((a, b) => b.roubosL - a.roubosL).slice(start, start + 10)
			topValor = top.sort((a, b) => b.valor - a.valor).slice(start, start + 10)

			let topGlobalWString = ""
			let topGlobalLString = ""
			let topValorString = ""
			let topGlobalWStringID = ""
			let topGlobalLStringID = ""
			let topValorStringID = ""

			topGlobalW.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalWString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.roubosW.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalWStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})
			topGlobalL.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalLString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.roubosL.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalLStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})
			topValor.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topValorString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} R$ ${user.valor.toLocaleString().replace(/,/g, ".")}\n`
				topValorStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			resultado
				.addField(`Top Ladrões`, isID ? topGlobalWStringID : topGlobalWString, true)
				.addField(`Top Roubados`, isID ? topGlobalLStringID : topGlobalLString, true)
				.addField(`Quantidade Roubada`, isID ? topValorStringID : topValorString, true)

		}

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `toproubo`", err))

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
				}).catch(err => console.log("Não consegui editar mensagem `toproubo`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `toproubo`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `toproubo`", err))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `toproubo`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `toproubo`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `toproubo`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `toproubo`", err))
};
// --
exports.config = {
	alias: ['topr', 'tpr']
};