const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let uData = await bot.data.get(message.author.id)
	let multiplicador_evento = 1
	let preço = 500 * ((await bot.bilhete.get('diaUltimoSorteio') + 1) * 10) * multiplicador_evento
	let total = await bot.bilhete.get('acumulado')
	let lastWinner = await bot.bilhete.get('lastWinner')
	let userBilhete = await bot.bilhete.get(message.author.id)

	let count = 0

	await bot.bilhete.filter((user, id) => {
		if (id == parseInt(id))
			count += 1
	})

	// if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	const embed = new Discord.MessageEmbed()
		.setTitle(`🎟️ Bilhete premiado`)
		.setDescription(`Compre um bilhete e teste sua sorte! Sorteios às 18h.\nVIPs possuem dias especiais, mas podem participar de todos!\n\n**Bilhetes vendidos**: ${count.toLocaleString().replace(/,/g, ".")}`)
		.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/855577867840258148/admission-tickets_1f39f-fe0f.png')

	if (userBilhete)
		embed.addField(`Seu bilhete`, `#${userBilhete.numero}`)
	else
		embed.addField(`Preço do bilhete`, `R$ ${preço.toLocaleString().replace(/,/g, ".")}`)

	// .addField("🥂 MEGA DA VIRADA! 🎉", 'Compre e sonhe com a chance de ficar bilionário!')
	embed.addField(`📆 Dias de sorteio`, `SEG, TER, QUA, QUI e SEX`, true)
		.addField(`${bot.badges.vip} Dias VIP`, `SÁB e DOM`, true)
		.addField(`Prêmio acumulado`, `R$ ${Math.round(total / 3 * 2).toLocaleString().replace(/,/g, ".")}`)
		// .addField(`Prêmio acumulado`, `R$ ${total.toLocaleString().replace(/,/g, ".")}`)
		.setColor(bot.colors.darkGrey)
		.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

	if (lastWinner)
		embed.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")} • Último vencedor: [#${lastWinner.numero}] ${await bot.data.get(`${lastWinner.id}.username`)} (R$ ${lastWinner.premio.toLocaleString().replace(/,/g, ".")})`)

	const row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Comprar')
			.setEmoji('🎟️')
			.setDisabled(!!await bot.bilhete.get(message.author.id))
			.setCustomId('bilhete'))

	let msg = await message.channel.send({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `bilhete`"))

	const filter = (button) => [
		'bilhete',
	].includes(button.customId) && button.user.id === message.author.id

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 90000,
		max: 1
	})

	collector.on('collect', async b => {
		await b.deferUpdate()
		currTime = new Date().getTime()
		uData = await bot.data.get(message.author.id)

		let diaUltimoSorteio = await bot.bilhete.get('diaUltimoSorteio')

		userBilhete = await bot.bilhete.get(message.author.id)

		if (userBilhete)
			return bot.createEmbed(message, `Você já comprou um bilhete para este sorteio! 🎟️`, `Seu bilhete: #${userBilhete.numero}`)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return

		if (await bot.isPlayerMorto(uData)) return

		if (await bot.isPlayerViajando(uData))
			return bot.msgPlayerViajando(message)

		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		if (uData.moni < 1)
			return bot.msgSemDinheiro(message)

		if (uData.moni < preço)
			return bot.msgDinheiroMenorQueAposta(message)

		// if ((diaUltimoSorteio === 5 || diaUltimoSorteio === 6))
		// 	return bot.createEmbed(message, `🎟️ Nenhum sorteio será realizado neste final de semana!`)
		if ((diaUltimoSorteio === 5 || diaUltimoSorteio === 6) && uData.vipTime < currTime)
			return bot.createEmbed(message, `🎟️ Sorteios de Sábado e Domingo são reservados para membros ${bot.config.vip} VIP!`)

		uData.moni -= preço
		await bot.data.set(message.author.id, uData)

		let num = await bot.bilhete.keys

		await bot.bilhete.set(message.author.id, {
			numero: num.length - 2,
		})
		await bot.bilhete.set('acumulado', await bot.bilhete.get('acumulado') + preço)

		userBilhete = await bot.bilhete.get(message.author.id)

		count = 0

		await bot.bilhete.filter((user, id) => {
			if (id == parseInt(id))
				count += 1
		})

		const embedEd = new Discord.MessageEmbed()
			.setTitle(`🎟️ Bilhete premiado`)
			.setDescription(`Compre um bilhete e teste sua sorte! Sorteios todo dia às 18h.\nVIPs possuem dias especiais, mas podem participar de todos!\n\n**Bilhetes vendidos**: ${count.toLocaleString().replace(/,/g, ".")}`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/855577867840258148/admission-tickets_1f39f-fe0f.png')
			.addField(`Seu bilhete`, `#${userBilhete.numero}`)
			// .addField("🥂 MEGA DA VIRADA! 🎉", 'Compre e sonhe com a chance de ficar bilionário!')
			.addField(`📆 Dias de sorteio`, `SEG, TER, QUA, QUI e SEX`, true)
			.addField(`${bot.badges.vip} Dias VIP`, `SÁB e DOM`, true)
			.addField(`Prêmio acumulado`, `R$ ${Math.round(await bot.bilhete.get('acumulado') / 3 * 2).toLocaleString().replace(/,/g, ".")}`)
			// .addField(`Prêmio acumulado`, `R$ ${bot.bilhete.get('acumulado').toLocaleString().replace(/,/g, ".")}`)
			.setColor(bot.colors.darkGrey)
			.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

		if (lastWinner)
			embedEd.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")} • Último vencedor: [#${lastWinner.numero}] ${await bot.data.get(`${lastWinner.id}.username`)} (R$ ${lastWinner.premio.toLocaleString().replace(/,/g, ".")})`)

		msg.edit({
			embeds: [embedEd],
			components: []
		}).catch(() => console.log("Não consegui editar mensagem `bilhete`"))

		bot.createEmbed(message, `🎟️ Bilhete #${userBilhete.numero} comprado. Boa sorte!`)

	})

	collector.on('end', async () => {
		msg.edit({
			components: []
		}).catch(() => console.log("Não consegui editar mensagem `bilhete`"))
	})

}
exports.config = {
	alias: ['ticket']
}