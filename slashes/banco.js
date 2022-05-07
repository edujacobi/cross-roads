const {SlashCommandBuilder} = require('@discordjs/builders')
exports.run = async (bot, interaction) => {
	const Discord = require('discord.js')
	const QUANTIA = await bot.banco.get('caixa')
	const embed = new Discord.MessageEmbed()

		.setTitle(`${bot.config.cash} Banco Central`)
		.setDescription(`Toda movimentação financeira lícita na Cidade da Cruz possui imposto. ${bot.imposto * 100}% de qualquer valor é pego pelo governo, goste você ou não, e guardado no cofre do Banco`)
		.setColor('GREEN')
		.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/757057425735024720/radar_cash.png")
		// .addField("Segurança aumentada", "Altamente protegido!")
		.addField("Cofre", `R$ ${QUANTIA.toLocaleString().replace(/,/g, ".")}`)
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp()

	await interaction.reply({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `banco`"))
}

exports.commandData = new SlashCommandBuilder()
	.setName('banco')
	.setDescription('Informações e valor guardado no banco')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}