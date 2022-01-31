function getPercent(percent, from) {
	return (from / 100) * percent
}

const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let option = args[0]
	let multiplicador_evento_tempo = 1
	let multiplicador_evento_espancado_tempo = 1
	let uData = bot.data.get(message.author.id)

	let membro = message.member.user

	// if (message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, "Espancar desativado temporiamente.")

	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.espancar} Espancar`)
			.setThumbnail("https://cdn.discordapp.com/attachments/691019843159326757/820064474995621938/Espancar_20210312194139.png")
			.setColor(bot.colors.espancar)
			.setDescription(`Derrote seu nêmesis e mostre quem é que manda!
Quem perder a luta, ficará hospitalizado por um tempo determinado pela arma com maior defesa do jogador defensor.
Para conseguir espancar, o alvo deve estar ${bot.config.vadiando} **Vadiando**.

Quando alguém tentar te espancar, você pode 💪 **Brigar** ou 👟 **Correr**!

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

	let targetMention = message.mentions.members.first()
	let targetNoMention = []

	if (!targetNoMention[0] && args[0] && !targetMention) { // para ver inventário sem pingar (funciona para outros servidores)

		let name = args.join(" ").toLowerCase()

		bot.data.forEach((item, id) => {
			if (bot.data.has(id, "username") && item.username.toLowerCase() == name) // verifica se o usuário é um jogador
				targetNoMention.push(id)

			else if (id.toString() == name) {
				targetNoMention.push(id)
			}
		})

		if (!targetNoMention[0])
			return bot.createEmbed(message, `${bot.config.espancar} Usuário não encontrado`, null, bot.colors.espancar)

	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else
		alvo = targetMention ? targetMention.id : message.author.id

	if (!targetMention && !targetNoMention[0])
		return bot.createEmbed(message, `Você deve inserir um usuário a ser espancado ${bot.config.espancar}`, null, bot.colors.espancar)

	let targetD = bot.data.get(alvo)
	if (!targetD)
		return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.espancar}`, null, bot.colors.espancar)

	bot.users.fetch(alvo).then(user => alvo = user.id)

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)
	if (uData.preso > currTime && targetD.preso < currTime)
		return bot.msgPreso(message, uData)
	// if (targetD.classe == undefined)
	// 	return bot.createEmbed(message, `**${targetD.username}** não está ativo na temporada e não pode ser espancado ${bot.config.espancar}`, null, bot.colors.espancar)
	if (bot.isUserEmRouboOuEspancamento(message, uData))
		return
	if (bot.isAlvoEmRouboOuEspancamento(message, targetD))
		return
	if (bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.espancar)
	if (targetD.jobTime > currTime)
		return bot.createEmbed(message, `**${targetD.username}** está trabalhando. Você não conseguirá espancá-lo ${bot.config.bulldozer}`, null, bot.colors.espancar)
	if (targetD.preso > currTime && uData.preso < currTime)
		return bot.createEmbed(message, `**${targetD.username}** está preso. Você só conseguirá espancá-lo se estiver preso também ${bot.config.police}`, null, bot.colors.espancar)
	if (targetD.hospitalizado > currTime)
		return bot.createEmbed(message, `**${targetD.username}** está hospitalizado. Você não conseguirá espancá-lo ${bot.config.hospital}`, null, bot.colors.hospital)
	// if (message.author.id == alvo)
	// 	return bot.createEmbed(message, `Você não pode espancar você mesmo, imbecil ${bot.config.espancar}`, null, bot.colors.espancar)
	// if (alvo == bot.config.adminID)
	// 	return bot.createEmbed(message, `Quem em sã consciência espancaria o Jacobi? ${bot.config.espancar}`, null, bot.colors.espancar)
	if (alvo == '526203502318321665') // bot
		return bot.createEmbed(message, `01000100 01100101 01110011 01101001 01110011 01110100 01100001 <:CrossRoadsLogo:757021182020157571>`, null, bot.colors.espancar)
	if (uData.gangID != null && uData.gangID == targetD.gangID)
		return bot.createEmbed(message, `Você não pode espancar membros da sua gangue ${bot.config.espancar}`, null, bot.colors.espancar)
	if (uData.fugindo > currTime)
		return bot.createEmbed(message, `Você está tentando fugir da prisão e não pode tentar espancar ninguém ${bot.config.police}`, 'Foco!', bot.colors.espancar)
	if (targetD.fugindo > currTime)
		return bot.createEmbed(message, `**${targetD.username}** está tentando fugir da prisão. Aguarde um momento ${bot.config.police}`, 'Paciência!', bot.colors.espancar)
	if (alvo == uData.conjuge)
		return bot.createEmbed(message, `Você não pode espancar o seu cônjuge ${bot.config.espancar}`, null, bot.colors.espancar)
	if (bot.isPlayerViajando(targetD))
		return bot.msgPlayerViajando(message, targetD, targetD.username)

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

	if (atkPowerDefensor - atkPower > 15)
		return bot.createEmbed(message, `Você não pode espancar este jogador ${bot.config.espancar}`, "Consiga uma arma melhor", bot.colors.espancar)

	let escolhido = false

	if (uData.arma.granada.quant <= 0 || granadaUsada != null)
		return espancamento()

	let aceitar = '572134588340633611'
	let negar = '572134589863034884'

	bot.createEmbed(message, `Você possui **${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} ${uData.arma.granada.quant} Granada**.\nDeseja utilizar uma neste espancamento? Seu ATK aumentará em 5!`, `60 segundos para responder`, bot.colors.espancar)
		.then(msg => {
			msg.react(aceitar) // aceitar
				.then(() => msg.react(negar)) // negar
				.catch(() => console.log("Não consegui reagir mensagem `espancar`"))

			const filter = (reaction, user) => [aceitar, negar].includes(reaction.emoji.id) && user.id == message.author.id

			const collector = msg.createReactionCollector({
				filter,
				time: 90000,
				errors: ['time']
			})

			collector.on('collect', r => {
				if (msg) msg.reactions.removeAll().then(async () => {
					uData = bot.data.get(message.author.id)
					targetD = bot.data.get(alvo)
					if (bot.isUserEmRouboOuEspancamento(message, uData))
						return
					if (bot.isAlvoEmRouboOuEspancamento(message, targetD))
						return
					if (uData.job != null)
						return bot.msgTrabalhando(message, uData)
					if (bot.isGaloEmRinha(message.author.id))
						return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
					if (bot.isGaloEmRinha(alvo))
						return bot.createEmbed(message, `${targetD.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)
					if (uData.fugindo > currTime)
						return bot.createEmbed(message, `Você está tentando fugir da prisão e não pode tentar espancar ninguém ${bot.config.police}`, 'Foco!', bot.colors.policia)
					escolhido = true

					if (r.emoji.id === aceitar) { //aceitar
						atkPower += 5
						granadaUsada = true

						collector.stop()

					}

					collector.stop()

				}).catch(() => console.log("Não consegui remover as reações mensagem `espancar`"))
			})

			collector.on('end', () => {
				msg.delete()
				if (escolhido == false)
					return
				uData = bot.data.get(message.author.id)
				targetD = bot.data.get(alvo)
				currTime = new Date().getTime()
				if (bot.isUserEmRouboOuEspancamento(message, uData))
					return
				if (uData.hospitalizado > currTime)
					return bot.msgHospitalizado(message, uData)
				if (bot.isAlvoEmRouboOuEspancamento(message, targetD))
					return
				if (uData.job != null)
					return bot.msgTrabalhando(message, uData)
				if (targetD.jobTime > currTime)
					return bot.createEmbed(message, `**${targetD.username}** está trabalhando. Você não conseguirá espancá-lo ${bot.config.bulldozer}`, null, bot.colors.espancar)
				if (targetD.preso > currTime && uData.preso < currTime)
					return bot.createEmbed(message, `**${targetD.username}** está preso. Você só conseguirá espancá-lo se estiver preso também ${bot.config.police}`, null, bot.colors.espancar)
				if (targetD.hospitalizado > currTime)
					return bot.createEmbed(message, `**${targetD.username}** está hospitalizado. Você não conseguirá espancá-lo ${bot.config.hospital}`, null, bot.colors.hospital)
				if (targetD.fugindo > currTime)
					return bot.createEmbed(message, `**${targetD.username}** está tentando fugir da prisão. Aguarde um momento ${bot.config.police}`, 'Paciência!', bot.colors.policia)
				if (bot.isGaloEmRinha(message.author.id))
					return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
				if (bot.isGaloEmRinha(alvo))
					return bot.createEmbed(message, `${targetD.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

				return espancamento()
			})
		})

	async function espancamento() {
		uData = bot.data.get(message.author.id)
		targetD = bot.data.get(alvo)
		currTime = new Date().getTime()

		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (bot.isAlvoEmRouboOuEspancamento(message, targetD))
			return
		if (targetD.jobTime > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está trabalhando. Você não conseguirá espancá-lo ${bot.config.bulldozer}`, null, bot.colors.espancar)
		if (targetD.preso > currTime && uData.preso < currTime)
			return bot.createEmbed(message, `**${targetD.username}** está preso. Você só conseguirá espancá-lo se estiver preso também ${bot.config.police}`, null, bot.colors.espancar)
		if (targetD.hospitalizado > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está hospitalizado. Você não conseguirá espancá-lo ${bot.config.hospital}`, null, bot.colors.hospital)
		if (targetD.fugindo > currTime)
			return bot.createEmbed(message, `**${targetD.username}** está tentando fugir da prisão. Aguarde um momento ${bot.config.police}`, 'Paciência!', bot.colors.policia)
		if (bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.espancar)
		if (bot.isGaloEmRinha(alvo))
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

		let emote = uData.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == bot.classes[uData.classe].emote) : `<:Inventario:814663379536052244>`

		uData.emEspancamento = {
			tempo: currTime + 63000,
			user: alvo,
			isAlvo: false
		}

		targetD.emEspancamento = {
			tempo: currTime + 63000,
			user: message.author.id,
			isAlvo: true
		}
		bot.data.set(message.author.id, uData)
		bot.data.set(alvo, targetD)

		const embed_robb_inicio = new Discord.MessageEmbed()
			.setAuthor('Espancamento em andamento...', bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.name == 'espancar').url)
			.setColor(bot.colors.espancar)
			.setFooter(uData.username, membro.avatarURL())
			.setTimestamp()
		if (granadaUsada)
			embed_robb_inicio.setDescription(`**Utilizando ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} Granada**!`)

		const embed_robb_private = new Discord.MessageEmbed()
			.setAuthor(`Vou quebrar tua cara!`, membro.avatarURL())
			.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}está tentando lhe espancar utilizando **${armaATK}**${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}\nO que você deseja fazer?`)
			.addField(`💪 Brigar`, `+5 ATK, mas quem apanhar ficará mais ${tempoHospitalizadoAdicional} minutos hospitalizado`, true)
			.addField(`👟 Correr`, `-5 ATK, mas quem apanhar ficará menos ${tempoHospitalizadoAdicional} minutos hospitalizado, `, true)
			.setColor(bot.colors.espancar)
			.setFooter("Você tem 60 segundos para responder")
			.setTimestamp()

		message.channel.send({
			embeds: [embed_robb_inicio]
		}).then(message_robb => {
			bot.users.fetch(alvo).then(user => {
				user.send({
					embeds: [embed_robb_private]
				})
					.then(msg => {
						msg.react('💪')
							.then(() => msg.react('👟'))
							.catch(() => console.log("Não consegui reagir mensagem `espancar`"))
							.then(() => {
								const filter = (reaction, user) => ['💪', '👟'].includes(reaction.emoji.name) && user.id == alvo

								const collector = msg.createReactionCollector({
									filter,
									time: 59000,
									errors: ['time'],
								})

								collector.on('collect', r => {
									let targetD = bot.data.get(alvo)
									collector.stop()

									if (r.emoji.name === '💪') {
										const embed_robb_private_brigar = new Discord.MessageEmbed()
											.setAuthor(`Vou quebrar tua cara!`, membro.avatarURL())
											.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}está tentando lhe espancar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}\nO que você deseja fazer?`)
											.addField(`💪 Brigar`, `Brigando...`)
											.setColor(bot.colors.espancar)
											.setFooter("Você tem 60 segundos para responder")
											.setTimestamp()

										msg.edit({embeds: [embed_robb_private_brigar]})
											.catch(() => console.log("Não consegui editar mensagem `espancar`"))

										const embed_robb_inicio_brigar = new Discord.MessageEmbed()
											.setAuthor('Vou quebrar tua cara!', bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.name == 'espancar').url)
											.setDescription(`💪 ${targetD.username} quer brigar!`)
											.setColor(bot.colors.espancar)
											.setFooter(bot.data.get(message.author.id, "username"), membro.avatarURL())
											.setTimestamp()

										message_robb.edit({embeds: [embed_robb_inicio_brigar]})
											.catch(() => console.log("Não consegui editar mensagem `espancar`"))

										atkPowerDefensor += 5
										tempoHospitalizado += tempoHospitalizadoAdicional

									}
									else if (r.emoji.name === '👟') {
										if (atkPowerDefensor == 0)
											return bot.users.fetch(alvo).then(user => user.send(`Você está fraco demais para correr! 👟`))

										collector.stop()

										const embed_robb_private_correr = new Discord.MessageEmbed()
											.setAuthor(`Vou quebrar tua cara!`, membro.avatarURL())
											.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}está tentando lhe espancar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.espancar}\nO que você deseja fazer?`)
											.addField(`👟 Correr`, `Correndo...`)
											.setColor(bot.colors.espancar)
											.setFooter("Você tem 60 segundos para responder")
											.setTimestamp()

										msg.edit({embeds: [embed_robb_private_correr]})
											.catch(() => console.log("Não consegui editar mensagem `espancar`"))

										const embed_robb_inicio_correr = new Discord.MessageEmbed()
											.setAuthor('Vou quebrar tua cara!', bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.name == 'espancar').url)
											.setDescription(`👟 ${targetD.username} quer correr!`)
											.setColor(bot.colors.espancar)
											.setFooter(bot.data.get(message.author.id, "username"), membro.avatarURL())
											.setTimestamp()

										message_robb.edit({embeds: [embed_robb_inicio_correr]})
											.catch(() => console.log("Não consegui editar mensagem `espancar`"))

										atkPowerDefensor -= 5
										tempoHospitalizado -= tempoHospitalizadoAdicional
									}
								})

								setTimeout(() => msg.delete(), 60000)
							})
					})
			})

			setTimeout(() => {
				uData = bot.data.get(message.author.id)
				targetD = bot.data.get(alvo)
				// console.log(granadaUsada)
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

					const embed_espancar_final = new Discord.MessageEmbed()
						.setDescription(`Você ${textoSurra} **${targetD.username}** e ele ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`)
						.setColor(bot.colors.espancar)
						.setFooter(uData.username, membro.avatarURL())
						.setTimestamp()

					message_robb.edit({embeds: [embed_espancar_final]})
						.catch(() => console.log("Não consegui editar mensagem `espancar`"))

					let surrado = ['espancado', 'surrado', 'socado com muita força', 'chutado nas bolas', 'trucidado', 'acabado', 'escadeirado', 'arrochado', 'marretado', 'moído a pau']
					bot.shuffle(surrado)
					let textoSurrado = surrado[0]

					bot.users.fetch(alvo).then(user => {
						user.send(`Você foi ${textoSurrado} pelo **${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`)
							.catch(() => console.log(`Não consegui mandar mensagem privada para ${targetD.username} (${alvo})`))
					})

					targetD.qtHospitalizado += 1
					targetD.hospitalizado = currTime + tempoHospitalizado * 60 * 1000
					targetD.espancarL++
					uData.espancarW++
					uData.roubo = currTime + 1800000 * multiplicador_evento_tempo
					uData.espancar = currTime + 3000000 * multiplicador_evento_tempo

					const embedPVEsp = new Discord.MessageEmbed()
						.setTitle(`${bot.config.espancar} Você já pode espancar novamente!`)
						.setColor(bot.colors.espancar)

					setTimeout(() => {
						bot.users.fetch(message.author.id).then(user => {
							user.send({embeds: [embedPVEsp]})
								.catch(() => message.reply(`você já pode espancar novamente! ${bot.config.espancar}`)
									.catch(() => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Espancar\``))
						})
					}, uData.espancar - currTime)

					const embedPVHeal = new Discord.MessageEmbed()
						.setTitle(`${bot.config.hospital} Você está curado!`)
						.setColor('RED')

					setTimeout(() => {
						bot.users.fetch(alvo).then(user => {
							user.send({embeds: [embedPVHeal]})
								.catch(() => console.log(`Não consegui mandar mensagem privada para ${targetD.username} (${alvo})`))

						})
					}, targetD.hospitalizado - currTime)

					bot.data.set(alvo, targetD)
					bot.data.set(message.author.id, uData)

				}
				else {
					// bot.createEmbed(message, `Você até tentou, mas apanhou e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`, null, bot.colors.hospital)

					let surrado = ['espancado', 'surrado', 'socado com muita força', 'chutado nas bolas', 'trucidado', 'acabado', 'escadeirado', 'arrochado', 'marretado', 'moído a pau']
					bot.shuffle(surrado)
					let textoSurrado = surrado[0]

					const embed_espancar_final = new Discord.MessageEmbed()
						.setDescription(`Você até tentou, mas foi ${textoSurrado} e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`)
						.setColor(bot.colors.espancar)
						.setFooter(uData.username, membro.avatarURL())
						.setTimestamp()

					message_robb.edit({embeds: [embed_espancar_final]})
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

					bot.users.fetch(alvo).then(user => {
						user.send(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}tentou lhe espancar, mas ${textoSurra} e ele ficará hospitalizado por ${bot.segToHour(tempoHospitalizado * 60)} ${bot.config.hospital}`)
							.catch(() => console.log(`Não consegui mandar mensagem privada para ${targetD.username} (${alvo})`))
					})

					const embedPVHeal = new Discord.MessageEmbed()
						.setTitle(`${bot.config.hospital} Você está curado!`)
						.setColor('RED')

					setTimeout(() => {
						bot.users.fetch(message.author.id).then(user => {
							user.send({embeds: [embedPVHeal]})
								.catch(() => message.reply(`Você está curado! ${bot.config.hospital}`)
									.catch(() => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Espancar\``))

						})
					}, uData.hospitalizado - currTime)

					bot.data.set(alvo, targetD)
					bot.data.set(message.author.id, uData)
				}
			}, 62000)
		}).catch(() => console.log("Não consegui enviar mensagem `espancar`"))
	}
			
}
exports.config = {
	alias: ['socar', 'bater', 'esp', 'chutar', 'surrar', 'arrochar', 'moerapau']
}