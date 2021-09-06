const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let multiplicador_evento = 1
	const hora = 3600000
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]

	function vasculharLugar(lugar, uData) {
		let item = bot.getRandom(0, 17) //normal: 17
		let achou = ''
		uData.vasculhar = currTime + hora * multiplicador_evento

		Object.entries(lugar).forEach(([key, value]) => {
			if (item == key) {
				if (value.item != 'moni' && value.item != 'ficha' && value.item != 'granada' && value.item != 'flor') {
					Object.entries(uData).forEach(([key_udata, value_udata]) => {
						if (key_udata == "_" + value.item) {
							value_udata = value_udata > currTime ? value_udata + (value.tempo * hora) : currTime + (value.tempo * hora)
							uData[key_udata] = value_udata
							Object.values(bot.guns).forEach(gun => {
								if (gun.data == value.item) {
									let emote = bot.config[gun.emote]
									achou = true
									uData.vasculharAchou += 1
									if (message.author.id != bot.config.adminID)
										bot.data.set(message.author.id, uData)
									return bot.createEmbed(message, `Você encontrou ${emote} **${gun.desc}** com duração de ${value.tempo} ${value.tempo == 1 ? `hora` : `horas`} enquanto vasculhava ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
								}
							})
						}
					})

				} else if (value.item == 'moni') {
					let money = bot.getRandom(value.min, value.max)
					uData.moni += money
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id != bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou **R$ ${money.toLocaleString().replace(/,/g, ".")}** enquanto vasculhava ${bot.config.vasculhar}`, null, 'LIGHT_GREY')

				} else if (value.item == 'ficha') {
					let ficha = bot.getRandom(value.min, value.max)
					uData.ficha += ficha
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id != bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.config.ficha} **${ficha.toLocaleString().replace(/,/g, ".")} ${ficha == 1 ? `Ficha` : `Fichas`}** enquanto vasculhava ${bot.config.vasculhar}`, `Use-as no Cassino!`, 'LIGHT_GREY')

				} else if (value.item == 'granada') {
					let quant = bot.getRandom(value.min, value.max)
					uData._ovogranada += quant
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id != bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.config.ovogranada} **${quant.toLocaleString().replace(/,/g, ".")} ${quant == 1 ? `Granada` : `Granadas`}** enquanto vasculhava ${bot.config.vasculhar}`, `Shaka laka boom!`, 'LIGHT_GREY')

				} else if (value.item == 'flor') {
					let quant = 1
					uData._flor += quant
					achou = true
					uData.vasculharAchou += 1
					if (message.author.id != bot.config.adminID)
						bot.data.set(message.author.id, uData)
					return bot.createEmbed(message, `Você encontrou ${bot.config.flor} **${quant.toLocaleString().replace(/,/g, ".")} ${quant == 1 ? `Flor` : `Flores`}** enquanto vasculhava ${bot.config.vasculhar}`, `Você poderá usá-las em breve nos Casamentos!`, 'LIGHT_GREY')
				}
			}
		})
		if (!achou) {
			if (message.author.id != bot.config.adminID)
				bot.data.set(message.author.id, uData)
			return bot.createEmbed(message, `Você não encontrou nada enquanto vasculhava ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
		}
	}

	let uData = bot.data.get(message.author.id)

	let lixao = {
		1: {
			item: "knife",
			tempo: 6,
		},
		2: {
			item: "9mm",
			tempo: 4,
		},
		3: {
			item: "9mm",
			tempo: 3,
		},
		4: {
			item: "moni",
			min: 15,
			max: 150,
		},
		5: {
			item: "moni",
			min: 50,
			max: 500,
		},
		6: {
			item: "ficha",
			min: 1,
			max: 5,
		},
		7: {
			item: "knife",
			tempo: 4
		},
		8: {
			item: "knife",
			tempo: 3,
		},
		9: {
			item: "flor",
			min: 1,
			max: 1
		}
	}
	let matagal = {
		1: {
			item: "knife",
			tempo: 2,
		},
		2: {
			item: "9mm",
			tempo: 1,
		},
		3: {
			item: "money",
			min: 50,
			max: 250,
		},
		4: {
			item: "money",
			min: 75,
			max: 750,
		},
		5: {
			item: "money",
			min: 500,
			max: 1000,
		},
		6: {
			item: "ficha",
			min: 1,
			max: 5,
		},
		7: {
			item: "money",
			min: 750,
			max: 1250,
		},
		8: {
			item: "money",
			min: 100,
			max: 500,
		},
		9: {
			item: "flor",
			min: 1,
			max: 1
		}
	}
	let esgoto = {
		1: {
			item: "knife",
			tempo: 2,
		},
		2: {
			item: "9mm",
			tempo: 1,
		},
		3: {
			item: "moni",
			min: 15,
			max: 150,
		},
		4: {
			item: "moni",
			min: 50,
			max: 500,
		},
		5: {
			item: "ficha",
			min: 1,
			max: 5,
		},
		6: {
			item: "ficha",
			min: 5,
			max: 10,
		},
		7: {
			item: "ficha",
			min: 10,
			max: 15,
		},
		8: {
			item: "ficha",
			min: 5,
			max: 15,
		},
		9: {
			item: "flor",
			min: 1,
			max: 1
		}
	}
	let fabrica = { // Nes: escopeta
		1: {
			item: "rifle",
			tempo: 6,
		},
		2: {
			item: "colete",
			tempo: 2,
		},
		3: {
			item: "escopeta",
			tempo: 4,
		},
		4: {
			item: "mp5",
			tempo: 2,
		},
		5: {
			item: "escopeta",
			tempo: 4,
		},
		6: {
			item: "moni",
			min: 5000,
			max: 10000,
		},
		7: {
			item: "flor",
			min: 1,
			max: 1
		}
	}
	let usina = { // Nes: ak47
		1: {
			item: "goggles",
			tempo: 4,
		},
		2: {
			item: "colete",
			tempo: 6,
		},
		3: {
			item: "ak47",
			tempo: 4,
		},
		4: {
			item: "m4",
			tempo: 2,
		},
		5: {
			item: "moni",
			min: 10000,
			max: 35000,
		},
		6: {
			item: "flor",
			min: 1,
			max: 1
		}
	}
	let nave = { // Nes: RPG
		1: {
			item: "rpg", //rpg
			tempo: 4,
		},
		2: {
			item: "colete", // bazuca
			tempo: 6,
		},
		3: {
			item: "ficha",
			min: 500,
			max: 750,
		},
		4: {
			item: "ficha",
			min: 750,
			max: 1000,
		},
		5: {
			item: "flor",
			min: 1,
			max: 1
		}
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
	let base = {
		1: {
			item: "bazuca", // bazuca
			tempo: 1,
		},
		2: {
			item: "exoesqueleto", // bazuca
			tempo: 1,
		},
		3: {
			item: "granada", // bazuca
			min: 1,
			max: 2,
		},
		4: {
			item: "flor",
			min: 1,
			max: 1
		}
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


	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.vasculhar} Vasculhar`)
			.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/814659864286461982/vasculhar_20210223172037.png")
			.setDescription("Procuro pessoas corajosas e sem nojo de entrar em locais sujos e perigosos. Muitas coisas boas podem ser encontradas!\nVocê pode vasculhar uma vez a cada hora.")
			.setColor('LIGHT_GREY')
			.addField("Lixão", `O lixão tem chances maiores de encontrar **Armas**.\n${bot.config.faca}${bot.config.colt45}${bot.config.ficha}${bot.config.coin}\n\`;vasculhar lixão\``, true)
			.addField("Matagal", `No matagal você encontrará **Dinheiro** mais facilmente.\n${bot.config.faca}${bot.config.colt45}${bot.config.ficha}${bot.config.coin}\n\`;vasculhar matagal\``, true)
			.addField("Esgoto", `**Fichas** são encontradas com maior facilidade no esgoto.\n${bot.config.faca}${bot.config.colt45}${bot.config.ficha}${bot.config.coin}\n\`;vasculhar esgoto\``, true)
			.addField("Fábrica de armas", `**Armas** melhores e mais **Dinheiro**.\n${bot.config.rifle}${bot.config.colete}${bot.config.escopeta}${bot.config.mp5}${bot.config.coin}\nNecessário: ${bot.config.escopeta}\n\`;vasculhar fábrica\``, true)
			.addField("Usina nuclear", `**Armas** ainda mais fortes e muito **Dinheiro**.\n${bot.config.goggles}${bot.config.colete}${bot.config.ak47}${bot.config.m4}${bot.config.coin}\nNecessário: ${bot.config.ak47}\n\`;vasculhar usina\``, true)
			.addField("Nave extraterrestre", `**Armas** estupidamente fortes e milhares de **Fichas**.\n${bot.config.rpg}${bot.config.colete}${bot.config.ficha}\nNecessário: ${bot.config.rpg}\n\`;vasculhar nave\``, true)
			.addField("Base Militar", `Itens militares proibidões\n${bot.config.bazuca}${bot.config.exoesqueleto}${bot.config.ovogranada}\nNecessário: ${bot.config.minigun}\n\`;vasculhar base\``, true)
			// .addField(`${bot.config.ovo} Ninho de páscoa`, `O que o coelhinho esconde?\n\`;vasculhar ninho\``)
			.setFooter(`${bot.user.username} • "ETs gostam de apostar em cassinos?"`, bot.user.avatarURL())
			.setTimestamp();

		message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `vasculhar`", err))

	} else if (['lixao', 'lixão', 'l', '1',
			'matagal', 'mata', 'm', '2',
			'esgoto', 'e', '3',
			'fabrica', 'fábrica', 'f', '4',
			'usina', 'u', '5',
			'nave', 'n', '6',
			'base', 'b', '7'
		].includes(option)) { // || option == 'arvore'
		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		if (uData.vasculhar > currTime) {
			let minutes = (uData.vasculhar - currTime) / 1000
			return bot.createEmbed(message, `Você deve esperar mais ${bot.segToHour(minutes)} para vasculhar novamente ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
		}

		if (['lixao', 'lixão', 'l', '1'].includes(option))
			vasculharLugar(lixao, uData)

		else if (['matagal', 'mata', 'm', '2'].includes(option))
			vasculharLugar(matagal, uData)

		else if (['esgoto', 'e', '3'].includes(option))
			vasculharLugar(esgoto, uData)

		else if (['fabrica', 'fábrica', 'f', '4'].includes(option)) {
			if (uData._shotgun < currTime && uData._mp5 < currTime && uData._ak47 < currTime && uData._m4 < currTime && uData._sniper < currTime && uData._katana < currTime && uData._rpg < currTime && uData._minigun < currTime && uData._bazuca < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.config.escopeta} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
			vasculharLugar(fabrica, uData)

		} else if (['usina', 'u', '5'].includes(option)) {
			if (uData._ak47 < currTime && uData._m4 < currTime && uData._sniper < currTime && uData._katana < currTime && uData._rpg < currTime && uData._minigun < currTime && uData._bazuca < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.config.ak47} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
			vasculharLugar(usina, uData)

		} else if (['nave', 'n', '6'].includes(option)) {
			if (uData._rpg < currTime && uData._minigun < currTime && uData._bazuca < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.config.rpg} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
			vasculharLugar(nave, uData)

		} else if (['base', 'b', '7'].includes(option)) {
			if (uData._minigun < currTime && uData._bazuca < currTime)
				return bot.createEmbed(message, `É necessário possuir ${bot.config.minigun} ou melhor para vasculhar este lugar ${bot.config.vasculhar}`, null, 'LIGHT_GREY')
			vasculharLugar(base, uData)
		}
		// else if (option == 'base')
		// 	vasculharLugar(base, uData)

		// else if (option == 'ninho')
		// 	vasculharLugar(ninho, uData)

		setTimeout(() => {
			bot.users.fetch(message.author.id).then(user =>
				user.send(`Você já pode vasculhar novamente! ${bot.config.vasculhar}`)
				.catch(err => message.reply(`você já pode vasculhar novamente ${bot.config.vasculhar}`)
					.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Vasculhar\``))
			)
		}, hora)

	} else
		return bot.createEmbed(message, `Você deve escolher entre \`lixão\`, \`matagal\`, \`esgoto\`, \`fábrica\`, \`usina\`, \`nave\` e \`base\` ${bot.config.vasculhar}`, null, 'LIGHT_GREY')

}
exports.config = {
	alias: ['v']
};