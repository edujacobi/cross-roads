const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return
	// let member = message.mentions.members.first();
	// member ? uData = bot.data.get(member.id) : null
	let option = args[0] ? args[0] : null
	let valor = args[1] ? parseInt(args[1]) : null
	let id = args[2] ? args[2] : null

	if (!option && !id && !valor)
		return bot.createEmbed(message, `${bot.config.ficha} \`;ficha <add|set> <quantidade> <id>\``)

	if (!option)
		return bot.createEmbed(message, `Pelo amor de deus, Jacobi, escolha uma opção`)

	// if (!valor)
	// 	return bot.createEmbed(message, `Porra, Jacobi, defina um valor`)

	if (valor < 0 || (valor % 1 != 0))
		return bot.createEmbed(message, `PQP, Jacobi, a quantidade é inválida`)

	if (!id)
		return bot.createEmbed(message, `Caralho, Jacobi, escolha um ID de usuário`)

	if (id < 0 || (id % 1 != 0) || id.toString().length != 18)
		return bot.createEmbed(message, `Caralho, Jacobi, o ID é inválido`)

	let uData = bot.data.get(id)

	if (!uData || uData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário`)

	if (option == "add") {
		let fichas = uData.ficha + valor
		bot.data.set(id, fichas, "ficha")

		const moneyAddado = new Discord.MessageEmbed()
			.setColor(bot.colors.darkGrey)
			.setDescription(`**${bot.data.get(message.author.id, "username")}** adicionou ${valor.toLocaleString().replace(/,/g, ".")} fichas no seu inventário`)

		bot.users.fetch(id).then(user => user.send({
			embeds: [moneyAddado]
		}).catch(err => console.log(`Não consegui mandar mensagem privada para ${uData.username} (${id})`)))

		bot.createEmbed(message, `${bot.config.ficha} Surgiram magicamente ${valor.toLocaleString().replace(/,/g, ".")} fichas no inventário de **${uData.username}**`)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${bot.data.get(message.author.id, "username")} adicionou ${valor.toLocaleString().replace(/,/g, ".")} fichas no inventário de ${uData.username}**`)
			.setColor(bot.colors.admin))
	}

	if (option == "set") {
		let oldFichas = uData.ficha
		let fichas = valor
		bot.data.set(id, fichas, "ficha")

		const moneySetado = new Discord.MessageEmbed()
			.setColor(bot.colors.darkGrey)
			.setDescription(`**${bot.data.get(message.author.id, "username")}** removeu ${oldFichas.toLocaleString().replace(/,/g, ".")} fichas do seu inventário, mas setou outras ${fichas.toLocaleString().replace(/,/g, ".")}`)

		bot.users.fetch(id).then(user => user.send({
			embeds: [moneySetado]
		}).catch(err => console.log(`Não consegui mandar mensagem privada para ${uData.username} (${id})`)))

		bot.createEmbed(message, `${bot.config.ficha} Sumiram ${oldFichas.toLocaleString().replace(/,/g, ".")} do inventário de **${uData.username}**, mas outras ${fichas.toLocaleString().replace(/,/g, ".")} apareceram`)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${bot.data.get(message.author.id, "username")} removeu ${oldFichas.toLocaleString().replace(/,/g, ".")} fichas do inventário de ${uData.username}, mas adicionou ${fichas.toLocaleString().replace(/,/g, ".")}**`)
			.setColor(bot.colors.admin))
	}

};