const Discord = require("discord.js")
const wait = require('util').promisify(setTimeout)
exports.run = async (bot, message, args) => {
	let emote = '<:girlfriend:799053368189911081>'
	let aviao = '<:aviao:916097534936637450>'
	let currTime = new Date().getTime()

	let {
		uData,
		alvo
	} = await bot.findUser(message, args)

	if (!uData) return


	// if (!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id) || uData.vipTime > currTime))
	// 	return

	if (!uData.casamentoID)
		return bot.createEmbed(message, `${emote} ${alvo === message.author.id ? "Você" : "Este jogador"} não é casado`, "Use ;casar para saber mais!", bot.colors.casamento)

	let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

	const getStringNivelCasamento = (nivel) => {
		const hp = {
			lFull_g: '<:lFull_g:902350148036866099>',
			mFull_g: '<:mFull_g:902350147873308714>',
			rFull_g: '<:rFull_g:902350147890077746>',

			lFull_y: '<:lFull_y:902351150685225021>',
			mFull_y: '<:mFull_y:902351150672654416>',
			rFull_y: '<:rFull_y:902351150215483433>',

			lFull_o: '<:lFull_o:902351150559399997>',
			mFull_o: '<:mFull_o:902351150827835463>',
			rFull_o: '<:rFull_o:902351150576177192>',

			lFull_r: '<:lFull_r:902351150576185344>',
			mFull_r: '<:mFull_r:902351150664273930>',
			rFull_r: '<:rFull_r:902351150567788674>',

			lEmpty: '<:lEmpty:902347180445159454>',
			mEmpty: '<:mEmpty:902347180432556112>',
			rEmpty: '<:rEmpty:902347180457746522>',
		}

		let esquema = hp.lFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.rFull_g

		if (nivel / 100 < 0.9)
			esquema = hp.lFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.rEmpty
		if (nivel / 100 < 0.80)
			esquema = hp.lFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.70)
			esquema = hp.lFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mFull_g + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.60)
			esquema = hp.lFull_y + hp.mFull_y + hp.mFull_y + hp.mFull_y + hp.mFull_y + hp.mFull_y + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.50)
			esquema = hp.lFull_y + hp.mFull_y + hp.mFull_y + hp.mFull_y + hp.mFull_y + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.40)
			esquema = hp.lFull_y + hp.mFull_y + hp.mFull_y + hp.mFull_y + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.30)
			esquema = hp.lFull_o + hp.mFull_o + hp.mFull_o + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.20)
			esquema = hp.lFull_o + hp.mFull_o + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 < 0.10)
			esquema = hp.lFull_r + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		if (nivel / 100 <= 0)
			esquema = hp.lEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.mEmpty + hp.rEmpty
		return esquema
	}
	
	const getRow = async (uData) => {
		uCasamento = await bot.casais.get(uData.casamentoID?.toString())
		
		// console.log(uCasamento)

		let isViajando = await bot.isPlayerViajando(uData)

		let row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Escrever')
				.setEmoji('💬')
				.setCustomId('mural'))

			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Entregar')
				.setEmoji(bot.config.flor)
				.setDisabled((uData._flor <= 0 || (currTime - uCasamento.ultimaFlor) < 7200000) || uCasamento.nivel >= 100 || isViajando || uCasamento.anel === null)
				.setCustomId('flor'))

		if (uCasamento.nivel >= 90)
			row.addComponents(new Discord.MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Viajar')
				.setEmoji(bot.config.aviao)
				.setDisabled(uCasamento.nivel < 100 || isViajando || uCasamento.anel === null)
				.setCustomId('viajar'))

		if (uCasamento.nivel <= 20)
			row.addComponents(new Discord.MessageButton()
				.setStyle('DANGER')
				.setLabel('Divórcio')
				.setDisabled(uCasamento.nivel >= 10)
				.setEmoji('💔')
				.setCustomId('divorcio'))

		if (uData.anel !== null)
			row.addComponents(new Discord.MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Melhorar anel')
				.setDisabled(uCasamento.nivel <= 10 && uCasamento.anel != null)
				.setEmoji(bot.aneis[uData.anel].emote)
				.setCustomId('anel'))

		return row
	}
	
	const embed = new Discord.MessageEmbed()
		.setTitle(`${emote} ${alvo === message.author.id ? `Seu casamento com ${await bot.data.get(uData.conjuge.toString() + '.username')}` : `Casamento de ${await bot.data.get(uCasamento.conjuges._1 + '.username')} e ${await bot.data.get(uCasamento.conjuges._2 + '.username')}`}`)
		.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/862135638945824768/radar_girlfriend.png')
		.setColor(bot.colors.casamento)
		.addField("Mural", uCasamento.mural.length > 0 ? `"${uCasamento.mural}"` : `...`)
		.addField(`${bot.config.flor} Flores`, `${uCasamento.flores.toString()} entregues\n${uCasamento.ultimaFlor !== 0 ? `${bot.segToHour((currTime - uCasamento.ultimaFlor) / 1000)} desde a última` : "Não entregaram ainda"}`, true)
		.addField(`${bot.config.aviao} Viagens`, `${uCasamento.viagem > currTime ? `Viajando por mais ${bot.segToHour((uCasamento.viagem - currTime) / 1000)}` : 'Não estão viajando'}\n${uCasamento.ultimaViagem !== 0 ? `${bot.segToHour((currTime - uCasamento.ultimaViagem) / 1000)} desde a última` : "Não viajaram ainda"}`, true)
		.addField(`${uCasamento.anel == null ? '' : bot.aneis[uCasamento.anel].emote} Anel`, `${uCasamento.anel == null ? 'Sem anel' : bot.aneis[uCasamento.anel].desc}`, true)
		.addField("Nível", `${getStringNivelCasamento(uCasamento.nivel)} **${uCasamento.nivel}**`)
		.setFooter(`${uData.username} e ${await bot.data.get(uData.conjuge.toString() + '.username')} • Casados desde ${new Date(uCasamento.desde).toLocaleString("pt-BR").replace(/-/g, "/")}${bot.isAdmin(message.author.id) ? ` • ID: ${uData.casamentoID}` : ''}`, bot.user.avatarURL())
		.setTimestamp()

	if (currTime - uCasamento.ultimaViagem < 72 * 60 * 60 * 1000)
		embed.addField(`Bônus de viagem ativo por mais ${bot.segToHour((uCasamento.ultimaViagem - currTime + 72 * 60 * 60 * 1000) / 1000)}`, `${bot.aneis[uCasamento.anel].bonus * 1.5}%`)

	const row = await getRow(uData)

	let msg = await message.channel.send({
		components: [uCasamento.conjuges._1, uCasamento.conjuges._2].includes(message.author.id) ? [row] : [],
		embeds: [embed]
	}).catch(() => console.log("Não consegui enviar mensagem `casamento`"))

	const filter = (button) => [
		'mural',
		'flor',
		'viajar',
		'divorcio',
		'anel',
	].includes(button.customId) && button.user.id === message.author.id

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async b => {
		await b.deferUpdate()

		const Piii = require("piii")
		const piiiFilters = require("piii-filters")

		const piii = new Piii({
			filters: [
				...Object.values(piiiFilters),
				bot.palavrasBanidas
			],
		})

		if (b.customId === 'mural') {
			const embedMural = new Discord.MessageEmbed()
				.setTitle(`💬 Escrever no mural`)
				.setDescription(`Escreva sua mensagem para deixar anotado no mural do casamento!`)
				.setColor(bot.colors.casamento)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()

			let msgMural = await message.channel.send({embeds: [embedMural]})
				.catch(() => console.log("Não consegui enviar mensagem `casamento mural`"))

			const filterMural = response => response.author.id === message.author.id
			const collectorMural = message.channel.createMessageCollector({
				filterMural,
				time: 90000,
				max: 1,
			})

			collectorMural.on('collect', async m => {
				if (m.author.id !== message.author.id) return
				let {
					uData,
					alvo
				} = await bot.findUser(message, args)

				let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

				let mensagem = m.content
				mensagem.replace(/\s/g, " ")

				if (piii.has(mensagem))
					return bot.createEmbed(message, `${emote} Não deixe palavras feias no mural!`, 'Somente palavras bonitas e legais', bot.colors.casamento)

				if (mensagem.length > 512)
					return bot.createEmbed(message, `${emote} Sua mensagem é muito grande. Limite de Caracteres: 512`, null, bot.colors.casamento)

				uCasamento.mural = mensagem

				await bot.casais.set(uData.casamentoID.toString(), uCasamento)

				embed.fields[0].value = uCasamento.mural.length > 0 ? `"${uCasamento.mural}"` : `...`

				msg.edit({embeds: [embed]})
					.catch(() => console.log("Não consegui editar mensagem `casamento mural`"))

				return msgMural.edit({
					components: [await getRow(uData)],
					embeds: [embedMural.setTitle(`💬 Mural alterado!`).setDescription('')]
				}).catch(() => console.log("Não consegui editar mensagem `casamento mural`"))
			})

		}
		else if (b.customId === 'flor') {
			let currTime = new Date().getTime()
			const duasHoras = 7200000

			// let {
			// 	uData,
			// 	alvo
			// } = await bot.findUser(message, args)
			let uData = await bot.data.get(message.author.id)

			let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

			if (uData._flor <= 0)
				return bot.createEmbed(message, `${bot.config.flor} Você não possui nenhuma flor para entregar`, `Encontre-as vasculhando`, bot.colors.casamento)

			if (currTime - uCasamento.ultimaFlor < duasHoras)
				return bot.createEmbed(message, `${bot.config.flor} Você só poderá entregar uma flor em ${bot.segToHour((duasHoras + uCasamento.ultimaFlor - currTime) / 1000)}`, null, bot.colors.casamento)

			const embedFlor = new Discord.MessageEmbed()
				.setTitle(`${bot.config.flor} Para você!`)
				.setDescription(`Gostaria de entrar e tomar uma xícara de café?`)
				.setColor(bot.colors.casamento)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()

			await message.channel.send({embeds: [embedFlor]})
				.catch(() => console.log("Não consegui enviar mensagem `casamento flor`"))

			uCasamento.flores += 1
			uCasamento.nivel += 1
			uCasamento.ultimaFlor = currTime
			uCasamento.ultimoDecrescimo = 1

			uData._flor -= 1

			setTimeout(() => {
				let embedPV = new Discord.MessageEmbed()
					.setTitle(`${bot.config.flor} Você já pode entregar ou receber outra flor!`)
					.setColor(bot.colors.casamento)

				message.author.send({embeds: [embedPV]})
					.catch(() => `Não consegui enviar PV para ${uData.username} \`Casamento Flor\``)

				bot.users.fetch(uData.conjuge).then(user => {
					user.send({embeds: [embedPV]})
						.catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Casamento Flor\``)
				})
			}, duasHoras)

			await bot.data.set(message.author.id, uData)

			await bot.casais.set(uData.casamentoID.toString(), uCasamento)

			embed.fields[1].value = `${uCasamento.flores.toString()} entregues\n${bot.segToHour((currTime - uCasamento.ultimaFlor) / 1000)} desde a última flor`
			embed.fields[4].value = `${getStringNivelCasamento(uCasamento.nivel)} **${uCasamento.nivel}**`

			const embedPV = new Discord.MessageEmbed()
				.setTitle(`${bot.config.flor} ${uData.username} te entregou uma flor!`)
				.setColor(bot.colors.casamento)

			bot.users.fetch(uData.conjuge).then(user => {
				user.send({embeds: [embedPV]})
					.catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Flor\``)
			})

			return msg.edit({
				components: [await getRow(uData)],
				embeds: [embed]
			}).catch(() => console.log("Não consegui editar mensagem `casamento flor`"))

		}
		else if (b.customId === 'viajar') {
			let currTime = new Date().getTime()
			const semana = 604800000

			let uData = await bot.data.get(message.author.id)

			let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

			if ((currTime - uCasamento.ultimaViagem) < semana)
				return bot.createEmbed(message, `${bot.config.aviao} Vocês só poderão viajar novamente em ${bot.segToHour((semana + uCasamento.ultimaViagem - currTime) / 1000)}`, null, bot.colors.casamento)

			if (uCasamento.nivel < 100)
				return bot.createEmbed(message, `${bot.config.aviao} Vocês não possuem nível suficiente para viajar!`, `Precisam estar nível 100`, bot.colors.casamento)

			const embedViagem = new Discord.MessageEmbed()
				.setTitle(`${bot.config.aviao} Aeroporto Internacional da Cruz`)
				.setDescription(`Vocês ficarão viajando por 24 horas e após retornarem, seus bônus terão um aumento de ${bot.aneis[uCasamento.anel].bonus / 2}% (total: ${bot.aneis[uCasamento.anel].bonus * 1.5}%) por 48 horas!`)
				.setThumbnail('https://media.discordapp.net/attachments/895062707684929588/916097951753973771/radar_airYard.png')
				.addField('🗾 Longe de casa', 'Enquanto estiverem viajando vocês obviamente não estarão na Cidade da Cruz e não poderão realizar nenhuma ação (nem ser alvo de ação de outros usuários)')
				.setColor(bot.colors.casamento)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()

			const row = new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('SUCCESS')
					.setLabel('Confirmar viagem 0/2')
					.setEmoji(aviao)
					.setCustomId('confirmarviagem'))

			let msgViagem = await message.channel.send({
				embeds: [embedViagem],
				components: [row]
			}).catch(() => console.log("Não consegui enviar mensagem `casamento viajar"))

			const filterViagem = (button) => 'confirmarviagem' === button.customId && (button.user.id === message.author.id || button.user.id === uData.conjuge)

			const collector = msgViagem.createMessageComponentCollector({
				filter: filterViagem,
				time: 90000,
			})

			let confirmados = []

			collector.on('collect', async c => {
				await c.deferUpdate()

				currTime = new Date().getTime()

				let uData = await bot.data.get(c.user.id)

				if (uData.job != null)
					return bot.msgTrabalhando(message, uData, uData.username)
				if (uData.preso > currTime)
					return bot.msgPreso(message, uData, uData.username)
				if (uData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, uData, uData.username)
				if (await bot.isUserEmRouboOuEspancamento(message, uData))
					return
				if (await bot.isGaloEmRinha(c.user.id))
					return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

				uCasamento = await bot.casais.get(uData.casamentoID?.toString())

				if ((currTime - uCasamento.ultimaViagem) < semana)
					return bot.createEmbed(message, `${bot.config.aviao} Vocês só poderão viajar novamente em ${bot.segToHour((semana + uCasamento.ultimaViagem - currTime) / 1000)}`, null, bot.colors.casamento)
				if (uCasamento.nivel < 100)
					return bot.createEmbed(message, `${bot.config.aviao} Vocês não possuem nível suficiente para viajar!`, `Precisam estar nível 100`, bot.colors.casamento)
				if (confirmados.includes(c.user.id))
					return

				confirmados.push(c.user.id)

				msgViagem.edit({
					components: [new Discord.MessageActionRow()
						.addComponents(new Discord.MessageButton()
							.setStyle('SUCCESS')
							.setLabel(`Confirmar viagem ${confirmados.length}/2`)
							.setEmoji(aviao)
							.setCustomId('confirmarviagem'))
					]
				})

				const newEmbedViagem = new Discord.MessageEmbed()
					.setTitle(`${bot.config.aviao} Embarcando... Nossas merecidas férias!`)
					.setDescription(`Durante as próximas 24 horas vocês não estarão na Cidade da Cruz e não poderão realizar nenhuma ação (nem ser alvo de ação de outros usuários)`)
					.setThumbnail('https://media.discordapp.net/attachments/895062707684929588/916097951753973771/radar_airYard.png')
					.setColor(bot.colors.casamento)
					.setFooter(`${bot.user.username} • Boa viagem!`, bot.user.avatarURL())
					.setTimestamp()

				if (confirmados.length === 2) {

					uCasamento.viagem = currTime + 24 * 60 * 60 * 1000
					uCasamento.ultimaViagem = currTime
					uCasamento.nivel = 75

					await bot.casais.set(uData.casamentoID.toString(), uCasamento)

					setTimeout(() => {
						let embedPV = new Discord.MessageEmbed()
							.setTitle(`${bot.config.aviao} Vocês chegarão da viagem em 30 minutos!`)
							.setColor(bot.colors.casamento)

						message.author.send({embeds: [embedPV]})
							.catch(() => `Não consegui enviar PV para ${uData.username} \`Casamento viagem\``)

						bot.users.fetch(uData.conjuge).then(user => {
							user.send({embeds: [embedPV]})
								.catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Casamento viagem\``)
						})
					}, 23.5 * 60 * 60 * 1000)

					setTimeout(() => {
						let embedPV = new Discord.MessageEmbed()
							.setTitle(`${bot.config.aviao} Vocês voltaram de viagem!`)
							.setColor(bot.colors.casamento)

						message.author.send({embeds: [embedPV]})
							.catch(() => `Não consegui enviar PV para ${uData.username} \`Casamento viagem\``)

						bot.users.fetch(uData.conjuge).then(user => {
							user.send({embeds: [embedPV]})
								.catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Casamento viagem\``)
						})
					}, 24 * 60 * 60 * 1000)

					msgViagem.edit({
						components: [],
						embeds: [newEmbedViagem]
					})
				}
			})

		}
		else if (b.customId === 'divorcio') {
			let currTime = new Date().getTime()
			const semana = 604800000

			let uData = await bot.data.get(message.author.id)

			let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

			if (uCasamento.nivel > 10)
				return bot.createEmbed(message, `💔 Vocês não estão mal o suficiente para se divorciar!`, `Precisam estar abaixo do nível 10`, bot.colors.casamento)

			const embedDiv = new Discord.MessageEmbed()
				.setDescription(`💔 Vocês desejam realmente se divorciar? Esta ação não poderá ser desfeita!`)
				.setColor(bot.colors.casamento)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()

			const row = new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('DANGER')
					.setLabel('Confirmar divórcio 0/2')
					.setEmoji('💔')
					.setCustomId('confirmardivorcio'))

			let msgDiv = await message.channel.send({
				embeds: [embedDiv],
				components: [row]
			}).catch(() => console.log("Não consegui enviar mensagem `casamento divorcio"))

			const filterDivorcio = (button) => 'confirmardivorcio' === button.customId && (button.user.id === message.author.id || button.user.id === uData.conjuge)

			const collector = msgDiv.createMessageComponentCollector({
				filter: filterDivorcio,
				time: 90000,
			})

			let confirmados = []

			collector.on('collect', async c => {
				await c.deferUpdate()

				currTime = new Date().getTime()

				let uData = await bot.data.get(c.user.id)

				if (uData.job != null)
					return bot.msgTrabalhando(message, uData, uData.username)
				if (uData.preso > currTime)
					return bot.msgPreso(message, uData, uData.username)
				if (uData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, uData, uData.username)
				if (await bot.isUserEmRouboOuEspancamento(message, uData))
					return
				if (await bot.isGaloEmRinha(c.user.id))
					return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

				uCasamento = await bot.casais.get(uData.casamentoID?.toString())

				if (uCasamento.nivel > 10)
					return bot.createEmbed(message, `💔 Vocês não estão mal o suficiente para se divorciar!`, `Precisam estar abaixo do nível 10`, bot.colors.casamento)

				if (confirmados.includes(c.user.id))
					return

				confirmados.push(c.user.id)

				msgDiv.edit({
					components: [new Discord.MessageActionRow()
						.addComponents(new Discord.MessageButton()
							.setStyle('DANGER')
							.setLabel(`Confirmar divórcio ${confirmados.length}/2`)
							.setEmoji('💔')
							.setCustomId('confirmardivorcio'))
					]
				})

				const newEmbedDiv = new Discord.MessageEmbed()
					.setTitle(`💔 Infelizmente, parece que nosso amor não é eterno...`)
					.setDescription(`Vocês não são mais um casal e estão livres para encontrar outras pessoas, ou até mesmo se reencontrarem no futuro!`)
					.setColor(bot.colors.casamento)
					.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
					.setTimestamp()

				if (confirmados.length === 2) {
					let uData = await bot.data.get(message.author.id)
					let conjugeID = uData.conjuge
					let uConjuge = await bot.data.get(conjugeID)

					uConjuge.conjuge = null
					uConjuge.casamentoID = null
					uData.conjuge = null
					uData.casamentoID = null
					await bot.data.set(conjugeID, uConjuge)
					await bot.data.set(message.author.id, uData)

					// bot.casais.set(uData.casamentoID, uCasamento)

					msgDiv.edit({
						components: [],
						embeds: [newEmbedDiv]
					})
				}
			})

		}
		else if (b.customId === 'anel') {
			let uData = await bot.data.get(message.author.id)
			let cData = await bot.data.get(uData.conjuge.toString())
			let currTime = Date.now()

			if (uData.preso > currTime)
				return bot.msgPreso(message, uData)
			if (cData.preso > currTime)
				return bot.msgPreso(message, cData, cData.username)
			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData)
			if (cData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, cData, cData.username)
			if (await bot.isUserEmRouboOuEspancamento(message, uData))
				return
			if (await bot.isAlvoEmRouboOuEspancamento(message, cData))
				return
			if (await bot.isPlayerMorto(cData))
				return bot.msgPlayerMorto(message, cData.username)
			if (await bot.isPlayerViajando(cData))
				return bot.msgPlayerViajando(message, cData.username)
			if (await bot.isGaloEmRinha(message.author.id))
				return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
			if (await bot.isGaloEmRinha(uData.conjuge.toString()))
				return bot.createEmbed(message, `O galo de **${cData.username}** está em uma rinha e ele não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
			if (uData.job != null)
				return bot.msgTrabalhando(message, uData)
			if (cData.job != null)
				return bot.createEmbed(message, `**${cData.username}** está trabalhando e não pode fazer isto ${bot.config.trabalhando}`, null, bot.colors.casamento)
			if (uData.anel == null)
				return bot.createEmbed(message, `${emote} Você não possui um ${bot.aneis.prata.emote} Anel! Compre um para melhorar os benefícios do seu casamento!`, null, bot.colors.casamento)
			if (cData.anel == null || cData.anel !== uData.anel)
				return bot.createEmbed(message, `${emote} Seu parceiro não possui um ${bot.aneis.prata.emote} Anel igual ao seu! Vocês devem possuir o mesmo tipo de anel`, null, bot.colors.casamento)

			const embedAnel = new Discord.MessageEmbed()
				.setDescription(`${bot.aneis[uData.anel].emote} O primeiro passo para um casamento feliz é a inteligência financeira!`)
				.setColor(bot.colors.casamento)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()

			const row = new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('PRIMARY')
					.setLabel('Confirmar melhoria do anel 0/2')
					.setEmoji(bot.aneis[uData.anel].emote)
					.setCustomId('confirmaranel'))

			let msgAnel = await message.channel.send({
				embeds: [embedAnel],
				components: [row]
			}).catch(() => console.log("Não consegui enviar mensagem `casamento anel"))

			const filterAnel = (button) => 'confirmaranel' === button.customId && (button.user.id === message.author.id || button.user.id === uData.conjuge)

			const collector = msgAnel.createMessageComponentCollector({
				filter: filterAnel,
				time: 90000,
			})

			let confirmados = []

			collector.on('collect', async c => {
				await c.deferUpdate()

				uData = await bot.data.get(message.author.id)
				cData = await bot.data.get(c.user.id)
				let currTime = Date.now()

				if (uData.preso > currTime)
					return bot.msgPreso(message, uData)
				if (cData.preso > currTime)
					return bot.msgPreso(message, cData, cData.username)
				if (uData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, uData)
				if (cData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, cData, cData.username)
				if (await bot.isUserEmRouboOuEspancamento(message, uData))
					return
				if (await bot.isAlvoEmRouboOuEspancamento(message, cData))
					return
				if (await bot.isPlayerMorto(cData))
					return bot.msgPlayerMorto(message, cData.username)
				if (await bot.isPlayerViajando(cData))
					return bot.msgPlayerViajando(message, cData.username)
				if (await bot.isGaloEmRinha(message.author.id))
					return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
				if (await bot.isGaloEmRinha(uData.conjuge.toString()))
					return bot.createEmbed(message, `O galo de **${cData.username}** está em uma rinha e ele não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
				if (uData.job != null)
					return bot.msgTrabalhando(message, uData)
				if (cData.job != null)
					return bot.createEmbed(message, `**${cData.username}** está trabalhando e não pode fazer isto ${bot.config.trabalhando}`, null, bot.colors.casamento)
				if (uData.anel == null)
					return bot.createEmbed(message, `${emote} Você não possui um ${bot.aneis.prata.emote} Anel! Compre um para melhorar os benefícios do seu casamento!`, null, bot.colors.casamento)
				if (cData.anel == null || cData.anel !== uData.anel)
					return bot.createEmbed(message, `${emote} Seu parceiro não possui um ${bot.aneis.prata.emote} Anel igual ao seu! Vocês devem possuir o mesmo tipo de anel`, null, bot.colors.casamento)

				uCasamento = await bot.casais.get(uData.casamentoID?.toString())

				if (uCasamento.nivel <= 10)
					return bot.createEmbed(message, `💔 Vocês estão com nível de casamento muito baixo para melhorar o Anel!`, `Precisam estar acima do nível 10`, bot.colors.casamento)

				if (confirmados.includes(c.user.id))
					return

				confirmados.push(c.user.id)

				msgAnel.edit({
					components: [new Discord.MessageActionRow()
						.addComponents(new Discord.MessageButton()
							.setStyle('PRIMARY')
							.setLabel(`Confirmar melhoria do anel ${confirmados.length}/2`)
							.setEmoji(bot.aneis[uData.anel].emote)
							.setCustomId('confirmaranel'))
					]
				})

				const newEmbedAnel = new Discord.MessageEmbed()
					.setTitle(`${bot.aneis[uData.anel].emote} Anel melhorado!`)
					.setColor(bot.colors.casamento)
					.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
					.setTimestamp()

				if (confirmados.length === 2) {
					uCasamento = await bot.casais.get(uData.casamentoID?.toString())
					uData = await bot.data.get(message.author.id)
					cData = await bot.data.get(uData.conjuge.toString())

					if (uCasamento.anel === null)
						uCasamento.nivel = 75

					uCasamento.anel = uData.anel

					uData.anel = null
					cData.anel = null

					await bot.data.set(uData.conjuge.toString(), cData)
					await bot.data.set(message.author.id, uData)

					await bot.casais.set(uData.casamentoID.toString(), uCasamento)

					msgAnel.edit({
						components: [],
						embeds: [newEmbedAnel]
					})
				}
			})
		}
	})

	collector.on('end', async () => {
		if (msg)
			msg.edit({
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `casamento`"))
	})
}
exports.config = {
	alias: ['ksamento', 'ksal', 'casal', 'nós', 'nos', 'conjuge', 'cônjuge', 'namoro', 'relacao', 'relação', 'relacionamento']
}