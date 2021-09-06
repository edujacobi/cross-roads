const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	// if (message.author.id != bot.config.adminID)
	// 	return
	let uData = bot.data.get(message.author.id)
	const LIMIT = 100
	let currTime = new Date().getTime()
	let valorFicha = 80 // cada ficha vale 80 no câmbio
	let texto = ''
	let option = args[0]


	// 	return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime) {
		valorFicha = 60
		texto = `O valor da ficha no ${bot.config.hospital} Hospital é de R$ 60\n`
	}
	if (uData.preso > currTime) {
		valorFicha = 40
		texto = `O valor da ficha na ${bot.config.prisao} Prisão é de R$ 40\n`
	}
	// 	return bot.msgHospitalizado(message, uData)

	// if (uData.job != null)
	// 	return bot.msgTrabalhando(message, uData)

	if (uData.emRoubo)
		return bot.msgEmRoubo(message)

	if (uData.galoEmRinha)
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

	if (option == 'allin' || option == 'all' || option == 'tudo')
		option = uData.ficha

	// if (args[0] > LIMIT){
	// 	args[0] = LIMIT
	// 	bot.createEmbed(message, `O Câmbio está limitado a ${bot.config.ficha} ${LIMIT} fichas por comando`)
	// }

	if (uData.ficha < 1)
		return bot.createEmbed(message, `Você não tem ${bot.config.ficha} **fichas** suficientes para trocar`)

	if (option <= 0 || (option % 1 != 0))
		return bot.msgValorInvalido(message);

	if (parseInt(uData.ficha) < option)
		return bot.createEmbed(message, `Você não tem esta quantidade de ${bot.config.ficha} **fichas** para trocar`, `Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}`)

	let valor = parseInt(option)
	let cambio = valor * valorFicha

	let aceitar = '572134588340633611'
	let negar = '572134589863034884'

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.mafiaCasino} Câmbio`)
		.setDescription(`${texto}Confirmar troca de ${bot.config.ficha} ${valor.toLocaleString().replace(/,/g, ".")} fichas por R$ ${cambio.toLocaleString().replace(/,/g, ".")}?`)
		.setFooter(`${bot.user.username} • "Me manda uma esmola!"`, bot.user.avatarURL())
		.setTimestamp();

	message.channel.send({
			embeds: [embed]
		})
		.then(msg => {
			msg.react(aceitar)
				.then(() => msg.react(negar)).catch(err => console.log("Não consegui reagir mensagem `cambio`", err))
				.then(r => {

					const filter = (reaction, user) => [aceitar, negar].includes(reaction.emoji.id) && user.id == message.author.id

					const cambioReaction = msg.createReactionCollector({
						filter,
						time: 90000,
						max: 1
					})

					cambioReaction.on('collect', r => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `cambio`", err))

						if (r.emoji.id === aceitar) {
							uData = bot.data.get(message.author.id)

							if (uData.emRoubo)
								return bot.msgEmRoubo(message)

							if (uData.galoEmRinha)
								return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

							if (uData.ficha < 1)
								return bot.createEmbed(message, `Você não tem ${bot.config.ficha} **fichas** suficientes para trocar`)

							if (parseInt(uData.ficha) < valor)
								return bot.createEmbed(message, `Você não tem esta quantidade de ${bot.config.ficha} **fichas** para trocar`, `Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}`)

							if (cambio > bot.banco.get('cassino'))
								return bot.createEmbed(message, `O Cassino não tem caixa suficiente para trocar fichas com você`, `Caixa: R$ ${bot.banco.get('cassino').toLocaleString().replace(/,/g, ".")}`)

							uData.ficha -= valor
							uData.moni += cambio
							bot.banco.set('cassino', bot.banco.get('cassino') - cambio)

							bot.data.set(message.author.id, uData)

							embed.setDescription(`Você trocou ${bot.config.ficha} **${valor.toLocaleString().replace(/,/g, ".")} fichas** por R$ ${cambio.toLocaleString().replace(/,/g, ".")} ${bot.config.mafiaCasino}`)
								.setColor('GREEN')
								.setFooter(`${bot.user.username} • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())

							return msg.edit({
								embeds: [embed]
							}).catch(err => console.log("Não consegui editar mensagem `cambio`", err));

						} else if (r.emoji.id === negar) {
							embed.setDescription(`Câmbio recusado`)
								.setColor('RED')
								.setFooter(`${bot.user.username} • "Bora apostar mais!"`, bot.user.avatarURL())

							return msg.edit({
								embeds: [embed]
							}).catch(err => console.log("Não consegui editar mensagem `cambio`", err));
						}
					})

					cambioReaction.on('end', async response => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `cambio`", err))
					})
				})
		}).catch(err => console.log("Não consegui enviar mensagem `cambio`", err))
};
exports.config = {
	alias: ['c', 'exchange']
};