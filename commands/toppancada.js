const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobalW = []
	let topGlobalL = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined) {
			if (id != bot.config.adminID) {
				top.push({
					nick: user.username,
					id: id,
					espancamentos: user.espancarW,
					pancadas: user.espancarL,
					classe: user.classe
				})
			}
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.esmagaCranio_s4} Ranking Espancamentos`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobalW = top.sort((a, b) => b.espancamentos - a.espancamentos).slice(start, start + 10)
			topGlobalL = top.sort((a, b) => b.pancadas - a.pancadas).slice(start, start + 10)

			let topGlobalWString = ""
			let topGlobalLString = ""
			let topGlobalWStringID = ""
			let topGlobalLStringID = ""

			topGlobalW.forEach((user, i) => {
				let mod = user.id == message.author.id ? "__" : ""
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				topGlobalWString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.espancamentos.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalWStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			topGlobalL.forEach((user, i) => {
				let mod = user.id == message.author.id ? "__" : ""
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				topGlobalLString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.pancadas.toLocaleString().replace(/,/g, ".")}\n`
				topGlobalLStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			resultado
				.addField("Espancadores", isID ? topGlobalWStringID : topGlobalWString, true)
				.addField("Espancados", isID ? topGlobalLStringID : topGlobalLString, true)

		} else
			resultado.addField("\u200b", 'Ninguém tem galo nessa porra?')

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `toppancada`", err))

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
				}).catch(err => console.log("Não consegui editar mensagem `toppancada`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `toppancada`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `toppancada`", err))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `toppancada`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `toppancada`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `toppancada`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `toppancada`", err))
};
exports.config = {
	alias: ['topp', 'tpp']
};