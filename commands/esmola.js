exports.run = async (bot, message, args) => {
	const Discord = require('discord.js')
	const hora = 3600000
	let currTime = new Date().getTime()
	
	let uData = await bot.data.get(message.author.id)
		
	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return
	
	if (await bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

	let esmola = uData.vipTime > currTime ? 75 : 50
	
	let {
		uData: tData,
		alvo
	} = await bot.findUser(message, args)
	
	if (!tData) return
	
	if (!alvo)
		return bot.createEmbed(message, `Você deve inserir um usuário para dar a esmola ${bot.config.coin}`, ";esmola <jogador>", 'GREEN')

	if (!tData)
		return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.coin}`, null, 'GREEN')

	bot.users.fetch(alvo).then(user => {
		alvo = user.id
	})

	if (message.author.id === alvo)
		return bot.createEmbed(message, `Você não pode dar esmola para si mesmo ${bot.config.coin}`, null, 'GREEN')

	if (uData.moni < esmola)
		return bot.createEmbed(message, `Você não tem dinheiro suficiente para dar esmola ${bot.config.coin}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

	if (await bot.isAlvoEmRouboOuEspancamento(message, tData))
		return

	if (tData.classe == undefined)
		return bot.createEmbed(message, `**${tData.username}** não está ativo na temporada e não receber esmola ${bot.config.coin}`, null, 'GREEN')

	if (uData.esmolaEntregueHoje > currTime)
		return bot.createEmbed(message, `Você deve esperar ${bot.segToHour((uData.esmolaEntregueHoje - currTime) / 1000)} para entregar uma esmola novamente ${bot.config.coin}`, null, 'GREEN')

	if (tData.esmolaRecebidaHoje > currTime)
		return bot.createEmbed(message, `${tData.username} deve esperar ${bot.segToHour((tData.esmolaRecebidaHoje - currTime) / 1000)} para receber uma esmola novamente ${bot.config.coin}`, null, 'GREEN')

	uData.esmolaEntregueHoje = currTime + hora

	tData.esmolaRecebidaHoje = tData.classe === 'mendigo' ? tData.esmolaRecebidaHoje = currTime + (hora / 2) : tData.esmolaRecebidaHoje = currTime + hora

	uData.qtEsmolasDadas += esmola
	tData.qtEsmolasRecebidas += esmola

	uData.moni -= esmola
	tData.moni += esmola

	if (message.author.id === bot.config.adminID) //Jacobi
		uData.esmolaEntregueHoje = currTime

	if (alvo === '526203502318321665') //Bot
		tData.esmolaRecebidaHoje = currTime

	await bot.data.set(message.author.id, uData)
	await bot.data.set(alvo, tData)

	const msgEsmola = new Discord.MessageEmbed()
		.setColor('GREEN')
		.setDescription(`**${uData.username}** te deu uma esmola de R$ ${esmola} ${bot.config.coin}`) //do servidor ${message.guild.name}

	bot.users.fetch(alvo).then(user => user.send({embeds: [msgEsmola]})
		.catch(() => console.log(`Não consegui mandar mensagem privada para ${tData.username} (${alvo})`)))

	return bot.createEmbed(message, `Você doou **R$ ${esmola}** para ${tData.username} ${bot.config.coin}`, `${alvo === bot.user.id ? "Obrigado! • " : ""}R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'GREEN')

}
exports.config = {
	alias: ['doar', 'esm', 'alms']
}