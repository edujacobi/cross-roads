const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	// if (message.author.id != bot.config.adminID)
	// 	return message.reply("Comando em manutenção")

	// if (args && args[0] > 30)
	// 	return bot.createEmbed(message, "O limite máximo é 30")

	// if (args[0] < 1 || (args[0] % 1 != 0))
	// 	args = 10

	let top = []
	let topGlobal = []
	let isID = false

	for (let [id, user] of bot.data) {
		if (user.username != undefined && user.moni != 0) {
			if (id != bot.config.adminID)
				top.push({
					nick: user.username,
					id: id,
					money: user.moni,
					classe: user.classe
				})
		}
	}

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.config.coin} Ranking Grana`)
			.setColor('GREEN')
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${top.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
			.setTimestamp()

		if (top.length > 0) {
			topGlobal = top.sort((a, b) => b.money - a.money).slice(start, start + 10)

			let topGlobalString = ""
			let topGlobalStringID = ""

			topGlobal.forEach((user, i) => {
				let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				let mod = user.id == message.author.id ? "__" : ""
				topGlobalString += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} R$ ${user.money.toLocaleString().replace(/,/g, ".")}\n`;
				topGlobalStringID += `\`${i + start + 1}.\` ${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`;
			});

			resultado.setDescription(isID ? topGlobalStringID : topGlobalString)

		} else
			resultado.addField("\u200b", 'Ninguém tem dinheiro nessa porra?')

		return resultado
	}



	// const embedWithoutID = new Discord.MessageEmbed()
	// 	.setTitle(`${bot.badges.topGrana1_s4} Ranking Grana`)
	// 	.setColor('GREEN')
	// 	.setDescription(topGlobalString)
	// 	.setFooter(`${bot.user.username} • Veja também o ;topficha`, bot.user.avatarURL())
	// 	.setTimestamp();

	// const embedWithID = new Discord.MessageEmbed()
	// 	.setTitle(`${bot.badges.topGrana1_s4} Ranking Grana`)
	// 	.setColor('GREEN')
	// 	.setDescription(topGlobalStringID)
	// 	.setFooter(`${bot.user.username} • Veja também o ;topficha`, bot.user.avatarURL())
	// 	.setTimestamp();

	message.channel.send({
		embeds: [generateEmbed(0)]
	}).then(msg => {

		if (top.length <= 10) return

		msg.react('➡️').then(msg.react('🆔')).catch(err => console.log("Não consegui reagir mensagem `topgrana`", err))

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
				}).catch(err => console.log("Não consegui editar mensagem `topgrana`", err))

				if (currentIndex !== 0)
					await msg.react('⬅️').catch(err => console.log("Não consegui reagir mensagem `topgrana`", err))
				if (currentIndex + 10 < top.length)
					msg.react('➡️').catch(err => console.log("Não consegui reagir mensagem `topgrana`", err))
				msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topgrana`", err))
			}).catch(err => console.log("Não consegui remover as reações mensagem `topgrana`", err))
		})
		collector.on('end', reaction => {
			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `topgrana`", err))
		})
	}).catch(err => console.log("Não consegui enviar mensagem `topgrana`", err))

	// return message.channel.send(embedWithoutID).then(msg => {
	// 	msg.react('🆔').then(r => {
	// 		const withoutIDFilter = (reaction, user) => reaction.emoji.id === '539572031436619777' && user.id == message.author.id;
	// 		const withIDFilter = (reaction, user) => reaction.emoji.name === '🆔' && user.id == message.author.id;
	// 		const fichaFilter = (reaction, user) => reaction.emoji.id === '757021259451203665' && user.id == message.author.id;

	// 		const withoutID = msg.createReactionCollector(withoutIDFilter, {
	// 			time: 60000
	// 		});
	// 		const withID = msg.createReactionCollector(withIDFilter, {
	// 			time: 60000
	// 		});
	// 		const ficha = msg.createReactionCollector(fichaFilter, {
	// 			time: 60000,
	// 			max: 1
	// 		});

	// 		withoutID.on('collect', r => {
	// 			r.users.remove(message.author.id)
	// 			r.users.remove(bot.user.id)
	// 			msg.edit(embedWithoutID)
	// 			msg.react('🆔');

	// 		});
	// 		withID.on('collect', r => {
	// 			r.users.remove(message.author.id)
	// 			r.users.remove(bot.user.id)
	// 			msg.edit(embedWithID)
	// 			msg.react('539572031436619777');
	// 		});
	// 		ficha.on('collect', r => {
	// 			r.users.remove(message.author.id)
	// 			r.users.remove(bot.user.id)
	// 			const cmd = bot.commands.get('topficha')
	// 			cmd.run(bot, message, args)
	// 		})
	// 	}).then(() => msg.react('757021259451203665')) // ficha
	// });
};
//--
exports.config = {
	alias: ['topg', 'tpg']
};