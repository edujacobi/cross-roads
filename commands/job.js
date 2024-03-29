const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()

	async function trabalhar(bot, message, job, uData, key) {
		if (job == undefined || key == undefined)
			return

		if (uData.job != null)
			return bot.createEmbed(message, `Você precisa receber seu pagamento antes de começar outro trabalho! ${bot.config.trabalhos}`, ";receber", 'YELLOW')

		uData.job = key
		uData.jobTime = currTime + (job.time * 1000 * 60)
		bot.createEmbed(message, `Você começou a trabalhar de **${job.desc}** ${bot.config.trabalhos}`, null, 'YELLOW')

		let aviso = (Math.random() < 0.50 ? "" : "\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!")

		const embedPV = new Discord.MessageEmbed()
			.setTitle(`${bot.config.trabalhando} Você terminou o trabalho **${job.desc}**!`)
			.setColor('YELLOW')

		setTimeout(() => {
			message.author.send({embeds: [embedPV]})
				.catch(() => message.reply(`você terminou o trabalho **${job.desc}**! ${bot.config.trabalhando}${aviso}`)
					.catch(async () => `Não consegui responder ${uData.username} nem no PV nem no canal. \`Job\``))
		}, uData.jobTime - currTime)

		await bot.data.set(message.author.id, uData)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${uData.username} começou a trabalhar de ${job.desc}**`)
			.setColor('YELLOW'))

	}

	let uData = await bot.data.get(message.author.id)

	let day = new Date().getDay()
	let hora = new Date().getHours()
	let option = args[0]

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (!option) {
		if (uData.job == null)
			return bot.createEmbed(message, `Você não está trabalhando ${bot.config.trabalhos}`, null, 'YELLOW')
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		let minutes = Math.floor((uData.jobTime - currTime) / 1000)

		return minutes < 0 ?
			bot.createEmbed(message, `Você encerrou seu trabalho e pode receber seu pagamento ${bot.config.trabalhando}`, ";receber", 'YELLOW')
			: bot.createEmbed(message, `${bot.segToHour(minutes)} restantes para encerrar seu trabalho de **${bot.jobs[uData.job].desc}** ${bot.config.trabalhando}`, null, 'YELLOW')

	}

	if (option === 'parar' || option === 'p' || option === 'stop') {
		if (uData.job != null) {
			let minutes = Math.floor((uData.jobTime - currTime) / 1000)

			if (minutes < 0)
				return bot.createEmbed(message, `Você encerrou seu trabalho e pode receber seu pagamento ${bot.config.trabalhando}`, ";receber", 'YELLOW')

			let job = bot.jobs[uData.job]
			bot.createEmbed(message, `Você desistiu do trabalho de **${job.desc}** ${bot.config.trabalhos}`, null, 'YELLOW')
			uData.jobTime = 0
			uData.job = null

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`**${uData.username} parou o trabalho ${job.desc}**`)
				.setColor('YELLOW'))

		}
		else
			bot.createEmbed(message, `Você não pode parar o que nem começou ${bot.config.trabalhos}`, null, 'YELLOW')

		return await bot.data.set(message.author.id, uData)
	}


	if (option < 1 || (option % 1 != 0) || option > Object.keys(bot.jobs).length)
		return bot.createEmbed(message, `O ID deve ser entre 1 e ${Object.keys(bot.jobs).length} ${bot.config.trabalhos}`, null, 'YELLOW')
	
	if (option >= 16 && day !== 0 && day !== 6 && !(day === 5 && hora >= 20) && message.author.id !== bot.config.adminID)
		return bot.createEmbed(message, `"Parça, este trabalho só fica disponível no final de semana" ${bot.config.thetruth}`, null, 0)

	// if (option == 13)
	// 	return bot.createEmbed(message, `Trabalho em manutenção ${bot.config.trabalhando}`)
	
	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return
	
	if (await bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)

	let emotes = ""
	let jobLugar = null
	let jobKey = null

	Object.entries(bot.jobs).forEach(([key, job]) => {
		if (option == job.id) {
			Object.entries(uData.arma).forEach(([keyArma, arma]) => {
				if (!Array.isArray(job.arma)) {
					if (keyArma == job.arma || job.arma == null) {
						if (arma.tempo < currTime) {
							Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
								if (job.arma == key_gun) {
									let emote = value_gun.skins[uData.arma[value_gun.data].skinAtual].emote
									return bot.createEmbed(message, `É necessário possuir ${emote} para este trabalho ${bot.config.trabalhos}`, null, 'YELLOW')
								}
							})
						}
						else {
							if (uData.jobTime < currTime || !uData.jobTime) {
								jobLugar = job
								jobKey = key
							}
						}
					}
				}
				else {
					for (let i = 0; i < job.arma.length; i++) {
						let jobArma = job.arma[i]
						if (keyArma == jobArma) {
							if (arma.tempo < currTime) {
								Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
									if (jobArma == key_gun) {
										let temp_emote = value_gun.skins[uData.arma[value_gun.data].skinAtual].emote
										emotes += `${temp_emote}`
									}
								})
							}
							else {
								if (emotes == "" && (uData.jobTime < currTime || !uData.jobTime)) {
									jobLugar = job
									jobKey = key
								}
							}
						}
					}
				}
			})
		}
	})

	return emotes != "" ?
		bot.createEmbed(message, `É necessário possuir ${emotes} para este trabalho ${bot.config.trabalhos}`, null, 'YELLOW')
		: trabalhar(bot, message, jobLugar, uData, jobKey)


}
exports.config = {
	alias: ['trab', 'trabalho', 'j', 't', 'trabalhar']
}