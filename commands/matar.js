const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID) return
	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	let currTime = new Date().getTime()
	let tempo = args[1]

	if (!targetNoMention[0] && args[0] && !targetMention) { // para ver inventário sem pingar (funciona para outros servidores)

		let name = args.join(" ").replace(args[1], "").replace(" ", "").toLowerCase()

		bot.data.forEach((item, id) => {
			if (bot.data.has(id, "username") && item.username.toLowerCase() == name) // verifica se o usuário é um jogador
				targetNoMention.push(id)

			else if (id.toString() == name) {
				targetNoMention.push(id)
			}
		})

		if (!targetNoMention[0])
			return bot.createEmbed(message, "Usuário não encontrado")
	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else
		alvo = targetMention ? targetMention.id : message.author.id

	if ((!targetMention && !targetNoMention[0]) || !tempo)
		return bot.createEmbed(message, `\`;matar <user> <horas>\` :headstone:`)

	let uData = bot.data.get(alvo)
	if (!uData) return bot.createEmbed(message, "Este usuário não possui um inventário")


	uData.morto = currTime + tempo * 60 * 60 * 1000
	uData.hospitalizado = currTime + tempo * 60 * 60 * 1000
	uData.moni = 0
	uData.ficha = 0
	uData.job = null
	uData.jobTime = 0

	bot.data.set(alvo, uData)

	let mortes = [
		`foi atingido por um raio`, `foi atropelado por um opala`, `se esgasgou com uma uva passa`, `chutou a quina de um móvel`, `levou um coice de um cavalo`, `resvalou numa casca de banana`, `levou um ferro de passar na cabeça`, `teve um infarto`, `foi peidar e cagou o cu pra fora`, `vislumbrou todo o poder do Jacobi`
	]

	bot.shuffle(mortes)

	let morte = mortes[0]

	bot.createEmbed(message, `**${uData.username}** ${morte} e morreu. Ele ressuscitará em ${tempo} horas.`, `Não queira ser o próximo`, 0x7e7e7e)

	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**${bot.data.get(message.author.id, "username")} matou ${uData.username} por ${tempo} horas**`)
		.setColor(bot.colors.admin))

};