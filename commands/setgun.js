const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	const currTime = new Date().getTime()

	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	//let member = message.mentions.members.first();
	//member ? uData = bot.data.get(member.id) : null
	let horas = parseInt(args.shift())
	const horasMS = horas * 1000 * 60 * 60
	let id = args.shift()
	let arma = args.join(" ").toLowerCase()
	let achou = false

	if (!arma && !id && !horas)
		return bot.createEmbed(message, `${bot.config.emmetGun} \`;setgun <horas> <id> <arma>\``)

	if (horas % 1 != 0)
		return bot.createEmbed(message, `PQP, ${bot.data.get(message.author.id, "username")}, as horas são inválidas`)

	if (id <= 0 || (id % 1 != 0) || id.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}i, o ID é inválido`)

	if (!arma)
		return bot.createEmbed(message, `Pelo amor de deus, ${bot.data.get(message.author.id, "username")}, escolha uma arma`)

	let uData = bot.data.get(id)

	if (!uData || uData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário`)

	Object.entries(bot.guns).forEach(([key, value]) => {
		if (arma == value.desc.toLowerCase()) {
			achou = key
			dataBase = value.data
		}
	})
	if (achou == false)
		return bot.createEmbed(message, `Puta merda, ${bot.data.get(message.author.id, "username")}, essa arma não existe`)

	let gun = bot.guns[achou]
	let emoji = gun.skins.default.emote 

	bot.createEmbed(message, `${bot.config.emmetGun} ${uData.username} recebeu ${horas} horas de ${emoji} ${gun.desc}`)

	const armaRecebida = new Discord.MessageEmbed()
		.setColor(bot.colors.darkGrey)
		.setDescription(`**${bot.data.get(message.author.id, "username")}** te deu ${horas} horas de ${emoji} ${gun.desc} ${bot.config.emmetGun}`)

	bot.users.fetch(id).then(user => user.send({
		embeds: [armaRecebida]
	}).catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`)))

	Object.entries(uData.arma).forEach(([key, arma]) => {
		if (key == dataBase) {
			if (dataBase === 'granada')
				uData.arma[key].quant += horas
			else
				uData.arma[key].tempo = arma > currTime ? arma + horasMS : currTime + horasMS
		}
	})

	bot.data.set(id, uData)
	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**${uData.username} recebeu ${horas} horas de ${emoji} de ${bot.data.get(message.author.id, "username")}**`)
		.setColor(bot.colors.admin))

}