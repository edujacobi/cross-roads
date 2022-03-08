const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

exports.run = async (bot, interaction) => {
	let server = bot.guilds.cache.get('529674666692837378')
	let canal = server.channels.cache.get('529676748422512661')
	let mensagem = await canal.messages.fetch(canal.lastMessageId)
	let ultimoUpdate = mensagem.content
	let date = mensagem.createdTimestamp

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.badges.dev} Updates`)
		//.setThumbnail("https://cdn.discordapp.com/attachments/453314806674358292/526265639552417802/GTD.png")
		.setColor('GREEN')
		.setDescription(ultimoUpdate)
		.addField("Para ver todos os updates", "Entre no servidor oficial do Cross Roads: https://discord.gg/sNf8avn")
		.setFooter({text: `${bot.user.username} • #${canal.name}`, iconURL: bot.user.avatarURL()})
		.setTimestamp(date)

	await interaction.reply({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `updates`"))
}

exports.commandData = new SlashCommandBuilder()
	.setName('updates')
	.setDescription('Últimas atualizações do Cross Roads!')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}