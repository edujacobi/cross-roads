const Discord = require("discord.js")

exports.run = async (bot, message, args) => {

	// if (!bot.isAdmin(message.author.id))
	// 	return message.reply('comando em manutenção')

	const embed = new Discord.MessageEmbed()
		.setTitle(`🏆 Rankings`)
		.setDescription(`Os melhores jogadores em determinadas áreas e ações!\nClique no botão e abra o ranking selecionado!`)
		.setColor('GREEN')
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp()

	let buttons = [
		{label: 'Valores', emoji: '934631819444355112', value: 'topvalor'},
		{label: 'Grana', emoji: '539572031436619777', value: 'topgrana'},
		{label: 'Ficha', emoji: '757021259451203665', value: 'topficha'},
		{label: 'Galo', emoji: '853053236952825856', value: 'topgalo'},
		{label: 'Gangue', emoji: '816407267665510440', value: 'topgang'},
		{label: 'Pancada', emoji: '816407267246211084', value: 'toppancada'},
		{label: 'Sortudo', emoji: '819694112076726303', value: 'topsortudo'},
		{label: 'Roubos', emoji: '856346384721772555', value: 'toproubo'},
		{label: 'Prisão', emoji: '853053234632458240', value: 'toppreso'},
		{label: 'Esmolas', emoji: '816407267707453490', value: 'topesmola'},
		{label: 'Investidores', emoji: '816407267556851712', value: 'topinvestidor'},
		{label: 'Trabalhadores', emoji: '816407267246211115', value: 'toptrabalhador'},
		{label: 'Gastadores', emoji: '817097198860894310', value: 'topgastador'},
		{label: 'Subornadores', emoji: '816407267779411989', value: 'topsuborno'},
		{label: 'Doentes', emoji: '817965402621083748', value: 'topdoente'},
		{label: 'Vasculhadores', emoji: '934632286337503264', value: 'topvasculhar'},
		// {label: 'Presentes', emoji: '921753148610211901', value: 'toppresente'},
	]
	// let rows = []

	// while (buttons.length > 0) {
	// 	let row = new Discord.MessageActionRow()
	// 	for (let i = 0; i < 5; i++) {
	// 		if (buttons.length === 0)
	// 			continue
	// 		let button = buttons.shift()
	// 		row.addComponents(new Discord.MessageButton()
	// 			.setStyle('SECONDARY')
	// 			.setLabel(button.label)
	// 			.setEmoji(button.emoji)
	// 			.setCustomId(message.id + message.author.id + button.value))
	// 	}
	// 	rows.push(row)
	// }

	const row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageSelectMenu()
			.setCustomId(message.id + message.author.id + 'select')
			.setPlaceholder('Selecione o ranking')
			.addOptions(buttons))

	let msg = await message.channel.send({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `top`"))

	// const filter = (button) => (button.customId.indexOf(message.id + message.author.id) > -1) && button.user.id === message.author.id

	const filter = (select) => [
		message.id + message.author.id + 'select',
	].includes(select.customId) && select.user.id === message.author.id

	const collector = message.channel.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async r => {
		await r.deferUpdate()
		// let comando = r.customId.replace(message.id + message.author.id, '')
		let comando = r.values[0]
		bot.commands.get(comando).run(bot, message, args)
	})

	collector.on('end', () => {
		if (msg)
			msg.edit({
				components: []
			}).catch(() => console.log("Não consegui editar mensagem `top`"))
	})

}
exports.config = {
	alias: ['ranking', 'rank']
}