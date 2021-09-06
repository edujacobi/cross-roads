exports.run = async (bot, message, args) => {
	const Discord = require('discord.js');
	const hora = 3600000
	let currTime = new Date().getTime()
	let target = message.mentions.members.first()
	let targetNoMention = []

	if (!targetNoMention[0] && args[0] && !target) { // para ver inventário sem pingar (funciona para outros servidores)

		let name = args.join(" ").toLowerCase()

		bot.data.forEach((item, id) => {
			if (bot.data.has(id, "username") && item.username.toLowerCase() == name) // verifica se o usuário é um jogador
				targetNoMention.push(id)

			else if (id.toString() == name) {
				targetNoMention.push(id)
			}
		})

		if (!targetNoMention[0])
			return bot.createEmbed(message, "Usuário não encontrado")

		// if (targetNoMention.length > 1) {
		// 	let str = ''
		// 	for (let i = 0; i < targetNoMention.length; ++i)
		// 		str += `**${targetNoMention[i].tag}**\n`

		// 	return bot.createEmbed(message, `Há ${targetNoMention.length} usuários com o mesmo nome.\n${str}`)
		// }
	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else {
		if (target)
			alvo = target.id
		else
			alvo = message.author.id
	}
	let uData = bot.data.get(message.author.id)

	if (uData.emRoubo)
		return bot.msgEmRoubo(message)

	if (uData.galoEmRinha)
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

	let esmola = uData.vipTime > currTime ? 75 : 50

	if (!target && !targetNoMention[0])
		return bot.createEmbed(message, `Você deve inserir um usuário para dar a esmola ${bot.config.coin}`, ";esmola <jogador>", 'GREEN')

	let tData = bot.data.get(alvo)

	if (!tData)
		return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.coin}`, null, 'GREEN')

	bot.users.fetch(alvo).then(user => {
		alvo = user.id
	})

	if (message.author.id == alvo)
		return bot.createEmbed(message, `Você não pode dar esmola para si mesmo ${bot.config.coin}`, null, 'GREEN')

	if (uData.moni < esmola)
		return bot.createEmbed(message, `Você não tem dinheiro suficiente para dar esmola ${bot.config.coin}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

	if (currTime > uData.esmolaEntregueHoje + hora) {
		if (currTime > tData.esmolaRecebidaHoje + hora) {
			if (message.author.id != bot.config.adminID) //Jacobi
				uData.esmolaEntregueHoje = currTime
			if (alvo != '526203502318321665') //Bot
				tData.esmolaRecebidaHoje = currTime

			uData.qtEsmolasDadas += esmola
			tData.qtEsmolasRecebidas += esmola

			uData.moni -= esmola
			tData.moni += esmola
			bot.data.set(message.author.id, uData)
			bot.data.set(alvo, tData)

			const msgEsmola = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setDescription(`**${bot.data.get(message.author.id, "username")}** do servidor ${message.guild.name} te deu uma esmola de R$ ${esmola} ${bot.config.coin}`)

			bot.users.fetch(alvo).then(user => user.send({
				embeds: [msgEsmola]
			}).catch(err => console.log(`Não consegui mandar mensagem privada para ${tData.username} (${alvo})`)))

			return bot.createEmbed(message, `Você doou **R$ ${esmola}** para ${tData.username} ${bot.config.coin}`, `${alvo == bot.user.id ? "Obrigado! • " : ""}R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'GREEN')

		} else
			return bot.createEmbed(message, `${tData.username} deve esperar ${bot.segToHour((tData.esmolaRecebidaHoje - currTime + hora) / 1000)} para receber uma esmola novamente ${bot.config.coin}`, null, 'GREEN')

	} else
		return bot.createEmbed(message, `Você deve esperar ${bot.segToHour((uData.esmolaEntregueHoje - currTime + hora) / 1000)} para entregar uma esmola novamente ${bot.config.coin}`, null, 'GREEN')
}
exports.config = {
	alias: ['doar', 'esm', 'alms']
};