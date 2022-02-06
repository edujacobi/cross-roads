const Discord = require("discord.js")
exports.run = async (bot, interaction) => {

	let uData = bot.data.get(interaction.user.id)

	const embed = new Discord.MessageEmbed()
		.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
		.setDescription(`${uData.username}, você batalhou bastante e finalmente pôde comprar sua primeira ${bot.guns.rpg.skins.default.emote} RPG.
Você bateu em muitas velhinhas para chegar até aqui, mas ainda preciso que você me prove que você não é simplesmente um clone de algum experimento alienígena, entende?

Por favor, na próxima mensagem, digite seu e-mail.`)
		.setColor(bot.colors.admin)
		.setTimestamp()
		.setFooter(`${bot.user.username} • KKK eae fake!`, bot.user.avatarURL())

	/**
	 * Usa /cadastro
	 * Bot pede pra inserir e-mail
	 * Usuário manda e-mail
	 * Bot confere se o e-mail ja está cadastrado
	 * se não, cancela e pede para iniciar dnv
	 * se sim, envia código por e-mail e pede pro usuário confirmar o código com /cadastro <codigo>
	 * se errou, cancela e pede para iniciar dnv
	 * se acertou, salva cadastro ok e encerra 
	 */


	await interaction.reply({embeds: [embed], ephemeral: true})
		.catch(() => console.log("Não consegui enviar mensagem `cadastro`"))
	
	return
	
	const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
		.setStyle('PRIMARY')
		.setLabel('Voltar')
		.setEmoji('🔙')
		.setCustomId(interaction.id + interaction.user.id + 'back'))

	await interaction.editReply({components: [row]})
		.catch(() => console.log("Não consegui editar mensagem `cadastro`"))

	const filter = (button) => button.customId.includes(interaction.id + interaction.user.id) && button.user.id === interaction.user.id

	const collector = interaction.channel.createMessageComponentCollector({
		filter: filter,
		idle: 60000,
	})

	collector.on('collect', async c => {
		await c.deferUpdate()
		let currTime = Date.now()
		let uData = bot.data.get(interaction.user.id)
		if (c.user.id !== interaction.user.id) return

		if (c.customId.includes('back'))
			await interaction.editReply({components: [row]})
				.catch(() => console.log("Não consegui editar mensagem `cadastro`"))

		else if (c.customId.includes('selecionar')) {
			
			
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