const Discord = require('discord.js')
exports.run = async (bot, message, args) => {
	const Piii = require("piii")
	const piiiFilters = require("piii-filters")
	let uData = await bot.data.get(message.author.id)
	let custo = 50000

	if (uData.nickAlterado)
		return bot.createEmbed(message, "Você não tem trocas de nick disponíveis")

	const embed = new Discord.MessageEmbed()
		.setTitle(`Cartório de registro civil`)
		.setColor(bot.colors.background)
		.setDescription(`Olá **${uData.username}**, defina seu novo **nick**!
Preço para troca: R$ ${custo.toLocaleString().replace(/,/g, ".")}`)
		.setFooter(`${uData.username} • Na próxima mensagem, mande o nick escolhido`, message.member.user.avatarURL())
		.setTimestamp()

	message.channel.send({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `nick`"))

	const filter = response => response.author.id === message.author.id
	const collector = message.channel.createMessageCollector({
		filter,
		time: 90000,
		max: 1,
	})

	collector.on('collect', async m => {
		if (uData.moni < custo)
			return bot.msgSemDinheiro(message)
		if (uData.nickAlterado)
			return bot.createEmbed(message, "Você não tem trocas de nick disponíveis", null, bot.colors.admin)

		let regex = /^[a-zA-Z0-9 !$.,%^&()+=\-/\\]{3,18}$/ugm

		const piii = new Piii({
			filters: [
				...Object.values(piiiFilters),
				bot.palavrasBanidas
			],
		})

		let nick = m.content

		nick.replace(/\s/g, ' ')  // remove espaço bosta do caraios
		// nick.replace(/\n/g, " ")

		if (nick.length < 3)
			return bot.createEmbed(message, `Escolha um nick maior`, `Mínimo de caracteres: 3`)
		if (nick.length > 18)
			return bot.createEmbed(message, `Escolha um nick menor`, `Máximo de caracteres: 18`)
		if (nick.toLowerCase() === 'jacobi' || nick.toLowerCase() === 'cross roads' || nick.toLowerCase() === 'user')
			return bot.createEmbed(message, `Este nick é reservado`, `Escolha outro nick`)

		if (await bot.data.find("username", nick) || await bot.data.find(user => user.username?.toLowerCase() === nick.toLowerCase()))
			return bot.createEmbed(message, `Este nick já está em uso`, `Escolha outro nick`)


		if (nick.indexOf('@') > -1 || nick.indexOf(':') > -1 || nick.indexOf(';') > -1 || nick.indexOf('`') > -1 || nick.indexOf('_') > -1 || nick.indexOf('*') > -1 ||
			nick.toLowerCase().indexOf('iii') > -1 || nick.toLowerCase().indexOf('lll') > -1 || nick.toLowerCase().indexOf('lilil') > -1 || nick.indexOf('  ') > -1 ||
			nick.toLowerCase().indexOf('granada') > -1 || nick.toLowerCase().indexOf('semgranada') > -1 || nick.indexOf('\\') > -1 || nick.indexOf('\n') > -1 ||
			nick.toLowerCase().indexOf('boss desafiar') > -1 || nick.toLowerCase().indexOf('nome') > -1 || nick.toLowerCase().indexOf('titulo') > -1 ||
			nick.toLowerCase().indexOf('título') > -1 || nick.toLowerCase().indexOf('info') > -1 || nick.toLowerCase().indexOf('treinar') > -1 ||
			nick.toLowerCase().indexOf('avatar') > -1)
			return bot.createEmbed(message, `Este nick é inválido`, `Escolha outro nick`)
		if (!regex.test(nick))
			return bot.createEmbed(message, 'Este nick é inválido', `Escolha outro nick`)
		if (piii.has(nick))
			return bot.createEmbed(message, `Escolha um nick maior`, `Palaras ofensivas não são aceitas`)

		const embed = new Discord.MessageEmbed()
			.setTitle(`Cartório de registro civil`)
			.setColor(bot.colors.background)
			.setDescription(`Confirmar o novo nick **${nick}**?
Você só poderá alterá-lo novamente em outra temporada ou ao adquirir ${bot.config.vip} VIP.`)
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
			.setTimestamp()

		let row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirmar')
				.setCustomId('confirmar'))
			.addComponents(new Discord.MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancelar')
				.setCustomId('cancelar'))

		let msg = await message.channel.send({
			embeds: [embed],
			components: [row]
		}).catch(() => console.log("Não consegui enviar mensagem `nick`"))

		const filter = (button) => [
			'confirmar',
			'cancelar',
		].includes(button.customId) && button.user.id === message.author.id

		const collector = msg.createMessageComponentCollector({
			filter,
			time: 90000,
			max: 1
		})

		collector.on('collect', async b => {
			await b.deferUpdate()
			if (b.customId === 'confirmar') {
				uData = await bot.data.get(message.author.id)
				if (uData.moni < custo)
					return bot.msgSemDinheiro(message)
				if (uData.nickAlterado)
					return bot.createEmbed(message, "Você não tem trocas de nick disponíveis")

				uData.username = nick
				uData.moni -= custo
				uData.nickAlterado = true
				await bot.data.set(message.author.id, uData)

				return msg.edit({
					embeds: [embed.setDescription(`Seu **nick** foi definido como **${nick}**! Até outro dia!`).setColor('GREEN')],
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `nick`"))

			}
			else if (b.customId === 'cancelar') {
				return msg.edit({
					embeds: [embed.setDescription(`Troca cancelada. Volte sempre!`).setColor('RED')],
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `nick`"))
			}
		})
	})
}

exports.help = {
	name: "base",
	category: "Code",
	description: "base",
	usage: "base",
	example: "base"
}