const Discord = require('discord.js')
exports.run = async (bot, message) => {
	let currTime = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	const MULT = uData.invest ? bot.investimentos[uData.invest].id : 1
	const isVip = uData.vipTime > currTime
	let daily = isVip ? 750 * MULT : 500 * MULT
	const evento = false
	const dia = 86040000

	let uCasamento = bot.casais.get(uData.casamentoID)

	let casado = uCasamento ? true : false
	let flores = isVip ? 2 : 1

	if (currTime > uData.day + dia) {
		uData.day = currTime
		uData.moni += parseInt(daily)
		if (casado) uData._flor += flores

		// let ovo = isVip ? 3 : 1
		// uData._ovo += ovo

		bot.data.set(message.author.id, uData)

		let aviso = Math.random() < 0.5 ? '' : '\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!'

		setTimeout(() => {
			message.author.send(`Seu daily está disponível novamente ${bot.config.coin}`)
				.catch(() => message.reply(`seu daily está disponível novamente ${bot.config.coin}${aviso}`)
					.catch(() => `Não consegui responder ${bot.data.get(message.author.id, 'username')} nem no PV nem no canal. \`Daily\``))
		}, dia)

		let textEvent = evento ? ` e ${bot.config.ovo} ${ovo} ${isVip ? 'Presentes' : 'Presente'}` : ''
		let textFlores = casado ? ` e ${bot.config.flor} ${flores} ${isVip ? 'Flores' : 'Flor'}` : ''

		bot.createEmbed(message, `Você recebeu seus R$ ${daily.toLocaleString().replace(/,/g, '.')}${textFlores}${textEvent} diários ${bot.config.coin}`,
			`R$ ${uData.moni.toLocaleString().replace(/,/g, '.')}`,
			'GREEN'
		)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`${uData.username} recebeu seus R$ ${daily} diários`)
			.addField('Ficou com', `R$ ${uData.moni.toLocaleString().replace(/,/g, '.')}`)
			.setColor('GREEN')
		)
	}
	else bot.createEmbed(message, `Você já recebeu hoje. O daily ficará disponível novamente em ${bot.segToHour((uData.day + dia - currTime) / 1000)} ${bot.config.coin}`, null, 'GREEN')
}
exports.config = {
	alias: ['d', 'diario'],
}
