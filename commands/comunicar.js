const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	let id = args.shift()
	let mensagem = args.join(" ")

	if (!id && !mensagem)
		return bot.createEmbed(message, `<:CrossRoadsLogo:757021182020157571> \`;comunicar <id> <mensagem>\``)

	if (!id)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id + ".username")}, escolha um ID de usuário`)

	if (id < 0 || (id % 1 != 0) || id.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id + ".username")}, o ID é inválido`)

	let uData = await bot.data.get(id)

	if (!uData || uData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário`)

	if (!mensagem)
		return bot.createEmbed(message, `Bah, ${bot.data.get(message.author.id + ".username")}, vai mandar uma mensagem vazia?`)

	const comunicado = new Discord.MessageEmbed()
		.setColor(0x80e893)
		.setTitle(`<:CrossRoadsLogo:757021182020157571> Comunicado Administrativo:`)
		.setDescription(mensagem)
		.setFooter(`${message.author.id == bot.config.adminID ? `Administrador` : `Moderador`} ${await bot.data.get(message.author.id + ".username")}`, message.member.user.avatarURL())
		.setTimestamp()

	bot.users.fetch(id).then(user => user.send({
		embeds: [comunicado]
	})
		.catch(() => message.reply(`Não consegui mandar mensagem privada para ${bot.data.get(id + ".username")} (${id})`)
			.catch(() => `Não consegui responder ${bot.data.get(id + ".username")} nem no PV nem no canal. \`Comunicar\``)))

	bot.createEmbed(message, `<:CrossRoadsLogo:757021182020157571> Comunicado enviado para ${uData.username}`)

	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**${bot.data.get(message.author.id + ".username")} mandou o comunicado \`${mensagem}\` para ${uData.username}**`)
		.setColor(bot.colors.admin))
}