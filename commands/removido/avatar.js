const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	// return message.reply("Comando desativado")
	let {
		uData,
		alvo
	} = await bot.findUser(message, args)

	if (!uData) return

	let avatar

	bot.users.fetch(alvo).then(user => {
		alvo = user.id
		avatar = user.avatarURL({dynamic: true, size: 1024})
	}).then(async () => {
		const embed = new Discord.MessageEmbed()
			.setTitle(`Avatar de ${uData.username}`)
			.setImage(avatar)
			.setColor(message.member.displayColor)
			.setFooter({
				text: await bot.data.get(message.author.id + ".username"),
				iconURL: message.member.user.avatarURL()
			})
			.setTimestamp()

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `avatar`"))
	})
}