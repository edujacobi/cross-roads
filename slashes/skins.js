const Discord = require("discord.js")
exports.run = async (bot, interaction) => {
	let emoji = bot.guns.minigun.skins['classic'].emote

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.vip} Skins de armas`)
		.setColor(0xffd700)
		.setTimestamp()
		.setFooter(bot.user.username, bot.user.avatarURL())

	let lista = []

	Object.values(bot.guns).forEach(arma => {
		if (arma.desc !== 'Celular') {
			// let emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote)
			let skinsDisponiveis = ''
			Object.values(arma.skins).forEach(skin => {
				if (skin.compravel)
					skinsDisponiveis += `${skin.emote} `
			})
			//${arma.skins['default']}
			embed.addField(`${arma.desc}`, skinsDisponiveis, true)

			lista.push({
				label: arma.desc,
				emoji: arma.skins.default.emote,
				// description: `R$ ${preço.toLocaleString().replace(/,/g, ".")} • Lucro/h: R$ ${lucro.toLocaleString().replace(/,/g, ".")}`,
				value: arma.id.toString(),
			})

		}
	})


	const row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageSelectMenu()
			.setCustomId(interaction.id + interaction.user.id + 'select')
			.setPlaceholder('Selecione a arma')
			.addOptions(lista))

	await interaction.reply({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `skins`"))

	const filter = (select) => [
		interaction.id + interaction.user.id + 'select',
	].includes(select.customId) && select.user.id === interaction.user.id

	const collector = interaction.channel.createMessageComponentCollector({
		filter,
		idle: 60000,
	})

	collector.on('collect', async s => {
		await s.deferUpdate()

		let uData = bot.data.get(interaction.user.id)

		let armaSelecionada = null
		let skins = ''
		const rowComprar = new Discord.MessageActionRow()
		const rowSpecial = new Discord.MessageActionRow()

		Object.values(bot.guns).forEach(gun => {
			if (parseInt(s.values[0]) === gun.id) {
				armaSelecionada = gun

				Object.entries(gun.skins).forEach(([id, skin]) => {
					skins += `${skin.emote} **${skin.nome}**\n`
					if (skin.compravel)
						rowComprar.addComponents(new Discord.MessageButton()
							.setStyle('SECONDARY')
							.setLabel(skin.nome)
							.setDisabled(uData.arma[gun.data].skinAtual === id.toString())
							.setEmoji(skin.emote)
							.setCustomId(interaction.id + interaction.user.id + 'selecionar' + gun.desc + skin.nome))

					if (!skin.compravel && uData.arma[gun.data].skinsCompradas.includes(id))
						rowSpecial.addComponents(new Discord.MessageButton()
							.setStyle('SECONDARY')
							.setLabel(skin.nome)
							.setDisabled(uData.arma[gun.data].skinAtual === id.toString())
							.setEmoji(skin.emote)
							.setCustomId(interaction.id + interaction.user.id + 'selecionar' + gun.desc + skin.nome))
				})
			}
		})

		rowComprar.addComponents(new Discord.MessageButton()
			.setStyle('PRIMARY')
			.setLabel('Voltar')
			.setEmoji('🔙')
			.setCustomId(interaction.id + interaction.user.id + 'back'))

		// const embed = new Discord.MessageEmbed()
		// 	.setTitle(`${bot.config.vip} Skins de ${armaSelecionada.desc}`)
		// 	.setColor(0xffd700)
		// 	.setDescription(skins)
		// 	.setTimestamp()
		// 	.setFooter(bot.user.username, bot.user.avatarURL())


		await interaction.editReply({components: rowSpecial.components.length > 0 ? [rowComprar, rowSpecial] : [rowComprar]})
			.catch(() => console.log("Não consegui editar mensagem `skins`"))

		const filterComprar = (button) => button.customId.includes(interaction.id + interaction.user.id) && button.user.id === interaction.user.id

		const collectorComprar = interaction.channel.createMessageComponentCollector({
			filter: filterComprar,
			idle: 60000,
		})

		collectorComprar.on('collect', async c => {
			await c.deferUpdate()
			let currTime = Date.now()
			uData = bot.data.get(interaction.user.id)
			if (c.user.id !== interaction.user.id) return

			if (c.customId.includes('back'))
				await interaction.editReply({components: [row]})
					.catch(() => console.log("Não consegui editar mensagem `skins`"))

			else if (c.customId.includes('selecionar')) {
				if (uData.vipTime < currTime) {
					const embed = new Discord.MessageEmbed()
						.setColor(0xffd700)
						.setDescription(`Você precisa ser **VIP** ${bot.config.vip} para usar skins`)
					// .setTimestamp()
					// .setFooter(bot.user.username, bot.user.avatarURL())
					return interaction.followUp({embeds: [embed]})
				}
				Object.values(bot.guns).forEach(arma => {
					if (c.customId.includes(arma.desc)) {
						Object.entries(arma.skins).forEach(([id, skin]) => {
							if (c.customId.includes(skin.nome)) {
								if (!uData.arma[arma.data].skinsCompradas.includes(id))
									uData.arma[arma.data].skinsCompradas.push(id)

								uData.arma[arma.data].skinAtual = id

								const embed = new Discord.MessageEmbed()
									.setColor(0xffd700)
									.setDescription(`Você agora está usando a skin ${skin.emote} **${arma.desc} ${skin.nome}**`)
								// .setTimestamp()
								// .setFooter(bot.user.username, bot.user.avatarURL())

								interaction.editReply({components: [row]})

								bot.data.set(interaction.user.id, uData)
								return interaction.followUp({embeds: [embed]})

							}
						})
					}
				})
			}
		})
		collectorComprar.on('end', () => {
			if (interaction)
				interaction.editReply({
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `skins`"))
		})
	})
	collector.on('end', () => {
		if (interaction)
			interaction.editReply({
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `skins`"))
	})
}

exports.commandData = {
	name: "skins",
	description: "Compra ou altera a skin de uma arma",
	options: [],
	defaultPermission: true,
}

exports.conf = {
	permLevel: "User",
	guildOnly: true
}