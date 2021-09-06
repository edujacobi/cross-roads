const Discord = require("discord.js");
exports.run = async (bot, message, args) => {

	let acao = args.join(" ")

	if (!acao)
		acao = "não faz nada..."

	const embed = new Discord.MessageEmbed()
		.setColor(message.member.displayColor)
		.setAuthor(`${bot.data.get(message.author.id, 'username')} está realizando uma ação...`, message.author.avatarURL())
		.setDescription(`*${bot.data.get(message.author.id, 'username')} ${acao}*`)
	message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `me`", err))
	return message.delete()
}