const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return
	// let member = message.mentions.members.first();
	// member ? uData = bot.data.get(member.id) : null
	let option = args[0] ? args[0] : null
	let valor = args[1] ? parseInt(args[1]) : null
	let id = args[2] ? args[2] : null

	if (!option && !id && !valor)
		return bot.createEmbed(message, `${bot.config.coin} \`;money <add|set> <quantidade> <id>\``)

	if (!option)
		return bot.createEmbed(message, `Pelo amor de deus, ${await bot.data.get(message.author.id + ".username")}, escolha uma opção`)

	// if (!valor)
	// 	return bot.createEmbed(message, `Porra, Jacobi, defina um valor`)

	if (valor < 0 || (valor % 1 != 0))
		return bot.createEmbed(message, `PQP, ${await bot.data.get(message.author.id + ".username")}, a quantidade é inválida`)

	if (!id)
		return bot.createEmbed(message, `Caralho, ${await bot.data.get(message.author.id + ".username")}, escolha um ID de usuário`)

	if (id < 0 || (id % 1 != 0) || id.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${await bot.data.get(message.author.id + ".username")}, o ID é inválido`)

	let uData = await bot.data.get(id)

	if (!uData || uData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário`)

	if (option === "add") {
		let money = uData.moni + valor
		await bot.data.set(id + ".moni", money)

		const moneyAddado = new Discord.MessageEmbed()
			.setColor(bot.colors.darkGrey)
			// .setDescription(`**${bot.data.get(message.author.id + ".username")}** adicionou ${bot.config.ovo} ${valor.toLocaleString().replace(/,/g, ".")} Ovos de páscoa no seu inventário`)

			.setDescription(`**${await bot.data.get(message.author.id + ".username")}** adicionou R$ ${valor.toLocaleString().replace(/,/g, ".")} no seu inventário`)

		bot.users.fetch(id).then(user => user.send({
			embeds: [moneyAddado]
		}).catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`)))
		// return bot.createEmbed(message, `${bot.config.coin} Surgiram magicamente ${bot.config.ovo} ${valor.toLocaleString().replace(/,/g, ".")} Ovos de páscoa no inventário de **${uData.username}**`)

		bot.createEmbed(message, `${bot.config.coin} Surgiram magicamente R$ ${valor.toLocaleString().replace(/,/g, ".")} no inventário de **${uData.username}**`)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${await bot.data.get(message.author.id + ".username")} adicionou R$ ${valor.toLocaleString().replace(/,/g, ".")} no inventário de ${uData.username}**`)
			.setColor(bot.colors.admin))
	}
	if (option == "set") {
		let oldMoney = uData.moni
		let money = valor
		await bot.data.set(id + ".moni", money)

		const moneySetado = new Discord.MessageEmbed()
			.setColor(bot.colors.darkGrey)
			.setDescription(`**${await bot.data.get(message.author.id + ".username")}** removeu ${oldMoney.toLocaleString().replace(/,/g, ".")} do seu inventário, mas setou outros R$ ${valor.toLocaleString().replace(/,/g, ".")}`)

		bot.users.fetch(id).then(user =>
			user.send({embeds: [moneySetado]})
				.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`)))

		bot.createEmbed(message, `${bot.config.coin} Sumiram R$ ${oldMoney.toLocaleString().replace(/,/g, ".")} do inventário de **${uData.username}**, mas outros R$ ${valor.toLocaleString().replace(/,/g, ".")} apareceram`)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${await bot.data.get(message.author.id + ".username")} removeu R$ ${oldMoney.toLocaleString().replace(/,/g, ".")} do inventário de ${uData.username}, mas adicionou R$ ${valor.toLocaleString().replace(/,/g, ".")}**`)
			.setColor(bot.colors.admin))
	}

}