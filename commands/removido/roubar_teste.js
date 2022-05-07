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

function roubarLugar(bot, message, lugar, uData) {
	if (lugar == undefined)
		return

	let currTime = new Date().getTime();
	let prob = (bot.getRandom(0, 100) < lugar.sucesso ? true : false)

	if (prob) {
		recompensa = bot.getRandom(lugar.min, lugar.max)
		uData.roubosW += 1
		uData.roubo = currTime + 3000000 //+50m
		uData.moni += recompensa
		uData.valorRoubado += recompensa
		bot.data.set(message.author.id, uData)
		setTimeout(async () => {
			await bot.users.fetch(message.author.id).then(user => {
				user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
					.catch(err => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`))
			})
		}, uData.roubo - currTime)

		const log = new Discord.MessageEmbed()
			.setAuthor(`${uData.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`**${uData.username} roubou ${recompensa} de ${lugar.desc}**`)
			.addField("Money", uData.moni, true)
			.addField("Ficha", uData.ficha, true)
			.setColor(message.member.displayColor) // bot.colors.background // 
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send(log)
		return bot.createEmbed(message, `Você roubou R$ ${recompensa.toLocaleString().replace(/,/g, ".")} de **${lugar.desc}** ${bot.config.roubar}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

	} else {
		uData.roubosL++
		let tempo_preso = lugar.id * 20
		uData.preso = currTime + tempo_preso * 60 * 1000
		setTimeout(async () => {
			await bot.users.fetch(message.author.id).then(user => {
				user.send(`Você está livre! ${bot.config.police}`)
					.catch(err => message.reply(`você está livre! ${bot.config.police}`))
			})
		}, tempo_preso * 60 * 1000)

		bot.data.set(message.author.id, uData)
		const log = new Discord.MessageEmbed()
			.setAuthor(`${uData.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`**${uData.username} falhou em roubar ${lugar.desc} e ficará preso por ${bot.segToHour((uData.preso - currTime)/1000/60)}**`)
			.setColor(message.member.displayColor) // bot.colors.background // 
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send(log)

		return bot.createEmbed(message, `Você falhou em roubar **${lugar.desc}** e ficará preso por ${bot.segToHour(tempo_preso)} ${bot.config.police}`)
	}
}

function verifyRoubo(bot, message, emoji_id) {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((uData.roubo - currTime) / 1000 / 60))} ${bot.config.police}`)

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)

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
									return bot.createEmbed(message, `É necessário possuir ${emote} para este roubo ${bot.config.roubar}`)
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
		return bot.createEmbed(message, `É necessário possuir ${emotes} para este roubo ${bot.config.roubar}`)
	else
		return roubarLugar(bot, message, lugarRoubo, uData)
}

exports.run = async (bot, message, args) => {

	if (message.author.id != bot.config.adminID)
		return //bot.createEmbed(message, "Roubar desativado temporiamente.")
	let currTime = new Date().getTime()
	let option = args[0]

	if (!option) {
		let uData = bot.data.get(message.author.id)
		let emotes = ""
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.roubar} Roubar`)
			.setThumbnail("https://media.discordapp.net/attachments/691019843159326757/791444366727708672/roubar_20201223201323.png")
			.setColor(message.member.displayColor)
			.setDescription(`Encontre um alvo e roube tudo!
Quanto melhor a arma, maior a chance de roubo contra outros jogadores e mais protegido você estará.
Se falhar, você será preso por um tempo definido pelo poder de sua arma.
Se conseguir, deverá esperar 50 minutos para roubar novamente.
Há uma pequena chance do alvo ser também espancado!`)
			.addField('\u200b', `${(uData.roubo > currTime) ? `Você só poderá roubar novamente em ${bot.segToHour(Math.floor((uData.roubo - currTime) / 1000 / 60))}` : `**Lugares disponíveis para roubar**`}`)
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
							temp_emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote)
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
		embed.setFooter(bot.data.get(message.author.id + ".username"), message.member.user.avatarURL())
			.setTimestamp();

		return message.channel.send({
				embeds: [embed]
			})
			.then(msg => {
				msg.react(emoji_1)
					.then(() => msg.react(emoji_2))
					.then(() => msg.react(emoji_3))
					.then(() => msg.react(emoji_4))
					.then(() => msg.react(emoji_5))
					.then(() => msg.react(emoji_6))
					.then(r => {
						const umFilter = (reaction, user) => reaction.emoji.id === emoji_1 && user.id == message.author.id
						const doisFilter = (reaction, user) => reaction.emoji.id === emoji_2 && user.id == message.author.id
						const tresFilter = (reaction, user) => reaction.emoji.id === emoji_3 && user.id == message.author.id
						const quatroFilter = (reaction, user) => reaction.emoji.id === emoji_4 && user.id == message.author.id
						const cincoFilter = (reaction, user) => reaction.emoji.id === emoji_5 && user.id == message.author.id
						const seisFilter = (reaction, user) => reaction.emoji.id === emoji_6 && user.id == message.author.id

						const um = msg.createReactionCollector({
							umFilter,
							max: 1,
							time: 60000,
							errors: ['time'],
						})
						const dois = msg.createReactionCollector({
							doisFilter,
							max: 1,
							time: 60000,
							errors: ['time'],
						})
						const tres = msg.createReactionCollector({
							tresFilter,
							max: 1,
							time: 60000,
							errors: ['time'],
						})
						const quatro = msg.createReactionCollector({
							quatroFilter,
							max: 1,
							time: 60000,
							errors: ['time'],
						})
						const cinco = msg.createReactionCollector({
							cincoFilter,
							max: 1,
							time: 60000,
							errors: ['time'],
						})
						const seis = msg.createReactionCollector({
							seisFilter,
							max: 1,
							time: 60000,
							errors: ['time'],
						})

						um.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, emoji_1)))
						dois.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, emoji_2)))
						tres.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, emoji_3)))
						quatro.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, emoji_4)))
						cinco.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, emoji_5)))
						seis.on('collect', r => r.users.remove(message.author.id).then(m => verifyRoubo(bot, message, emoji_6)))
					})
			})
	}
	let uData = bot.data.get(message.author.id)

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (uData.roubo > currTime)
		return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((uData.roubo - currTime) / 1000 / 60))} ${bot.config.police}`)

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
			return bot.createEmbed(message, "Usuário não encontrado")

		// if (targetNoMention.length > 1) {
		// 	let str = ''
		// 	for (let i = 0; i < targetNoMention.length; ++i)
		// 		str += `**${targetNoMention[i].tag}**\n`

		// 	return bot.createEmbed(message, `Há ${targetNoMention.length} usuários com o mesmo nome.\n${str}`)
		// }
	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else {
		if (targetMention)
			alvo = targetMention.id
		else
			alvo = message.author.id
	}
	//let alvo = (target ? target.user : message.author);

	if (!targetMention && !targetNoMention[0])
		return bot.createEmbed(message, `Você deve inserir um usuário a ser roubado ${bot.config.roubar}`)

	let tData = bot.data.get(alvo)
	if (!targetMention) targetMention = targetNoMention[0]

	if (!tData) return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.roubar}`)

	bot.users.fetch(alvo).then(user => {
		alvo = user.id
	})

	if (uData.job != null) return bot.msgTrabalhando(message, uData)

	if (message.author.id == alvo)
		return bot.createEmbed(message, `Você não pode roubar você mesmo, idiota ${bot.config.roubar}`)

	if (alvo == bot.config.adminID)
		return bot.createEmbed(message, `Quem em sã consciência roubaria o Jacobi? ${bot.config.roubar}`)

	if (alvo == '526203502318321665') // bot
		return bot.createEmbed(message, `01000100 01100101 01110011 01101001 01110011 01110100 01100001 <:CrossRoadsLogo:757021182020157571>`)

	if (uData.gangID != null && uData.gangID == tData.gangID)
		return bot.createEmbed(message, `Você não pode roubar membros da sua gangue ${bot.config.roubar}`)

	let atkPower = 0
	let defPower = 0
	let moneyAtkPower = null
	let moneyDefPower = null
	//let armaATK
	//let armaDEF
	let atkPowerDefensor = 0

	Object.entries(uData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.atk) == "number") {
				atkPower = arma.atk
				//armaATK_ID = arma.id
				//emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == arma.emote)
				//armaATK = `${emote} **${arma.desc}**`
				//console.log("ATK: ", uData.nome, arma.desc, atkPower)
			}
		})
	})

	Object.entries(tData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.atk) == "number") {
				atkPowerDefensor = arma.atk
			}
		})
	})

	Object.entries(tData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.def > defPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.def) == "number") {
				defPower = arma.def
				//armaDEF_ID = arma.id
				//emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == arma.emote)
				//armaDEF = `${emote} **${arma.desc}**`
				//console.log("DEF: ", tData.nome, arma.desc, defPower)
			}
		})
	})

	Object.entries(uData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.moneyAtk > moneyAtkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.moneyAtk) == "number")
				moneyAtkPower = arma.moneyAtk
		})
	})

	Object.entries(tData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.moneyDef > moneyDefPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.moneyDef) == "number")
				moneyDefPower = arma.moneyDef
		})
	})

	if (atkPower == 0) {
		const log = new Discord.MessageEmbed()
			.setAuthor(`${uData.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`**${uData.username} tentou roubar ${tData.username}, mas não possuia nenhuma arma**`)
			.setColor(message.member.displayColor) // bot.colors.background // 
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send(log)
		return bot.createEmbed(message, `Você não pode roubar sem uma arma ${bot.config.roubar}`)
	}

	let hora = new Date().getHours()

	let multiplicador_evento_tempo_preso = 1
	let tempo_preso = 15 + 1.5 * atkPower * multiplicador_evento_tempo_preso
	let tempo_hospitalizado = 15 + (2 * defPower)

	if (uData._goggles > currTime && !(hora > 4 && hora < 20))
		atkPower += 3

	// Verificar com minigun depois
	if (atkPowerDefensor - atkPower > 30) {
		const log = new Discord.MessageEmbed()
			.setAuthor(`${uData.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`**${uData.username} tentou roubar ${tData.username}, mas não possuia arma forte o suficiente**`)
			.setColor(message.member.displayColor) // bot.colors.background // 
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send(log)
		return bot.createEmbed(message, `Você não pode roubar este jogador usando esta arma ${bot.config.roubar}`, "Consiga uma arma melhor")
	}
	if (tData._colete > currTime)
		defPower += 2
	if (tData._colete_p > currTime)
		defPower += 5
	if (tData._goggles > currTime && !(hora > 4 && hora < 20))
		defPower += 3

	if (defPower != 0 && tData.hospitalizado > currTime)
		defPower -= 5

	if (defPower == 0)
		atkPower *= 1.35

	atkPower -= getPercent(defPower, atkPower)

	// let tempo_preso = 15 * armaATK_ID
	let chance = bot.getRandom(0, 100)

	if (chance < atkPower) {
		//console.log("Sucesso")
		if (defPower != 0)
			moneyAtkPower -= getPercent(moneyDefPower, moneyAtkPower)

		let money = Math.floor(getPercent(moneyAtkPower, tData.moni))
		let chips = Math.floor((getPercent(moneyAtkPower, tData.ficha)) / 1.25)

		let chipsString = chips > 0 ?
			` e ${bot.config.ficha} ${chips.toLocaleString().replace(/,/g, ".")} fichas` : ""

		let target_espancado = false
		let chance_espancar = bot.getRandom(0, 100)
		//let tempoJob = tData.job != null ? bot.jobs[tData.job].time * 1000 * 60 : 0


		if (tData.preso < currTime && tData.jobTime < currTime && tData.hospitalizado < currTime && chance_espancar <= 25) {
			tData.qtHospitalizado += 1
			tData.hospitalizado = currTime + tempo_hospitalizado * 60 * 1000
			tData.espancarL++
			uData.espancarW++
			target_espancado = true
			setTimeout(async () => {
				await bot.users.fetch(alvo).then(user => {
					user.send(`Você está curado! ${bot.config.hospital}`).catch()
				})
			}, tempo_hospitalizado * 60 * 1000)
		}

		tData.moni -= money
		tData.ficha -= chips
		tData.qtRoubado += 1
		uData.moni += money
		uData.valorRoubado += money
		uData.ficha += chips
		uData.roubosW++
		uData.roubo = currTime + 3000000 //+50m

		bot.data.set(alvo, tData)
		bot.data.set(message.author.id, uData)

		bot.createEmbed(message, `Você roubou R$ ${money.toLocaleString().replace(/,/g, ".")}${chipsString} de **${tData.username}** ${bot.config.roubar}` +
			(target_espancado ? `\nVocê detonou, e ele ficará hospitalizado por ${bot.segToHour(tempo_hospitalizado)} ${bot.config.hospital}` : ""), `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}${chips > 0 ? ` • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}` : ""}`, bot.colors.roubar)

		bot.users.fetch(alvo).then(user => {
			user.send(`Você foi roubado e perdeu R$ ${money.toLocaleString().replace(/,/g, ".")}${chipsString} pro **${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : "" }${bot.config.roubar}` +
				(target_espancado ? `\nVocê tomou uma coça e ficará hospitalizado por ${bot.segToHour(tempo_hospitalizado)} ${bot.config.hospital}` : "")).catch()
		})

		setTimeout(async () => {
			await bot.users.fetch(message.author.id).then(user => {
				user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
					.catch(err => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`))
			})
		}, uData.roubo - currTime)

		const log = new Discord.MessageEmbed()
			.setAuthor(`${uData.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`**${uData.username} roubou R$ ${money} e ${chips} fichas de ${tData.username}**`)
			.addField("Money", uData.moni, true)
			.addField("Ficha", uData.ficha, true)
			.addField("Chance", `${atkPower}/${chance}`)
			.setColor(message.member.displayColor) // bot.colors.background // 
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send(log)

	} else {
		//console.log("Falha")
		bot.createEmbed(message, `Você falhou na sua tentativa e ficará preso por ${bot.segToHour(tempo_preso)} ${bot.config.police}`)
		uData.preso = currTime + tempo_preso * 60 * 1000
		uData.roubosL++
		uData.presoNotification = true

		bot.users.fetch(alvo).then(user => {
			user.send(`**${uData.username}** ${uData.gangID != null ? `da gangue **${bot.gangs.get(uData.gangID, 'nome')}** ` : "" }tentou lhe roubar mas acabou sendo preso ${bot.config.police}`).catch()
		})
		setTimeout(async () => {
			await bot.users.fetch(message.author.id).then(user => {
				let userT = bot.data.get(message.author.id)
				if (userT.presoNotification) {
					user.send(`Você está livre! ${bot.config.police}`)
						.catch(err => message.reply(`você está livre! ${bot.config.police}`))
					userT.presoNotification = false
					bot.data.set(message.author.id, userT)
				}
			})
		}, tempo_preso * 60 * 1000)

		const log = new Discord.MessageEmbed()
			.setAuthor(`${uData.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`**${uData.username} falhou em roubar ${tData.username}** e ficará preso por ${bot.segToHour((uData.preso - currTime)/1000/60)}`)
			.setColor(message.member.displayColor) // bot.colors.background // 
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send(log)

		bot.data.set(message.author.id, uData)

	}

	//		return bot.createEmbed(message, `Você deve escolher \`user\` ou \`lugar\` ${bot.config.roubar}`, "Para mais informações, use ;roubar")
}