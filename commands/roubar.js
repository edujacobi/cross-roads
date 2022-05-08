const Discord = require("discord.js")
const wait = require('util').promisify(setTimeout)

let multiplicador_evento_tempo_hospitalizado = 1
let multiplicador_evento_tempo_roubar = 1
let multiplicador_evento_tempo_preso = 1

async function roubarLugar(bot, message, lugar, uData) {
	if (lugar == undefined)
		return

	let currTime = new Date().getTime()
	let membro = message.member.user

	let chance = bot.getRandom(0, 100)

	uData.emRoubo = {
		tempo: currTime + 11000 + (5000 * lugar.id),
		user: lugar.desc,
		isAlvo: false
	}

	await bot.data.set(message.author.id, uData)

	const embed_robb_inicio = new Discord.MessageEmbed()
		.setTitle(`${bot.config.roubar} Roubo em andamento...`)
		.setColor(bot.colors.roubar)
		.setFooter({
			text: `${uData.username} • ${lugar.desc}`, iconURL: membro.avatarURL()
		})
		.setTimestamp()

	let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

	const row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Participar')
			.setEmoji(bot.config.roubar)
			.setDisabled(uCasamento?.anel === null)
			.setCustomId(message.id + 'participar'))

	let message_robb = await message.channel.send({
		embeds: [embed_robb_inicio],
		components: uData.casamentoID != null ? [row] : []
	}).catch(() => console.log("Não consegui enviar mensagem `roubar`"))

	const filter = (button) => message.id + 'participar' === button.customId && button.user.id === uData.conjuge

	const collector = message_robb.createMessageComponentCollector({
		filter,
		time: 10000 + (5000 * lugar.id),
	})

	let isConjugeParticipando = false
	let conjuge = false

	collector.on('collect', async b => {
		await b.deferUpdate()
		let currTime = new Date().getTime()
		let cData = await bot.data.get(uData.conjuge)

		if (isConjugeParticipando) return
		if (cData.preso > currTime)
			return bot.msgPreso(message, cData, cData.username)
		if (cData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, cData, cData.username)
		if (cData.roubo > currTime)
			return bot.createEmbed(message, `**${cData.username}** está sendo procurado pela polícia por mais ${bot.segToHour((cData.roubo - currTime) / 1000)} ${bot.config.police}`, null, bot.colors.policia)
		if (cData.job != null)
			return bot.msgTrabalhando(message, cData)
		if (await bot.isUserEmRouboOuEspancamento(message, cData)) return

		let emotes = ""
		let lugarRoubo = null
		Object.values(bot.robbery).forEach(_lugar => {
			if (lugar.id == _lugar.id) {
				Object.entries(cData.arma).forEach(([key_udata, value_udata]) => {
					if (!Array.isArray(_lugar.necessario)) {
						if (key_udata == _lugar.necessario) {
							if (currTime > value_udata.tempo) {
								Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
									if (_lugar.necessario == key_gun) {
										let emote = value_gun.skins[cData.arma[value_gun.data].skinAtual].emote
										return bot.createEmbed(message, `**${cData.username}**, é necessário possuir ${emote} para este roubo ${bot.config.roubar}`, null, bot.colors.roubar)
									}
								})
							}
							else {
								emotes = ""
								lugarRoubo = _lugar
							}
						}
					}
					else {
						for (let i = 0; i < _lugar.necessario.length; i++) {
							let arma = _lugar.necessario[i]
							if (key_udata == arma) {
								if (currTime > value_udata) {
									Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
										if (arma == key_gun && lugarRoubo == null) {
											emotes += value_gun.skins[cData.arma[value_gun.data].skinAtual].emote
											if (i < lugar.necessario.length - 1)
												emotes += " ou "
										}
									})
								}
								else {
									emotes = ""
									lugarRoubo = _lugar
									break
								}
							}
						}
					}
				})
			}
		})
		if (emotes != "")
			return bot.createEmbed(message, `**${cData.username}**, necessário possuir ${emotes} para este roubo ${bot.config.roubar}`, null, bot.colors.roubar)

		if (!lugarRoubo)
			return

		uCasamento = await bot.casais.get(uData.casamentoID?.toString())

		if (uCasamento.nivel === 0)
			return bot.createEmbed(message, `Vocês estão com o nível do casamento muito baixo para realizar ações em dupla!`, null, bot.colors.casamento)

		let bonus = currTime - uCasamento.ultimaViagem < 72 * 60 * 60 * 1000 ? 1.5 : 1

		chance *= 1 - bot.aneis[uCasamento.anel].bonus * bonus / 100

		uCasamento.nivel += uCasamento.nivel >= 100 ? 0 : 1
		uCasamento.ultimoDecrescimo = 1
		isConjugeParticipando = true

		cData.emRoubo = {
			tempo: currTime + 11000 + (5000 * lugar.id),
			user: lugar.desc,
			isAlvo: false
		}

		message_robb.edit({
			components: [],
			embeds: [embed_robb_inicio
				.setTitle(`${bot.config.roubar} Roubo em andamento... Juntos somos mais fortes!`)
				.setFooter({text: `${uData.username} e ${cData.username} • ${lugar.desc}`, iconURL: membro.avatarURL()})
			]
		})

		await bot.data.set(uData.conjuge, cData)
		bot.casais.set(uData.casamentoID.toString(), uCasamento)

		conjuge = await bot.data.get(uData.conjuge)
	})

	let sucesso = (chance < lugar.sucesso)

	await wait(10000 + (5000 * lugar.id))

	uData = await bot.data.get(message.author.id)

	uData.emRoubo.tempo = 0

	if (sucesso) {
		let recompensa = bot.getRandom(lugar.min, lugar.max)
		if (isConjugeParticipando)
			recompensa = ~~(recompensa * 0.5)
		if (uData.classe === 'ladrao')
			recompensa = ~~(recompensa * 1.1)
		uData.roubosW += 1
		uData.roubo = currTime + 60 * (uData.classe === 'ladrao' ? 1.15 : (uData.classe === 'advogado' ? 0.85 : 1)) * 60 * 1000 * multiplicador_evento_tempo_roubar //+60m
		uData.moni += recompensa
		uData.valorRoubado += recompensa
		await bot.data.set(message.author.id, uData)

		const embedPV = new Discord.MessageEmbed()
			.setTitle(`${bot.config.roubar} Você já pode roubar novamente!`)
			.setColor(bot.colors.roubar)

		setTimeout(() => {
			message.author.send({embeds: [embedPV]}).catch(() => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
				.catch(async () => `Não consegui responder ${await bot.data.get(message.author.id + ".username")} nem no PV nem no canal. \`Roubar\``))
		}, uData.roubo - currTime)

		if (isConjugeParticipando && conjuge) {
			conjuge.roubosW += 1
			conjuge.roubo = currTime + 60 * (conjuge.classe === 'ladrao' ? 1.15 : (conjuge.classe === 'advogado' ? 0.85 : 1)) * 60 * 1000 * multiplicador_evento_tempo_roubar //+60m
			conjuge.moni += recompensa
			conjuge.valorRoubado += recompensa
			conjuge.emRoubo.tempo = 0
			await bot.data.set(uData.conjuge, conjuge)

			setTimeout(() => {
				bot.users.fetch(uData.conjuge).then(user => {
					user.send({
						embeds: [embedPV]
					}).catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Roubar\``)
				})
			}, conjuge.roubo - currTime)
		}

		const embed_robb_final = new Discord.MessageEmbed()
			.setDescription(`Você roubou R$ ${recompensa.toLocaleString().replace(/,/g, ".")} de **${lugar.desc}** ${bot.config.roubar}`)
			.setColor(bot.colors.roubar)
			.setFooter({
				text: `${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
				iconURL: membro.avatarURL()
			})
			.setTimestamp()

		const embed_robb_final_casal = new Discord.MessageEmbed()
			.setDescription(`Vocês roubaram R$ ${(recompensa * 2).toLocaleString().replace(/,/g, ".")} de **${lugar.desc}** ${bot.config.roubar}\nCada um recebeu R$ ${recompensa.toLocaleString().replace(/,/g, ".")}`)
			.setColor(bot.colors.roubar)
			.setFooter({
				text: `${uData.username} e ${conjuge.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
				iconURL: membro.avatarURL()
			})
			.setTimestamp()

		message_robb.edit({
			components: [],
			embeds: isConjugeParticipando ? [embed_robb_final_casal] : [embed_robb_final]
		}).catch(() => console.log("Não consegui editar mensagem `roubar`"))

		const logR = new Discord.MessageEmbed()
			.setDescription(`**${uData.username} roubou R$ ${recompensa.toLocaleString().replace(/,/g, ".")} de ${lugar.desc}**`)
			.addField("Money", uData.moni.toString(), true)
			.addField("Ficha", uData.ficha.toString(), true)
			.setColor(bot.colors.roubar)

		if (isConjugeParticipando && conjuge)
			logR.addField("Junto de seu conjuge", conjuge.username)
				.addField("Money", conjuge.moni.toString(), true)
				.addField("Ficha", conjuge.ficha.toString(), true)

		return bot.log(message, logR)

	}
	else {
		uData.roubosL++
		let multiplo = uData.classe === 'ladrao' ? 1.15 : (uData.classe === 'advogado' ? 0.85 : 1)
		let tempo_preso = (lugar.id * 20) * (multiplo * multiplicador_evento_tempo_preso)
		uData.preso = currTime + Math.floor(tempo_preso * 60 * 1000)

		const embedPV = new Discord.MessageEmbed()
			.setTitle(`${bot.config.police} Você está livre!`)
			.setColor(bot.colors.policia)

		setTimeout(() => {
			message.author.send({embeds: [embedPV]})
				.catch(() => message.reply(`você está livre! ${bot.config.police}`)
					.catch(async () => `Não consegui responder ${await bot.data.get(message.author.id + ".username")} nem no PV nem no canal. \`Roubar\``))

		}, tempo_preso * 60 * 1000)

		if (isConjugeParticipando && conjuge) {
			conjuge.roubosL++
			conjuge.preso = currTime + Math.floor(tempo_preso * 60 * 1000)
			conjuge.emRoubo.tempo = 0
			await bot.data.set(uData.conjuge, conjuge)

			setTimeout(() => {
				bot.users.fetch(uData.conjuge).then(user => {
					user.send({
						embeds: [embedPV]
					}).catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Roubar\``)
				})
			}, tempo_preso * 60 * 1000)
		}

		await bot.data.set(message.author.id, uData)

		const embed_robb_final = new Discord.MessageEmbed()
			.setDescription(`Você falhou em roubar **${lugar.desc}** e ficará preso por ${bot.segToHour(tempo_preso * 60)} ${bot.config.police}`)
			.setColor(bot.colors.policia)
			.setFooter({
				text: `${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
				iconURL: membro.avatarURL()
			})
			.setTimestamp()

		const embed_robb_final_casal = new Discord.MessageEmbed()
			.setDescription(`Vocês falharam em roubar **${lugar.desc}** e ficarão presos por ${bot.segToHour(tempo_preso * 60)} ${bot.config.police}`)
			.setColor(bot.colors.policia)
			.setFooter({
				text: `${uData.username} e ${conjuge.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
				iconURL: membro.avatarURL()
			})
			.setTimestamp()

		message_robb.edit({
			components: [],
			embeds: isConjugeParticipando ? [embed_robb_final_casal] : [embed_robb_final]
		}).catch(() => console.log("Não consegui editar mensagem `roubar`"))

		const logR = new Discord.MessageEmbed()
			.setDescription(`**${uData.username} falhou em roubar ${lugar.desc} e ficará preso por ${bot.segToHour((uData.preso - currTime) / 1000)}**`)
			.setColor(bot.colors.roubar)

		if (isConjugeParticipando && conjuge)
			logR.addField("Junto de seu conjuge", conjuge.username)

		return bot.log(message, logR)

	}
}


