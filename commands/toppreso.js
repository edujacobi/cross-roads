const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topGlobalPreso = []
	let topGlobalFuga = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined && user.roubosL > 0) {
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

			let userComando
			if (!topGlobalPreso.some(user => user.id === message.author.id))
				userComando = top.find(user => user.id === message.author.id)

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

			if (userComando) {
				let user = bot.data.get(userComando.id)
				const i = top.indexOf(userComando)
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				topGlobalStringPreso += `\`${i + 1}.\` ${emote} __**${user.username}**__ ${user.roubosL.toLocaleString().replace(/,/g, ".")}\n`;
				topGlobalStringFuga += `\`${i + 1}.\` ${emote} __**${user.username}**__ ${user.qtFugas.toLocaleString().replace(/,/g, ".")}\n`;

			}

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

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `toppreso`"))

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
				}).catch(err => console.log("Não consegui editar mensagem `toppreso`"))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `toppreso`"))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `toppreso`"))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `toppreso`"))
			}).catch(err => console.log("Não consegui remover as reações mensagem `toppreso`"))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `toppreso`"))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `toppreso`"))
};
// --
exports.config = {
	alias: ['toppr', 'tppr']
};