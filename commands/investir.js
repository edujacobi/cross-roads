const Discord = require("discord.js")
exports.run = async (bot, message, args) => {

	// if (!bot.isAdmin(message.author.id) && !bot.isMod(message.author.id))
	// 	return bot.createEmbed(message, `${bot.config.propertyG} Comando em manutenção.`)

	let uData = bot.data.get(message.author.id)

	const semana = 604800000 // 7 dias
	const hora = 3600000 // 1h
	let currTime = new Date().getTime()
	const desconto = 1 // 1 = 0%, 0.7 = 30%

	if (uData.invest == null || args[0] === 'outros') {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.propertyG} Investimentos`)
			.setDescription("Você receberá lucros a cada hora. Cada investimento dura 7 dias.\nPossuir um investimento aumenta seu prestígio social, permitindo receber maiores quantias no `;daily`, `;weekly` e multiplicadores maiores no `;niquel`.")
			.setThumbnail("https://cdn.discordapp.com/attachments/719677144133009478/734264171511676969/radar_propertyG.png")
			.setColor('GREEN')
			.setFooter({
				text: `${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
				iconURL: message.member.user.avatarURL()
			})
			.setTimestamp()

		let investimentos = []

		Object.values(bot.investimentos).forEach(investimento => {
			let preço = uData.classe === 'mafioso' ? investimento.preço : (investimento.preço + investimento.preço * bot.imposto)
			let lucro = investimento.lucro
			if (uData.classe === 'mafioso')
				lucro = Math.floor(investimento.lucro * 0.9)
			if (uData.classe === 'empresario')
				lucro = Math.floor(investimento.lucro * 1.05)

			investimentos.push({
				label: investimento.desc,
				description: `R$ ${preço.toLocaleString().replace(/,/g, ".")} • Lucro/h: R$ ${lucro.toLocaleString().replace(/,/g, ".")}`,
				value: investimento.id.toString(),
			})
		})

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageSelectMenu()
				.setCustomId(message.id + message.author.id + 'select')
				.setPlaceholder('Selecione o investimento')
				.addOptions(investimentos))

		let msg = await message.channel.send({embeds: [embed], components: [row]})
			.catch(() => console.log("Não consegui enviar mensagem `investimentos`"))

		const filter = (select) => [
			message.id + message.author.id + 'select',
		].includes(select.customId) && select.user.id === message.author.id

		const collector = message.channel.createMessageComponentCollector({
			filter,
			time: 90000,
		})

		collector.on('collect', async s => {
			await s.deferUpdate()

			uData = bot.data.get(message.author.id)

			if (uData.invest != null) return

			let investimentoSelecionado = null

			msg.edit({components: []})
				.catch(() => console.log("Não consegui editar mensagem `investir`"))

			Object.entries(bot.investimentos).forEach(([key, investimento]) => {
				if (parseInt(s.values[0]) === investimento.id) {
					investimentoSelecionado = {
						valorPago: uData.classe === 'mafioso' ? investimento.preço : (investimento.preço + investimento.preço * bot.imposto),
						preço: investimento.preço,
						key: key,
						desc: investimento.desc,
						img: investimento.img
					}
				}
			})

			const embedComprar = new Discord.MessageEmbed()
				.setTitle(`${bot.config.propertyG} Deseja realmente comprar o investimento ${investimentoSelecionado.desc}?`)
				.setColor('GREEN')

			const rowComprar = new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('SUCCESS')
					.setLabel('Comprar')
					// .setEmoji(bot.config.propertyR)
					.setCustomId(message.id + message.author.id + 'comprar'))

			let msgComprar = await message.channel.send({embeds: [embedComprar], components: [rowComprar]})
				.catch(() => console.log("Não consegui enviar mensagem `investir comprar"))

			const filterComprar = (button) => message.id + message.author.id + 'comprar' === button.customId && button.user.id === message.author.id

			const collectorComprar = message.channel.createMessageComponentCollector({
				filter: filterComprar,
				time: 90000,
				max: 1
			})

			collectorComprar.on('collect', async c => {
				await c.deferUpdate()

				uData = bot.data.get(message.author.id)

				if (uData.preso > currTime)
					return bot.msgPreso(message, uData)
				if (uData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, uData)
				if (bot.isUserEmRouboOuEspancamento(message, uData))
					return
				if (bot.isPlayerViajando(uData))
					return bot.msgPlayerViajando(message, uData)
				if (bot.isGaloEmRinha(message.author.id))
					return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
				if (uData.invest != null)
					return bot.createEmbed(message, `Você só pode ter um investimento por vez ${bot.config.propertyG}`, null, 'GREEN')

				if (uData.moni < investimentoSelecionado.valorPago)
					return bot.msgSemDinheiro(message)


				if (currTime > (uData.investTime + semana) || !uData.investTime) {
					uData.invest = investimentoSelecionado.key
					uData.investTime = currTime
					uData.investLast = currTime
					uData.lojaGastos += investimentoSelecionado.valorPago * desconto
					uData.moni -= investimentoSelecionado.valorPago * desconto

					if (uData.classe !== 'mafioso')
						bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(investimentoSelecionado.preço * bot.imposto))

					const embed = new Discord.MessageEmbed()
						.setDescription(`${bot.config.propertyG} Você adquiriu o investimento **${investimentoSelecionado.desc}!**`)
						.setColor('GREEN')
						.setImage(investimentoSelecionado.img)
						.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
						.setTimestamp()

					bot.data.set(message.author.id, uData)

					msgComprar.edit({embeds: [embed], components: []})
						.catch(() => console.log("Não consegui editar mensagem `investir`"))

					return bot.log(message, new Discord.MessageEmbed()
						.setDescription(`${bot.config.propertyG} **${uData.username} adquiriu o investimento ${investimentoSelecionado.desc}**`)
						.setColor('GREEN'))
				}

			})
			collectorComprar.on('end', async () => {
				msgComprar.edit({components: []})
					.catch(() => console.log("Não consegui editar mensagem `investir`"))
			})
		})

		collector.on('end', async () => {
			msg.edit({components: []})
				.catch(() => console.log("Não consegui editar mensagem `investir`"))
		})
	}
	else {
		let horasPassadas = 1
		let uptime = bot.uptime

		while (uptime > 3600000) {
			horasPassadas++
			uptime -= 3600000
		}

		let proxDeposito = 60 * 60 * horasPassadas - ((bot.uptime) / 1000)

		let horas = uData.investTime + semana > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
		let praSacar = Math.round((horas / hora) * bot.investimentos[uData.invest].lucro)

		if (uData.classe === 'mafioso') praSacar = Math.round(praSacar * 0.9)

		if (uData.classe === 'empresario') praSacar = Math.round(praSacar * 1.05)

		let preco = uData.classe === 'mafioso' ? bot.investimentos[uData.invest].preço : (bot.investimentos[uData.invest].preço + bot.investimentos[uData.invest].preço * bot.imposto)

		function getRow(uData) {

			return new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel(uData.investNotification ? 'Desativar notificações' : 'Ativar notificações')
					.setEmoji(uData.investNotification ? '🔕' : '🔔')
					.setCustomId(message.id + message.author.id + 'notificar'))

				.addComponents(new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Ver outros')
					.setEmoji(bot.config.propertyG)
					.setCustomId(message.id + message.author.id + 'outros'))

				.addComponents(new Discord.MessageButton()
					.setStyle('DANGER')
					.setLabel('Parar')
					// .setEmoji(bot.config.propertyR)
					.setCustomId(message.id + message.author.id + 'parar'))

				.addComponents(new Discord.MessageButton()
					.setStyle('SUCCESS')
					.setLabel('Reinvestir')
					// .setEmoji(bot.config.propertyR)
					.setDisabled(preco + praSacar > uData.moni)
					.setCustomId(message.id + message.author.id + 'reinvestir'))
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.propertyG} ${bot.investimentos[uData.invest].desc}`)
			// .setDescription(`Próximo depósito de R$ ${lucro.toLocaleString().replace(/,/g, ".")} em ${bot.segToHour(proxDeposito)}`)
			.setDescription(`Valor acumulado: R$ ${praSacar.toLocaleString().replace(/,/g, ".")}\nPróximo depósito em ${bot.segToHour(proxDeposito)}`)
			// .setThumbnail("https://cdn.discordapp.com/attachments/719677144133009478/734264171511676969/radar_propertyG.png")
			.setColor('GREEN')
			.addField(`Comprado em`, new Date(uData.investTime).toLocaleString("pt-BR").replace(/-/g, "/"), true)
			.addField(`Tempo restante`, bot.segToHour((uData.investTime + semana - currTime) / 1000), true)
			.addField(`Multiplicadores`, `Daily e weekly: ${bot.investimentos[uData.invest].id}x\nMáquina caça-níquel: ${bot.investimentos[uData.invest].id * 5}x`)
			.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
			.setImage(bot.investimentos[uData.invest].img)
			.setTimestamp()

		if (uData.preso > currTime) {
			embed.setDescription(`${bot.config.police} Você está preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)} e só receberá lucros quando estiver solto`)
		}
		if (uData.hospitalizado > currTime) {
			embed.setDescription(`${bot.config.hospital} Você está hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)} e só receberá lucros quando estiver curado`)
		}
		// if (bot.isPlayerMorto(uData))
		// 	embed.setDescription(`🪦 Você está morto por mais ${bot.segToHour((currTime - uData.morto)/1000)} e não receberá lucros`)
		// if (bot.isPlayerViajando(uData))
		// 	embed.setDescription(`${bot.config.aviao} Você está viajando e só receberá lucros quando retornar`)

		if ((uData.investTime + semana) < currTime) {
			embed.setTitle(`${bot.config.propertyR} ${bot.investimentos[uData.invest].desc}`)
				.setColor('RED')
				.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/854848920010489856/radar_propertyR.png")
		}
		let msg = await message.channel.send({embeds: [embed], components: [getRow(uData)]})
			.catch(() => console.log("Não consegui enviar mensagem `investir`"))

		const filter = (button) => [
			message.id + message.author.id + 'notificar',
			message.id + message.author.id + 'parar',
			message.id + message.author.id + 'reinvestir',
			message.id + message.author.id + 'outros',
		].includes(button.customId) && button.user.id === message.author.id

		const collector = message.channel.createMessageComponentCollector({
			filter,
			time: 90000,
		})

		collector.on('collect', async b => {
			await b.deferUpdate()

			if (b.customId === message.id + message.author.id + 'notificar') {
				if (uData.invest == null)
					return bot.createEmbed(message, `Você não possui um investimento para receber notificações ${bot.config.propertyG}`, null, 'GREEN')

				uData.investNotification = !uData.investNotification

				bot.data.set(message.author.id, uData)

				// bot.createEmbed(message, `Você ${uData.investNotification ? `receberá` : `não receberá mais`} notificações do investimento ${bot.config.propertyG}`, null, 'GREEN')
				return msg.edit({embeds: [embed], components: [getRow(uData)]})

			}
			else if (b.customId === message.id + message.author.id + 'parar') {
				uData = bot.data.get(message.author.id)
				let horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
				let praSacar = Math.round(((horas / 3600000) * bot.investimentos[uData.invest].lucro))

				const embed2 = new Discord.MessageEmbed()
					.setTitle(`${bot.config.propertyR} Deseja realmente parar o investimento ${bot.investimentos[uData.invest].desc}?`)
					.setDescription(`Você receberá R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele.`)
					.setColor('RED')

				const row2 = new Discord.MessageActionRow()
					.addComponents(new Discord.MessageButton()
						.setStyle('DANGER')
						.setLabel('Parar')
						// .setEmoji(bot.config.propertyR)
						.setCustomId(message.id + message.author.id + 'confirmarparar'))

				let msg2 = await message.channel.send({embeds: [embed2], components: [row2]})
					.catch(() => console.log("Não consegui enviar mensagem `investir parar"))

				const filterParar = (button) => message.id + message.author.id + 'confirmarparar' === button.customId && button.user.id === message.author.id

				const collector2 = message.channel.createMessageComponentCollector({
					filter: filterParar,
					time: 90000,
				})

				collector2.on('collect', async c => {
					await c.deferUpdate()

					uData = bot.data.get(message.author.id)
					currTime = Date.now()

					if (uData.preso > currTime)
						return bot.msgPreso(message, uData)
					if (uData.hospitalizado > currTime)
						return bot.msgHospitalizado(message, uData)
					if (bot.isUserEmRouboOuEspancamento(message, uData))
						return
					if (bot.isGaloEmRinha(message.author.id))
						return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
					if (uData.invest == null)
						return bot.createEmbed(message, `Você não pode parar um investimento se você não possui um ${bot.config.propertyG}`, null, 'GREEN')
					if (bot.isPlayerViajando(uData))
						return bot.msgPlayerViajando(message, uData)

					let horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
					let praSacar = Math.round(((horas / 3600000) * bot.investimentos[uData.invest].lucro))

					bot.createEmbed(message, `Você parou o investimento **${bot.investimentos[uData.invest].desc}** e recebeu R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele ${bot.config.propertyR}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'RED')

					bot.log(message, new Discord.MessageEmbed()
						.setDescription(`${bot.config.propertyR} **${uData.username} parou o investimento ${bot.investimentos[uData.invest].desc} e recebeu R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele**`)
						.setColor('GREEN'))

					uData.moni += praSacar
					uData.investGanhos += praSacar
					uData.investLast = 0
					uData.invest = null
					uData.investTime = 0

					msg.edit({components: []})
						.catch(() => console.log("Não consegui editar mensagem `investir`"))
					msg2.edit({components: []})
						.catch(() => console.log("Não consegui editar mensagem `investir`"))

					return bot.data.set(message.author.id, uData)
				})

				collector2.on('end', () => {
					msg2.edit({
						components: []
					}).catch(() => console.log("Não consegui editar mensagem `investir`"))
				})
			}
			else if (b.customId === message.id + message.author.id + 'reinvestir') {
				uData = bot.data.get(message.author.id)
				let horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
				let praSacar = Math.round(((horas / 3600000) * bot.investimentos[uData.invest].lucro))
				let preco = uData.classe === 'mafioso' ? bot.investimentos[uData.invest].preço : (bot.investimentos[uData.invest].preço + bot.investimentos[uData.invest].preço * bot.imposto)

				const embed3 = new Discord.MessageEmbed()
					.setTitle(`${bot.config.propertyG} Deseja realmente reinvestir o investimento ${bot.investimentos[uData.invest].desc}?`)
					.setDescription(`Você receberá R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele.\nO preço de compra dele é de R$ ${preco.toLocaleString().replace(/,/g, ".")}`)
					.setColor('GREEN')
					.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())

				const row3 = new Discord.MessageActionRow()
					.addComponents(new Discord.MessageButton()
						.setStyle('SUCCESS')
						.setLabel('Reinvestir')
						// .setEmoji(bot.config.propertyR)
						.setCustomId(message.id + message.author.id + 'confirmarreinvestir'))

				let msg3 = await message.channel.send({embeds: [embed3], components: [row3]})
					.catch(() => console.log("Não consegui enviar mensagem `investir reinvestir"))

				const filterReinvestir = (button) => message.id + message.author.id + 'confirmarreinvestir' === button.customId && button.user.id === message.author.id

				const collector3 = message.channel.createMessageComponentCollector({
					filter: filterReinvestir,
					time: 90000,
				})

				collector3.on('collect', async c => {
					await c.deferUpdate()

					uData = bot.data.get(message.author.id)
					currTime = Date.now()

					if (uData.preso > currTime)
						return bot.msgPreso(message, uData)
					if (uData.hospitalizado > currTime)
						return bot.msgHospitalizado(message, uData)
					if (bot.isUserEmRouboOuEspancamento(message, uData))
						return
					if (bot.isGaloEmRinha(message.author.id))
						return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
					if (uData.invest == null)
						return bot.createEmbed(message, `Você não pode parar um investimento se você não possui um ${bot.config.propertyG}`, null, 'GREEN')
					if (bot.isPlayerViajando(uData))
						return bot.msgPlayerViajando(message, uData)

					let horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
					let praSacar = Math.round(((horas / 3600000) * bot.investimentos[uData.invest].lucro))

					uData.moni += praSacar

					if (uData.moni < preco)
						return bot.msgSemDinheiro(message)

					uData.investGanhos += praSacar
					uData.investLast = currTime
					uData.investTime = currTime
					uData.lojaGastos += preco * desconto
					uData.moni -= preco * desconto

					if (uData.classe !== 'mafioso')
						bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(bot.investimentos[uData.invest].preço * bot.imposto))

					const embed = new Discord.MessageEmbed()
						.setDescription(`${bot.config.propertyG} Você readquiriu o investimento **${bot.investimentos[uData.invest].desc}!**`)
						.setColor('GREEN')
						.setImage(bot.investimentos[uData.invest].img)
						.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
						.setTimestamp()

					bot.data.set(message.author.id, uData)

					msg.edit({components: []})
						.catch(() => console.log("Não consegui editar mensagem `investir`"))
					msg3.edit({embeds: [embed], components: []})
						.catch(() => console.log("Não consegui editar mensagem `investir`"))

					return bot.log(message, new Discord.MessageEmbed()
						.setDescription(`${bot.config.propertyG} **${uData.username} readquiriu o investimento ${bot.investimentos[uData.invest].desc}**`)
						.setColor('GREEN'))
				})

				collector3.on('end', () => {
					msg3.edit({components: []})
						.catch(() => console.log("Não consegui editar mensagem `investir`"))
				})
			}
			else if (b.customId === message.id + message.author.id + 'outros') {
				msg.edit({components: []})
					.catch(() => console.log("Não consegui enviar mensagem `investir outros`"))

				bot.commands.get('investir').run(bot, message, ['outros'])
			}
		})

		collector.on('end', () => {
			msg.edit({components: []})
				.catch(() => console.log("Não consegui editar mensagem `investir`"))
		})

	}
}

exports.config = {
	alias: ['investimentos', 'invest', 'investimento', 'invests', 'investments', 'locais', 'negócio', 'negocio', 'empresa', 'empreendimento', 'in', 'local']
}