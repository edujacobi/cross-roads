const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let multiplicador_evento_chance_fuga = 1
	let uData = bot.data.get(message.author.id)
	const chanceBase = uData.classe == 'advogado' ? 15 : uData.classe == 'ladrao' ? 25 : 20
	const chanceJetpack = chanceBase + 30

	if (option == 'fugir' || option == 'f') {
		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)

		else {
			if (uData.fuga == uData.preso)
				return bot.createEmbed(message, `Os policiais estão te observando! ${bot.config.prisao}`, "Você não conseguirá fugir", bot.colors.policia)

			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData)

			let chance = bot.getRandom(0, 99)


			if (chance <= (uData._jetpack > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga)) {
				uData.fuga = uData.preso
				uData.roubo = currTime + (uData.classe == 'advogado' ? 1530000 : 1800000) //+30m
				uData.preso = 0
				//clearTimeout(uData.presoNotification)
				uData.qtFugas += 1
				uData.presoNotification = false
				bot.data.set(message.author.id, uData)
				bot.createEmbed(message, `Você conseguiu fugir, mas a polícia está na sua cola! ${bot.config.police}`, "Espere 30 minutos para roubar novamente", bot.colors.policia)

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} conseguiu fugir da prisão`)
					.addField(`${bot.config.jetpack} Jetpack`, uData._jetpack > currTime ? `Sim` : `Não`, true)
					.setColor(bot.colors.policia))

			} else {

				let atkPower = 0
				Object.entries(uData).forEach(([key, value]) => {
					Object.values(bot.guns).forEach(arma => {
						if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")))
							atkPower = arma.atk
					})
				})
				let tempo_adicional = (0.5 * atkPower) * 1000 * 60
				uData.preso += 900000 + tempo_adicional // 15 min + adicional
				uData.fuga = uData.preso

				setTimeout(() => {
					bot.users.fetch(message.author.id).then(user => {
						let userT = bot.data.get(message.author.id)
						if (userT.preso != 0) {
							user.send(`Você está livre! ${bot.config.police}`)
								.catch(err => message.reply(`você está livre! ${bot.config.police}`)
								.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Prisao\``))
						}
					})
				}, uData.preso - currTime)
				bot.data.set(message.author.id, uData)

				bot.createEmbed(message, `Você não conseguiu fugir e ficará na prisão por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}! ${bot.config.prisao}`, null, bot.colors.policia)

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} não conseguiu fugir da prisão e ficará preso por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}**`)
					.addField(`${bot.config.jetpack} Jetpack`, uData._jetpack > currTime ? `Sim` : `Não`, true)
					.setColor(bot.colors.policia))
			}
		}

	} else if (option == 'subornar' || option == 's' || option == 'suborno') {
		let atkPower = 0
		Object.entries(uData).forEach(([key, value]) => {
			Object.values(bot.guns).forEach(arma => {
				if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")))
					atkPower = arma.atk
			})
		})

		let preço = Math.floor((20000 + (atkPower * (atkPower / 20)) ** 1.91) + (uData.moni * 0.12) + (uData.ficha * 80 * 0.12))

		if (uData.classe == 'advogado')
			preço = Math.floor(preço * 0.9)

		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (uData.emRoubo)
			return bot.msgEmRoubo(message)
		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.policia)


		// if (valor) {
		// 	if (valor <= 0 || (valor % 1 != 0))
		// 		return bot.msgValorInvalido(message)

		// 	if (valor > uData.moni)
		// 		return bot.msgDinheiroMenorQueAposta(message)

		// 	if (valor < 100000) {
		// 		uData.moni -= parseInt(valor)
		// 		uData.prisaoGastos += parseInt(valor)
		// 		if (uData.fuga == uData.preso)
		// 			uData.fuga += 2700000
		// 		uData.preso += 2700000 //+45m
		// 		bot.data.set(message.author.id, uData)
		// 		return bot.createEmbed(message, `"Isto é algum tipo de piada? Ficaremos com este dinheiro e você ficará preso por mais 45 minutos." ${bot.config.police}`)

		// 	} else if (valor < Math.floor((uData.moni + (uData.ficha * 90)) / 5)) {
		// 		uData.moni -= parseInt(valor)
		// 		uData.prisaoGastos += parseInt(valor)
		// 		bot.data.set(message.author.id, uData)
		// 		return bot.createEmbed(message, `"Sabemos que você tem mais escondido aí. Vamos pegar este dinheiro e você vai continuar na prisão." ${bot.config.police}`)

		// 	} else {
		// 		uData.moni -= parseInt(valor)
		// 		uData.prisaoGastos += parseInt(valor)
		// 		uData.roubo = currTime + 600000 //+10m
		// 		uData.preso = 0
		// 		bot.data.set(message.author.id, uData)
		// 		return bot.createEmbed(message, `"Assim que se faz! Cai fora daqui antes que mais te veja." ${bot.config.police}`)
		// 	}

		// } else {
		//let preço = Math.floor((uData.moni + (uData.ficha * 90)) / 5)

		// if (preço < 100000)
		// 	return bot.createEmbed(message, `"Isto é algum tipo de piada? Junte mais grana para tentar nos impressionar." ${bot.config.police}`)

		const confirmed = new Discord.MessageEmbed()
			.setColor(bot.colors.policia)
			.setDescription(`"Assim que se faz! Caia fora daqui antes que mais alguém te veja." ${bot.config.police}`)
			.setFooter(`${uData.username} • Espere 30 minutos para fazer alguma besteira`, message.member.user.avatarURL())
			.setTimestamp()

		bot.createEmbed(message, `"Sabemos que você tem um certo dinheiro escondido aí... Nos dê **R$ ${preço.toLocaleString().replace(/,/g, ".")}** e deixaremos você sair de fininho." ${bot.config.police}\nConfirmar pagamento?`)
			.then(msg => {
				msg.react('✅').catch(err => console.log("Não consegui reagir mensagem `prisao`", err)).then(r => {
					const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id

					const confirm = msg.createReactionCollector({
						filter,
						max: 1,
						time: 30000
					})

					confirm.on('collect', r => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `niquel`", err))
							.then(m => {
								uData = bot.data.get(message.author.id)
								currTime = new Date().getTime()
								if (uData.moni < preço)
									return bot.msgSemDinheiro(message)
								if (uData.preso < currTime)
									return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
								if (uData.emRoubo)
									return bot.msgEmRoubo(message)
								if (uData.galoEmRinha)
									return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.policia)

								uData.moni -= preço
								uData.prisaoGastos += preço
								uData.roubo = currTime + (uData.classe == 'advogado' ? 1530000 : 1800000) // 30 min
								uData.preso = 0
								uData.presoNotification = false
								bot.data.set(message.author.id, uData)
								msg.edit({
									embeds: [confirmed]
								}).catch(err => console.log("Não consegui editar mensagem `prisao`", err))

								return bot.log(message, new Discord.MessageEmbed()
									.setDescription(`**${uData.username} pagou suborno de R$ ${preço.toLocaleString().replace(/,/g, ".")} e ficou livre da prisão**`)
									.setColor(bot.colors.policia))
							})

					})
				})
			})
		// }

	} else {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.prisao} Prisão`) // de ${message.guild.name}
			.setDescription(`Ao tentar roubar alguém e falhar, você será preso por um tempo determinado pelo poder de sua arma. Estar preso limita muitas de suas ações no jogo, como trabalhar, investir, apostar, vasculhar, e claro, roubar.`)
			.addField("Fugir", `Você tem ${chanceBase * multiplicador_evento_chance_fuga}% (${chanceJetpack * multiplicador_evento_chance_fuga}% se possuir uma ${bot.config.jetpack} **Jetpack**) de chance de fugir da prisão!\n\`;prisao fugir\``, true)
			.addField("Subornar", `Os guardas são gananciosos, e quanto melhor sua arma, mais eles pedirão!\n\`;prisao subornar\``, true)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/817102027183357992/prisao.png') //message.guild.iconURL()
			.setColor(bot.colors.policia)
			.setFooter(`${bot.user.username} • Clique na reação para abrir a lista de prisioneiros`, bot.user.avatarURL())
			.setTimestamp();

		message.channel.send({
			embeds: [embed]
		}).then(msg => {
			msg.react('817097391840296980').catch(err => console.log("Não consegui reagir mensagem `prisao`", err))
				.then(() => {
					const filter = (reaction, user) => reaction.emoji.id === '817097391840296980' && user.id == message.author.id;
					const prisioneiros_ = msg.createReactionCollector({
						filter,
						time: 90000,
					});

					let presos = []
					let total = 0

					bot.data.indexes.forEach(user => {
						if (user != bot.config.adminID) { // && message.guild.members.cache.get(user)
							let uData = bot.data.get(user)
							if (uData.preso > currTime) {
								if (bot.users.fetch(user) != undefined)
									presos.push({
										nick: uData.username,
										tempo: uData.preso - currTime,
										vezes: uData.roubosL,
										fugiu: uData.qtFugas
									})
								total += 1
							}
						}
					})

					presos.sort((a, b) => b.tempo - a.tempo)

					const prisioneiros = new Discord.MessageEmbed()
						.setTitle(`${bot.config.prisao} Prisioneiros`)
						.setColor(bot.colors.background)

					if (presos.length > 0) {
						presos.forEach(preso => prisioneiros.addField(preso.nick, `Livre em ${bot.segToHour((preso.tempo / 1000))}\nPreso ${preso.vezes} vezes\nFugiu ${preso.fugiu} vezes`, true))
					} else
						prisioneiros.setDescription("Não há prisioneiros")

					// if (total == 1 || total == 4 || total == 7 || total == 10 || total == 13 || total == 16 || total == 19) {
					// 	prisioneiros.addField('\u200b', '\u200b', true)
					// 	prisioneiros.addField('\u200b', '\u200b', true)
					// } else if (total == 2 || total == 5 || total == 8 || total == 11 || total == 14 || total == 17 || total == 20) {
					// 	prisioneiros.addField('\u200b', '\u200b', true)
					// }

					prisioneiros_.on('collect', r => {
						message.channel.send({
							embeds: [prisioneiros]
						}).then(m => {
							if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `prisao`", err))
						}).catch(err => console.log("Não consegui enviar mensagem `prisao`", err))
					})
				})

		}).catch(err => console.log("Não consegui enviar mensagem `prisao`", err))
	}
};
exports.config = {
	alias: ['p', 'cadeia', 'prison']
};