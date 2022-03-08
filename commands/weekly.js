const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	const semana = 604800000 // 7 dias,
	let uData = bot.data.get(message.author.id)
	const MULT = uData.invest ? bot.investimentos[uData.invest].id : 1
	let weekly_moni = uData.vipTime > currTime ? 1500 * MULT : 1000 * MULT
	// let weekly_ficha = uData.vipTime > currTime ? 15 : 10


	if (currTime > uData.weekly + semana) {
		uData.weekly = currTime
		uData.moni += parseInt(weekly_moni)
		// uData.ficha += parseInt(weekly_ficha)
		bot.data.set(message.author.id, uData)
		bot.createEmbed(message, `Você recebeu seus R$ ${weekly_moni.toLocaleString().replace(/,/g, ".")} semanais ${bot.config.coin}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'GREEN')

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`${uData.username} recebeu seus R$ ${weekly_moni.toLocaleString().replace(/,/g, ".")} semanais`)
			.addField("Ficou com", `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)
			.setColor('GREEN'))

	} else
		return bot.createEmbed(message, `Você já recebeu esta semana. O Weekly ficará disponível novamente em ${bot.segToHour((uData.weekly + semana - currTime) / 1000)} ${bot.config.coin}`, null, 'GREEN')
}
exports.config = {
	alias: ['w', 'semanal']
};