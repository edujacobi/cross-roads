const Discord = require("discord.js")

exports.run = async (bot, message, args) => {

	// if (!bot.isAdmin(message.author.id))
	// 	return message.reply('comando em manutenção')

	const embed = new Discord.MessageEmbed()
		.setTitle(`🏆 Rankings`)
		.setDescription(`Os melhores jogadores em determinadas áreas e ações!\nClique no botão e abra o ranking selecionado!`)
		.setColor('GREEN')
		// .addField(`${bot.badges.topGrana1_s4} Valores`, `\`\;topvalor\``, true)
		// .addField(`${bot.config.coin} Grana`, `\`\;topgrana\``, true)
		// .addField(`${bot.config.ficha} Ficha`, `\`\;topficha\``, true)
		// .addField(`${bot.badges.topGalo_s4} Galo`, `\`\;topgalo\``, true)
		// .addField(`${bot.badges.topGangue_s4} Gangue`, `\`\;topgangue\``, true)
		// .addField(`${bot.badges.esmagaCranio_s4} Pancada`, `\`;toppancada\``, true)
		// .addField(`${bot.badges.sortudo_s4} Sortudo`, `\`;topsortudo\``, true)
		// .addField(`${bot.badges.bolsoLargo_s4} Roubos`, `\`;toproubo\``, true)
		// .addField(`${bot.badges.fujao_s4} Prisão`, `\`;toppreso\``, true)
		// .addField(`${bot.badges.filantropo_s4} Esmolas`, `\`;topesmola\``, true)
		// .addField(`${bot.badges.investidor_s4} Investidores`, `\`;topinvestidor\``, true)
		// .addField(`${bot.badges.workaholic_s4} Trabalhadores`, `\`;toptrabalhador\``, true)
		// .addField(`${bot.badges.patricinha_s4} Gastadores`, `\`;topgastador\``, true)
		// .addField(`${bot.badges.deputado_s4} Subornadores`, `\`;topsuborno\``, true)
		// .addField(`${bot.badges.hipocondriaco_s4} Doentes`, `\`;topdoente\``, true)
		// .addField(`${bot.config.vasculhar} Vasculhadores`, `\`;topvasculhar\``, true)
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp()

	let buttons = [
		{nome: 'Valores', emote: '853052970115006485', comando: 'topvalor'},
		{nome: 'Grana', emote: '539572031436619777', comando: 'topgrana'},
		{nome: 'Ficha', emote: '757021259451203665', comando: 'topficha'},
		{nome: 'Galo', emote: '853053236952825856', comando: 'topgalo'},
		{nome: 'Gangue', emote: '816407267665510440', comando: 'topgang'},
		{nome: 'Pancada', emote: '816407267246211084', comando: 'toppancada'},
		{nome: 'Sortudo', emote: '819694112076726303', comando: 'topsortudo'},
		{nome: 'Roubos', emote: '856346384721772555', comando: 'toproubo'},
		{nome: 'Prisão', emote: '853053234632458240', comando: 'toppreso'},
		{nome: 'Esmolas', emote: '816407267707453490', comando: 'topesmola'},
		{nome: 'Investidores', emote: '816407267556851712', comando: 'topinvestidor'},
		{nome: 'Trabalhadores', emote: '816407267246211115', comando: 'toptrabalhador'},
		{nome: 'Gastadores', emote: '817097198860894310', comando: 'topgastador'},
		{nome: 'Subornadores', emote: '816407267779411989', comando: 'topsuborno'},
		{nome: 'Doentes', emote: '817965402621083748', comando: 'topdoente'},
		{nome: 'Vasculhadores', emote: '816407267581886575', comando: 'topvasculhar'},
		// {nome: 'Presentes', emote: '921753148610211901', comando: 'toppresente'},
	]
	let rows = []

	while (buttons.length > 0) {
		let row = new Discord.MessageActionRow()
		for (let i = 0; i < 5; i++) {
			if (buttons.length === 0)
				continue
			let button = buttons.shift()
			row.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel(button.nome)
				.setEmoji(button.emote)
				.setCustomId(message.id + message.author.id + button.comando))
		}
		rows.push(row)
	}

	let msg = await message.channel.send({embeds: [embed], components: rows})
		.catch(() => console.log("Não consegui enviar mensagem `top`"))

	const filter = (button) => (button.customId.indexOf(message.id + message.author.id) > -1) && button.user.id === message.author.id
	// const filter = (reaction, user) => Object.values(e).includes(reaction.emoji.id) && user.id === message.author.id
	const collector = message.channel.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async r => {
		await r.deferUpdate()
		let comando = r.customId.replace(message.id + message.author.id, '')
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