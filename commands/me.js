const Discord = require("discord.js")
exports.run = async (bot, message, args) => {

	let uData = await bot.data.get(message.author.id)

	let acao = args.join(" ")

	if (!acao)
		acao = "não faz nada..."

	const embed = new Discord.MessageEmbed()
		.setColor(message.member.displayColor)
		.setAuthor(`${uData.username} está realizando uma ação${await bot.isPlayerViajando(uData) ? ' durante sua viagem' : ''}...`, message.author.avatarURL())
		.setDescription(`${await bot.isPlayerViajando(uData) ? bot.config.aviao : ''}*${uData.username} ${acao}*`)

	message.channel.send({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `me`"))
	return message.delete()
}