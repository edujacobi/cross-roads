const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobalPreso = []
	let topGlobalFuga = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined) {
			if (id != bot.config.adminID) {
				top.push({
					nick: user.username,
					id: id,
					vezes: user.roubosL,
					fugiu: user.qtFugas,
					classe: user.classe
				})
			}
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.fujao_s4} Ranking Prisão`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobalPreso = top.sort((a, b) => b.vezes - a.vezes).slice(start, start + 10)
			topGlobalFuga = top.sort((a, b) => b.fugiu - a.fugiu).slice(start, start + 10)

			let topGlobalStringPreso = ""
			let topGlobalStringPresoID = ""
			let topGlobalStringFuga = ""
			let topGlobalStringFugaID = ""

			topGlobalPreso.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalStringPreso += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.vezes.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalStringPresoID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})
			topGlobalFuga.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalStringFuga += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.fugiu.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalStringFugaID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			resultado
				.addField(`Top Presos`, isID ? topGlobalStringPresoID : topGlobalStringPreso, true)
				.addField(`Top Fujão`, isID ? topGlobalStringFugaID : topGlobalStringFuga, true)

		} else
			resultado.addField("\u200b", 'Ninguém tem galo nessa porra?')

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `toppreso`", err))

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
				}).catch(err => console.log("Não consegui editar mensagem `toppreso`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `toppreso`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `toppreso`", err))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `toppreso`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `toppreso`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `toppreso`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `toppreso`", err))
};
// --
exports.config = {
	alias: ['toppr', 'tppr']
};