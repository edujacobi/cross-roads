const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	const MULT = uData.invest ? bot.investimentos[uData.invest].id : 1
	let daily = uData.vipTime > currTime ? 750 * MULT : 500 * MULT
	const evento = false
	const dia = 86040000

	if (currTime > uData.day + dia) {
		uData.day = currTime
		uData.moni += parseInt(daily)
		// let ovo = uData.vipTime > currTime ? 5 : 1
		// uData._ovo += ovo

		bot.data.set(message.author.id, uData)

		let aviso = (Math.random() < 0.50 ? "" : "\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!")

		setTimeout(() => {
			bot.users.fetch(message.author.id).then(user =>
				user.send(`Seu daily está disponível novamente ${bot.config.coin}`)
				.catch(err => message.reply(`seu daily está disponível novamente ${bot.config.coin}${aviso}`)
					.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Daily\``))
			)
		}, dia)

		bot.createEmbed(message, `Você recebeu seus R$ ${daily.toLocaleString().replace(/,/g, ".")} ${evento ? `e ${bot.config.ovo} ${ovo} Ovos de páscoa` : ''} diários ${bot.config.coin}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`${uData.username} recebeu seus R$ ${daily} diários`)
			.addField("Ficou com", `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)
			.setColor('GREEN'))

	} else
		bot.createEmbed(message, `Você já recebeu hoje. O daily ficará disponível novamente em ${bot.segToHour((uData.day + dia - currTime) / 1000)} ${bot.config.coin}`, null, 'GREEN')


}
exports.config = {
	alias: ['d', 'diario']
};