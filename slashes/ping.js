const Discord = require("discord.js")
exports.run = async (bot, interaction) => {
	let botPing = Math.round(bot.ws.ping)
	let svPing = new Date().getTime()

	const embed = new Discord.MessageEmbed()
		.setDescription(`:satellite_orbital: ${botPing}ms API.`)
		.setColor('GREEN')
		.setTimestamp()
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})

	await interaction.reply({embeds: [embed]})
	
	await interaction.editReply({
		embeds: [embed.setDescription(`:satellite_orbital: ${botPing}ms API. ${Math.round(new Date().getTime() - svPing)}ms Server.`)]
	})
		.catch(err => console.log("Não consegui editar mensagem `ping`"))
}

exports.commandData = {
	name: "ping",
	description: "Latência da API do Discord e do servidor do Cross Roads.",
	options: [],
	defaultPermission: true,
}

exports.conf = {
	permLevel: "User",
	guildOnly: false
}