const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	const currTime = new Date().getTime()

	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	//let member = message.mentions.members.first();
	//member ? uData = bot.data.get(member.id) : null
	let horas = parseInt(args.shift())
	const horasMS = horas * 1000 * 60 * 60
	let id = args.shift()
	let achou = false
	let voce = await bot.data.get(message.author.id + ".username")

	if (!id && !horas)
		return bot.createEmbed(message, `${bot.config.prisao} \`;prender <horas> <id>\``)

	if (horas % 1 != 0)
		return bot.createEmbed(message, `PQP, ${voce}, as horas são inválidas`)

	if (id <= 0 || (id % 1 != 0) || id.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${voce}, o ID é inválido`)

	let uData = await bot.data.get(id)

	if (!uData || uData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário`)
	
	bot.createEmbed(message, `${bot.config.prisao} ${uData.username} foi preso por ${horas} horas`)

	const presoEmbed = new Discord.MessageEmbed()
		.setColor(bot.colors.policia)
		.setDescription(`**${voce}** te prendeu por ${horas} horas ${bot.config.prisao}`)

	bot.users.fetch(id).then(user =>
		user.send({embeds: [presoEmbed]})
			.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`)))
	
	uData.preso = uData.preso > currTime ? uData.preso + horasMS : currTime + horasMS
	
	await bot.data.set(id, uData)
	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**${uData.username} foi preso por ${horas} horas por ${voce}**`)
		.setColor(bot.colors.admin))

}