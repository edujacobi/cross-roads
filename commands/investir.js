const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)

	let option = args[0]
	const semana = 604800000 // 7 dias
	let currTime = new Date().getTime()
	const desconto = 1 // 1 = 0%, 0.7 = 30%

	if (!option) {
		if (uData.invest != null) {
			// let options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

			let horasPassadas = 1
			let uptime = bot.uptime

			while (uptime > 3600000) {
				horasPassadas++
				uptime -= 3600000
			}

			let proxDeposito = 60 * 60 * horasPassadas - ((bot.uptime) / 1000)

			let lucro = bot.investimentos[uData.invest].lucro
			if (uData.classe == 'mafioso')
				lucro = Math.floor(lucro * 0.9)
			if (uData.classe == 'empresario')
				lucro = Math.floor(lucro * 1.05)


			// let horas = (uData.investTime + semana) > (currTime + (Math.round(proxDeposito) + 3) * 1000) ? (currTime + (Math.round(proxDeposito) + 3) * 1000) - uData.investLast : uData.investTime + semana - uData.investLast
			// // se investimento ainda não passou de uma semana, então horas = tempo atual - ultimo saque, senão horas = investTime + semana - investLast

			// let praSacar = Math.round(((horas / 3600000) * bot.investimentos[uData.invest].lucro))

			// if (uData.classe == 'mafioso')
			// 	praSacar = Math.round(praSacar * 0.9)

			// if (uData.classe == 'empresario')
			// 	praSacar = Math.round(praSacar * 1.1)

			// message.channel.send(`Horas: ${horas}\nProxDeposito: ${Math.round(proxDeposito) + 3}`)

			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.propertyG} ${bot.investimentos[uData.invest].desc}`)
				.setDescription(`Próximo depósito de R$ ${lucro.toLocaleString().replace(/,/g, ".")} em ${bot.segToHour(proxDeposito)}`)
				.setThumbnail("https://cdn.discordapp.com/attachments/719677144133009478/734264171511676969/radar_propertyG.png")
				.setColor('GREEN')
				.addField(`Comprado em`, new Date(uData.investTime).toLocaleString("pt-BR").replace(/-/g, "/"), true)
				.addField(`Tempo restante`, bot.segToHour((uData.investTime + semana - currTime) / 1000), true)
				.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
				.setTimestamp();

			if (uData.preso > currTime)
				embed.setDescription(`Você está preso por mais ${bot.segToHour(currTime - uData.preso)/1000} e só receberá lucros quando estiver solto`)
			if (uData.hospitalizado > currTime)
				embed.setDescription(`Você está hospitalizado por mais ${bot.segToHour(currTime - uData.hospitalizado)/1000} e só receberá lucros quando estiver curado`)

			if ((uData.investTime + semana) < currTime) {
				embed.setTitle(`${bot.config.propertyR} ${bot.investimentos[uData.invest].desc}`)
				.setColor('RED')
				.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/854848920010489856/radar_propertyR.png")
			}
			message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `investir`", err));

		} else
			return bot.createEmbed(message, `O ID deve ser entre 1 e ${Object.keys(bot.investimentos).length} ${bot.config.propertyG}`, null, 'GREEN')

	} else if (option == "parar") {

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		if (uData.invest == null)
			return bot.createEmbed(message, `Você não pode parar um investimento se você não possui um ${bot.config.propertyG}`, null, 'GREEN')

		else {
			let horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
			let praSacar = Math.round(((horas / 3600000) * bot.investimentos[uData.invest].lucro))
			uData.moni += parseInt(praSacar)
			bot.createEmbed(message, `Você parou o investimento **${bot.investimentos[uData.invest].desc}** e recebeu R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele ${bot.config.propertyG}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'GREEN')
			uData.investGanhos += parseInt(praSacar)
			uData.investLast = 0
			uData.invest = null
			uData.investTime = 0

		}

	} else if (option == "notificar") {
		if (uData.invest == null)
			return bot.createEmbed(message, `Você não possui um investimento para receber notificações ${bot.config.propertyG}`, null, 'GREEN')

		else {
			uData.investNotification = !uData.investNotification

			bot.data.set(message.author.id, uData)

			return bot.createEmbed(message, `Você ${uData.investNotification ? `receberá` : `não receberá mais`} notificações do investimento ${bot.config.propertyG}`, null, 'GREEN')
		}

	} else if (option < 1 || (option % 1 != 0) || option > Object.keys(bot.investimentos).length)
		return bot.createEmbed(message, `O ID deve ser entre 1 e ${Object.keys(bot.investimentos).length} ${bot.config.propertyG}`, null, 'GREEN')

	else if (uData.invest != null)
		return bot.createEmbed(message, `Você só pode ter um investimento por vez ${bot.config.propertyG}`, null, 'GREEN')

	else {
		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		Object.entries(bot.investimentos).forEach(([key, investimento]) => {
			if (parseInt(option) == investimento.id) {
				let preço = uData.classe == 'mafioso' ? investimento.preço : (investimento.preço + investimento.preço * bot.imposto)

				if (uData.moni < preço)
					return bot.msgSemDinheiro(message)

				if (currTime > (uData.investTime + semana) || !uData.investTime) {
					uData.invest = key
					uData.investTime = currTime
					uData.investLast = currTime
					uData.lojaGastos += preço * desconto
					uData.moni -= preço * desconto

					if (uData.classe != 'mafioso')
						bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(investimento.preço * bot.imposto))

					bot.createEmbed(message, `Você adquiriu o investimento **${investimento.desc}** ${bot.config.propertyG}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'GREEN')
				}
			}
		})
	}
	return bot.data.set(message.author.id, uData)
}
exports.config = {
	alias: ['invest', 'investimento']
};