async function verifyRoubo(bot, message, idLugar) {
	let uData = await bot.data.get(message.author.id)
	let currTime = new Date().getTime()

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)
	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)
	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour((uData.roubo - currTime) / 1000)} ${bot.config.police}`, null, bot.colors.policia)
	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)
	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return

	let emotes = ""
	let lugarRoubo = null

	Object.values(bot.robbery).forEach(lugar => {
		if (idLugar == lugar.id) {
			Object.entries(uData.arma).forEach(([key_udata, value_udata]) => {
				if (!Array.isArray(lugar.necessario)) {
					if (key_udata == lugar.necessario) {
						if (currTime > value_udata.tempo) {
							Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
								if (lugar.necessario == key_gun) {
									let emote = value_gun.skins[uData.arma[value_gun.data].skinAtual].emote
									return bot.createEmbed(message, `É necessário possuir ${emote} para este roubo ${bot.config.roubar}`, null, bot.colors.roubar)
								}
							})
						}
						else {
							emotes = ""
							lugarRoubo = lugar
						}
					}
				}
				else {
					for (let i = 0; i < lugar.necessario.length; i++) {
						let arma = lugar.necessario[i]
						if (key_udata === arma) {
							if (currTime > value_udata.tempo) {
								Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
									if (arma == key_gun && lugarRoubo == null) {
										emotes += value_gun.skins[uData.arma[value_gun.data].skinAtual].emote
										if (i < lugar.necessario.length - 1)
											emotes += " ou "
									}
								})
							}
							else {
								emotes = ""
								lugarRoubo = lugar
								break
							}
						}
					}
				}
			})
		}
	})
	if (emotes !== "")
		return bot.createEmbed(message, `É necessário possuir ${emotes} para este roubo ${bot.config.roubar}`, null, bot.colors.roubar)

	return roubarLugar(bot, message, lugarRoubo, uData)
}

exports.run = async (bot, message, args) => {
	let membro = message.member.user
	// if (message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, "Roubar desativado temporiamente.")
	let currTime = new Date().getTime()
	let option = args[0]
	let authorId = message.author.id
	let membroAvatar = membro.avatarURL()

	if (!option) {
		let uData = await bot.data.get(message.author.id)

		let texto = "Você pode roubar!"
		if (uData.roubo > currTime)
			texto = `Você só poderá roubar novamente em ${bot.segToHour((uData.roubo - currTime) / 1000)}`
		if (uData.preso > currTime)
			texto = `Você está preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)}`

		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.roubar} Roubar`)
			.setThumbnail("https://media.discordapp.net/attachments/691019843159326757/791444366727708672/roubar_20201223201323.png")
			.setColor(bot.colors.roubar)
			.setDescription(`Encontre um alvo e roube tudo!
Quanto melhor a arma, maior a chance de roubo contra outros jogadores e mais protegido você estará.
Se falhar, você será preso por um tempo definido pelo poder de sua arma.
Se conseguir, deverá esperar 1 hora para roubar novamente.
Há uma pequena chance do alvo ser também espancado!

Quando alguém tentar te roubar, você pode ${bot.config.emmetGun} **Reagir**, ${bot.config.police} **Chamar a polícia** ou <:fazer_nada:758817091872096267> **Fazer nada**!

Você já roubou \`${uData.roubosW.toLocaleString().replace(/,/g, ".")}\` vezes, falhou \`${uData.roubosL.toLocaleString().replace(/,/g, ".")}\` vezes e foi roubado \`${uData.qtRoubado.toLocaleString().replace(/,/g, ".")}\` vezes`)
			.addField(`Comando`, `\`;roubar [user]\``, true)
			.setFooter({text: `${uData.username} • ${texto}`, iconURL: membro.avatarURL()})
			.setTimestamp()

		// Object.values(bot.robbery).forEach(lugar => {
		// 	let emotes = ""
		// 	Object.entries(bot.guns).forEach(([key, value]) => {
		// 		if (!Array.isArray(lugar.necessario)) {
		// 			if (key === lugar.necessario)
		// 				emotes = value.skins.default.emote
		// 		}
		// 		else {
		// 			for (let i = 0; i < lugar.necessario.length; i++) {
		// 				let arma = lugar.necessario[i]
		// 				if (key === arma) {
		// 					emotes += value.skins.default.emote
		// 					if (i < lugar.necessario.length - 1)
		// 						emotes += " ou "
		// 				}
		// 			}
		// 		}
		// 	})
		//
		// 	embed.addField(`${lugar.desc}`, `Necessário: ${emotes}`, true)
		// })

		let locais = []

		Object.values(bot.robbery).forEach(local => {
			let MIN = local.min
			let MAX = local.max
			if (uData.classe === 'ladrao') {
				MIN = ~~(MIN * 1.1)
				MAX = ~~(MAX * 1.1)
			}

			let necessario = !Array.isArray(local.necessario) ? local.necessario : local.necessario[0]

			locais.push({
				label: local.desc,
				description: `Sucesso: ${local.sucesso}% • R$ ${MIN.toLocaleString().replace(/,/g, ".")} - R$ ${MAX.toLocaleString().replace(/,/g, ".")}`,
				emoji: bot.guns[necessario].skins[uData.arma[necessario].skinAtual].emote,
				value: local.id.toString()
			})
		})

		const row = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
			.setCustomId('select')
			.setPlaceholder('Lugares disponíveis para roubar')
			.addOptions(locais))

		let msg = await message.channel.send({
			embeds: [embed],
			components: uData.roubo > currTime || uData.preso > currTime ? [] : [row]
		})
			.catch(() => console.log("Não consegui enviar mensagem `roubar`"))

		const filter = (select) => [
			'select',
		].includes(select.customId) && select.user.id === message.author.id

		const collector = msg.createMessageComponentCollector({
			filter,
			time: 90000,
		})

		collector.on('collect', async s => {
			await s.deferUpdate()

			uData = await bot.data.get(message.author.id)

			await verifyRoubo(bot, message, s.values[0])

			// msg.edit({components: []})
			// 	.catch(() => console.log("Não consegui editar mensagem `roubar`"))
		})

		collector.on('end', async () => {
			msg.edit({components: []})
				.catch(() => console.log("Não consegui editar mensagem `roubar`"))
		})
		return
	}

	let uData = await bot.data.get(message.author.id)

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)
	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)
	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour((uData.roubo - currTime) / 1000)} ${bot.config.police}`, null, bot.colors.policia)

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
		uData: tData,
		alvo
	} = await bot.findUser(message, args)

	if (!tData) return

	if (uData.job != null) return bot.msgTrabalhando(message, uData)

	if (message.author.id === alvo)
		return bot.createEmbed(message, `Você não pode roubar você mesmo, idiota ${bot.config.roubar}`, null, bot.colors.roubar)

	if (alvo === bot.config.adminID)
		return bot.createEmbed(message, `Quem em sã consciência roubaria o Jacobi? ${bot.config.roubar}`, null, bot.colors.roubar)

	if (alvo === '526203502318321665') // bot
		return bot.createEmbed(message, `01000100 01100101 01110011 01101001 01110011 01110100 01100001 <:CrossRoadsLogo:757021182020157571>`, null, bot.colors.roubar)

	if (uData.gangID != null && uData.gangID == tData.gangID)
		return bot.createEmbed(message, `Você não pode roubar membros da sua gangue ${bot.config.roubar}`, null, bot.colors.roubar)

	if (tData.classe == undefined)
		return bot.createEmbed(message, `**${tData.username}** não está ativo na temporada e não pode ser roubado ${bot.config.roubar}`, null, bot.colors.roubar)

	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (await bot.isAlvoEmRouboOuEspancamento(message, tData))
		return

	if (await bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)

	if (await bot.isGaloEmRinha(alvo))
		return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

	if (await bot.isPlayerViajando(tData))
		return bot.msgPlayerViajando(message, tData, tData.username)

	if (alvo === uData.conjuge)
		return bot.createEmbed(message, `Você não pode roubar o seu cônjuge ${bot.config.roubar}`, null, bot.colors.roubar)

	if (!tData.lastCommandChannelId)
		return bot.createEmbed(message, `Você não pode roubar um jogador que ainda não usou um comando ${bot.config.roubar}`, null, bot.colors.roubar)

	let atkPower = 0
	let defPower = 0
	let moneyAtkPower = null
	let moneyDefPower = null
	let atkPowerDefensor = 0
	let armaATK = ''

	// ATK, arma e moneyATK do ladrão
	Object.entries(uData.arma).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value.tempo > currTime && arma.atk > atkPower && key == arma.data && typeof (arma.atk) == "number") {
				atkPower = arma.atk
				armaATK = `${arma.skins[uData.arma[arma.data].skinAtual].emote} ${arma.desc}`
			}

			if (value.tempo > currTime && arma.moneyAtk > moneyAtkPower && key == arma.data && typeof (arma.moneyAtk) == "number")
				moneyAtkPower = arma.moneyAtk
		})
	})

	// ATK, DEF e moneyDEF do roubado
	Object.entries(tData.arma).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value.tempo > currTime && arma.atk > atkPowerDefensor && key == arma.data && typeof (arma.atk) == "number")
				atkPowerDefensor = arma.atk

			if (value.tempo > currTime && arma.def > defPower && key == arma.data && typeof (arma.def) == "number")
				defPower = arma.def

			if (value.tempo > currTime && arma.moneyDef > moneyDefPower && key == arma.data && typeof (arma.moneyDef) == "number")
				moneyDefPower = arma.moneyDef
		})
	})

	if (atkPower == 0) {
		bot.log(new Discord.MessageEmbed()
			.setDescription(`**${uData.username} tentou roubar ${tData.username}, mas não possuia nenhuma arma**`)
			.setColor(message.member.displayColor))

		return bot.createEmbed(message, `Você não pode roubar sem uma arma ${bot.config.roubar}`, null, bot.colors.roubar)
	}

	let hora = new Date().getHours()

	if (uData.arma.goggles.tempo > currTime && hora <= 4 && hora >= 20)
		atkPower += 3

	if (tData.arma.goggles.tempo > currTime && hora <= 4 && hora >= 20)
		atkPowerDefensor += 3

	if (atkPowerDefensor - atkPower > 15) {
		bot.log(new Discord.MessageEmbed()
			.setDescription(`**${uData.username} tentou roubar ${tData.username} utilizando ${armaATK}, mas ela não é forte o suficiente**`)
			.setColor(bot.colors.roubar))

		return bot.createEmbed(message, `Você não pode roubar este jogador usando esta arma ${bot.config.roubar}`, "Consiga uma arma melhor", bot.colors.roubar)
	}
	if (tData.arma.colete.tempo > currTime)
		defPower += 2
	if (tData.arma.colete_p.tempo > currTime)
		defPower += 5
	if (tData.arma.goggles.tempo > currTime && hora <= 4 && hora >= 20)
		defPower += 3

	if (tData.arma.exoesqueleto.tempo > currTime) {
		defPower += 5
		moneyDefPower += 5
	}

	if (defPower != 0 && tData.hospitalizado > currTime) {
		defPower -= 5
		moneyDefPower -= 5
	}

	let tGang = await bot.gangs.get(tData.gangID?.toString())
	if (tGang && tGang.base == 'bunker')
		defPower += 0.5 * tGang.baseLevel

	let escolhido = false

	if (uData.arma.granada.quant <= 0 || granadaUsada != null) {
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isAlvoEmRouboOuEspancamento(message, tData))
			return
		return roubo()
	}

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
		tData = await bot.data.get(alvo)

		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isAlvoEmRouboOuEspancamento(message, tData))
			return
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
		if (await bot.isGaloEmRinha(alvo))
			return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

		escolhido = true
		if (b.customId === 'aceitar') {
			atkPower += 5
			granadaUsada = true
		}

		collector.stop()

	})

	collector.on('end', async () => {
		msg.delete()
		if (escolhido == false)
			return
		// return bot.createEmbed(message, `Roubo cancelado ${bot.config.roubar}`, `Você não escolheu se ia usar granada ou não`, bot.colors.roubar)

		uData = await bot.data.get(message.author.id)
		tData = await bot.data.get(alvo)

		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isAlvoEmRouboOuEspancamento(message, tData))
			return
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
		if (await bot.isGaloEmRinha(alvo))
			return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

		return roubo()
	})


	async function roubo() {
		uData = await bot.data.get(message.author.id)
		tData = await bot.data.get(alvo)
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isAlvoEmRouboOuEspancamento(message, tData))
			return
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
		if (await bot.isGaloEmRinha(alvo))
			return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)
		if (alvo === uData.conjuge)
			return bot.createEmbed(message, `Você não pode roubar o seu cônjuge ${bot.config.roubar}`, null, bot.colors.roubar)

		currTime = new Date().getTime()

		uData.emRoubo = {
			tempo: currTime + 63000,
			user: alvo,
			isAlvo: false
		}

		tData.emRoubo = {
			tempo: currTime + 63000,
			user: message.author.id,
			isAlvo: true
		}
		await bot.data.set(message.author.id, uData)
		await bot.data.set(alvo, tData)

		let tempo_preso = (10 + 1.5 * atkPower) * (uData.classe === 'advogado' ? 0.85 : 1) * multiplicador_evento_tempo_preso
		let tempo_hospitalizado = parseInt(25 + defPower / 2) * multiplicador_evento_tempo_hospitalizado
		let tempo_adicional_preso_chamar_policia = Math.floor((25 + 0.5 * atkPower)) * multiplicador_evento_tempo_preso

		if (uData.classe === 'mendigo')
			atkPower *= 0.9
		else if (uData.classe === 'assassino')
			atkPower *= 1.1
		if (tData.classe === 'assassino' || tData.classe === 'empresario')
			defPower *= 0.9
		if (defPower === 0)
			atkPower *= 1.35

		let emote = uData.classe ? bot.classes[uData.classe].emote : `<:Inventario:814663379536052244>`

		// let tempo_preso = 15 * armaATK_ID
		let chance = bot.getRandom(0, 100)
		const embed_robb_inicio = new Discord.MessageEmbed()
			.setTitle(`${bot.config.roubar} Roubo em andamento...`)
			.setColor(bot.colors.roubar)
			.setFooter(uData.username, membro.avatarURL())
			.setTimestamp()
		if (granadaUsada)
			embed_robb_inicio.setDescription(`**Utilizando ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} Granada**!`)

		const embed_robb_private = new Discord.MessageEmbed()
			.setAuthor(`Mãos ao alto!`, membro.avatarURL())
			.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID.toString() + '.nome')}** ` : ""}está tentando lhe roubar utilizando **${armaATK}**${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
			.addField(`${bot.config.emmetGun} Reagir`, `+5 DEF, mas você ficará hospitalizado caso seja roubado`, true)
			.addField(`${bot.config.police} Chamar a polícia`, `-5 DEF, mas ele ficará preso +${tempo_adicional_preso_chamar_policia} min caso falhe`, true)
			.addField(`<:fazer_nada:758817091872096267> Não fazer nada`, `Nenhum efeito adicional`, true)
			.setColor(bot.colors.roubar)
			.setFooter("Você tem 60 segundos para responder")
			.setTimestamp()

		let chance_espancar = bot.getRandom(0, 100)

		let reagir = '539501924307959808'
		let policia = '539502682545717288'
		let nada = '758817091872096267'

		let rowReagir = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setEmoji(reagir)
				.setLabel('Reagir')
				.setCustomId('reagir'))
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setEmoji(policia)
				.setLabel('Chamar polícia')
				.setCustomId('policia'))
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setEmoji(nada)
				.setLabel('Não fazer nada')
				.setCustomId('nada'))

		let message_robb = await message.channel.send({embeds: [embed_robb_inicio]})
			.catch(() => console.log(`Não consegui iniciar o roubo de ${uData.username} (${message.author.id} em ${tData.username} (${alvo})`))

		let embeds = {
			private: {
				reagiu: new Discord.MessageEmbed()
					.setAuthor(`Mãos ao alto!`, membro.avatarURL())
					.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID.toString() + '.nome')}** ` : ""}está tentando lhe roubar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
					.addField(`${bot.config.emmetGun} Reagir`, `Reagindo...`)
					.setColor(bot.colors.roubar)
					.setFooter("Você tem 60 segundos para responder")
					.setTimestamp(),

				policia: new Discord.MessageEmbed()
					.setAuthor(`Mãos ao alto!`, membro.avatarURL())
					.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID.toString() + '.nome')}** ` : ""}está tentando lhe roubar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
					.addField(`${bot.config.police} Chamar a polícia`, `Chamando a polícia...`)
					.setColor(bot.colors.roubar)
					.setFooter("Você tem 60 segundos para responder")
					.setTimestamp(),

				nada: new Discord.MessageEmbed()
					.setAuthor(`Mãos ao alto!`, membro.avatarURL())
					.setDescription(`${emote} **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID.toString() + '.nome')}** ` : ""}está tentando lhe roubar utilizando ${armaATK}${granadaUsada ? ` e ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
					.addField(`<:fazer_nada:758817091872096267> Não fazer nada`, `Fazendo nada...`)
					.setColor(bot.colors.roubar)
					.setFooter("Você tem 60 segundos para responder")
					.setTimestamp()
			},
			inicio: {
				reagiu: new Discord.MessageEmbed()
					.setTitle(`${bot.config.roubar} Roubo em andamento...`)
					.setDescription(`${bot.config.emmetGun} ${tData.username} está reagindo!`)
					.setColor(bot.colors.roubar)
					.setFooter(uData.username, membro.avatarURL())
					.setTimestamp(),

				policia: new Discord.MessageEmbed()
					.setTitle(`${bot.config.roubar} Roubo em andamento...`)
					.setDescription(`${bot.config.police} ${tData.username} está chamando a polícia!`)
					.setColor(bot.colors.roubar)
					.setFooter(uData.username, membro.avatarURL())
					.setTimestamp(),

				nada: new Discord.MessageEmbed()
					.setTitle(`${bot.config.roubar} Roubo em andamento...`)
					.setDescription(`<:fazer_nada:758817091872096267> ${tData.username} não está fazendo nada!`)
					.setColor(bot.colors.roubar)
					.setFooter(uData.username, membro.avatarURL())
					.setTimestamp()
			},
			pv: {
				roubar: new Discord.MessageEmbed()
					.setTitle(`${bot.config.roubar} Você já pode roubar novamente!`)
					.setColor(bot.colors.roubar),

				heal: new Discord.MessageEmbed()
					.setTitle(`${bot.config.hospital} Você está curado!`)
					.setColor(bot.colors.hospital),

				livre: new Discord.MessageEmbed()
					.setTitle(`${bot.config.prisao} Você está livre!`)
					.setColor(bot.colors.policia)
			},
			erro: new Discord.MessageEmbed()
				.setTitle(`${bot.badges.cataBug} Ops, por algum motivo não consegui realizar seu roubo. Tente novamente mais tarde.`)
				.setColor(bot.colors.roubar)
				.setFooter(uData.username, membro.avatarURL())
				.setTimestamp()
		}

		//canal da mensagem Você está roubando...
		const channelLadrao = await bot.channels.cache.get(uData.lastCommandChannelId)

		console.log('channelLadrao roubar', channelLadrao)

		//mensagem Você está roubando...
		const messageRobb = await channelLadrao.messages.fetch(message_robb.id)

		await bot.shard.broadcastEval(async (bot, {
			channelId, embed, component, alvo,
			moneyDefPower, message_robb, defPower, chance_espancar,
			tempo_preso, embeds, membroAvatar, currTime,
			uData, authorId, tempo_adicional_preso_chamar_policia, granadaUsada,
			atkPower, chance, moneyAtkPower, messageId,
			multiplicador_evento_tempo_roubar, tempo_hospitalizado
		}) => {
			//canal da mensagem Você está sendo roubado
			const channel = await bot.channels.cache.get(channelId)
			if (!channel) return null

			let msg = await channel.send({
				content: `<@${alvo}>`, embeds: [embed], components: [component]
			})
			
			const filterRoubo = (button) => button.user.id === alvo

			const collectorRoubo = msg.createMessageComponentCollector({
				filter: filterRoubo,
				time: 59000,
			})

			collectorRoubo.on('collect', async b => {
				await b.deferUpdate()

				let tData = await bot.data.get(alvo)

				if (b.customId === 'reagir') {
					if (tData.preso > currTime)
						return msg.reply(`Você está preso por mais ${bot.segToHour((tData.preso - currTime) / 1000)} e não pode fazer isto ${bot.config.police}`)
					if (tData.hospitalizado > currTime)
						return msg.reply(`Você está hospitalizado por mais ${bot.segToHour((tData.hospitalizado - currTime) / 1000)} e não pode fazer isto ${bot.config.hospital}`)
					if (tData.jobTime > currTime)
						return msg.reply(`Você está trabalhando por mais ${bot.segToHour((tData.jobTime - currTime) / 1000)} e não pode fazer isto ${bot.config.trabalhando}`)
					if (moneyDefPower == null)
						return msg.reply(`Você não pode reagir sem uma arma ${bot.config.roubar}`)

					collectorRoubo.stop()

					msg.edit({embeds: [embeds.private.reagiu], components: []})
						.catch(() => console.log("Não consegui editar mensagem `roubar`"))

					messageRobb.edit({embeds: [embeds.inicio.reagiu]})
						.catch(() => console.log("Não consegui editar mensagem `roubar`"))

					defPower += 5
					chance_espancar = 0 // deve ser menor que 25
				}

				if (b.customId === 'policia') {
					// if (tData.preso > currTime)
					// 	return msg.reply(`Você está preso por mais ${bot.segToHour((tData.preso - currTime) / 1000 / 60)} e não pode fazer isto ${bot.config.police}`)

					if (tData.hospitalizado > currTime)
						return msg.reply(`Você está hospitalizado por mais ${bot.segToHour((tData.hospitalizado - currTime) / 1000)} e não pode fazer isto ${bot.config.hospital}`)
					if (defPower == 0)
						return msg.reply(`Você não possui poder de defesa suficiente para convencer a polícia a te ajudar ${bot.config.police}`)

					collectorRoubo.stop()

					msg.edit({embeds: [embeds.private.policia], components: []})
						.catch(() => console.log("Não consegui editar mensagem `roubar`"))

					messageRobb.edit({embeds: [embeds.inicio.policia]})
						.catch(() => console.log("Não consegui editar mensagem `roubar`"))

					defPower -= 5
					tempo_preso += tempo_adicional_preso_chamar_policia
				}

				if (b.customId === 'nada') {
					collectorRoubo.stop()

					msg.edit({embeds: [embeds.private.nada], components: []})
						.catch(() => console.log("Não consegui editar mensagem `roubar`"))

					messageRobb.edit({embeds: [embeds.inicio.nada]})
						.catch(() => console.log("Não consegui editar mensagem `roubar`"))
				}
			})

			collectorRoubo.on('end', () => {
				if (msg) msg.edit({components: []})
					.catch(() => console.log("Não consegui editar mensagem `roubar`"))
			})
			
			setTimeout(() => {
				if (msg) msg.delete()
			}, 60000)
			
			return 
		}, {context: {
				channelId: tData.lastCommandChannelId,
				embed: embed_robb_private,
				component: rowReagir,
				alvo,
				moneyDefPower,
				message_robb,
				defPower,
				chance_espancar,
				tempo_preso,
				embeds,
				membroAvatar: membro.avatarURL(),
				currTime,
				uData,
				authorId: message.author.id,
				tempo_adicional_preso_chamar_policia,
				granadaUsada,
				atkPower,
				chance,
				moneyAtkPower,
				messageId: message.id,
				multiplicador_evento_tempo_roubar,
				tempo_hospitalizado
		}})
			// .then(async array => {
			// 	console.log('array', array)
			// 	let findChannel = array.find(channel => channel)
			// 	console.log('findChannel', findChannel)
			//
			// 	if (!findChannel)
			// 		return message.reply({embeds: [embeds.erro]})
			//	
			// 	return findChannel
			// })
		

		//mensagem original
		// const messageLadr = await channelLadrao.messages.fetch(message.id)

		setTimeout(async () => {

			function getPercent(percent, from) {
				return (from / 100) * percent
			}

			uData = await bot.data.get(authorId)
			let tData = await bot.data.get(alvo)

			// console.log(granadaUsada)
			if (granadaUsada)
				uData.arma.granada.quant -= 1

			atkPower -= getPercent(defPower, atkPower)
			if (chance < atkPower) {
				//console.log("Sucesso")
				if (defPower > 0)
					moneyAtkPower -= getPercent(moneyDefPower, moneyAtkPower)

				if (uData.classe === 'ladrao')
					moneyAtkPower *= 1.1

				let money = Math.floor(getPercent(moneyAtkPower, tData.moni))
				let chips = Math.floor((getPercent(moneyAtkPower, tData.ficha)) / 1.4)
				// let ovosRoubados = Math.floor((getPercent(moneyAtkPower, tData._ovo)) / 2)
				// console.log("roubados:", ovosRoubados, " ficou com", tData._ovo, ` (${uData.username} e ${tData.username})`)

				let chipsString = chips > 0 ? ` e ${bot.config.ficha} ${chips.toLocaleString().replace(/,/g, ".")} fichas` : ""

				// chipsString += ovosRoubados > 0 ? ` e ${bot.config.ovo} ${ovosRoubados.toLocaleString().replace(/,/g, ".")} ovos de páscoa` : ""
				// chipsString += ovosRoubados > 0 ? ` e ${bot.config.ovo} ${ovosRoubados.toLocaleString().replace(/,/g, ".")} presentes de natal` : ""

				let target_espancado = false

				if (tData.preso < currTime && tData.jobTime < currTime && tData.hospitalizado < currTime && defPower > 0 && chance_espancar <= 25) {
					tData.qtHospitalizado += 1
					tData.hospitalizado = currTime + tempo_hospitalizado * 60 * 1000
					tData.espancarL++
					uData.espancarW++
					target_espancado = true

					setTimeout(() => {
						bot.users.fetch(alvo).then(user => {
							user.send({embeds: [embeds.pv.heal]})
								.catch(async () => `Não consegui responder ${await bot.data.get(alvo + ".username")} no PV. \`Roubar\``)
						})
					}, tempo_hospitalizado * 60 * 1000)
				}

				// tData._ovo = Math.floor(tData._ovo - ovosRoubados)
				// uData._ovo = Math.floor(uData._ovo + ovosRoubados)
				// console.log(tData._ovo, uData._ovo)

				tData.moni -= money
				tData.ficha -= chips
				tData.qtRoubado += 1
				uData.moni += money
				uData.valorRoubado += money + (chips * 80)
				uData.ficha += chips
				uData.roubosW++
				uData.roubo = currTime + 60 * (uData.classe === 'ladrao' ? 1.15 : (uData.classe === 'advogado' ? 0.85 : 1)) * 60 * 1000 * multiplicador_evento_tempo_roubar //+60m

				await bot.data.set(alvo, tData)
				await bot.data.set(authorId, uData)

				const embed_robb_final = {
					description: `Você roubou R$ ${money.toLocaleString().replace(/,/g, ".")}${chipsString} de **${tData.username}** ${bot.config.roubar}` +
						(target_espancado ? `\nVocê detonou, e ele ficará hospitalizado por ${bot.segToHour(tempo_hospitalizado * 60)} ${bot.config.hospital}` : ""),
					color: bot.colors.roubar,
					footer: {
						text: `${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}${chips > 0 ? ` • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}` : ""}`,
						icon_url: membroAvatar
					},
					timestamp: new Date(),
				}

				//Caiu pq não existia mais o canal?
				messageRobb.edit({embeds: [embed_robb_final]})
					.catch(() => console.log("Não consegui editar mensagem `roubar`"))

				bot.users.fetch(alvo).then(async user => {
					user.send(`Você foi roubado e perdeu R$ ${money.toLocaleString().replace(/,/g, ".")}${chipsString} pro **${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID.toString() + '.nome')}** ` : ""}${bot.config.roubar}` +
						(target_espancado ? `\nVocê tomou uma coça e ficará hospitalizado por ${bot.segToHour(tempo_hospitalizado * 60)} ${bot.config.hospital}` : ""))
						.catch(() => console.log(`${tData.username} (${alvo}) foi roubado por ${uData.username} (${authorId}), mas eu não consegui avisá-lo`))
				})

				setTimeout(() => {
					bot.users.fetch(authorId).then(async user => {
						user.send({embeds: [embeds.pv.roubar]})
							.catch(() => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
								.catch(async () => `Não consegui responder ${await bot.data.get(authorId + ".username")} nem no PV nem no canal. \`Roubar\``))
					})
				}, uData.roubo - currTime)


				return bot.log(message, {
					description: `**${uData.username} roubou R$ ${money.toLocaleString().replace(/,/g, ".")} e ${chips.toLocaleString().replace(/,/g, ".")} fichas de ${tData.username}**`,
					color: bot.colors.roubar,
					fields: [
						{
							name: 'Espancou',
							value: `${target_espancado}. Tempo: ${tempo_hospitalizado} minutos`,
							inline: true,
						}, {
							name: 'Money',
							value: `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
							inline: true,
						}, {
							name: 'Ficha',
							value: uData.ficha.toLocaleString().replace(/,/g, "."),
							inline: true,
						},
						// {
						// 	name: 'Presentes',
						// 	value: uData._ovo.toLocaleString().replace(/,/g, "."),
						// 	inline: true,
						// },
						{
							name: 'Chance',
							value: `${chance}(random) < ${atkPower}(atk calculado)`,
							inline: true,
						},
					]
				})

			}
			else {
				//console.log("Falha")
				const embed_robb_final = {
					description: `Você falhou na sua tentativa e ficará preso por ${bot.segToHour(uData.classe === 'ladrao' ? Math.floor(tempo_preso * 60 * 1.15) : tempo_preso * 60)} ${bot.config.police}`,
					color: bot.colors.policia,
					footer: {
						text: uData.username,
						icon_url: membroAvatar
					},
					timestamp: new Date(),
				}

				messageRobb.edit({embeds: [embed_robb_final]})
					.catch(() => console.log("Não consegui editar mensagem `roubar`"))

				uData.preso = currTime + (uData.classe === 'ladrao' ? Math.floor(tempo_preso * 60 * 1000 * 1.15) : tempo_preso * 60 * 1000)
				uData.roubosL++
				await bot.data.set(alvo, tData)

				bot.users.fetch(alvo).then(async user => {
					user.send(`**${uData.username}** ${uData.gangID != null ? `da gangue **${await bot.gangs.get(uData.gangID.toString() + '.nome')}** ` : ""}tentou lhe roubar, mas a polícia o capturou e deixará ele preso por ${bot.segToHour(uData.classe === 'ladrao' ? Math.floor(tempo_preso * 60 * 1.15) : tempo_preso * 60)} ${bot.config.police}`)
						.catch(() => console.log(`${tData.username} (${alvo}) sofreu uma tentativa de roubo de ${uData.username} (${authorId}), mas eu não consegui avisá-lo`))
				})

				setTimeout(() => {
					bot.users.fetch(authorId).then(async user => {
						user.send({embeds: [embeds.pv.livre]})
							.catch(() => message.reply(`você está livre! ${bot.config.police}`)
								.catch(async () => `Não consegui responder ${await bot.data.get(authorId + ".username")} nem no PV nem no canal. \`Roubar\``))
					})
				}, uData.preso - currTime)

				await bot.data.set(authorId, uData)

				return bot.log(message, {
					description: `**${uData.username} falhou em roubar ${tData.username} e ficará preso por ${bot.segToHour(uData.classe === 'ladrao' ? Math.floor(tempo_preso * 60 * 1.15) : tempo_preso * 60)}**`,
					color: bot.colors.roubar,
				})

			}
		}, 62000)
	}
}

exports.config = {
	alias: ['r', 'rob', 'assaltar']
}