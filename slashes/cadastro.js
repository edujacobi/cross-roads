const Discord = require("discord.js")
exports.run = async (bot, interaction) => {

	let uData = bot.data.get(interaction.user.id)

	const embed = new Discord.MessageEmbed()
		.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
		.setDescription(`${uData.username}, você batalhou bastante e finalmente pôde comprar sua primeira ${bot.guns.rpg.skins.default.emote} RPG.
Você bateu em muitas velhinhas para chegar até aqui, mas ainda preciso que você me prove que você não é simplesmente um clone de algum experimento alienígena, entende?

Confirmando, você concorda com todas as regras da <#529676890454360074> e que esta é sua única conta.`)
		.setColor(bot.colors.admin)
		.setTimestamp()
		.setFooter(`${bot.user.username} • KKK eae fake!`, bot.user.avatarURL())


	await interaction.reply({embeds: [embed], ephemeral: true})
		.catch(() => console.log("Não consegui enviar mensagem `cadastro`"))

	const row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('PRIMARY')
			.setLabel('Confirmar, não sou um clone')
			.setCustomId(interaction.id + interaction.user.id + 'confirm'))
		.addComponents(new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel('Cancelar')
			.setCustomId(interaction.id + interaction.user.id + 'cancel'))

	await interaction.editReply({components: [row]})
		.catch(() => console.log("Não consegui editar mensagem `cadastro`"))

	const filter = (button) => button.customId.includes(interaction.id + interaction.user.id) && button.user.id === interaction.user.id

	const collector = interaction.channel.createMessageComponentCollector({
		filter: filter,
		idle: 60000,
	})

	collector.on('collect', async c => {
		await c.deferUpdate()
		let uData = bot.data.get(interaction.user.id)
		if (c.user.id !== interaction.user.id) return

		if (c.customId.includes('confirm')) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
				.setDescription(`${uData.username}, obrigado pela confirmação!`)
				.setColor(bot.colors.admin)
				.setTimestamp()
				.setFooter(`${bot.user.username} • Circulando, circulando!`, bot.user.avatarURL())

			await interaction.editReply({embeds: [embed], components: []})
				.catch(() => console.log("Não consegui editar mensagem `cadastro`"))
		}

		else if (c.customId.includes('cancel')) {
			collector.stop()
			const embed = new Discord.MessageEmbed()
				.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
				.setDescription(`${uData.username}, não posso deixar você continuar se você é um clone!`)
				.setColor('RED')
				.setTimestamp()
				.setFooter(`${bot.user.username} • Xispa!`, bot.user.avatarURL())

			bot.users.fetch(bot.config.adminID).then(user => {
				user.send(`Cancelou cadastro anti-fake: ${uData.username} (${c.user.id})`)
			})

			await interaction.editReply({embeds: [embed], components: []})
				.catch(() => console.log("Não consegui editar mensagem `cadastro`"))
		}
		
	})
	collector.on('end', () => {
		if (interaction)
			interaction.editReply({
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `cadastro`"))
	})

}

exports.commandData = {
	name: "cadastro",
	description: "Completa o cadastro anti-fake",
	options: [],
	defaultPermission: true,
}

exports.conf = {
	permLevel: "User",
	guildOnly: true
}