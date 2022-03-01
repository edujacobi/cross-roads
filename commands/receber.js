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
		return bot.createEmbed(message, `Você não pode receber enquanto seu galo está em uma rinha ${bot.config.galo}`, null, bot.colors.white)

	let linhaTrabalho = ''
	// let linhaInvest = ''

	if (uData.job == null) {
		linhaTrabalho = `Você não está trabalhando ${bot.config.trabalhando}`

	} else {
		let job = bot.jobs[uData.job]
		let pagamento = job.pagamento

		if (uData.classe === 'mafioso')
			pagamento *= 0.9

		if (uData.classe === 'empresario')
			pagamento *= 1.05

		if (currTime > uData.jobTime) {
			linhaTrabalho = `Você recebeu seu pagamento de R$ ${Math.round(pagamento).toLocaleString().replace(/,/g, ".")} ${bot.config.trabalhando}`

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
			linhaTrabalho = `Você ainda está trabalhando de **${job.desc}** ${bot.config.trabalhando}`

	}

	bot.data.set(message.author.id, uData)
	
	return bot.createEmbed(message, `${linhaTrabalho}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'YELLOW')
}
exports.config = {
	alias: ['receive', 'rcb']
};