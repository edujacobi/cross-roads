const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let top = []
	let topWins = []
	let topWinrate = []
	let topLevel = []

	bot.data.indexes.forEach(user => { //gera lista para top global
		if (bot.users.fetch(user)) {
			let uData = bot.data.get(user)
			if ((uData.galoW + uData.galoL) >= 10) {
				top.push({
					nick: uData.username,
					galo: uData.galoNome,
					wins: uData.galoW,
					level: uData.galoPower - 30,
					winrate: uData.galoW / (uData.galoL + uData.galoW) * 100,
					classe: uData.classe
				})
			}
		}
	})

	const generateEmbed = start => {
		const current = top.slice(start, start + 5)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.topGalo_s4} Ranking Galos`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Para entrar no Ranking, seu galo deve realizar 10 rinhas\nMostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topWins = top.sort((a, b) => b.wins - a.wins).slice(start, start + 5)
			topWinrate = top.sort((a, b) => b.winrate - a.winrate).slice(start, start + 5)
			topLevel = top.sort((a, b) => b.level - a.level).slice(start, start + 5)

			let topWinsString = ""
			let topWinrateString = ""
			let topLevelString = ""

			topWins.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topWinsString += `\`${i + start + 1}.\` ${mod}**${user.galo}**${mod}: \`${user.wins.toLocaleString().replace(/,/g, ".")}\` (${emote} ${user.nick})\n`
			})
			topWinrate.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topWinrateString += `\`${i + start + 1}.\` ${mod}**${user.galo}**${mod}: \`${user.winrate.toFixed(1)}%\` (${emote} ${user.nick})\n`
			})
			topLevel.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topLevelString += `\`${i + start + 1}.\` ${mod}**${user.galo}**${mod}: \`${user.level}\` (${emote} ${user.nick})\n`
			})

			resultado.addField("Vitórias", topWinsString)
				.addField("Win rate", topWinrateString)
				.addField("Level", topLevelString)

		} else
			resultado.addField("\u200b", 'Ninguém tem galo nessa porra?')

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 5) return

		msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topgalo`", err))

		const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
		const collector = msg.createReactionCollector({
			filter,
			idle: 60000
		})

		let currentIndex = 0

		collector.on('collect', reaction => {
			if (msg) msg.reactions.removeAll().then(async () => {

				if (reaction.emoji.name === '⬅️')
					currentIndex -= 5
				else if (reaction.emoji.name === '➡️')
					currentIndex += 5

				msg.edit({
					embeds: [generateEmbed(currentIndex)]
				}).catch(err => console.log("Não consegui editar mensagem `topgalo`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topgalo`", err))
				if (currentIndex + 5 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topgalo`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topgalo`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topgalo`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topgalo`", err))
};
// --
exports.config = {
	alias: ['topgl', 'tpgl']
};