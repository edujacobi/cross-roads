const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	return message.reply("Comando desativado")
	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	if (!targetNoMention[0] && args[0] && !targetMention) { // se não mencionou mas quer ver inv de outro user

		let name = args.join(" ").toLowerCase()

		bot.data.forEach((item, id) => {
			if (bot.data.has(id, "username") && item.username.toLowerCase() == name)
				targetNoMention.push(id)

			else if (id.toString() == name) {
				targetNoMention.push(id)
			}
		})

		if (!targetNoMention[0])
			return bot.createEmbed(message, "Usuário não encontrado.")
	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else
		alvo = targetMention ? targetMention.id : message.author.id

	let uData = bot.data.get(alvo)
	if (!uData) return bot.createEmbed(message, "Este usuário não possui um inventário")

	let avatar

	bot.users.fetch(alvo).then(user => {
		alvo = user.id
		avatar = user.avatarURL({
			dynamic: true,
			size: 1024
		})
	}).then(() => {
		const embed = new Discord.MessageEmbed()

			.setTitle(`Avatar de ${uData.username}`)
			.setImage(avatar)
			.setColor(message.member.displayColor)
			.setFooter(bot.data.get(message.author.id, "username"), message.member.user.avatarURL())
			.setTimestamp();

		return message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `avatar`"))
	})
}