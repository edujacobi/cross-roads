function getPercent(percent, from) {
	return (from / 100) * percent
}
const Discord = require("discord.js")

let emoji_1 = '769667860141178920'
let emoji_2 = '769667860090847273'
let emoji_3 = '769667860145504256'
let emoji_4 = '769667859985989633'
let emoji_5 = '769667859739049986'
let emoji_6 = '769667859902103553'
let multiplicador_evento_tempo_hospitalizado = 1
let multiplicador_evento_tempo_roubar = 0.75
let multiplicador_evento_tempo_preso = 0.75



function roubarLugar(bot, message, lugar, uData) {
	if (lugar == undefined)
		return

	let currTime = new Date().getTime();
	let membro = message.member.user

	let prob = (bot.getRandom(0, 100) < lugar.sucesso ? true : false)

	bot.data.set(message.author.id, true, 'emRoubo')

	const embed_robb_inicio = new Discord.MessageEmbed()
		.setAuthor('Roubo em andamento...', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'roubar').url)
		.setColor(bot.colors.roubar)
		.setFooter(`${uData.username} • ${lugar.desc}`, membro.avatarURL())
		.setTimestamp()

	message.channel.send({
		embeds: [embed_robb_inicio]
	}).then(message_robb => {
		setTimeout(() => {
			bot.data.set(message.author.id, false, 'emRoubo')

			uData = bot.data.get(message.author.id)

			if (prob) {
				recompensa = bot.getRandom(lugar.min, lugar.max)
				if (uData.classe == 'ladrao')
					recompensa = ~~(recompensa * 1.1)
				uData.roubosW += 1
				uData.roubo = currTime + 60 * (uData.classe == 'ladrao' ? 1.1 : (uData.classe == 'advogado' ? 0.85 : 1)) * 60 * 1000 * multiplicador_evento_tempo_roubar //+60m
				uData.moni += recompensa
				uData.valorRoubado += recompensa
				bot.data.set(message.author.id, uData)
				setTimeout(() => {
					bot.users.fetch(message.author.id).then(user => {
						user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
							.catch(err => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
								.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Roubar\``))
					})
				}, uData.roubo - currTime)

				const embed_robb_final = new Discord.MessageEmbed()
					.setDescription(`Você roubou R$ ${recompensa.toLocaleString().replace(/,/g, ".")} de **${lugar.desc}** ${bot.config.roubar}`)
					.setColor(bot.colors.roubar)
					.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, membro.avatarURL())
					.setTimestamp()

				message_robb.edit({
					embeds: [embed_robb_final]
				}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} roubou R$ ${recompensa.toLocaleString().replace(/,/g, ".")} de ${lugar.desc}**`)
					.addField("Money", uData.moni.toString(), true)
					.addField("Ficha", uData.ficha.toString(), true)
					.setColor(bot.colors.roubar))

			} else {
				uData.roubosL++
				let multiplo = uData.classe == 'ladrao' ? 1.1 : (uData.classe == 'advogado' ? 0.85 : 1)
				let tempo_preso = (lugar.id * 20) * (multiplo * multiplicador_evento_tempo_preso)
				uData.preso = currTime + (uData.classe == 'ladrao' ? Math.floor(tempo_preso * 60 * 1000 * 1.1) : tempo_preso * 60 * 1000)
				setTimeout(() => {
					bot.users.fetch(message.author.id).then(user => {
						let userT = bot.data.get(message.author.id)
						if (userT.preso != 0 && userT.fuga <= userT.preso) {
							user.send(`Você está livre! ${bot.config.police}`)
								.catch(err => message.reply(`você está livre! ${bot.config.police}`)
									.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Roubar\``))
						}
					})
				}, tempo_preso * 60 * 1000)

				bot.data.set(message.author.id, uData)

				const embed_robb_final = new Discord.MessageEmbed()
					.setDescription(`Você falhou em roubar **${lugar.desc}** e ficará preso por ${bot.segToHour(tempo_preso * 60)} ${bot.config.police}`)
					.setColor(bot.colors.policia)
					.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, membro.avatarURL())
					.setTimestamp()

				message_robb.edit({
					embeds: [embed_robb_final]
				}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} falhou em roubar ${lugar.desc} e ficará preso por ${bot.segToHour((uData.preso - currTime) / 1000)}**`)
					.setColor(bot.colors.roubar))

			}
		}, 5000 * lugar.id)
	}).catch(err => console.log("Não consegui enviar mensagem `roubar`", err))
}


function verifyRoubo(bot, message, emoji_id) {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour((uData.roubo - currTime) / 1000)} ${bot.config.police}`, null, bot.colors.policia)

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)

	if (uData.emRoubo)
		return bot.createEmbed(message, `Você já está em um roubo ${bot.config.roubar}`, null, bot.colors.roubar)

	let emotes = ""
	let lugarRoubo = null
	let lugar_id

	if (emoji_id == emoji_1) lugar_id = 1
	else if (emoji_id == emoji_2) lugar_id = 2
	else if (emoji_id == emoji_3) lugar_id = 3
	else if (emoji_id == emoji_4) lugar_id = 4
	else if (emoji_id == emoji_5) lugar_id = 5
	else if (emoji_id == emoji_6) lugar_id = 6

	Object.values(bot.robbery).forEach(lugar => {
		if (lugar_id == lugar.id) {
			Object.entries(uData).forEach(([key_udata, value_udata]) => {
				if (!Array.isArray(lugar.necessario)) {
					if (key_udata == "_" + lugar.necessario || (key_udata == "_9mm" && lugar.necessario == "colt45")) {
						if (currTime > value_udata) {
							Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
								if (lugar.necessario == key_gun) {
									let emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value_gun.emote)
									return bot.createEmbed(message, `É necessário possuir ${emote} para este roubo ${bot.config.roubar}`, null, bot.colors.roubar)
								}
							})
						} else {
							emotes = ""
							lugarRoubo = lugar
						}
					}

				} else {
					let ou = false
					let ou2 = false
					for (let i = 0; i < lugar.necessario.length; i++) {
						let arma = lugar.necessario[i]
						if (key_udata == "_" + arma || (key_udata == "_9mm" && arma == "colt45")) {
							if (currTime > value_udata) {
								Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
									if (arma == key_gun && lugarRoubo == null) {
										let temp_emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value_gun.emote)
										emotes += `${temp_emote}`
										if (ou && lugar.necessario.length == 3 && !ou2) {
											emotes += " ou "
											ou2 = true
										}
										if (!ou) {
											emotes += " ou "
											ou = true
										}
									}
								})
							} else {
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
	if (emotes != "")
		return bot.createEmbed(message, `É necessário possuir ${emotes} para este roubo ${bot.config.roubar}`, null, bot.colors.roubar)

	return roubarLugar(bot, message, lugarRoubo, uData)
}

exports.run = async (bot, message, args) => {
	let membro = message.member.user
	// if (message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, "Roubar desativado temporiamente.")
	let currTime = new Date().getTime()
	let option = args[0]

	if (!option) {
		let uData = bot.data.get(message.author.id)
		let emotes = ""
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.roubar} Roubar`)
			.setThumbnail("https://media.discordapp.net/attachments/691019843159326757/791444366727708672/roubar_20201223201323.png")
			.setColor(bot.colors.roubar)
			.setDescription(`Encontre um alvo e roube tudo!
Quanto melhor a arma, maior a chance de roubo contra outros jogadores e mais protegido você estará.
Se falhar, você será preso por um tempo definido pelo poder de sua arma.
Se conseguir, deverá esperar 1 hora para roubar novamente.
Há uma pequena chance do alvo ser também espancado!`)
			.addField('\u200b', `${(uData.roubo > currTime) ? `Você só poderá roubar novamente em ${bot.segToHour((uData.roubo - currTime) / 1000)}` : `**Lugares disponíveis para roubar**`}`)
			.setFooter(uData.username, membro.avatarURL())
			.setTimestamp();

		Object.values(bot.robbery).forEach(lugar => {
			let ou = false
			let ou2 = false
			let emote
			Object.entries(bot.guns).forEach(([key, value]) => {
				if (!Array.isArray(lugar.necessario)) {
					if (key == lugar.necessario)
						emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote)

				} else {
					for (let i = 0; i < lugar.necessario.length; i++) {
						let arma = lugar.necessario[i]
						if (key == arma) {
							let temp_emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote)
							emotes += `<:${temp_emote.name}:${temp_emote.id}>`
							if (ou && lugar.necessario.length == 3 && !ou2) {
								emotes += " ou "
								ou2 = true
							}
							if (!ou) {
								emotes += " ou "
								ou = true
							}
						}
					}
				}
			})

			necessario = emotes != "" ? `Necessário: ${emotes}` : `Necessário: ${emote}`

			embed.addField(`${lugar.id}: ${lugar.desc}`, `Sucesso: ${lugar.sucesso}%\n${necessario}\nR$ ${lugar.min.toLocaleString().replace(/,/g, ".")} - R$ ${lugar.max.toLocaleString().replace(/,/g, ".")}`, true)
			emotes = ""
		});

		return message.channel.send({
				embeds: [embed]
			})
			.then(msg => {
				const filter = (reaction, user) => [emoji_1, emoji_2, emoji_3, emoji_4, emoji_5].includes(reaction.emoji.id) && user.id == message.author.id

				const collector = msg.createReactionCollector({
					filter,
					time: 60000,
					errors: ['time'],
				})

				collector.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, r.emoji.id)))

				msg.react(emoji_1)
					.then(() => msg.react(emoji_2))
					.then(() => msg.react(emoji_3))
					.then(() => msg.react(emoji_4))
					.then(() => msg.react(emoji_5))
					.then(() => msg.react(emoji_6))
					.catch(err => console.log("Não consegui reagir mensagem `roubar`", err))
			}).catch(err => console.log("Não consegui enviar mensagem `roubar`", err))
	}
	let uData = bot.data.get(message.author.id)

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour((uData.roubo - currTime) / 1000)} ${bot.config.police}`, null, bot.colors.policia)

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
			return bot.createEmbed(message, `${bot.config.roubar} Usuário não encontrado`, null, bot.colors.roubar)

	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else
		alvo = targetMention ? targetMention.id : message.author.id

	if (!targetMention && !targetNoMention[0])
		return bot.createEmbed(message, `Você deve inserir um usuário a ser roubado ${bot.config.roubar}`, null, bot.colors.roubar)

	let tData = bot.data.get(alvo)
	if (!targetMention) targetMention = targetNoMention[0]

	if (!tData || tData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.roubar}`, null, bot.colors.roubar)

	bot.users.fetch(alvo).then(user => alvo = user.id).catch(err => console.log(`Não consegui obter informações de ${tData.username} (${alvo})`))

	if (uData.job != null) return bot.msgTrabalhando(message, uData)

	if (message.author.id == alvo)
		return bot.createEmbed(message, `Você não pode roubar você mesmo, idiota ${bot.config.roubar}`, null, bot.colors.roubar)

	if (alvo == bot.config.adminID)
		return bot.createEmbed(message, `Quem em sã consciência roubaria o Jacobi? ${bot.config.roubar}`, null, bot.colors.roubar)

	if (alvo == '526203502318321665') // bot
		return bot.createEmbed(message, `01000100 01100101 01110011 01101001 01110011 01110100 01100001 <:CrossRoadsLogo:757021182020157571>`, null, bot.colors.roubar)

	if (uData.gangID != null && uData.gangID == tData.gangID)
		return bot.createEmbed(message, `Você não pode roubar membros da sua gangue ${bot.config.roubar}`, null, bot.colors.roubar)

	if (tData.classe == undefined)
		return bot.createEmbed(message, `**${tData.username}** não está ativo na temporada e não pode ser roubado ${bot.config.roubar}`, null, bot.colors.roubar)

	if (uData.emRoubo)
		return bot.createEmbed(message, `Você já está em um roubo ${bot.config.roubar}`, null, bot.colors.roubar)

	if (alvo != bot.config.adminID && tData.emRoubo)
		return bot.createEmbed(message, `${tData.username} está em um roubo, cruze os braços e espere um pouco ${bot.config.roubar}`, null, bot.colors.roubar)

	if (uData.galoEmRinha)
		return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
	if (tData.galoEmRinha)
		return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

	let atkPower = 0
	let defPower = 0
	let moneyAtkPower = null
	let moneyDefPower = null
	let atkPowerDefensor = 0
	let armaATK = ''

	// ATK, arma e moneyATK do ladrão
	Object.entries(uData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.atk) == "number") {
				atkPower = arma.atk
				armaATK = `${bot.config[arma.emote]} ${arma.desc}`
			}

			if (value > currTime && arma.moneyAtk > moneyAtkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.moneyAtk) == "number")
				moneyAtkPower = arma.moneyAtk
		})
	})

	// ATK, DEF e moneyDEF do roubado
	Object.entries(tData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.atk > atkPowerDefensor && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.atk) == "number")
				atkPowerDefensor = arma.atk

			if (value > currTime && arma.def > defPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.def) == "number")
				defPower = arma.def

			if (value > currTime && arma.moneyDef > moneyDefPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.moneyDef) == "number")
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

	if (uData._goggles > currTime && hora <= 4 && hora >= 20)
		atkPower += 3

	if (tData._goggles > currTime && hora <= 4 && hora >= 20)
		atkPowerDefensor += 3

	if (atkPowerDefensor - atkPower > 20) {
		bot.log(new Discord.MessageEmbed()
			.setDescription(`**${uData.username} tentou roubar ${tData.username} utilizando ${armaATK}, mas ela não é forte o suficiente**`)
			.setColor(bot.colors.roubar))

		return bot.createEmbed(message, `Você não pode roubar este jogador usando esta arma ${bot.config.roubar}`, "Consiga uma arma melhor", bot.colors.roubar)
	}
	if (tData._colete > currTime)
		defPower += 2
	if (tData._colete_p > currTime)
		defPower += 5
	if (tData._goggles > currTime && hora <= 4 && hora >= 20)
		defPower += 3

	if (tData._exoesqueleto > currTime) {
		defPower += 5
		moneyDefPower += 5
	}

	if (defPower != 0 && tData.hospitalizado > currTime) {
		defPower -= 5
		moneyDefPower -= 5
	}

	let tGang = bot.gangs.get(tData.gangID)
	if (tGang && tGang.base == 'bunker')
		defPower += 0.5 * tGang.baseLevel

	let granadaUsada = false
	let escolhido = false

	if (uData._ovogranada <= 0)
		return roubo()

	let aceitar = '572134588340633611'
	let negar = '572134589863034884'

	bot.createEmbed(message, `Você possui **${bot.config.ovogranada} ${uData._ovogranada} Granada**.\nDeseja utilizar uma neste roubo? Seu ATK aumentará em 5!`, `60 segundos para responder`, bot.colors.roubar)
		.then(msg => {

			msg.react(aceitar) // aceitar
				.then(() => msg.react(negar)) // negar
				.catch(err => console.log("Não consegui reagir mensagem `roubar`", err))

			const filter = (reaction, user) => [aceitar, negar].includes(reaction.emoji.id) && user.id == message.author.id

			const collector = msg.createReactionCollector({
				filter,
				time: 90000,
				errors: ['time']
			});

			collector.on('collect', r => {
				if (msg) msg.reactions.removeAll().then(async () => {
					if (r.emoji.id === aceitar) { //aceitar
						uData = bot.data.get(message.author.id)
						tData = bot.data.get(alvo)

						if (uData.emRoubo)
							return bot.createEmbed(message, `Você já está em um roubo ${bot.config.roubar}`, null, bot.colors.roubar)
						if (alvo != bot.config.adminID && tData.emRoubo)
							return bot.createEmbed(message, `Enquanto você pensava, alguém foi mais rápido e está assaltando ${tData.username}. Eespere um pouco ${bot.config.roubar}`, null, bot.colors.roubar)
						if (uData.galoEmRinha)
							return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
						if (tData.galoEmRinha)
							return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

						atkPower += 5
						granadaUsada = true

						collector.stop()

					} else if (r.emoji.id === negar) {
						collector.stop()
					}
				}).catch(err => console.log("Não consegui remover as reações mensagem `roubar`", err))

			})
			collector.on('end', r => {
				msg.delete()
				return roubo()
			})
		})

	function roubo() {
		uData = bot.data.get(message.author.id)
		tData = bot.data.get(alvo)
		if (uData.emRoubo)
			return bot.createEmbed(message, `Você já está em um roubo ${bot.config.roubar}`, null, bot.colors.roubar)
		if (alvo != bot.config.adminID && tData.emRoubo)
			return bot.createEmbed(message, `Enquanto você pensava, alguém foi mais rápido e está assaltando ${tData.username}. Eespere um pouco ${bot.config.roubar}`, null, bot.colors.roubar)
		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Você está apostando em uma rinha e não pode fazer isto ${bot.config.galo}`, null, bot.colors.roubar)
		if (tData.galoEmRinha)
			return bot.createEmbed(message, `${tData.username} está em uma rinha, torça para ele perder e espere um pouco ${bot.config.galo}`, null, bot.colors.roubar)

		let tempo_preso = (10 + 1.5 * atkPower) * (uData.classe == 'advogado' ? 0.85 : 1) * multiplicador_evento_tempo_preso
		let tempo_hospitalizado = parseInt(25 + defPower / 2) * multiplicador_evento_tempo_hospitalizado
		let tempo_adicional_preso_chamar_policia = Math.floor((25 + 0.5 * atkPower)) * multiplicador_evento_tempo_preso

		if (uData.classe == 'assassino')
			atkPower *= 1.1
		if (tData.classe == 'assassino' || tData.classe == 'empresario')
			defPower *= 0.9
		if (defPower == 0)
			atkPower *= 1.35

		bot.data.set(message.author.id, true, 'emRoubo')
		bot.data.set(alvo, true, 'emRoubo')

		// let tempo_preso = 15 * armaATK_ID
		let chance = bot.getRandom(0, 100)
		const embed_robb_inicio = new Discord.MessageEmbed()
			.setAuthor('Roubo em andamento...', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'roubar').url)
			.setColor(bot.colors.roubar)
			.setFooter(uData.username, membro.avatarURL())
			.setTimestamp()
		if (granadaUsada)
			embed_robb_inicio.setDescription(`**Utilizando ${bot.config.ovogranada} Granada**!`)

		const embed_robb_private = new Discord.MessageEmbed()
			.setAuthor(`Mãos ao alto!`, membro.avatarURL())
			.setDescription(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : "" }está tentando lhe roubar utilizando **${armaATK}**${granadaUsada ? ` e ${bot.config.ovogranada} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
			.addField(`${bot.config.emmetGun} Reagir`, `+5 DEF, mas você ficará hospitalizado caso seja roubado`, true)
			.addField(`${bot.config.police} Chamar a polícia`, `-5 DEF, mas ele ficará preso +${tempo_adicional_preso_chamar_policia} min caso falhe`, true)
			.addField(`<:fazer_nada:758817091872096267> Não fazer nada`, `Nenhum efeito adicional`, true)
			.setColor(bot.colors.roubar)
			.setFooter("Você tem 60 segundos para responder")
			.setTimestamp()

		let chance_espancar = bot.getRandom(0, 100)

		message.channel.send({
			embeds: [embed_robb_inicio]
		}).then(message_robb => {
			bot.users.fetch(alvo).then(user => {
				user.send({
						embeds: [embed_robb_private]
					})
					.then(msg => {
						let reagir = '539501924307959808'
						let policia = '539502682545717288'
						let nada = '758817091872096267'
						msg.react(reagir)
							.then(() => msg.react(policia))
							.then(() => msg.react(nada))
							.catch(err => console.log("Não consegui reagir mensagem `roubar`", err))
							.then(r => {
								const filter = (reaction, user) => [reagir, policia, nada].includes(reaction.emoji.id) && user.id == alvo

								const collector = msg.createReactionCollector({
									filter,
									time: 65000,
									errors: ['time'],
								})

								collector.on('collect', r => {
									let tData = bot.data.get(alvo)
									collector.stop()

									if (r.emoji.id === reagir) {
										if (tData.preso > currTime)
											return bot.users.fetch(alvo).then(user => user.send(`Você está preso por mais ${bot.segToHour((tData.preso - currTime) / 1000)} e não pode fazer isto ${bot.config.police}`))

										if (tData.hospitalizado > currTime)
											return bot.users.fetch(alvo).then(user => user.send(`Você está hospitalizado por mais ${bot.segToHour((tData.hospitalizado - currTime) / 1000)} e não pode fazer isto ${bot.config.hospital}`))

										if (tData.jobTime > currTime)
											return bot.users.fetch(alvo).then(user => user.send(`Você está trabalhando por mais ${bot.segToHour((tData.jobTime - currTime) / 1000)} e não pode fazer isto ${bot.config.bulldozer}`))

										if (moneyDefPower == null)
											return bot.users.fetch(alvo).then(user => user.send(`Você não pode reagir sem uma arma ${bot.config.roubar}`))

										collector.stop()
										const embed_robb_private_reagiu = new Discord.MessageEmbed()
											.setAuthor(`Mãos ao alto!`, membro.avatarURL())
											.setDescription(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : "" }está tentando lhe roubar utilizando ${armaATK}${granadaUsada ? ` e ${bot.config.ovogranada} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
											.addField(`${bot.config.emmetGun} Reagir`, `Reagindo...`)
											.setColor(bot.colors.roubar)
											.setFooter("Você tem 60 segundos para responder")
											.setTimestamp()
										msg.edit({
											embeds: [embed_robb_private_reagiu]
										}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

										const embed_robb_inicio_reagiu = new Discord.MessageEmbed()
											.setAuthor('Roubo em andamento...', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'roubar').url)
											.setDescription(`${bot.config.emmetGun} ${tData.username} está reagindo!`)
											.setColor(bot.colors.roubar)
											.setFooter(bot.data.get(message.author.id, "username"), membro.avatarURL())
											.setTimestamp()
										message_robb.edit({
											embeds: [embed_robb_inicio_reagiu]
										}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

										defPower += 5
										chance_espancar = 0 // deve ser menor que 25

									} else if (r.emoji.id === policia) {
										// if (tData.preso > currTime)
										// 	return bot.users.fetch(alvo).then(user => user.send(`Você está preso por mais ${bot.segToHour((tData.preso - currTime) / 1000 / 60)} e não pode fazer isto ${bot.config.police}`))

										if (tData.hospitalizado > currTime)
											return bot.users.fetch(alvo).then(user => user.send(`Você está hospitalizado por mais ${bot.segToHour((tData.hospitalizado - currTime) / 1000)} e não pode fazer isto ${bot.config.hospital}`))

										if (defPower == 0)
											return bot.users.fetch(alvo).then(user => user.send(`Você não possui poder de defesa suficiente para convencer a polícia a te ajudar ${bot.config.police}`))

										collector.stop()
										const embed_robb_private_policia = new Discord.MessageEmbed()
											.setAuthor(`Mãos ao alto!`, membro.avatarURL())
											.setDescription(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : "" }está tentando lhe roubar utilizando ${armaATK}${granadaUsada ? ` e ${bot.config.ovogranada} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
											.addField(`${bot.config.police} Chamar a polícia`, `Chamando a polícia...`)
											.setColor(bot.colors.roubar)
											.setFooter("Você tem 60 segundos para responder")
											.setTimestamp()
										msg.edit({
											embeds: [embed_robb_private_policia]
										}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

										const embed_robb_inicio_policia = new Discord.MessageEmbed()
											.setAuthor('Roubo em andamento...', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'roubar').url)
											.setDescription(`${bot.config.police} ${tData.username} está chamando a polícia!`)
											.setColor(bot.colors.roubar)
											.setFooter(uData.username, membro.avatarURL())
											.setTimestamp()
										message_robb.edit({
											embeds: [embed_robb_inicio_policia]
										}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

										defPower -= 5
										tempo_preso += tempo_adicional_preso_chamar_policia

									} else if (r.emoji.id === nada) {
										collector.stop()
										const embed_robb_private_nada = new Discord.MessageEmbed()
											.setAuthor(`Mãos ao alto!`, membro.avatarURL())
											.setDescription(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : "" }está tentando lhe roubar utilizando ${armaATK}${granadaUsada ? ` e ${bot.config.ovogranada} **Granada**` : ''} ${bot.config.roubar}\nO que você deseja fazer?`)
											.addField(`<:fazer_nada:758817091872096267> Não fazer nada`, `Fazendo nada...`)
											.setColor(bot.colors.roubar)
											.setFooter("Você tem 60 segundos para responder")
											.setTimestamp()
										msg.edit({
											embeds: [embed_robb_private_nada]
										}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

										const embed_robb_inicio_nada = new Discord.MessageEmbed()
											.setAuthor('Roubo em andamento...', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'roubar').url)
											.setDescription(`<:fazer_nada:758817091872096267> ${tData.username} não está fazendo nada!`)
											.setColor(bot.colors.roubar)
											.setFooter(uData.username, membro.avatarURL())
											.setTimestamp()
										message_robb.edit({
											embeds: [embed_robb_inicio_nada]
										}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

									}
								})

								setTimeout(() => msg.delete(), 61000)
							})
					}).catch(err => console.log(`Não consegui mandar mensagem privada para ${user.username} (${alvo})`))
			}).catch(err => console.log(`Não consegui iniciar o roubo de ${uData.username} (${message.author.id} em ${tData.username} (${alvo})`))

			setTimeout(() => {
				uData = bot.data.get(message.author.id)
				tData = bot.data.get(alvo)
				// console.log(granadaUsada)
				if (granadaUsada)
					uData._ovogranada -= 1

				atkPower -= getPercent(defPower, atkPower)
				if (chance < atkPower) {
					//console.log("Sucesso")
					if (defPower > 0)
						moneyAtkPower -= getPercent(moneyDefPower, moneyAtkPower)

					if (uData.classe == 'ladrao')
						moneyAtkPower *= 1.1

					let money = Math.floor(getPercent(moneyAtkPower, tData.moni))
					let chips = Math.floor((getPercent(moneyAtkPower, tData.ficha)) / 1.4)
					// let ovosRoubados = Math.floor((getPercent(moneyAtkPower, tData._ovo)) / 2)

					let chipsString = chips > 0 ? ` e ${bot.config.ficha} ${chips.toLocaleString().replace(/,/g, ".")} fichas` : ""

					// chipsString += ovosRoubados > 0 ? ` e ${bot.config.ovo} ${ovosRoubados.toLocaleString().replace(/,/g, ".")} ovos de páscoa` : ""

					let target_espancado = false

					if (tData.preso < currTime && tData.jobTime < currTime && tData.hospitalizado < currTime && defPower > 0 && chance_espancar <= 25) {
						tData.qtHospitalizado += 1
						tData.hospitalizado = currTime + tempo_hospitalizado * 60 * 1000
						tData.espancarL++
						uData.espancarW++
						target_espancado = true
						setTimeout(() => {
							bot.users.fetch(alvo).then(user => {
								let userT = bot.data.get(alvo)
								if (userT.hospitalizadoNotification) {
									user.send(`Você está curado! ${bot.config.hospital}`)
										.catch(err => message.reply(`você está curado! ${bot.config.hospital}`)
											.catch(er => `Não consegui responder ${bot.data.get(alvo, "username")} nem no PV nem no canal. \`Roubar\``))
									userT.hospitalizadoNotification = false
									bot.data.set(alvo, userT)
								}
							})
						}, tempo_hospitalizado * 60 * 1000)
					}

					// tData._ovo -= ovosRoubados
					// uData._ovo += ovosRoubados

					tData.moni -= money
					tData.ficha -= chips
					tData.qtRoubado += 1
					uData.moni += money
					uData.valorRoubado += money + (chips * 80)
					uData.ficha += chips
					uData.roubosW++
					uData.roubo = currTime + 60 * (uData.classe == 'ladrao' ? 1.1 : (uData.classe == 'advogado' ? 0.85 : 1)) * 60 * 1000 * multiplicador_evento_tempo_roubar //+60m
					uData.emRoubo = false
					tData.emRoubo = false

					bot.data.set(alvo, tData)
					bot.data.set(message.author.id, uData)

					const embed_robb_final = new Discord.MessageEmbed()
						.setDescription(`Você roubou R$ ${money.toLocaleString().replace(/,/g, ".")}${chipsString} de **${tData.username}** ${bot.config.roubar}` +
							(target_espancado ? `\nVocê detonou, e ele ficará hospitalizado por ${bot.segToHour(tempo_hospitalizado * 60)} ${bot.config.hospital}` : ""))
						.setColor(bot.colors.roubar)
						.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}${chips > 0 ? ` • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}` : ""}`, membro.avatarURL())
						.setTimestamp()
					message_robb.edit({
						embeds: [embed_robb_final]
					}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

					bot.users.fetch(alvo).then(user => {
						user.send(`Você foi roubado e perdeu R$ ${money.toLocaleString().replace(/,/g, ".")}${chipsString} pro **${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}${bot.config.roubar}` +
								(target_espancado ? `\nVocê tomou uma coça e ficará hospitalizado por ${bot.segToHour(tempo_hospitalizado * 60)} ${bot.config.hospital}` : ""))
							.catch(err => console.log(`${tData.username} (${alvo}) foi roubado por ${uData.username} (${message.author.id}), mas eu não consegui avisá-lo`))
					})

					setTimeout(() => {
						bot.users.fetch(message.author.id).then(user => {
							user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
								.catch(err => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
									.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Roubar\``))
						})
					}, uData.roubo - currTime)

					return bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${uData.username} roubou R$ ${money.toLocaleString().replace(/,/g, ".")} e ${chips.toLocaleString().replace(/,/g, ".")} fichas de ${tData.username}**`)
						.addField("Espancou", `${target_espancado}. Tempo: ${tempo_hospitalizado} minutos`, true)
						.addField("Money", `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, true)
						.addField("Ficha", uData.ficha.toLocaleString().replace(/,/g, "."), true)
						.addField("Chance", `${chance}(random) < ${atkPower}(atk calculado)`, true)
						.setColor(bot.colors.roubar))

				} else {
					//console.log("Falha")
					const embed_robb_final = new Discord.MessageEmbed()
						.setDescription(`Você falhou na sua tentativa e ficará preso por ${bot.segToHour(uData.classe == 'ladrao' ? Math.floor(tempo_preso * 60 * 1.1) : tempo_preso * 60 )} ${bot.config.police}`)
						.setColor(bot.colors.policia)
						.setFooter(uData.username, membro.avatarURL())
						.setTimestamp()
					message_robb.edit({
						embeds: [embed_robb_final]
					}).catch(err => console.log("Não consegui editar mensagem `roubar`", err))

					uData.preso = currTime + (uData.classe == 'ladrao' ? Math.floor(tempo_preso * 60 * 1000 * 1.1) : tempo_preso * 60 * 1000)
					uData.roubosL++
					uData.presoNotification = true
					uData.emRoubo = false
					tData.emRoubo = false
					bot.data.set(alvo, tData)

					bot.users.fetch(alvo).then(user => {
						user.send(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : ""}tentou lhe roubar, mas a polícia o capturou e deixará ele preso por ${bot.segToHour(tempo_preso * 60)} ${bot.config.police}`)
							.catch(err => console.log(`${tData.username} (${alvo}) sofreu uma tentativa de roubo de ${uData.username} (${message.author.id}), mas eu não consegui avisá-lo`))
					})
					setTimeout(() => {
						bot.users.fetch(message.author.id).then(user => {
							let userT = bot.data.get(message.author.id)
							if (userT.preso != 0) {
								user.send(`Você está livre! ${bot.config.police}`)
									.catch(err => message.reply(`você está livre! ${bot.config.police}`)
										.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Roubar\``))
							}
						})
					}, uData.preso - currTime)

					bot.data.set(message.author.id, uData)

					return bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${uData.username} falhou em roubar ${tData.username} e ficará preso por ${bot.segToHour((uData.preso - currTime) / 1000)}**`)
						.setColor(bot.colors.roubar))

				}
			}, 62000)
		}).catch(err => console.log("Não consegui enviar mensagem `roubar`", err))
	}

	//		return bot.createEmbed(message, `Você deve escolher \`user\` ou \`lugar\` ${bot.config.roubar}`, "Para mais informações, use ;roubar")
}
exports.config = {
	alias: ['r', 'rob', 'assaltar']
};