const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let time = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	let multiplicador = args[0] ? parseInt(args[0]) : 1
	const MAX = 20
	//	if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return message.channel.send('Comando em manutenção')

	if (multiplicador <= 0 || (multiplicador % 1 != 0))
		return bot.msgValorInvalido(message)

	if (multiplicador > MAX) {
		bot.createEmbed(message, `O limite máximo do multiplicador é ${MAX} :slot_machine:`)
		multiplicador = MAX
	}

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)

	if (uData.preso > time)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > time)
		return bot.msgHospitalizado(message, uData)

	if (uData.emRoubo)
		return bot.msgEmRoubo(message)
	if (uData.galoEmRinha)
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)



	const embed = new Discord.MessageEmbed()
		.addField(`Máquina Caça-níqueis ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n║══║══║══║\n╚══╩══╩══╝`)
		.setColor(bot.colors.darkGrey)
		.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)
	if (multiplicador > 1)
		embed.setDescription(`Multiplicador: ${multiplicador}x`)

	message.channel.send({
		embeds: [embed]
	}).then(msg => {
		msg.react('🎰').catch(err => console.log("Não consegui reagir mensagem `niquel`", err)).then(r => {
			const filter = (reaction, user) => reaction.emoji.name === '🎰' && user.id == message.author.id

			const niquel = msg.createReactionCollector({
				filter,
				idle: 30000
			})

			niquel.on('collect', r => {

				uData = bot.data.get(message.author.id)
				if (uData.preso > time)
					return bot.msgPreso(message, uData)

				if (uData.hospitalizado > time)
					return bot.msgHospitalizado(message, uData)

				if (uData.jobTime > time)
					return bot.msgTrabalhando(message, uData)

				if (uData.emRoubo)
					return bot.msgEmRoubo(message)
				if (uData.galoEmRinha)
					return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

				if (uData.ficha < 1 * multiplicador) {
					if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `niquel`", err))
					const embedSemFicha = new Discord.MessageEmbed()
						.addField(`Máquina Caça-níqueis ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n║══║══║══║\n╚══╩══╩══╝\nSuas ${bot.config.ficha} **fichas** acabaram`)
						.setColor(bot.colors.darkGrey)
						.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)
					if (multiplicador > 1)
						embed.setDescription(`Multiplicador: ${multiplicador}x`)
					return msg.edit({
						embeds: [embedSemFicha]
					}).catch(err => console.log("Não consegui editar mensagem `niquel`", err))
				}
				uData.ficha -= 1 * multiplicador

				let emoji = [
					bot.config.vip,
					bot.config.mercadonegro,
					bot.badges.bilionario,
					bot.config.dateDrink,
					bot.config.loja,
					bot.config.cash,
					bot.config.car,
					bot.config.bulldozer,
					bot.config.carregamento,
					bot.config.propertyG,
					bot.config.propertyR,
					bot.config.ficha,
					bot.config.hospital,
				]

				let emojis = []

				for (let i = 0; i < 3; i++)
					emojis[i] = emoji[Math.floor(Math.random() * emoji.length)]

				let visor1 = emojis[0]
				let visor2 = emojis[1]
				let visor3 = emojis[2]

				let resultado = `║${visor1}║${visor2}║${visor3}║`

				const embedNew = new Discord.MessageEmbed()
				if (visor1 == visor2 && visor2 == visor3 && visor1 != bot.config.cash && visor1 != bot.config.propertyR && visor1 != bot.config.propertyG) {
					let premio = 225 * multiplicador
					uData.betW += 1
					uData.ficha += premio
					uData.cassinoGanhos += premio * 80
					embedNew.addField(`Você ganhou ${premio} fichas! ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
						.setColor('GREEN')

					bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${uData.username} ganhou ${premio} fichas na máquina caça-níqueis**`)
						.addField("Resultado", resultado, true)
						.addField("Multiplicador", multiplicador.toString(), true)
						.setColor('GREEN'))

				} else if (visor1 == visor2 && visor2 == visor3 && visor1 == bot.config.propertyR) {
					let premio = 50 * multiplicador
					uData.betW += 1
					uData.ficha += premio
					uData.cassinoGanhos += premio * 80
					embedNew.addField(`Você ganhou ${premio} fichas! ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
						.setColor('GREEN')

					bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${uData.username} ganhou ${premio} fichas na máquina caça-níqueis**`)
						.addField("Resultado", resultado, true)
						.addField("Multiplicador", multiplicador.toString(), true)
						.setColor('GREEN'))

				} else if (visor1 == visor2 && visor2 == visor3 && visor1 == bot.config.propertyG) {
					let premio = 300 * multiplicador
					uData.betW += 1
					uData.ficha += premio
					uData.cassinoGanhos += premio * 80
					embedNew.addField(`Você ganhou ${premio} fichas! ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
						.setColor('GREEN')

					bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${uData.username} ganhou ${premio} fichas na máquina caça-níqueis**`)
						.addField("Resultado", resultado, true)
						.addField("Multiplicador", multiplicador.toString(), true)
						.setColor('GREEN'))

				} else if (visor1 == visor2 && visor2 == visor3 && visor1 == bot.config.cash) {
					let premio = 500 * multiplicador
					uData.betW += 1
					uData.ficha += premio
					uData.cassinoGanhos += premio * 80
					embedNew.addField(`Você ganhou ${premio} fichas! ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
						.setColor('GREEN')

					bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${uData.username} ganhou ${premio} fichas na máquina caça-níqueis**`)
						.addField("Resultado", resultado, true)
						.addField("Multiplicador", multiplicador.toString(), true)
						.setColor('GREEN'))

				} else {
					uData.betL += 1
					uData.cassinoPerdidos += 80 * multiplicador
					bot.banco.set('cassino', bot.banco.get('cassino') + 30 * multiplicador)
					bot.banco.set('caixa', bot.banco.get('caixa') + 60 * multiplicador)
					embedNew.addField(`Você não ganhou ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
						.setColor('RED')

					// bot.log(message, new Discord.MessageEmbed()
					// 	.setDescription(`**${uData.username} não ganhou nada na máquina caça-níqueis**`)
					// 	.addField("Resultado", resultado, true)
					// 	.addField("Multiplicador", multiplicador, true)
					// 	.setColor('RED'))
				}

				uData.betJ += 1
				embedNew.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)

				if (multiplicador > 1)
					embedNew.setDescription(`Multiplicador: ${multiplicador}x`)

				bot.data.set(message.author.id, uData)
				
				msg.edit({
					embeds: [embedNew]
				}).catch(err => console.log("Não consegui editar mensagem `niquel`", err))
				.then(() => r.users.remove(message.author.id).catch(err => console.log("Não consegui remover a reação mensagem `niquel`", err)))

			})

			niquel.on('end', async response => {
				const embedNew = new Discord.MessageEmbed()
					.addField(`Máquina Caça-níqueis ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n║══║══║══║\n╚══╩══╩══╝`)
					.setColor(bot.colors.darkGrey)
					.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)

				if (multiplicador > 1)
					embed.setDescription(`Multiplicador: ${multiplicador}x`)

				if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `niquel`", err))
				msg.edit(embedNew)
					.catch(err => console.log("Não consegui editar mensagem `niquel`", err))

			})
		})
	}).catch(err => console.log("Não consegui enviar mensagem `niquel`", err))

};
exports.config = {
	alias: ['n']
};