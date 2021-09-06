const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topWinrate = []
	let topGanhos = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined) {
			if (id != bot.config.adminID && user.betJ >= 100) {
				top.push({
					nick: user.username,
					id: id,
					winrate: ((user.betW / user.betJ) * 100).toFixed(2),
					ganhos: user.cassinoGanhos,
					classe: user.classe
				})
			}
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.sortudo_s4} Ranking Sortudos`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Para entrar no ranking, jogue 100 vezes no cassino\nMostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topWinrate = top.sort((a, b) => b.winrate - a.winrate).slice(start, start + 10)
			topGanhos = top.sort((a, b) => b.ganhos - a.ganhos).slice(start, start + 10)

			let topWinrateString = ""
			let topWinrateStringID = ""
			let topGanhosString = ""
			let topGanhosStringID = ""

			topWinrate.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topWinrateString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.winrate.toLocaleString().replace(/,/g, ".")} %\n`
				topWinrateStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})
			topGanhos.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGanhosString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} R$ ${user.ganhos.toLocaleString().replace(/,/g, ".")}\n`
				topGanhosStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
			})

			resultado
				.addField(`Top Winrate`, isID ? topWinrateStringID : topWinrateString, true)
				.addField(`Top Ganhos`, isID ? topGanhosStringID : topGanhosString, true)

		}

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `topsortudo`", err))

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
				}).catch(err => console.log("Não consegui editar mensagem `topsortudo`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topsortudo`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topsortudo`", err))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topsortudo`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topsortudo`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topsortudo`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topsortudo`", err))
};
// --
exports.config = {
	alias: ['tops']
};