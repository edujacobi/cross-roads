const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	function getIcone(index) {
		switch (index) {
			case 0:
				return bot.config.gang
			case 1:
				return bot.config.gang1
			case 2:
				return bot.config.gang2
			case 3:
				return bot.config.gang3
		}
	}

	let top = []
	let topgrana = []
	let toplevel = []

	bot.gangs.forEach((gang, id) => {
		if (gang != '') {
			if (gang.nome != '') { //&& id != '1'
				top.push({
					nome: gang.nome,
					caixa: gang.caixa,
					base: gang.base,
					level: gang.baseLevel,
					boneco: gang.boneco
				})
			}
		}
	})

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.topGangue_s4} Ranking Gangues`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} gangues de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topgrana = top.sort((a, b) => b.caixa - a.caixa).slice(start, start + 10)
			toplevel = top.sort((a, b) => b.level - a.level).slice(start, start + 10)

			let topgranaString = ""
			let toplevelString = ""

			let userGangId = bot.data.get(message.author.id, 'gangID')

			topgrana.forEach((gang, i) => {
				let mod = gang.id == userGangId && userGangId != null ? "__" : ""
				topgranaString += `\`${i + start +1}.\` ${getIcone(gang.boneco)} ${mod}**${gang.nome}**${mod} R$ ${gang.caixa.toLocaleString().replace(/,/g, ".")}\n`
			})

			toplevel.forEach((gang, i) => {
				let mod = gang.id == userGangId && userGangId != null ? "__" : ""
				let base = bot.bases[gang.base] ? bot.bases[gang.base].desc.split(" ")[0] : ''
				toplevelString += `\`${i + start +1}.\` ${getIcone(gang.boneco)} ${mod}**${gang.nome}**${mod} \`${gang.base != null ? `${base} ${gang.level}` : 'Sem base'}\`\n`
			})

			resultado
				.addField("Top Grana", topgranaString, true)
				.addField("Top Base", toplevelString, true)

		} else
			resultado.addField("\u200b", 'Ninguém tem gangue nessa porra?')

		return resultado
	}

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 5) return

		msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topgang`", err))

		const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
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

				msg.edit({
					embeds: [generateEmbed(currentIndex)]
				}).catch(err => console.log("Não consegui editar mensagem `topgang`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topgang`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topgang`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topgang`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topgang`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topgang`", err))
};
exports.config = {
	alias: ['topgg', 'topgangue', 'tpgg', 'topmafia']
};