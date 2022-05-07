const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	let nick = args.join(" ").toLowerCase()
	let userEncontrados = []
	let gangEncontrados = []

	if (nick.length < 3)
		return bot.createEmbed(message, `:mag_right: Escolha um nick maior`, `Mínimo de caracteres: 3`)
	if (nick.length > 32)
		return bot.createEmbed(message, `:mag_right: Escolha um nick menor`, `Máximo de caracteres: 32`)

	await bot.data.filter((user, id) => {
		if (user.username?.toLowerCase().indexOf(nick.toLowerCase()) > -1 || user.username?.toLowerCase() === nick.toLowerCase())
			userEncontrados.push({
				username: user.username,
				id: id
			})
	})
	await bot.gangs.filter(gang => {
		if ((gang.nome?.toLowerCase().indexOf(nick.toLowerCase()) > -1 || gang.nome?.toLowerCase() === nick.toLowerCase()))
			gangEncontrados.push({
				nome: gang.nome,
				tag: gang.tag
			})
	})

	// const resultado = new Discord.MessageEmbed()
	// 	.setTitle(`:mag_right: Resultado da pesquisa`)
	// 	.setColor(message.member.displayColor)
	// 	.setFooter(bot.data.get(message.author.id + ".username"), message.member.user.avatarURL())
	// 	.setTimestamp();

	// const resultado_page_2 = resultado

	// let count_fields

	// if (userEncontrados.length > 0) {
	// 	resultado.addField("\u200b", '**Usuários**')
	// 	for (user of userEncontrados) {
	// 		if (count_fields < 20) {
	// 			count_fields++

	// 			resultado.addField(user.username, `\`${user.id}\``, true)
	// 		} else
	// 			resultado_page_2.addField(user.username, `\`${user.id}\``, true)
	// 	}
	// } else
	// 	resultado.addField("Usuários", "Nenhum usuário encontrado com este parâmetro")


	// message.channel.send(resultado)


	/**
	 * Creates an embed with guilds starting from an index.
	 * @param {number} start The index to start from.
	 */
	const generateEmbed = async start => {
		const current = userEncontrados.slice(start, start + 15)

		// you can of course customise this embed however you want

		const resultado = new Discord.MessageEmbed()
			.setTitle(`:mag_right: Resultado da pesquisa`)
			.setColor(bot.colors.darkGrey)
			.setFooter(await bot.data.get(message.author.id + ".username"), message.member.user.avatarURL())
			.setTimestamp()
			.setDescription(`Mostrando ${start + 1}-${start + current.length} usuários de ${userEncontrados.length}`)

		if (userEncontrados.length > 0) {
			resultado.addField("\u200b", '**Usuários**')
			current.forEach(g => resultado.addField(g.username, `\`${g.id}\``, true))

		}
		else
			resultado.addField("Usuários", "Nenhum usuário encontrado com este parâmetro")

		if (gangEncontrados.length > 0) {
			resultado.addField("\u200b", '**Gangues**')
			gangEncontrados.forEach(gang => resultado.addField(gang.nome, `\`${gang.tag != '' ? gang.tag : `Sem tag`}\``, true))
		}
		// else
		// 	resultado.addField("Gangues", "Nenhuma gangue encontrado com este parâmetro")
		return resultado
	}

	message.channel.send({
		embeds: [await generateEmbed(0)]
	}).then(msg => {

		if (userEncontrados.length <= 15) return

		msg.react('➡️').catch(() => console.log("Não consegui reagir mensagem `procurar`"))

		const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id

		const collector = msg.createReactionCollector({
			filter,
			time: 90000
		})

		let currentIndex = 0

		collector.on('collect', reaction => {
			if (msg) msg.reactions.removeAll().then(async () => {

				reaction.emoji.name === '⬅️' ? currentIndex -= 15 : currentIndex += 15

				msg.edit({
					embeds: [await generateEmbed(currentIndex)]
				}).catch(() => console.log("Não consegui editar mensagem `procurar`"))
				if (currentIndex !== 0)
					await msg.react('⬅️').catch(() => console.log("Não consegui reagir mensagem `procurar`"))
				if (currentIndex + 15 < userEncontrados.length)
					msg.react('➡️').catch(() => console.log("Não consegui reagir mensagem `procurar`"))
			}).catch(() => console.log("Não consegui remover as reações mensagem `procurar`"))
		})
	}).catch(() => console.log("Não consegui enviar mensagem `procurar`"))
}

exports.config = {
	alias: ['search', 'buscar', 'pesquisar']
}