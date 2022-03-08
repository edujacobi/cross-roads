const Discord = require("discord.js")
exports.run = async (bot, interaction, args) => {
	let server = bot.guilds.cache.get('529674666692837378')
	let canal = server.channels.cache.get('805753163201249280')

	let mensagem = await canal.messages.fetch(canal.lastMessageId)

	let ultimoUpdate = mensagem.content
	let date = mensagem.createdTimestamp


	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.badges.ovos_dourados} Eventos`)
		//.setThumbnail("https://cdn.discordapp.com/attachments/453314806674358292/526265639552417802/GTD.png")
		.setColor('GREEN')
		.setDescription(ultimoUpdate)
		.addField("Para ver todos os eventos", "Entre no servidor oficial do Cross Roads: https://discord.gg/sNf8avn")
		.setFooter({text: `${bot.user.username} • #${canal.name}`, iconURL: bot.user.avatarURL()})
		.setTimestamp(date)

	await interaction.reply({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `evento`"))

}
exports.commandData = {
	name: "eventos",
	description: "Verifique se eventos estão ocorrendo no Cross Roads",
	options: [],
	defaultPermission: true,
}

exports.conf = {
	permLevel: "User",
	guildOnly: false
}