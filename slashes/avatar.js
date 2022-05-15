const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')
exports.run = async (bot, interaction) => {
	// return message.reply("Comando desativado")

	let user = interaction.options.getString('jogador')

	await interaction.deferReply()
	
	console.log(user)
	
	if (!user)
		user = interaction.user.id
	
	let {
		uData,
		alvo
	} = await bot.findUser(interaction, [user])

	if (!uData) return

	let avatar
	
	

	bot.users.fetch(alvo).then(user => {
		alvo = user.id
		avatar = user.avatarURL({dynamic: true, size: 1024})
	}).then(async () => {
		const embed = new Discord.MessageEmbed()
			.setTitle(`Avatar de ${uData.username}`)
			.setImage(avatar)
			.setColor(interaction.member.displayColor)
			.setFooter({
				text: await bot.data.get(interaction.user.id + ".username"),
				iconURL: interaction.member.user.avatarURL()
			})
			.setTimestamp()

		await interaction.editReply({embeds: [embed]})
			// .catch(() => console.log("Não consegui enviar mensagem `avatar`"))
	})
}


exports.commandData = new SlashCommandBuilder()
	.setName('avatar')
	.setDescription('Mostra o avatar de um jogador')
	.setDefaultPermission(true)
	.addStringOption(option =>
		option.setName('jogador')
			.setDescription('O nick do jogador')
			.setRequired(false));

exports.conf = {
	permLevel: "User",
	guildOnly: false
}