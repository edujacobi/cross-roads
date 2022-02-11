const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	// let total = 0

	if (option === "particular" || option === "p") {
		if (uData.hospitalizado < currTime)
			return bot.createEmbed(message, `Você não está hospitalizado ${bot.config.hospital}`, "Quer uma injeçãozinha?", bot.colors.hospital)

		if (uData.hospitalizado < currTime + 5 * 60 * 60 * 1000)
			return bot.createEmbed(message, `Você é o próximo da fila, aguarde sua vez ${bot.config.hospital}`, "Uma picadinha não dói.", bot.colors.hospital)

		let defPower = 0

		Object.entries(uData.arma).forEach(([key, value]) => {
			Object.values(bot.guns).forEach(arma => {
				if (value.tempo > currTime && arma.def > defPower && key == arma.data)
					defPower = arma.def
			})
		})

		//let tempo_restante_proporcao = (uData.hospitalizado / currTime) - 1
		let preço = Math.floor((3000 + (defPower * (defPower / 4)) ** 2) + (uData.moni * 0.05) + (uData.ficha * 80 * 0.05))

		const confirmed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.hospital} Atendimento particular`)
			.setColor('RED')
			.setDescription(`**Você está curado!**`)
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
			.setTimestamp()

		const tratamento = new Discord.MessageEmbed()
			.setTitle(`${bot.config.hospital} Atendimento particular`)
			.setColor('RED')
			.setDescription(`Seu tratamento custará **R$ ${preço.toLocaleString().replace(/,/g, ".")}**.\n\nConfirmar pagamento?`)
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
			.setTimestamp()

		let btnConfirmar = new Discord.MessageButton()
			.setStyle('SUCCESS')
			.setLabel('Confirmar')
			.setCustomId(message.id + message.author.id + 'confirmar')

		const row = new Discord.MessageActionRow()
			.addComponents(btnConfirmar)

		let msg = await message.channel.send({
			embeds: [tratamento],
			components: [row]
		})

		const filterConfirmar = (button) => [
			message.id + message.author.id + 'confirmar',
		].includes(button.customId) && button.user.id === message.author.id

		const collectorConfirmar = message.channel.createMessageComponentCollector({
			filter: filterConfirmar,
			time: 90000,
		})

		collectorConfirmar.on('collect', async b => {
			await b.deferUpdate()
			if (uData.moni < preço)
				return bot.msgSemDinheiro(message)

			uData.moni -= preço
			uData.hospitalizado = 0
			uData.hospitalGastos += preço
			bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(preço * bot.imposto))
			bot.data.set(message.author.id, uData)

			msg.edit({embeds: [confirmed], components: []})
				.catch(() => console.log("Não consegui editar mensagem `hospital part`"))
		})
		
		collectorConfirmar.on('end', () => {
			if (msg)
				msg.edit({
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `hospital part`"))
		})
		
	} else {

		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.hospital} Hospital`)
			.setDescription("*Público, Gratuito e de Qualidade!*\nUsuários hospitalizados possuem -5 de DEF e -5% de Valor defendido.")
			.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/739635753063153714/radar_hostpital.png")
			.setColor('RED')
			.addField("Serviço público", `Infelizmente não temos mais leitos livres, então você precisará esperar no corredor até ser atendido.`)
			.addField(`${bot.badges.hipocondriaco_s5} Atendimento particular`, `Caso você pague uma certa quantia, poderemos tratá-lo mais rapidamente!`)
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		let btnHosp = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Hospitalizados')
			.setEmoji(bot.config.hospital)
			.setCustomId(message.id + message.author.id + 'hosp')

		let btnParticular = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Pagar particular')
			.setEmoji(bot.badges.hipocondriaco_s5)
			.setCustomId(message.id + message.author.id + 'particular')

		const row = new Discord.MessageActionRow()
			.addComponents(btnHosp)

		if (uData.hospitalizado > currTime)
			row.addComponents(btnParticular)

		let msg = await message.channel.send({
			embeds: [embed],
			components: [row]
		}).catch(() => console.log("Não consegui enviar mensagem `hospital`"))

		const filter = (button) => [
			message.id + message.author.id + 'hosp',
			message.id + message.author.id + 'particular',
		].includes(button.customId) && button.user.id === message.author.id

		const collector = message.channel.createMessageComponentCollector({
			filter,
			time: 90000,
		})

		collector.on('collect', async b => {
			await b.deferUpdate()
			currTime = Date.now()

			if (b.customId === message.id + message.author.id + 'hosp') {
				let hospitalizados = []

				bot.data.forEach((user, id) => {
					if (id !== bot.config.adminID) { // && message.guild.members.cache.get(user)
						if (user.hospitalizado > currTime && user.morto < currTime) {
							if (bot.users.fetch(id) != undefined)
								hospitalizados.push({
									nick: user.username,
									tempo: user.hospitalizado - currTime,
									vezes: user.qtHospitalizado,
								})
							// total += 1
						}
					}
				})

				hospitalizados.sort((a, b) => b.tempo - a.tempo)

				const Hospitalizados = new Discord.MessageEmbed()
					.setTitle(`${bot.config.hospital} Hospitalizados`)
					.setColor(bot.colors.background)

				if (hospitalizados.length > 0) {
					hospitalizados.forEach(hospitalizado => Hospitalizados.addField(hospitalizado.nick, `Curado em ${bot.segToHour((hospitalizado.tempo / 1000))}\nHospitalizado ${hospitalizado.vezes} vezes`, true))
				} else
					Hospitalizados.setDescription("Não há hospitalizados")

				btnHosp.setDisabled(true)

				msg.edit({
					embeds: [embed, Hospitalizados],
					components: [row]
				}).catch(() => console.log("Não consegui enviar mensagem `hospital`"))

			} else if (b.customId === message.id + message.author.id + 'particular') {
				btnParticular.setDisabled(true)

				msg.edit({
					components: [row]
				}).catch(() => console.log("Não consegui enviar mensagem `hospital`"))

				bot.commands.get('hospital').run(bot, message, ['particular'])
			}
		})

		collector.on('end', () => {
			if (msg)
				msg.edit({
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `hospital`"))
		})
	}
}
exports.config = {
	alias: ['h']
}