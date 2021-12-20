const wait = require('util').promisify(setTimeout);
const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let time = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	let multiplicador = args[0] ? parseInt(args[0]) : 1
	const MAX = 10
	//	if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return message.channel.send('Comando em manutenção')

	// return bot.createEmbed(message, `🎰 As Máquinas Caça-níqueis estão desativadas durante a primeira semana de temporada`)

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

	if (bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

	let embed = new Discord.MessageEmbed()
		.addField(`Máquina Caça-níqueis ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n║══║══║══║\n╚══╩══╩══╝`)
		.setColor(bot.colors.darkGrey)
		.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)

	if (multiplicador > 1)
		embed.setDescription(`**Multiplicador: ${multiplicador}x**`)

	const button = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Jogar')
		.setEmoji('🎰')
		.setCustomId(message.id + message.author.id)

	if (uData.preso > time || uData.hospitalizado > time || uData.jobTime > time || uData.emRoubo.tempo > time || uData.emEspancamento.tempo > time || bot.isGaloEmRinha(message.author.id))
		button.setDisabled(true)

	let row = new Discord.MessageActionRow()
		.addComponents(button);

	await message.channel.send({
		components: [row],
		embeds: [embed]
	}).then(msg => {

		const filter = (button) => (message.id + message.author.id) === button.customId && button.user.id === message.author.id

		const collector = message.channel.createMessageComponentCollector({
			filter,
			idle: 40000
		});

		collector.on('collect', async r => {
			await r.deferUpdate()
			button.setDisabled(true)
				.setLabel("Jogando...")

			row = new Discord.MessageActionRow()
				.addComponents(button);

			await msg.edit({
				embeds: [embed],
				components: [row]
			}).catch(err => console.log("Não consegui editar mensagem `niquel`"))

			uData = bot.data.get(message.author.id)

			if (uData.preso > time)
				return bot.msgPreso(message, uData)

			if (uData.hospitalizado > time)
				return bot.msgHospitalizado(message, uData)

			if (bot.isPlayerMorto(uData))
				return bot.msgPlayerMorto(message);

			if (bot.isPlayerViajando(uData))
				return bot.msgPlayerViajando(message);

			if (uData.jobTime > time)
				return bot.msgTrabalhando(message, uData)

			if (bot.isUserEmRouboOuEspancamento(message, uData))
				return

			if (bot.isGaloEmRinha(message.author.id))
				return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

			if (uData.ficha < 1 * multiplicador) {
				const embedSemFicha = new Discord.MessageEmbed()
					.addField(`Máquina Caça-níqueis ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n║══║══║══║\n╚══╩══╩══╝\nSuas ${bot.config.ficha} **fichas** acabaram`)
					.setColor(bot.colors.darkGrey)
					.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)

				if (multiplicador > 1)
					embedSemFicha.setDescription(`**Multiplicador: ${multiplicador}x**`)

				return r.editReply({
					embeds: [embedSemFicha],
					components: []
				}).catch(err => console.log("Não consegui editar mensagem `niquel`"))
			}

			uData.ficha -= 1 * multiplicador

			let emojis = [
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

			let visor1 = bot.shuffle(emojis)[0]
			let visor2 = bot.shuffle(emojis)[0]
			let visor3 = bot.shuffle(emojis)[0]

			let resultado = `║${visor1}║${visor2}║${visor3}║`

			embed = new Discord.MessageEmbed()

			if (visor1 == visor2 && visor2 == visor3) {
				let premio = 150 * multiplicador
				if (visor1 == bot.config.propertyR)
					premio = 40 * multiplicador

				else if (visor1 == bot.config.propertyG)
					premio = 250 * multiplicador

				else if (visor1 == bot.config.cash)
					premio = 400 * multiplicador

				uData.betW += 1
				uData.ficha += premio
				uData.cassinoGanhos += premio * 80

				embed.addField(`Você ganhou ${premio} fichas! ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
					.setColor('GREEN')

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} ganhou ${premio} fichas na máquina caça-níqueis**`)
					.addField("Resultado", resultado, true)
					.addField("Ficou com", uData.ficha.toLocaleString().replace(/,/g, "."), true)
					.addField("Multiplicador", multiplicador.toString(), true)
					.setColor('GREEN'))

			} else {
				uData.betL += 1
				uData.cassinoPerdidos += 80 * multiplicador

				bot.banco.set('cassino', bot.banco.get('cassino') + 30 * multiplicador)
				bot.banco.set('caixa', bot.banco.get('caixa') + 60 * multiplicador)

				embed.addField(`Você não ganhou ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n${resultado}\n╚══╩══╩══╝`)
					.setColor('RED')
			}

			uData.betJ += 1

			bot.data.set(message.author.id, uData)

			embed.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)

			if (multiplicador > 1)
				embed.setDescription(`**Multiplicador: ${multiplicador}x**`)

			await wait(1000)			

			button.setDisabled(false)
				.setLabel("Jogar")

			row = new Discord.MessageActionRow()
				.addComponents(button);

			await r.editReply({
				embeds: [embed],
				components: [row]
			}).catch(err => console.log("Não consegui editar mensagem `niquel`"))
		})

		collector.on('end', async response => {
			const embed = new Discord.MessageEmbed()
				.addField(`Máquina Caça-níqueis ${bot.config.mafiaCasino}`, `╔══╦══╦══╗\n║══║══║══║\n╚══╩══╩══╝`)
				.setColor(bot.colors.darkGrey)
				.setFooter(`${uData.username} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`)

			if (multiplicador > 1)
				embed.setDescription(`**Multiplicador: ${multiplicador}x**`)

			await msg.edit({
					embeds: [embed],
					components: []
				})
				.catch(err => console.log("Não consegui editar mensagem `niquel`"))
		})

	})
	// .catch(err => console.log("Não consegui enviar mensagem `niquel`"))

};
exports.config = {
	alias: ['n', 'slot']
};