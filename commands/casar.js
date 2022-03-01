const Discord = require("discord.js")
const wait = require('util').promisify(setTimeout)
exports.run = async (bot, message, args) => {
	let target = message.mentions.members.first()
	let option = args ? args[0] : null
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()

	let emote = bot.config.namoro

	if (!option && !target) {
		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Comprar anel')
				.setEmoji(bot.aneis.prata.emote)
				.setCustomId(message.id + message.author.id + 'anel'))
			
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Mais informações')
				.setCustomId(message.id + message.author.id + 'info'))

		const embed = new Discord.MessageEmbed()
			.setTitle(`${emote} Casamento`)
			.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/862135638945824768/radar_girlfriend.png')
			.setDescription(`_“Os edifícios ardem, as pessoas morrem, mas o amor verdadeiro é para sempre.”_\nPeça seu par romântico em casamento utilizando um ${bot.aneis.prata.emote} Anel e faça ações em dupla!`)
			.setColor(bot.colors.casamento)
			.addField(`${bot.aneis.prata.emote} Anéis`, `Quanto melhor o anel que vocês tiverem, maiores os benefícios.\n${uData.anel != null ? `Você possui um anel de ${bot.aneis[uData.anel].emote} **${bot.aneis[uData.anel].desc}**.` : `Você não possui um anel.`}`)
			.addField(`${bot.config.flor} Flores`, `Flores precisam ser entregues para manter o nível do casamento alto.\nVocê possui \`${uData._flor}\` ${uData._flor === 1 ? `flor` : `flores`}`)
			.addField(`${bot.config.aviao} Viagens`, `Com um relacionamento no nível máximo, vocês podem viajar de férias. Após a viagem, os bônus de casal aumentam em 50%.`)
			.addField("💔 Divórcio", `Caso o casamento fique com um nível muito baixo, os efeitos positivos ficarão desativados até o nível aumentar. Você pode pedir divórcio, se assim preferir.`)
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		let msg = await message.channel.send({
			components: [row],
			embeds: [embed]
		}).catch(() => console.log("Não consegui enviar mensagem `casar`"))

		const filter = (button) => [
			message.id + message.author.id + 'anel',
			message.id + message.author.id + 'info',
			message.id + message.author.id + 'prata',
			message.id + message.author.id + 'ouro',
			message.id + message.author.id + 'diamante',
		].includes(button.customId) && button.user.id === message.author.id

		const collector = message.channel.createMessageComponentCollector({
			filter,
			idle: 90000
		})

		collector.on('collect', async b => {
			await b.deferUpdate()

			if (b.customId === message.id + message.author.id + 'info') {
				const embed = new Discord.MessageEmbed()
					.setTitle(`${emote} Mais informações do Casamento`)
					.setColor(bot.colors.casamento)
					.addField(`Ações em dupla`, `Agir em dupla aumentam as chances de sucesso e o nível do casamento! Disponíveis: **Roubo à locais** e **Fuga da prisão**`)
					.addField(`${bot.config.flor} Flores`, `Flores aumentam o nível do casamento em 1. Podem ser entregues a cada 2h por qualquer um dos cônjuges.`)
					.addField(`${bot.config.aviao} Viagens`, `Enquanto estiverem viajando, os jogadores não podem realizar nenhuma ação nem ser alvo de ações por 24h. Ao voltarem de viagem, os bônus fornecidos pelos aneis são aumentados em 50% por 48 horas.`)
					.addField("Nível", `A cada 6h, o nível do casamento decai 1 ponto. Se nenhuma ação em dupla tiver sido feita ou nenhuma flor tiver sido entregue, o decaimento aumentará em 1 a cada 6h (\`1 (6h) → 2 (12h) → 3 (18h)\`) até o nível chegar a zero.`)
					.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
					.setTimestamp()

				return message.channel.send({
					components: [],
					embeds: [embed]
				}).catch(() => console.log("Não consegui enviar mensagem `casar info`"))
			}

			uData = bot.data.get(message.author.id)

			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.aneis.prata.emote} Anéis`)
				.setThumbnail(bot.aneis.prata.img)
				.setDescription(`Quanto melhor o anel que vocês tiverem, maiores os benefícios. Juntos vocês poderão **Roubar locais**, **Fugir da prisão** e **~~Dividir prêmios de sorteios~~**. Os dois precisam ter o mesmo anel.`)
				.setColor(bot.colors.casamento)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()
			
			if (uData.casamentoID != null){
				embed.description += "\nVocê já é casado"
				if (bot.casais.get(uData.casamentoID, 'anel') === 'diamante')
					embed.description += " e já possui o melhor anel disponível em seu casamento."
				else
					embed.description += ", mas pode comprar outro anel para aumentar os benefícios!"
			}
			
			if (uData.anel == null)
				Object.values(bot.aneis).forEach(anel => {
					let custoComImposto = uData.classe === 'mafioso' ? anel.custo : Math.round(anel.custo * (1 + bot.imposto))
					embed.addField(`${anel.emote} ${anel.desc}`, `Bônus de ${anel.bonus}% na ação realizada\nPreço: R$ ${custoComImposto.toLocaleString().replace(/,/g, ".")}`, true)
				})
			else
				embed.addField(`${bot.aneis[uData.anel].emote} ${bot.aneis[uData.anel].desc}`, `Você já possui um anel!`)

			const rowAneis = new Discord.MessageActionRow()
			
			let uCasamento = bot.casais.get(uData.casamentoID)

			Object.values(bot.aneis).forEach(anel => {
				rowAneis.addComponents(new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel(anel.desc)
					.setEmoji(anel.emote)
					.setDisabled(uData.casamentoID != null && uCasamento?.anel != null ? anel.id <= bot.aneis[bot.casais.get(uData.casamentoID, 'anel')].id : false)
					.setCustomId(message.id + message.author.id + anel.desc.toLowerCase())
				)
			})

			if (b.customId === message.id + message.author.id + 'anel') {
				msg.edit({
					components: uData.anel == null ? [rowAneis] : [],
					embeds: [embed]
				}).catch(() => console.log("Não consegui editar mensagem `casar`"))

			} else {
				let anelId = b.customId.replace(`${message.id}${message.author.id}`, '')

				collector.stop()

				let custoComImposto = uData.classe === 'mafioso' ? bot.aneis[anelId].custo : Math.round(bot.aneis[anelId].custo * (1 + bot.imposto))

				if (uData.moni < custoComImposto)
					return bot.msgDinheiroMenorQueAposta(message)
				if (uData.preso > currTime)
					return bot.msgPreso(message, uData)
				if (uData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, uData)
				if (bot.isPlayerMorto(uData)) return
				if (bot.isUserEmRouboOuEspancamento(message, uData))
					return
				if (bot.isGaloEmRinha(message.author.id))
					return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
				if (uData.job != null)
					return bot.msgTrabalhando(message, uData)
				if (uData.anel != null)
					return bot.createEmbed(message, `Você já possui um ${bot.aneis.prata.emote} Anel!`, null, bot.colors.casamento)

				let anel = bot.aneis[anelId].desc
				let emoteAnel = bot.aneis[anelId].emote

				const embed = new Discord.MessageEmbed()
					.setTitle(`${emoteAnel} Anel de ${anel} adquirido!`)
					.setColor(bot.colors.casamento)
					.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
					.setTimestamp()

				uData.anel = anelId
				uData.moni -= custoComImposto

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} adquiriu um ${emoteAnel} Anel de ${anel}**`)
					.addField("Preço", custoComImposto.toLocaleString().replace(/,/g, "."), true)
					.addField("Ficou com", uData.moni.toLocaleString().replace(/,/g, "."), true)
					.setColor(bot.colors.casamento))

				msg.edit({
					embeds: [embed],
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `casar`"))

				// if (!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id) || uData.vipTime > currTime))
				// 	return bot.createEmbed(message, `${emote} Casamentos em breve!`, "Mas sabe-se lá quando", bot.colors.casamento)

				bot.data.set(message.author.id, uData)

			}
		})
	}

	if (target) {
		let tData = bot.data.get(target.id)
		if (!tData) return bot.createEmbed(message, "Este usuário não possui um inventário", null, bot.colors.casamento)
		if (uData.conjuge != null)
			return bot.createEmbed(message, `${emote} Você já é casado com ${bot.data.get(uData.conjuge, 'username')}!`, null, bot.colors.casamento)
		if (tData.conjuge != null)
			return bot.createEmbed(message, `${emote} ${tData.username} já é casado com ${bot.data.get(tData.conjuge, 'username')}!`, null, bot.colors.casamento)
		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)
		if (tData.preso > currTime)
			return bot.msgPreso(message, tData, tData.username)
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (tData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, tData, tData.username)
		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (bot.isAlvoEmRouboOuEspancamento(message, tData))
			return
		if (bot.isPlayerMorto(tData))
			return bot.msgPlayerMorto(message, tData.username)
		if (bot.isPlayerViajando(tData))
			return bot.msgPlayerViajando(message, tData.username)
		if (bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
		if (bot.isGaloEmRinha(target.id))
			return bot.createEmbed(message, `O galo de **${tData.username}** está em uma rinha e ele não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)
		if (tData.job != null)
			return bot.createEmbed(message, `**${tData.username}** está trabalhando e não pode fazer isto ${bot.config.trabalhando}`, null, bot.colors.casamento)
		if (message.author.id === target.id)
			return bot.createEmbed(message, `${emote} Por mais que você se ame mais que tudo no mundo, não pode casar consigo mesmo`, null, bot.colors.casamento)
		if (target.id === '526203502318321665') // bot
			return bot.createEmbed(message, `${emote} 001100011 01101111 01101101 00100000 01110110 01101111 01100011 11000011 10101010 00100000 01101110 11000011 10100011 01101111 <:CrossRoadsLogo:757021182020157571>`, null, bot.colors.casamento)
		if (uData.anel == null)
			return bot.createEmbed(message, `${emote} Você não possui um ${bot.aneis.prata.emote} Anel! Compre um para fazer um pedido de casamento!`, null, bot.colors.casamento)
		if (tData.anel == null || tData.anel !== uData.anel)
			return bot.createEmbed(message, `${emote} Seu parceiro não possui um ${bot.aneis.prata.emote} Anel igual ao seu! Vocês devem possui o mesmo tipo de anel`, null, bot.colors.casamento)

		const embed = new Discord.MessageEmbed()
			.setTitle(`${emote} Pedido de casamento`)
			.setDescription(`${tData.username}...`)
			.setColor(bot.colors.casamento)
			.setFooter(uData.username, message.author.avatarURL())
			.setTimestamp()

		let msg = await message.channel.send({
			embeds: [embed]
		})

		await wait(3000)

		await msg.edit({
			embeds: [embed.setDescription(`${tData.username}... você aceita...`)]
		}).catch(() => console.log("Não consegui editar mensagem `casar`"))

		await wait(3000)

		const buttonSim = new Discord.MessageButton()
			.setStyle('SUCCESS')
			.setLabel('SIM!')
			.setCustomId(message.id + message.author.id + 'sim')

		const buttonNao = new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel('Não...')
			.setCustomId(message.id + message.author.id + 'nao')

		const row = new Discord.MessageActionRow()
			.addComponents(buttonSim)
			.addComponents(buttonNao)

		await msg.edit({
			embeds: [embed.setDescription(`${tData.username}... você aceita... casar comigo? ${bot.aneis[uData.anel].emote}`)],
			components: [row]
		}).catch(() => console.log("Não consegui editar mensagem `casar`"))

		const filter = (button) => [
			message.id + message.author.id + 'sim',
			message.id + message.author.id + 'nao'
		].includes(button.customId) && button.user.id === target.id

		const collectorAceito = message.channel.createMessageComponentCollector({
			filter,
			time: 90000,
			max: 1
		})

		let aceitoOuNegado = false

		collectorAceito.on('collect', async b => {
			await b.deferUpdate()

			if (b.customId === message.id + message.author.id + 'sim') {
				if (uData.conjuge != null)
					return bot.createEmbed(message, `Você já é casado com ${bot.data.get(uData.conjuge, 'username')}!`, null, bot.colors.casamento)
				if (tData.conjuge != null)
					return bot.createEmbed(message, `${tData.username} já é casado com ${bot.data.get(tData.conjuge, 'username')}!`, null, bot.colors.casamento)
				if (uData.anel == null)
					return bot.createEmbed(message, `Você não possui um ${bot.aneis.prata.emote} Anel! Compre um para fazer um pedido de casamento`, null, bot.colors.casamento)
				if (tData.anel == null || tData.anel !== uData.anel)
					return bot.createEmbed(message, `Seu parceiro não possui um ${bot.aneis.prata.emote} Anel igual ao seu! Vocês devem possui o mesmo tipo de anel`, null, bot.colors.casamento)

				aceitoOuNegado = true
				let anelLog = uData.anel
				uData.anel = null
				tData.anel = null
				uData.conjuge = target.id
				tData.conjuge = message.author.id
				uData.casamentoID = bot.casais.size
				tData.casamentoID = bot.casais.size

				let casamento = {
					conjuges: {
						_1: message.author.id,
						_2: target.id
					},
					mural: '',
					nivel: 75,
					flores: 0,
					ultimaFlor: 0,
					anel: anelLog,
					viagem: 0,
					ultimaViagem: 0,
					desde: new Date().getTime(),
					ultimoDecrescimo: 0,
				}

				bot.casais.ensure((bot.casais.size).toString(), casamento)

				bot.data.set(message.author.id, uData)
				bot.data.set(target.id, tData)

				embed.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/862135638945824768/radar_girlfriend.png')
					.setTitle(`${emote} Eu vos declaro Casados!`)
					.setDescription(`${uData.username}, ${tData.username}, podem se beijar!`)
					.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
					.setTimestamp()

				msg.edit({
					embeds: [embed],
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `casar`"))
					.then(() => msg.react('🎉')).catch(() => console.log("Não consegui reagir mensagem `casar`"))

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} e ${tData.username} se casaram!**`)
					.addField("Anel", bot.aneis[anelLog].desc)
					.setColor(bot.colors.casamento))

			} else {
				aceitoOuNegado = true

				return msg.edit({
					embeds: [embed.setTitle(`${emote} Pedido recusado`).setDescription(`${tData.username}, ainda conquistarei seu coração!`)],
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `casar`"))
			}
		})

		collectorAceito.on("end", () => {
			if (!aceitoOuNegado) {
				embed.setTitle(`${emote} Pedido não respondido`)
					.setDescription(`${tData.username}, você não me ama?`)
				msg.edit({
					embeds: [embed],
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `casar`"))
			}
		})
	}
}