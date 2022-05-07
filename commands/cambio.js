const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	// if (message.author.id != bot.config.adminID)
	// 	return
	let uData = await bot.data.get(message.author.id)
	// const LIMIT = 100
	let currTime = new Date().getTime()
	let valorFicha = 80 // cada ficha vale 80 no câmbio
	let texto = ''
	let option = args[0]

	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.mafiaCasino} Câmbio`)
			.setDescription(`Troque suas fichas por dinheiro! Cada ficha vale R$ 80.

O valor da ficha no ${bot.config.hospital} Hospital é de R$ 60 e na ${bot.config.prisao} Prisão é de R$ 40.

\`;cambio [quantidade]\``)
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `cambio`"))
	}
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

	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (await bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

	if (['allin', 'all', 'tudo'].includes(option))
		option = uData.ficha

	// if (args[0] > LIMIT){
	// 	args[0] = LIMIT
	// 	bot.createEmbed(message, `O Câmbio está limitado a ${bot.config.ficha} ${LIMIT} fichas por comando`)
	// }

	if (uData.ficha < 1)
		return bot.createEmbed(message, `Você não tem ${bot.config.ficha} **fichas** suficientes para trocar`)

	if (option <= 0 || (option % 1 != 0))
		return bot.msgValorInvalido(message)

	if (parseInt(uData.ficha) < option)
		return bot.createEmbed(message, `Você não tem esta quantidade de ${bot.config.ficha} **fichas** para trocar`, `Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}`)

	let valor = parseInt(option)
	let cambio = valor * valorFicha

	let aceitar = '572134588340633611'
	let negar = '572134589863034884'

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.mafiaCasino} Câmbio`)
		.setDescription(`${texto}Confirmar troca de ${bot.config.ficha} ${valor.toLocaleString().replace(/,/g, ".")} fichas por R$ ${cambio.toLocaleString().replace(/,/g, ".")}?`)
		.setFooter({text: `${bot.user.username} • "Me manda uma esmola!"`, iconURL: bot.user.avatarURL()})
		.setTimestamp()

	let row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SUCCESS')
			.setLabel('Aceitar')
			.setEmoji(aceitar)
			.setCustomId('aceitar'))

		.addComponents(new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel('Cancelar')
			.setEmoji(negar)
			.setCustomId('negar'))


	let msg = await message.channel.send({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `cambio`"))


	const filter = (button) => [
		'aceitar',
		'negar',
	].includes(button.customId) && button.user.id === message.author.id

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async b => {
		await b.deferUpdate()

		if (b.customId === 'aceitar') {
			uData = await bot.data.get(message.author.id)

			if (await bot.isUserEmRouboOuEspancamento(message, uData))
				return

			if (await bot.isPlayerMorto(uData)) return

			if (await bot.isPlayerViajando(uData))
				return bot.msgPlayerViajando(message)

			if (await bot.isGaloEmRinha(message.author.id))
				return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

			if (uData.ficha < 1)
				return bot.createEmbed(message, `Você não tem ${bot.config.ficha} **fichas** suficientes para trocar`)

			if (parseInt(uData.ficha) < valor)
				return bot.createEmbed(message, `Você não tem esta quantidade de ${bot.config.ficha} **fichas** para trocar`, `Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}`)

			if (cambio > await bot.banco.get('cassino'))
				return bot.createEmbed(message, `O Cassino não tem caixa suficiente para trocar fichas com você`, `Caixa: R$ ${await bot.banco.get('cassino').toLocaleString().replace(/,/g, ".")}`)

			uData.ficha -= valor
			uData.moni += cambio
			await bot.banco.set('cassino', await bot.banco.get('cassino') - cambio)

			await bot.data.set(message.author.id, uData)

			embed.setDescription(`Você trocou ${bot.config.ficha} **${valor.toLocaleString().replace(/,/g, ".")} fichas** por R$ ${cambio.toLocaleString().replace(/,/g, ".")} ${bot.config.mafiaCasino}`)
				.setColor('GREEN')
				.setFooter({
					text: `${bot.user.username} • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
					iconURL: bot.user.avatarURL()
				})

			return msg.edit({
				embeds: [embed],
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `cambio`"))

		}
		else if (b.customId === 'negar') {
			embed.setDescription(`Câmbio recusado`)
				.setColor('RED')
				.setFooter({text: `${bot.user.username} • "Bora apostar mais!"`, iconURL: bot.user.avatarURL()})

			return msg.edit({
				embeds: [embed],
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `cambio`"))
		}
	})

	collector.on('end', async () => {
		return msg.edit({
			components: []
		}).catch(() => console.log("Não consegui editar mensagem `cambio`"))
	})

}
exports.config = {
	alias: ['c', 'exchange']
}