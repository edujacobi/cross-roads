const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	let multiplicador_evento = 1
	let preço = 500 * (bot.bilhete.get('diaUltimoSorteio') * 10 + 1) * multiplicador_evento
	let total = bot.bilhete.get('acumulado')
	let lastWinner = bot.bilhete.get('lastWinner')
	let userBilhete = bot.bilhete.get(message.author.id)

	let count = 0
	bot.bilhete.forEach((user, id) => {
		if (id == parseInt(id))
			count += 1
	})

	// if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id) && uData.vipTime < currTime) return

	const embed = new Discord.MessageEmbed()
		.setTitle(`🎟️ Bilhete premiado`)
		.setDescription(`Compre um bilhete e teste sua sorte! Sorteios às 18h.\nVIPs possuem dias especiais, mas podem participar de todos!\n\n**Bilhetes vendidos**: ${count.toLocaleString().replace(/,/g, ".")}`)
		.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/855577867840258148/admission-tickets_1f39f-fe0f.png')

	if (userBilhete)
		embed.addField(`Seu bilhete`, `#${userBilhete.numero}`)
	else
		embed.addField(`Preço do bilhete`, `R$ ${preço.toLocaleString().replace(/,/g, ".")}`)

	embed.addField(`📆 Dias de sorteio`, `SEG, TER, QUA, QUI e SEX`, true)
		.addField(`${bot.badges.vip} Dias VIP`, `SÁB e DOM`, true)
		.addField(`Prêmio acumulado`, `R$ ${Math.round(total/3*2).toLocaleString().replace(/,/g, ".")}`)
		.setColor(bot.colors.darkGrey)
		.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

	if (lastWinner)
		embed.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")} • Último vencedor: [#${lastWinner.numero}] ${bot.data.get(lastWinner.id, 'username')} (R$ ${lastWinner.premio.toLocaleString().replace(/,/g, ".")})`)

	message.channel.send({
			embeds: [embed]
		})
		.then(msg => {
			msg.react('🎟️').then(r => {
				const filter = (reaction, user) => reaction.emoji.name === '🎟️' && user.id == message.author.id

				const bilhete = msg.createReactionCollector({
					filter,
					time: 90000,
					max: 1
				})

				bilhete.on('collect', r => {
					if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `bilhete`"))
					currTime = new Date().getTime()
					uData = bot.data.get(message.author.id)

					let diaUltimoSorteio = bot.bilhete.get('diaUltimoSorteio')

					userBilhete = bot.bilhete.get(message.author.id)

					if (userBilhete)
						return bot.createEmbed(message, `Você já comprou um bilhete para este sorteio! 🎟️`, `Seu bilhete: #${userBilhete.numero}`)

					if (uData.preso > currTime)
						return bot.msgPreso(message, uData)

					if (uData.hospitalizado > currTime)
						return bot.msgHospitalizado(message, uData)

					if (bot.isUserEmRouboOuEspancamento(message, uData))
						return

					if (bot.isPlayerMorto(uData)) return;

					if (bot.isPlayerViajando(uData))
						return bot.msgPlayerViajando(message);

					if (bot.isGaloEmRinha(message.author.id))
						return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

					if (uData.moni < 1)
						return bot.msgSemDinheiro(message)

					if (uData.moni < preço)
						return bot.msgDinheiroMenorQueAposta(message)

					if ((diaUltimoSorteio == 5 || diaUltimoSorteio == 6) && uData.vipTime < currTime)
						return bot.createEmbed(message, `🎟️ Sorteios de Sábado e Domingo são reservados para membros ${bot.config.vip} VIP!`)

					uData.moni -= preço
					bot.data.set(message.author.id, uData)

					bot.bilhete.set(message.author.id, {
						numero: bot.bilhete.indexes.length - 2,
					})
					bot.bilhete.set('acumulado', bot.bilhete.get('acumulado') + preço)

					userBilhete = bot.bilhete.get(message.author.id)

					count = 0
					bot.bilhete.forEach((user, id) => {
						if (id == parseInt(id))
							count += 1
					})

					const embedEd = new Discord.MessageEmbed()
						.setTitle(`🎟️ Bilhete premiado`)
						.setDescription(`Compre um bilhete e teste sua sorte! Sorteios todo dia às 18h.\nVIPs possuem dias especiais, mas podem participar de todos!\n\n**Bilhetes vendidos**: ${count.toLocaleString().replace(/,/g, ".")}`)
						.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/855577867840258148/admission-tickets_1f39f-fe0f.png')
						.addField(`Seu bilhete`, `#${userBilhete.numero}`)
						.addField(`📆 Dias de sorteio`, `SEG, TER, QUA, QUI e SEX`, true)
						.addField(`${bot.badges.vip} Dias VIP`, `SÁB e DOM`, true)
						.addField(`Prêmio acumulado`, `R$ ${Math.round(bot.bilhete.get('acumulado')/3*2).toLocaleString().replace(/,/g, ".")}`)
						.setColor(bot.colors.darkGrey)
						.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

					if (lastWinner)
						embedEd.setFooter(`${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, ".")} • Último vencedor: [#${lastWinner.numero}] ${bot.data.get(lastWinner.id, 'username')} (R$ ${lastWinner.premio.toLocaleString().replace(/,/g, ".")})`)

					msg.edit({
						embeds: [embedEd]
					}).catch(err => console.log("Não consegui editar mensagem `bilhete`"));
					bot.createEmbed(message, `🎟️ Bilhete #${userBilhete.numero} comprado. Boa sorte!`)

				})

				bilhete.on('end', async response => {
					if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `bilhete`"))
				})
			}).catch(err => console.log("Não consegui reagir mensagem `bilhete`"))
		})
		.catch(err => console.log("Não consegui enviar mensagem `bilhete`"))

};
exports.config = {
	alias: ['ticket']
};