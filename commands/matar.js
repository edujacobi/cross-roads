const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID) return
	let currTime = new Date().getTime()
	let tempo = args[1]
	
	let {
		uData,
		alvo
	} = await bot.findUser(message, args)

	if (!uData) return

	uData.morto = currTime + tempo * 60 * 60 * 1000
	uData.hospitalizado = currTime + tempo * 60 * 60 * 1000
	uData.moni = 0
	uData.ficha = 0
	uData.job = null
	uData.jobTime = 0

	await bot.data.set(alvo, uData)

	let mortes = [
		`foi atingido por um raio`, `foi atropelado por um opala`, `se esgasgou com uma uva passa`, `chutou a quina de um móvel`, `levou um coice de um cavalo`, `resvalou numa casca de banana`, `levou um ferro de passar na cabeça`, `teve um infarto`, `foi peidar e cagou o cu pra fora`, `vislumbrou todo o poder do Jacobi`
	]

	bot.shuffle(mortes)

	let morte = mortes[0]

	bot.createEmbed(message, `**${uData.username}** ${morte} e morreu. Ele ressuscitará em ${tempo} horas.`, `Não queira ser o próximo`, 0x7e7e7e)

	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**${await bot.data.get(message.author.id + ".username")} matou ${uData.username} por ${tempo} horas**`)
		.setColor(bot.colors.admin))

};