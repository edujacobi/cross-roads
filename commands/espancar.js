function getPercent(percent, from) {
	return (from / 100) * percent
}

const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let membro = message.member.user
	let currTime = new Date().getTime()
	let option = args[0]
	let multiplicador_evento_tempo = 1
	let multiplicador_evento_espancado_tempo = 1
	let uData = await bot.data.get(message.author.id)
	let authorId = message.author.id
	let membroAvatar = membro.avatarURL()

	// if (message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, "Espancar desativado temporiamente.")

	// Quando alguém tentar te espancar, você pode 💪 **Brigar** ou 👟 **Correr**!
	
	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.espancar} Espancar`)
			.setThumbnail("https://cdn.discordapp.com/attachments/691019843159326757/820064474995621938/Espancar_20210312194139.png")
			.setColor(bot.colors.espancar)
			.setDescription(`Derrote seu nêmesis e mostre quem é que manda!
Quem perder a luta, ficará hospitalizado por um tempo determinado pela arma com maior defesa do jogador defensor.
Para conseguir espancar, o alvo deve estar ${bot.config.vadiando} **Vadiando**.

Você já espancou jogadores \`${uData.espancarW.toLocaleString().replace(/,/g, ".")}\` vezes e foi espancado \`${uData.espancarL.toLocaleString().replace(/,/g, ".")}\` vezes`)
			.addField("Comando", `\`;espancar [user]\``)
			.setFooter(uData.username, membro.avatarURL())
			.setTimestamp()

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `espancar`"))
	}

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)
	if (uData.espancar > currTime)
		return bot.createEmbed(message, `Você só poderá espancar novamente em ${bot.segToHour(Math.floor((uData.espancar - currTime) / 1000))} ${bot.config.espancar}`, null, bot.colors.espancar)
	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((uData.roubo - currTime) / 1000))} ${bot.config.police}`, null, bot.colors.policia)

	let granadaUsada = null

	if (args[0].toLowerCase() === 'granada' && uData.arma.granada.quant > 0) {
		args.shift()
		granadaUsada = true
	}

	else if (args[0].toLowerCase() === 'semgranada' && uData.arma.granada.quant > 0) {
		args.shift()
		granadaUsada = false
	}

	let {
		uData: targetD,
		alvo
	} = await bot.findUser(message, args)

	if (!targetD) return

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)
	if (uData.preso > currTime && targetD.preso < currTime)
		return bot.msgPreso(message, uData)
	if (targetD.classe == undefined)
		return bot.createEmbed(message, `**${targetD.username}** não está ativo na temporada e não pode ser espancado ${bot.config.espancar}`, null, bot.colors.espancar)
	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return
	if (await bot.isAlvoEmRouboOuEspancamento(message, targetD))
		return
	if (await bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.espancar)
	if (targetD.jobTime > currTime)
		return bot.createEmbed(message, `**${targetD.username}** está trabalhando. Você não conseguirá espancá-lo ${bot.config.trabalhando}`, null, bot.colors.espancar)
	if (targetD.preso > currTime && uData.preso < currTime)
		return bot.createEmbed(message, `**${targetD.username}** está preso. Você só conseguirá espancá-lo se estiver preso também ${bot.config.police}`, null, bot.colors.espancar)
	if (targetD.hospitalizado > currTime)
		return bot.createEmbed(message, `**${targetD.username}** está hospitalizado. Você não conseguirá espancá-lo ${bot.config.hospital}`, null, bot.colors.hospital)
	if (message.author.id === alvo)
		return bot.createEmbed(message, `Você não pode espancar você mesmo, imbecil ${bot.config.espancar}`, null, bot.colors.espancar)
	if (alvo === bot.config.adminID)
		return bot.createEmbed(message, `Quem em sã consciência espancaria o Jacobi? ${bot.config.espancar}`, null, bot.colors.espancar)
	if (alvo === '526203502318321665') // bot
		return bot.createEmbed(message, `01000100 01100101 01110011 01101001 01110011 01110100 01100001 <:CrossRoadsLogo:757021182020157571>`, null, bot.colors.espancar)
	if (uData.gangID != null && uData.gangID == targetD.gangID)
		return bot.createEmbed(message, `Você não pode espancar membros da sua gangue ${bot.config.espancar}`, null, bot.colors.espancar)
	if (uData.fugindo > currTime)
		return bot.createEmbed(message, `Você está tentando fugir da prisão e não pode tentar espancar ninguém ${bot.config.police}`, 'Foco!', bot.colors.espancar)
	if (targetD.fugindo > currTime)
		return bot.createEmbed(message, `**${targetD.username}** está tentando fugir da prisão. Aguarde um momento ${bot.config.police}`, 'Paciência!', bot.colors.espancar)
	if (alvo === uData.conjuge)
		return bot.createEmbed(message, `Você não pode espancar o seu cônjuge ${bot.config.espancar}`, null, bot.colors.espancar)
	if (await bot.isPlayerViajando(targetD))
		return bot.msgPlayerViajando(message, targetD, targetD.username)
	if (!targetD.lastCommandChannelId)
		return bot.createEmbed(message, `Você não pode espancar um jogador que ainda não usou um comando ${bot.config.espancar}`, null, bot.colors.espancar)

	let atkPower = 0
	let armaATK = ''
	let atkPowerDefensor = 0

	let hora = new Date().getHours()

	// ATK e arma do espancador
	Object.entries(uData.arma).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value.tempo > currTime && arma.atk > atkPower && (key == arma.data) && typeof (arma.atk) == "number") {
				atkPower = arma.atk
				armaATK = `${arma.skins[uData.arma[arma.data].skinAtual].emote} ${arma.desc}`
			}
		})
	})

	// ATK do espancado
	Object.entries(targetD.arma).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value.tempo > currTime && arma.atk > atkPowerDefensor && (key == arma.data) && typeof (arma.atk) == "number")
				atkPowerDefensor = arma.atk
		})
	})


	if (uData.arma.goggles.tempo > currTime && hora <= 4 && hora >= 20)
		atkPower += 3
	if (targetD.arma.goggles.tempo > currTime && hora <= 4 && hora >= 20)
		atkPowerDefensor += 3

	if (atkPowerDefensor - atkPower > 15) {
		bot.log(new Discord.MessageEmbed()
			.setDescription(`**${uData.username} tentou espancar ${targetD.username} utilizando ${armaATK}, mas ela não é forte o suficiente**`)
			.setColor(bot.colors.roubar))

		return bot.createEmbed(message, `Você não pode espancar este jogador usando esta arma ${bot.config.espancar}`, "Consiga uma arma melhor", bot.colors.espancar)
	}
	let escolhido = false

	if (uData.arma.granada.quant <= 0 || granadaUsada != null)
		return espancamento()

	let rowGranada = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SUCCESS')
			.setLabel('Utilizar')
			.setCustomId('aceitar'))
		.addComponents(new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel('Talvez depois')
			.setCustomId('negar'))

	let embedGranada = new Discord.MessageEmbed()
		.setDescription(`Você possui **${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} ${uData.arma.granada.quant} Granada**.\nDeseja utilizar uma neste roubo? Seu ATK aumentará em 5!`)
		.setColor(bot.colors.roubar)
		.setFooter({text: '60 segundos para responder', iconURL: message.author.avatarURL()})
		.setTimestamp()

	let msg = await message.channel.send({embeds: [embedGranada], components: [rowGranada]})
		.catch(() => console.log('Não consegui enviar mensagem roubar'))

	const filter = (button) => [
		'aceitar',
		'negar',
	].includes(button.customId) && button.user.id === message.author.id


	const collector = msg.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async b => {
		await b.deferUpdate()
		uData = await bot.data.get(message.author.id)
		targetD = await bot.data.get(alvo)
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isAlvoEmRouboOuEspancamento(message, targetD))
			return
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
		if (await bot.isGaloEmRinha(alvo))
			return bot.createEmbed(message, `${targetD.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)
		if (uData.fugindo > currTime)
			return bot.createEmbed(message, `Você está tentando fugir da prisão e não pode tentar espancar ninguém ${bot.config.police}`, 'Foco!', bot.colors.policia)
		escolhido = true

		if (b.customId === 'aceitar') { //aceitar
			atkPower += 5
			granadaUsada = true

			collector.stop()
		}

		collector.stop()

	})

	collector.on('end', async () => {
		msg.delete()
		if (escolhido == false)
			return
		uData = await bot.data.get(message.author.id)
		targetD = await bot.data.get(alvo)
		currTime = new Date().getTime()
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (await bot.isAlvoEmRouboOuEspancamento(message, targetD))
			return
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)
		if (targetD.jobTime > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está trabalhando. Você não conseguirá espancá-lo ${bot.config.trabalhando}`, null, bot.colors.espancar)
		if (targetD.preso > currTime && uData.preso < currTime)
			return bot.createEmbed(message, `**${targetD.username}** está preso. Você só conseguirá espancá-lo se estiver preso também ${bot.config.police}`, null, bot.colors.espancar)
		if (targetD.hospitalizado > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está hospitalizado. Você não conseguirá espancá-lo ${bot.config.hospital}`, null, bot.colors.hospital)
		if (targetD.fugindo > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está tentando fugir da prisão. Aguarde um momento ${bot.config.police}`, 'Paciência!', bot.colors.policia)
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
		if (await bot.isGaloEmRinha(alvo))
			return bot.createEmbed(message, `${targetD.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

		return espancamento()
	})


	async function espancamento() {
		uData = await bot.data.get(message.author.id)
		targetD = await bot.data.get(alvo)
		currTime = new Date().getTime()

		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (await bot.isAlvoEmRouboOuEspancamento(message, targetD))
			return
		if (targetD.jobTime > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está trabalhando. Você não conseguirá espancá-lo ${bot.config.trabalhando}`, null, bot.colors.espancar)
		if (targetD.preso > currTime && uData.preso < currTime)
			return bot.createEmbed(message, `**${targetD.username}** está preso. Você só conseguirá espancá-lo se estiver preso também ${bot.config.police}`, null, bot.colors.espancar)
		if (targetD.hospitalizado > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está hospitalizado. Você não conseguirá espancá-lo ${bot.config.hospital}`, null, bot.colors.hospital)
		if (targetD.fugindo > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está tentando fugir da prisão. Aguarde um momento ${bot.config.police}`, 'Paciência!', bot.colors.policia)
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.espancar)
		if (await bot.isGaloEmRinha(alvo))
			return bot.createEmbed(message, `${targetD.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.espancar)
		if (alvo == uData.conjuge)
			return bot.createEmbed(message, `Você não pode espancar o seu cônjuge ${bot.config.espancar}`, null, bot.colors.espancar)

		let tempoHospitalizado = (45 + atkPowerDefensor) * multiplicador_evento_espancado_tempo
		let tempoHospitalizadoAdicional = 5 + atkPowerDefensor * multiplicador_evento_espancado_tempo

		if (uData.classe === 'mendigo')
			atkPower *= 0.9
		else if (uData.classe === 'assassino')
			atkPower *= 1.1

		if (targetD.classe === 'mendigo')
			atkPowerDefensor *= 0.9
		else if (targetD.classe === 'assassino')
			atkPowerDefensor *= 1.1

		let emote = uData.classe ? bot.classes[uData.classe].emote : `<:Inventario:814663379536052244>`

		uData.emEspancamento = {
			tempo: currTime + 23000,
			user: alvo,
			isAlvo: false
		}

		targetD.emEspancamento = {
			tempo: currTime + 23000,
			user: message.author.id,
			isAlvo: true
		}
		await bot.data.set(message.author.id, uData)
		await bot.data.set(alvo, targetD)

		const embed_robb_inicio = new Discord.MessageEmbed()
			.setTitle(`${bot.config.espancar} Espancamento em andamento...`)
			.setColor(bot.colors.espancar)
			.setFooter(uData.username, membro.avatarURL())
			.setTimestamp()
		if (granadaUsada)
			embed_robb_inicio.setDescription(`**Utilizando ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} Granada**!`)

		const embed_robb_private = new Discord.MessageEmbed()
			.setAuthor(`Vou quebrar tua cara!`, membro.avatarURL())
			// .setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID + '.nome')}** ` : ""}está tentando lhe espancar utilizando **${armaATK}**${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}\nO que você deseja fazer?`)
			.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID + '.nome')}** ` : ""}está tentando lhe espancar utilizando **${armaATK}**${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}`)
			// .addField(`💪 Brigar`, `+5 ATK, mas quem apanhar ficará mais ${tempoHospitalizadoAdicional} minutos hospitalizado`, true)
			// .addField(`👟 Correr`, `-5 ATK, mas quem apanhar ficará menos ${tempoHospitalizadoAdicional} minutos hospitalizado, `, true)
			.setColor(bot.colors.espancar)
			// .setFooter("Você tem 60 segundos para responder")
			.setTimestamp()

		let rowReagir = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('💪')
				.setLabel('Brigar')
				.setCustomId('brigar'))
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('👟')
				.setLabel('Correr')
				.setCustomId('correr'))

		let message_robb = await message.channel.send({embeds: [embed_robb_inicio]})
			.catch(() => console.log(`Não consegui iniciar o espancamento de ${uData.username} (${message.author.id} em ${targetD.username} (${alvo})`))

		let embeds = {
			private: {
				brigar: new Discord.MessageEmbed()
					.setAuthor(`Vou quebrar tua cara!`, membro.avatarURL())
					.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID + '.nome')}** ` : ""}está tentando lhe espancar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}\nO que você deseja fazer?`)
					.addField(`💪 Brigar`, `Brigando...`)
					.setColor(bot.colors.espancar)
					.setFooter("Você tem 60 segundos para responder")
					.setTimestamp(),

				correr: new Discord.MessageEmbed()
					.setAuthor(`Vou quebrar tua cara!`, membro.avatarURL())
					.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID + '.nome')}** ` : ""}está tentando lhe espancar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}\nO que você deseja fazer?`)
					.addField(`👟 Correr`, `Correndo...`)
					.setColor(bot.colors.espancar)
					.setFooter("Você tem 60 segundos para responder")
					.setTimestamp(),
			},
			inicio: {
				brigar: new Discord.MessageEmbed()
					.setTitle(`${bot.config.espancar} Vou quebrar tua cara!`)
					.setDescription(`💪 ${targetD.username} quer brigar!`)
					.setColor(bot.colors.espancar)
					.setFooter(uData.username, membro.avatarURL())
					.setTimestamp(),

				correr: new Discord.MessageEmbed()
					.setTitle(`${bot.config.espancar} Vou quebrar tua cara!`)
					.setDescription(`👟 ${targetD.username} quer correr!`)
					.setColor(bot.colors.espancar)
					.setFooter(uData.username, membro.avatarURL())
					.setTimestamp(),
			},
			pv: {
				espancar: new Discord.MessageEmbed()
					.setTitle(`${bot.config.espancar} Você já pode espancar novamente!`)
					.setColor(bot.colors.espancar),

				heal: new Discord.MessageEmbed()
					.setTitle(`${bot.config.hospital} Você está curado!`)
					.setColor('RED')
			},
			erro: new Discord.MessageEmbed()
				.setTitle(`${bot.badges.cataBug} Ops, por algum motivo não consegui realizar seu espancamento. Tente novamente mais tarde.`)
				.setColor(bot.colors.espancar)
				.setFooter(uData.username, membro.avatarURL())
				.setTimestamp()
		}
		//canal da mensagem Você está roubando...
		const channelLadrao = await bot.channels.cache.get(uData.lastCommandChannelId)
		//mensagem Você está roubando...
		const messageRobb = await channelLadrao.messages.fetch(message_robb.id)

		await bot.shard.broadcastEval(async (bot, {
				channelId, embed, component, alvo,
				message_robb, atkPowerDefensor, tempoHospitalizado, tempoHospitalizadoAdicional,
				embeds, membroAvatar, currTime, multiplicador_evento_tempo,
				uData, authorId, granadaUsada,
				atkPower, messageId
			}) => {
				//canal da mensagem Você está sendo roubado
				const channel = await bot.channels.cache.get(channelId)
				if (!channel) return null

				let msg = await channel.send({
					content: `<@${alvo}>`, embeds: [embed]//, components: [component]
				})

				// setTimeout(() => {
				// 	if (msg)
				// 		msg.edit({components: []})
				// 			.catch(() => console.log("Não consegui editar mensagem `espancar`"))
				// }, 20000)

				// const filterEsp = (button) => button.user.id === alvo
				//
				// const collectorEsp = msg.createMessageComponentCollector({
				// 	filter: filterEsp,
				// 	time: 59000,
				// })
				//
				// collectorEsp.on('collect', async b => {
				// 	await b.deferUpdate()
				// 	let targetD = await bot.data.get(alvo)
				//
				// 	if (b.customId === 'brigar') {
				// 		collectorEsp.stop()
				//
				// 		msg.edit({embeds: [embeds.private.brigar]})
				// 			.catch(() => console.log("Não consegui editar mensagem `espancar`"))
				//
				// 		messageRobb.edit({embeds: [embeds.inicio.brigar]})
				// 			.catch(() => console.log("Não consegui editar mensagem `espancar`"))
				//
				// 		atkPowerDefensor += 5
				// 		tempoHospitalizado += tempoHospitalizadoAdicional
				//
				// 	}
				// 	else if (b.customId === 'correr') {
				// 		if (atkPowerDefensor == 0)
				// 			return msg.reply(`Você está fraco demais para correr! 👟`)
				//
				// 		collectorEsp.stop()
				//
				// 		msg.edit({embeds: [embeds.private.correr]})
				// 			.catch(() => console.log("Não consegui editar mensagem `espancar`"))
				//
				// 		messageRobb.edit({embeds: [embeds.inicio.correr]})
				// 			.catch(() => console.log("Não consegui editar mensagem `espancar`"))
				//
				// 		atkPowerDefensor -= 5
				// 		tempoHospitalizado -= tempoHospitalizadoAdicional
				// 	}
				// })
				//
				// collectorEsp.on('end', () => {
				// 	if (msg) msg.edit({components: []})
				// 		.catch(() => console.log("Não consegui editar mensagem `espancar`"))
				//
				// })
				//
				// 
				//
				// return
			},
			{
				context: {
					channelId: targetD.lastCommandChannelId,
					embed: embed_robb_private,
					component: rowReagir,
					alvo,
					message_robb,
					atkPowerDefensor,
					tempoHospitalizado,
					tempoHospitalizadoAdicional,
					embeds,
					membroAvatar: membro.avatarURL(),
					currTime,
					multiplicador_evento_tempo,
					uData,
					authorId: message.author.id,
					granadaUsada,
					atkPower,
					messageId: message.id,
				}
			})

		setTimeout(async () => {
			uData = await bot.data.get(authorId)
			let targetD = await bot.data.get(alvo)

			if (granadaUsada)
				uData.arma.granada.quant -= 1

			let randomDesafiante = bot.getRandom(1, 100)
			let randomDesafiado = bot.getRandom(1, 100)

			let desafianteVencedor = (randomDesafiante * atkPower) > (randomDesafiado * atkPowerDefensor)

			// atkPower -= getPercent(defPower, atkPower)
			if (desafianteVencedor) {
				// bot.createEmbed(message, `Você espancou **${targetD.username}** e ele ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`, null, bot.colors.espancar)
				let surras = ['espancou', 'surrou', 'socou com muita força', 'chutou as bolas de', 'trucidou', 'acabou com a raça de', 'mostrou quem é que manda para', 'escadeirou', 'arrochou', 'marretou', 'moeu a pau']
				bot.shuffle(surras)
				let textoSurra = surras[0]

				const embed_espancar_final = {
					description: `Você ${textoSurra} **${targetD.username}** e ele ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`,
					color: bot.colors.espancar,
					footer: {
						text: uData.username,
						icon_url: membroAvatar
					},
					timestamp: new Date(),
				}

				messageRobb.edit({embeds: [embed_espancar_final]})
					.catch(() => console.log("Não consegui editar mensagem `espancar`"))

				let surrado = ['espancado', 'surrado', 'socado com muita força', 'chutado nas bolas', 'trucidado', 'acabado', 'escadeirado', 'arrochado', 'marretado', 'moído a pau']
				bot.shuffle(surrado)
				let textoSurrado = surrado[0]

				bot.users.fetch(alvo).then(async user => {
					user.send(`Você foi ${textoSurrado} pelo **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID + '.nome')}** ` : ""}e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`)
						.catch(() => console.log(`Não consegui mandar mensagem privada para ${targetD.username} (${alvo})`))
				})

				targetD.qtHospitalizado += 1
				targetD.hospitalizado = currTime + tempoHospitalizado * 60 * 1000
				targetD.espancarL++
				uData.espancarW++
				uData.roubo = currTime + 1800000 * multiplicador_evento_tempo
				uData.espancar = currTime + 3000000 * multiplicador_evento_tempo

				setTimeout(() => {
					bot.users.fetch(authorId).then(user => {
						user.send({embeds: [embeds.pv.espancar]})
							.catch(() => message.reply(`você já pode espancar novamente! ${bot.config.espancar}`)
								.catch(async () => `Não consegui responder ${uData.username} nem no PV nem no canal. \`Espancar\``))
					})
				}, uData.espancar - currTime)

				setTimeout(() => {
					bot.users.fetch(alvo).then(user => {
						user.send({embeds: [embeds.pv.heal]})
							.catch(() => console.log(`Não consegui mandar mensagem privada para ${targetD.username} (${alvo})`))

					})
				}, targetD.hospitalizado - currTime)

				await bot.data.set(alvo, targetD)
				await bot.data.set(authorId, uData)

				return bot.log(message, {
					description: `**${uData.username} espancou ${targetD.username}**`,
					color: bot.colors.espancar,
					fields: [
						{
							name: 'Tempo',
							value: bot.segToHour(tempoHospitalizado * 60),
							inline: true,
						},
						{
							name: 'Chance',
							value: `${randomDesafiante}(desafiante) > ${randomDesafiado}(desafiado)`,
							inline: true,
						},
					]
				})

			}
			else {
				// bot.createEmbed(message, `Você até tentou, mas apanhou e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`, null, bot.colors.hospital)

				let surrado = ['espancado', 'surrado', 'socado com muita força', 'chutado nas bolas', 'trucidado', 'acabado', 'escadeirado', 'arrochado', 'marretado', 'moído a pau']
				bot.shuffle(surrado)
				let textoSurrado = surrado[0]

				const embed_espancar_final = {
					description: `Você até tentou, mas foi ${textoSurrado} e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`,
					color: bot.colors.espancar,
					footer: {
						text: uData.username,
						icon_url: membroAvatar
					},
					timestamp: new Date(),
				}

				messageRobb.edit({embeds: [embed_espancar_final]})
					.catch(() => console.log("Não consegui editar mensagem `espancar`"))

				uData.espancar = currTime + 3000000 * multiplicador_evento_tempo
				uData.roubo = currTime + 1800000 * multiplicador_evento_tempo
				uData.hospitalizado = currTime + tempoHospitalizado * 60 * 1000
				uData.qtHospitalizado += 1
				uData.espancarL++
				targetD.espancarW++

				let surras = ['apanhou', 'foi surrado', 'foi socado com muita força', 'foi chutado nas bolas', 'foi trucidado', 'você acabou com a raça dele', 'você mostrou quem é que manda', 'foi escadeirado', 'foi arrochado', 'você o marretou', 'foi moído a pau']
				bot.shuffle(surras)
				let textoSurra = surras[0]

				bot.users.fetch(alvo).then(async user => {
					user.send(`**${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID + '.nome')}** ` : ""}tentou lhe espancar, mas ${textoSurra} e ele ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`)
						.catch(() => console.log(`Não consegui mandar mensagem privada para ${targetD.username} (${alvo})`))
				})

				setTimeout(() => {
					bot.users.fetch(authorId).then(user => {
						user.send({embeds: [embeds.pv.heal]})
							.catch(() => message.reply(`Você está curado! ${bot.config.hospital}`)
								.catch(async () => `Não consegui responder ${await bot.data.get(authorId + ".username")} nem no PV nem no canal. \`Espancar\``))

					})
				}, uData.hospitalizado - currTime)

				await bot.data.set(alvo, targetD)
				await bot.data.set(authorId, uData)

				return bot.log(message, {
					description: `**${uData.username} falhou em espancar ${targetD.username} e apanhou**`,
					color: bot.colors.espancar,
					fields: [
						{
							name: 'Tempo',
							value: bot.segToHour(tempoHospitalizado * 60),
							inline: true,
						},
						{
							name: 'Chance',
							value: `${randomDesafiante}(desafiante) > ${randomDesafiado}(desafiado)`,
							inline: true,
						},
					]
				})
			}
		}, 22000)

	}
}

exports.config = {
	alias: ['socar', 'bater', 'esp', 'chutar', 'surrar', 'arrochar', 'moerapau']
}