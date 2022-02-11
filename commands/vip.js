const Discord = require("discord.js")

const minToDays = (minutes) => {
	let d = Math.floor(minutes / 1440) // 60*24
	let h = Math.floor((minutes - (d * 1440)) / 60)

	return d > 0 ? (`${d} dias e ${h} horas`) : (`${h} horas`)
}

const beneficios = () => {
	let lista = [
		"Badge exclusiva no inventário",
		"Bônus de 50% no `;daily` e `;weekly`",
		"Recarga na alteração de nick",
		"Avatar GIF do galo",
		"Dobro de limite de caracteres no título do galo",
		"Imune ao cooldown entre comandos",
		"Entrega esmolas 50% maiores",
		// "Envio de SMS mais rápido",
		"Acesso ao canal de desenvolvimento",
		"Acesso à categoria VIP do servidor Cross Roads",
		"Cargo VIP no servidor do Cross Roads",
		"25% de desconto na troca de Classe",
		// "Pode solicitar alteração do `Jogando desde`",
		"Sorteios do Bilhete premiado exclusivos",
		"Pode selecionar Skins para armas",
		"Muito mais a vir!"
	]

	let texto = ""

	lista.forEach(item => texto += `${item}\n`)

	return texto
}

exports.run = async (bot, message, args) => {
	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.vip} Seja VIP`)
		.setThumbnail("https://media.discordapp.net/attachments/531174573463306240/799060089503875072/VIP.png")
		.setColor(0xffd700)
		.addField("Vantagens", beneficios())
		.addField("Como adquirir", "Mande uma DM pro Jacobi#5109. Caso não consiga, entre no servidor do Cross Roads. Valores: R$ 10,00 = 1 mês. R$ 25,00 = 3 meses.")
		.setFooter(bot.data.get(message.author.id, "username"), message.member.user.avatarURL())
		.setTimestamp()

	let row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Lista de VIPs')
			.setEmoji(bot.config.vip)
			.setCustomId(message.id + message.author.id + 'lista'))

	let msg = await message.channel.send({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `vip`"))

	const filter = (button) => [
		message.id + message.author.id + 'lista',
		message.id + message.author.id + 'prev',
		message.id + message.author.id + 'next',
	].includes(button.customId) && button.user.id === message.author.id

	const collector = message.channel.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	let vipsTotal = []
	let vips = []
	let currTime = new Date().getTime()

	bot.data.forEach(user => {
		if (user.vipTime > currTime) {
			vipsTotal.push({
				nick: user.username,
				tempo: user.vipTime - currTime,
			})
		}
	})

	function getEmbed(start = 0) {
		const current = vipsTotal.slice(start, start + 15)
		const membros = new Discord.MessageEmbed()
			.setTitle(`${bot.config.vip} Membros VIP`)
			.setColor(bot.colors.background)
			.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${vipsTotal.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())

		if (vipsTotal.length > 0) {
			vips = vipsTotal.sort((a, b) => b.tempo - a.tempo).slice(start, start + 15)
			vips.forEach(vip => membros.addField(vip.nick, `Tempo restante: ${minToDays((vip.tempo / 1000 / 60))}`, true))
		}
		else
			membros.setDescription("Não há VIPs")

		return membros
	}

	let currentIndex = 0

	collector.on('collect', async b => {
		await b.deferUpdate()

		let buttonAnterior = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Anterior')
			.setEmoji('⬅️')
			.setCustomId(message.id + message.author.id + 'prev')

		let buttonProx = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Próximo')
			.setEmoji('➡️')
			.setCustomId(message.id + message.author.id + 'next')

		if (b.customId === message.id + message.author.id + 'lista') {
			msg.edit({
				embeds: [embed, getEmbed()],
				components: vipsTotal.length > 15 ? [new Discord.MessageActionRow().addComponents(buttonProx)] : []
			}).catch(() => console.log("Não consegui editar mensagem `vip`"))
		}

		else if (b.customId === message.id + message.author.id + 'prev' || b.customId === message.id + message.author.id + 'next') {
			if (b.customId === message.id + message.author.id + 'prev')
				currentIndex -= 15
			else if (b.customId === message.id + message.author.id + 'next')
				currentIndex += 15

			let rowBtn = new Discord.MessageActionRow()
			if (currentIndex !== 0)
				rowBtn.addComponents(buttonAnterior)
			if (currentIndex + 15 < vipsTotal.length)
				rowBtn.addComponents(buttonProx)

			msg.edit({
				embeds: [embed, getEmbed(currentIndex)],
				components: [rowBtn]
			}).catch(() => console.log("Não consegui editar mensagem `vip`"))
		}
	})
	collector.on('end', () => {
		if (msg)
			msg.edit({
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `vip`"))
	})
}