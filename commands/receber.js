const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()

	// const semana = 604800000 // 7 dias
	// const hora = 3600000 // 1h

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Você não pode receber enquanto seu galo está em uma rinha ${bot.config.galo}`)

	let linhaTrabalho = ''
	// let linhaInvest = ''

	if (uData.job == null) {
		linhaTrabalho = `Você não está trabalhando ${bot.config.bulldozer}`

	} else {
		let job = bot.jobs[uData.job]
		let pagamento = job.pagamento

		if (uData.classe == 'mafioso')
			pagamento *= 0.9

		if (uData.classe == 'empresario')
			pagamento *= 1.05

		if (currTime > uData.jobTime) {
			linhaTrabalho = `Você recebeu seu pagamento de R$ ${Math.round(pagamento).toLocaleString().replace(/,/g, ".")} ${bot.config.bulldozer}`

			uData.moni += Math.round(pagamento)
			uData.jobGanhos += Math.round(pagamento)
			uData.job = null
			uData.jobTime = 0

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`**${uData.username} recebeu R$ ${Math.round(pagamento).toLocaleString().replace(/,/g, ".")} de seu trabalho**`)
				.addField("Trabalho", job.desc, true)
				.addField("Ficou com", `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, true)
				.setColor('YELLOW'))

		} else
			linhaTrabalho = `Você ainda está trabalhando de **${job.desc}** ${bot.config.bulldozer}`

	}

	// let horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast : uData.investTime + semana - uData.investLast
	// // se investimento ainda não passou de uma semana, então horas = tempo atual - ultimo saque, senão horas = investTime + semana - investLast

	// let praSacar = uData.invest != null ? Math.floor(((horas / hora) * bot.investimentos[uData.invest].lucro)) : 0

	// if (currTime < (uData.investTime + semana)) { //se o investimento ainda não completou uma semana
	// 	linhaInvest = `Você recebeu R$ ${praSacar.toLocaleString().replace(/,/g, ".")} de seu investimento **${bot.investimentos[uData.invest].desc}** ${bot.config.propertyG}`
	// 	uData.moni += parseInt(praSacar)
	// 	uData.investGanhos += parseInt(praSacar)
	// 	uData.investLast = currTime

	// } else if (uData.invest != null) { // se já passou uma semana
	// 	linhaInvest = `Seu investimento **${bot.investimentos[uData.invest].desc}** acabou. Você recebeu R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele ${bot.config.propertyR}`
	// 	uData.moni += parseInt(praSacar)
	// 	uData.investGanhos += parseInt(praSacar)
	// 	uData.investLast = 0
	// 	uData.invest = null
	// 	uData.investTime = 0
	// }

	bot.data.set(message.author.id, uData)
	return bot.createEmbed(message, `${linhaTrabalho}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)
}
exports.config = {
	alias: ['receive', 'rcb']
};