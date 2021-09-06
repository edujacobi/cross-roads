const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime();

	function trabalhar(bot, message, job, uData, key) {
		if (job == undefined || key == undefined)
			return

		if (uData.job != null)
			return bot.createEmbed(message, `Você precisa receber seu pagamento antes de começar outro trabalho! ${bot.config.bulldozer}`, ";receber", 'GREEN')

		else {
			uData.job = key
			uData.jobTime = uData.classe == 'empresario' ? currTime + Math.round((job.time * 1000 * 60) * 0.95) : currTime + (job.time * 1000 * 60)
			uData.jobNotification = true
			bot.createEmbed(message, `Você começou a trabalhar de **${job.desc}** ${bot.config.bulldozer}`, null, 'GREEN')

			let aviso = (Math.random() < 0.50 ? "" : "\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!")

			setTimeout(() => {
				bot.users.fetch(message.author.id).then(user => {
					let userT = bot.data.get(message.author.id)
					if (userT.jobNotification) {
						user.send(`Você terminou o trabalho **${job.desc}**! ${bot.config.bulldozer}`)
							.catch(err => message.reply(`você terminou o trabalho **${job.desc}**! ${bot.config.bulldozer}${aviso}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Job\``));
						userT.jobNotification = false
						bot.data.set(message.author.id, userT)
					}
				});
			}, uData.jobTime - currTime)

			bot.data.set(message.author.id, uData)
			return bot.log(message, new Discord.MessageEmbed()
				.setDescription(`**${uData.username} começou a trabalhar de ${job.desc}**`)
				.setColor('YELLOW'))
		}
	}

	let uData = bot.data.get(message.author.id)

	let day = new Date().getDay()
	let hora = new Date().getHours()
	let option = args[0]

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (!option) {
		if (uData.job == null)
			return bot.createEmbed(message, `Você não está trabalhando ${bot.config.bulldozer}`, null, 'GREEN')

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		let minutes = Math.floor((uData.jobTime - currTime) / 1000)

		if (minutes < 0)
			return bot.createEmbed(message, `Você encerrou seu trabalho e pode receber seu pagamento ${bot.config.bulldozer}`, ";receber", 'GREEN')

		else
			return bot.createEmbed(message, `${bot.segToHour(minutes)} restantes para encerrar seu trabalho de **${bot.jobs[uData.job].desc}** ${bot.config.bulldozer}`, null, 'GREEN')

	} else {
		if (option == 'parar') {
			if (uData.job != null) {
				let minutes = Math.floor((uData.jobTime - currTime) / 1000)

				if (minutes < 0)
					return bot.createEmbed(message, `Você encerrou seu trabalho e pode receber seu pagamento ${bot.config.bulldozer}`, ";receber", 'GREEN')

				let job = bot.jobs[uData.job]
				bot.createEmbed(message, `Você desistiu do trabalho de **${job.desc}** ${bot.config.bulldozer}`, null, 'GREEN')
				uData.jobTime = 0
				uData.job = null
				uData.jobNotification = false
				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} parou o trabalho ${job.desc}**`)
					.setColor('YELLOW'))
				//clearTimeout(uData.jobNotification)

			} else
				bot.createEmbed(message, `Você não pode parar o que nem começou ${bot.config.bulldozer}`, null, 'GREEN')

			return bot.data.set(message.author.id, uData)
		}
	}

	if (option < 1 || (option % 1 != 0) || option > Object.keys(bot.jobs).length)
		return bot.createEmbed(message, `O ID deve ser entre 1 e ${Object.keys(bot.jobs).length} ${bot.config.bulldozer}`, null, 'GREEN')

	// if ((option == 16 || option == 17) && day != 0 && day != 6 && !(day == 5 && hora >= 20) && message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, `"Parça, este trabalho só fica disponível no final de semana" ${bot.config.thetruth}`, null, 0)

	// if (option == 13)
	// 	return bot.createEmbed(message, `Trabalho em manutenção ${bot.config.bulldozer}`)

	else {
		if (uData.emRoubo)
			return bot.msgEmRoubo(message)
		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)

		let emotes = ""
		let jobLugar = null
		let jobKey = null

		Object.entries(bot.jobs).forEach(([key, job]) => {
			if (option == job.id) {
				Object.entries(uData).forEach(([key_udata, value_udata]) => {
					if (!Array.isArray(job.arma)) {
						if (key_udata == "_" + job.arma || (key_udata == "_9mm" && job.arma == "colt45") || job.arma == null) {
							if (currTime > value_udata) {
								Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
									if (job.arma == key_gun) {
										let emote = bot.config[value_gun.emote]
										return bot.createEmbed(message, `É necessário possuir ${emote} para este trabalho ${bot.config.bulldozer}`, null, 'GREEN')
									}
								})

							} else {
								if (currTime > uData.jobTime || !uData.jobTime) {
									jobLugar = job
									jobKey = key
								}
							}
						}

					} else {
						for (let i = 0; i < job.arma.length; i++) {
							let arma = job.arma[i]
							if (key_udata == "_" + arma || (key_udata == "_9mm" && arma == "colt45")) {
								if (currTime > value_udata) {
									Object.entries(bot.guns).forEach(([key_gun, value_gun]) => {
										if (arma == key_gun) {
											let temp_emote = bot.config[value_gun.emote]
											emotes += `${temp_emote}`
										}
									})

								} else {
									if (emotes == "" && (currTime > uData.jobTime || !uData.jobTime)) {
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

		if (emotes != "")
			return bot.createEmbed(message, `É necessário possuir ${emotes} para este trabalho ${bot.config.bulldozer}`, null, 'GREEN')
		else
			return trabalhar(bot, message, jobLugar, uData, jobKey)

	}
}
exports.config = {
	alias: ['trab', 'trabalho', 'j', 't', 'trabalhar']
};