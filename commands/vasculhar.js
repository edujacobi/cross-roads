const Discord = require('discord.js')
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let multiplicador_evento = 1
	const hora = 3600000
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]

	function vasculharLugar(lugar, uData) {
		let item = uData.classe === 'mendigo' ? bot.getRandom(0, 15) : bot.getRandom(0, 17) //normal: 15/17
		let achou = ''
		uData.vasculhar = currTime + hora * multiplicador_evento
		// if (lugar == baile)
		// 	uData.vasculhar = currTime + 600000
		Object.entries(lugar).forEach(([key, value]) => {
			if (item == key) {
				if (value.item !== 'moni' && value.item !== 'ficha' && value.item !== 'granada' && value.item !== 'flor' && value.item !=='badge' && value.item !== 'ovo') {
					Object.entries(uData.arma).forEach(([key_udata, arma]) => {
						if (key_udata == value.item) {
							arma.tempo = arma.tempo > currTime ? arma.tempo + value.tempo * hora : currTime + value.tempo * hora
							Object.values(bot.guns).forEach(gun => {
								if (gun.data == value.item) {
									let emote = gun.skins[arma.skinAtual].emote
									achou = true
									uData.vasculharAchou += 1
									if (message.author.id !== bot.config.adminID)
										bot.data.set(message.author.id, uData)
									return bot.createEmbed(message, `Você encontrou ${emote} **${gun.desc}** com duração de ${value.tempo} ${value.tempo == 1 ? `hora` : `horas`} enquanto vasculhava ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
								}
							})
						}
					})
				} else if (value.item === 'moni') {
					let money = bot.getRandom(value.min, value.max)
					uData.moni += money
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id !== bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou **R$ ${money.toLocaleString().replace(/,/g, '.')}** enquanto vasculhava ${bot.config.vasculhar}`, null, bot.colors.vasculhar)

				} else if (value.item === 'ficha') {
					let ficha = bot.getRandom(value.min, value.max)
					uData.ficha += ficha
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id !== bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.config.ficha} **${ficha.toLocaleString().replace(/,/g, '.')} ${ficha == 1 ? `Ficha` : `Fichas`}** enquanto vasculhava ${bot.config.vasculhar}`, `Use-as no Cassino!`, bot.colors.vasculhar)

				} else if (value.item === 'granada') {
					let quant = bot.getRandom(value.min, value.max)
					uData.arma.granada.quant += quant
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id !== bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote} **${quant.toLocaleString().replace(/,/g, '.')} ${quant == 1 ? `Granada` : `Granadas`}** enquanto vasculhava ${bot.config.vasculhar}`, `Shaka laka boom!`, bot.colors.vasculhar)

				} else if (value.item === 'flor') {
					let quant = 1
					uData._flor += quant
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id !== bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.config.flor} **${quant.toLocaleString().replace(/,/g, '.')} ${quant == 1 ? `Flor` : `Flores`}** enquanto vasculhava ${bot.config.vasculhar}`, `Você pode usá-las nos Casamentos! → ;casar`, bot.colors.vasculhar)

				} else if (value.item === 'ovo') {
					let quant = bot.getRandom(value.min, value.max)
					uData._ovo += quant
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id !== bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.config.ovo} **${quant.toLocaleString().replace(/,/g, '.')} ${quant == 1 ? `Presente` : `Presentes`}** enquanto vasculhava ${bot.config.vasculhar}`, `Use-os no Mercado do Natal! → ;natal`, 'YELLOW')
				}
				// else if (value.item == 'badge') {
				// 	achou = true
				// 	uData.vasculhar = currTime + 600000
				// 	uData.badgeBaileMandrake = true
				// 	if (message.author.id != bot.config.adminID)
				// 		bot.data.set(message.author.id, uData)
				// 	return bot.createEmbed(message, `Você encontrou o ${bot.badges.mandrake} **Óculos Mandrake** enquanto vasculhava ${bot.config.vasculhar}`, `Ele ficará lindo no seu galo!`, bot.colors.vasculhar)
				// }
			}
		})
		if (!achou) {
			if (message.author.id !== bot.config.adminID)
				bot.data.set(message.author.id, uData)
			return bot.createEmbed(message, `Você não encontrou nada enquanto vasculhava ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
		}
	}

	let uData = bot.data.get(message.author.id)

	let lixao = {
		1: {
			item: 'faca',
			tempo: 6,
		},
		2: {
			item: 'colt45',
			tempo: 4,
		},
		3: {
			item: 'colt45',
			tempo: 3,
		},
		4: {
			item: 'moni',
			min: 15,
			max: 150,
		},
		5: {
			item: 'moni',
			min: 50,
			max: 500,
		},
		6: {
			item: 'ficha',
			min: 1,
			max: 5,
		},
		7: {
			item: 'faca',
			tempo: 4,
		},
		8: {
			item: 'faca',
			tempo: 3,
		},
		9: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	let matagal = {
		1: {
			item: 'faca',
			tempo: 2,
		},
		2: {
			item: 'colt45',
			tempo: 1,
		},
		3: {
			item: 'money',
			min: 50,
			max: 250,
		},
		4: {
			item: 'money',
			min: 75,
			max: 750,
		},
		5: {
			item: 'money',
			min: 500,
			max: 1000,
		},
		6: {
			item: 'ficha',
			min: 1,
			max: 5,
		},
		7: {
			item: 'money',
			min: 750,
			max: 1250,
		},
		8: {
			item: 'money',
			min: 100,
			max: 500,
		},
		9: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	let esgoto = {
		1: {
			item: 'faca',
			tempo: 2,
		},
		2: {
			item: 'colt45',
			tempo: 1,
		},
		3: {
			item: 'moni',
			min: 15,
			max: 150,
		},
		4: {
			item: 'moni',
			min: 50,
			max: 500,
		},
		5: {
			item: 'ficha',
			min: 1,
			max: 5,
		},
		6: {
			item: 'ficha',
			min: 5,
			max: 10,
		},
		7: {
			item: 'ficha',
			min: 10,
			max: 15,
		},
		8: {
			item: 'ficha',
			min: 5,
			max: 15,
		},
		9: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	let fabrica = {
		// Nes: escopeta
		1: {
			item: 'rifle',
			tempo: 6,
		},
		2: {
			item: 'colete',
			tempo: 2,
		},
		3: {
			item: 'escopeta',
			tempo: 4,
		},
		4: {
			item: 'mp5',
			tempo: 2,
		},
		5: {
			item: 'escopeta',
			tempo: 4,
		},
		6: {
			item: 'moni',
			min: 5000,
			max: 10000,
		},
		7: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	let usina = {
		// Nes: ak47
		1: {
			item: 'goggles',
			tempo: 4,
		},
		2: {
			item: 'colete',
			tempo: 6,
		},
		3: {
			item: 'ak47',
			tempo: 4,
		},
		4: {
			item: 'm4',
			tempo: 2,
		},
		5: {
			item: 'moni',
			min: 10000,
			max: 35000,
		},
		6: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	let nave = {
		// Nes: RPG
		1: {
			item: 'rpg', //rpg
			tempo: 4,
		},
		2: {
			item: 'colete', // bazuca
			tempo: 6,
		},
		3: {
			item: 'ficha',
			min: 500,
			max: 750,
		},
		4: {
			item: 'ficha',
			min: 750,
			max: 1000,
		},
		5: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	// let ninho = {
	// 	1: {
	// 		item: "ovo",
	// 		min: 1,
	// 		max: 5,
	// 	},
	// 	2: {
	// 		item: "ovo",
	// 		min: 5,
	// 		max: 10,
	// 	},
	// 	3: {
	// 		item: "ovo",
	// 		min: 15,
	// 		max: 20,
	// 	},
	// 	4: {
	// 		item: "ovo",
	// 		min: 15,
	// 		max: 20,
	// 	},
	// 	5: {
	// 		item: "ovo",
	// 		min: 15,
	// 		max: 20,
	// 	},
	// 	6: {
	// 		item: "ovo",
	// 		min: 5,
	// 		max: 10,
	// 	},
	// 	7: {
	// 		item: "ovo",
	// 		min: 5,
	// 		max: 10,
	// 	},
	// 	8: {
	// 		item: "ovo",
	// 		min: 25,
	// 		max: 35,
	// 	},
	// }
	let arvore = {
		1: {
			item: 'ovo',
			min: 5,
			max: 10,
		},
		2: {
			item: 'ovo',
			min: 5,
			max: 10,
		},
		3: {
			item: 'ovo',
			min: 10,
			max: 15,
		},
		4: {
			item: 'ovo',
			min: 10,
			max: 15,
		},
		5: {
			item: 'ovo',
			min: 15,
			max: 20,
		},
		6: {
			item: 'ovo',
			min: 5,
			max: 10,
		},
		7: {
			item: 'ovo',
			min: 15,
			max: 25,
		},
		8: {
			item: 'ovo',
			min: 15,
			max: 25,
		},
		9: {
			item: 'flor',
			min: 1,
			max: 1,
		},
	}
	let base = {
		1: {
			item: 'bazuca', // bazuca
			tempo: 1,
		},
		2: {
			item: 'exoesqueleto', // bazuca
			tempo: 1,
		},
		3: {
			item: 'granada', // bazuca
			min: 1,
			max: 2,
		},
		4: {
			item: 'flor',
			min: 1,
			max: 1,
		},
		// 7: {
		// 	item: "minigun", // bazuca
		// 	tempo: 1,
		// },
		// 8: {
		// 	item: "minigun", // bazuca
		// 	tempo: 0.5,
		// },
		// 9: {
		// 	item: "minigun", // bazuca
		// 	tempo: 2,
		// },
	}
	// let baile = {
	// 	1: {
	// 		item: "badge",
	// 	},
	// }

	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.vasculhar} Vasculhar`)
			.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/948017009633919057/VasculharNew2.png')
			.setDescription('Procuro pessoas corajosas e sem nojo de entrar em locais sujos e perigosos. Muitas coisas boas podem ser encontradas!\nVocê pode vasculhar uma vez a cada hora.')
			.setColor(bot.colors.vasculhar)
			.addField('Lixão', `O lixão tem chances maiores de encontrar **Armas**.
${bot.guns.faca.skins[uData.arma.faca.skinAtual].emote}${bot.guns.colt45.skins[uData.arma.colt45.skinAtual].emote}${bot.config.ficha}${bot.config.coin}\n\`;vasculhar lixão\``, true)
			.addField('Matagal', `No matagal você encontrará **Dinheiro** mais facilmente.
${bot.guns.faca.skins[uData.arma.faca.skinAtual].emote}${bot.guns.colt45.skins[uData.arma.colt45.skinAtual].emote}${bot.config.ficha}${bot.config.coin}\n\`;vasculhar matagal\``, true)
			.addField('Esgoto', `**Fichas** são encontradas com maior facilidade no esgoto.
${bot.guns.faca.skins[uData.arma.faca.skinAtual].emote}${bot.guns.colt45.skins[uData.arma.colt45.skinAtual].emote}${bot.config.ficha}${bot.config.coin}\n\`;vasculhar esgoto\``, true)
			.addField('Fábrica de armas', `**Armas** melhores e mais **Dinheiro**.
${bot.guns.rifle.skins[uData.arma.rifle.skinAtual].emote}${bot.guns.colete.skins[uData.arma.colete.skinAtual].emote}${bot.guns.shotgun.skins[uData.arma.shotgun.skinAtual].emote}${bot.guns.mp5.skins[uData.arma.mp5.skinAtual].emote}${bot.config.coin}
Necessário: ${bot.guns.shotgun.skins[uData.arma.shotgun.skinAtual].emote}
\`;vasculhar fábrica\``, true)
			.addField('Usina nuclear', `**Armas** ainda mais fortes e muito **Dinheiro**.
${bot.guns.goggles.skins[uData.arma.goggles.skinAtual].emote}${bot.guns.colete.skins[uData.arma.colete.skinAtual].emote}${bot.guns.ak47.skins[uData.arma.ak47.skinAtual].emote}${bot.guns.m4.skins[uData.arma.m4.skinAtual].emote}${bot.config.coin}
Necessário: ${bot.guns.ak47.skins[uData.arma.ak47.skinAtual].emote}
\`;vasculhar usina\``, true)
			.addField('Nave extraterrestre', `**Armas** estupidamente fortes e milhares de **Fichas**.
${bot.guns.rpg.skins[uData.arma.rpg.skinAtual].emote}${bot.guns.colete.skins[uData.arma.colete.skinAtual].emote}${bot.config.ficha}
Necessário: ${bot.guns.rpg.skins[uData.arma.rpg.skinAtual].emote}
\`;vasculhar nave\``, true)
			.addField('Base Militar', `Itens militares proibidões
${bot.guns.bazuca.skins[uData.arma.bazuca.skinAtual].emote}${bot.guns.exoesqueleto.skins[uData.arma.exoesqueleto.skinAtual].emote}${bot.guns.granada.skins[uData.arma.granada.skinAtual].emote}
Necessário: ${bot.guns.minigun.skins[uData.arma.minigun.skinAtual].emote}
\`;vasculhar base\``, true)
			// .addField(`${bot.config.ovo} Ninho de páscoa`, `O que o coelhinho esconde?\n\`;vasculhar ninho\``)
			// .addField(`🎄 Árvore de Natal`, `O que tem no saco do velhinho?\n\`;vasculhar árvore\``, true)
			.setFooter(`${bot.user.username} • "ETs gostam de apostar em cassinos?"`, bot.user.avatarURL())
			.setTimestamp()

		// if (message.channel.guild.id === '810546397786931200')
		// 	embed.addField(`Bailão`, `Vapo, vapo, vapo\n${bot.badges.mandrake}\n\`;vasculhar bailão\``, true)

		message.channel.send({embeds: [embed]})
			.catch(() => console.log('Não consegui enviar mensagem `vasculhar`'))
		
	} else if ([
		'lixao', 'lixão', 'l', '1',
		'matagal', 'mata', 'm', '2',
		'esgoto', 'e', '3',
		'fabrica', 'fábrica', 'f', '4',
		'usina', 'u', '5',
		'nave', 'n', '6',
		'base', 'b', '7',
		// 'arvore', 'árvore', 'a', '8',
		// 'baile', 'bailao', 'bailão', '8'
	].includes(option)) {
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (bot.isUserEmRouboOuEspancamento(message, uData)) return

		if (bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		if (uData.vasculhar > currTime) {
			let minutes = (uData.vasculhar - currTime) / 1000
			return bot.createEmbed(message, `Você deve esperar mais ${bot.segToHour(minutes)} para vasculhar novamente ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
		}

		if (['lixao', 'lixão', 'l', '1'].includes(option)) {
			vasculharLugar(lixao, uData)
			
		} else if (['matagal', 'mata', 'm', '2'].includes(option)) {
			vasculharLugar(matagal, uData)
			
		} else if (['esgoto', 'e', '3'].includes(option)) {
			vasculharLugar(esgoto, uData)
			
		} else if (['fabrica', 'fábrica', 'f', '4'].includes(option)) {
			if (uData.arma.shotgun.tempo < currTime && uData.arma.mp5.tempo < currTime && uData.arma.ak47.tempo < currTime && uData.arma.m4.tempo < currTime && uData.arma.sniper.tempo < currTime && uData.arma.katana.tempo < currTime && uData.arma.rpg.tempo < currTime && uData.arma.minigun.tempo < currTime && uData.arma.bazuca.tempo < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.guns.shotgun.skins[uData.arma['shotgun'].skinAtual].emote} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
			vasculharLugar(fabrica, uData)
			
		} else if (['usina', 'u', '5'].includes(option)) {
			if (uData.arma.ak47.tempo < currTime && uData.arma.m4.tempo < currTime && uData.arma.sniper.tempo < currTime && uData.arma.katana.tempo < currTime && uData.arma.rpg.tempo < currTime && uData.arma.minigun.tempo < currTime && uData.arma.bazuca.tempo < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.guns.ak47.skins[uData.arma['ak47'].skinAtual].emote} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
			vasculharLugar(usina, uData)
			
		} else if (['nave', 'n', '6'].includes(option)) {
			if (uData.arma.rpg.tempo < currTime && uData.arma.minigun.tempo < currTime && uData.arma.bazuca.tempo < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.guns.rpg.skins[uData.arma['rpg'].skinAtual].emote} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
			vasculharLugar(nave, uData)
			
		} else if (['base', 'b', '7'].includes(option)) {
			if (uData.arma.minigun.tempo < currTime && uData.arma.bazuca.tempo < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.guns.minigun.skins[uData.arma['minigun'].skinAtual].emote} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
			vasculharLugar(base, uData)
			
		} 
		// else if (['arvore', 'árvore', 'a', '8'].includes(option)) {
		// 	vasculharLugar(arvore, uData)
		// }
		// else if (['baile', 'bailao', 'bailão', '8'].includes(option)) {
		// 	// if (message.author.id != bot.config.adminID)
		// 	// 	return

		// 	if (message.channel.guild.id !== '810546397786931200')
		// 		return bot.createEmbed(message, `Você não está no **Bailão da Cruz**! ${bot.config.vasculhar}`, null, `LIGHT_GREY`)

		// 	if (uData.badgeBaileMandrake != undefined)
		// 		return bot.createEmbed(message, `Você já encontrou o óculos mandrake! ${bot.badges.mandrake}`, null, `LIGHT_GREY`)
		// 	vasculharLugar(baile, uData)
		// }
		// else if (option == 'ninho')
		// 	vasculharLugar(ninho, uData)

		const embedPV = new Discord.MessageEmbed()
			.setTitle(`${bot.config.vasculhar} Você já pode vasculhar novamente!`)
			.setColor(bot.colors.vasculhar)

		setTimeout(() => {
			message.author.send({embeds: [embedPV]})
					.catch(() => message.reply(`você já pode vasculhar novamente ${bot.config.vasculhar}`)
						.catch(() => `Não consegui responder ${bot.data.get(message.author.id, 'username')} nem no PV nem no canal. \`Vasculhar\``))
		}, hora)
		
	} else return bot.createEmbed(message, `Você deve escolher entre \`lixão\`, \`matagal\`, \`esgoto\`, \`fábrica\`, \`usina\`, \`nave\` e \`base\` ${bot.config.vasculhar}`, null, bot.colors.vasculhar)
}
exports.config = {
	alias: ['v'],
}
