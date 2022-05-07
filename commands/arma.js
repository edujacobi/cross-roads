const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	
	if (!args[0]) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.emmetGun} Armas e Equipamentos`)
			.setDescription("As seguintes armas e equipamentos estão disponíveis.\nVocê pode ver mais detalhes usando `;arma MP5`, por exemplo.")
			.setColor('GREEN')
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		Object.values(bot.guns).forEach(arma => {
			// let emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote)
			if (arma.atk || arma.def)
				embed.addField(`${arma.skins['default'].emote} ${arma.desc}`, `${arma.atk ? arma.atk : '0'} / ${arma.def ? arma.def : '0'}`, true)
			else {
				// if (arma.desc == 'Celular')
				// 	embed.addField(`${bot.config[arma.emote]} ${arma.desc}`, `\`;celular\``, true)
				if (arma.desc === 'Jetpack')
					embed.addField(`${arma.skins['default'].emote} ${arma.desc}`, `Para fugir`, true)
			}
		})

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `arma`"))

	}

	let arma = args.join(" ").toLowerCase()
	let achou = false

	Object.entries(bot.guns).forEach(([key, value]) => {
		if (arma == value.desc.toLowerCase())
			achou = key
	})

	if (achou === false)
		return bot.createEmbed(message, "Arma não encontrada")

	let uData = await bot.data.get(message.author.id)

	let value = bot.guns[achou]
	let emoji = value.skins[uData.arma[achou].skinAtual].emote
	let emoji_id = emoji.substring(emoji.indexOf(':', 3) + 1, emoji.indexOf('>'))
	let emojiUrl = await bot.shard.broadcastEval(bot.findEmoji, { context: { nameOrId: emoji_id } })
		.then(emojiArray => {
			const foundEmoji = emojiArray.find(emoji => emoji);
			return foundEmoji ? foundEmoji.url : console.warn('I could not find such an emoji.')
		});
	
	const embed = new Discord.MessageEmbed()
		.setTitle(`${emoji} ${value.desc}`)
		.setThumbnail(emojiUrl) //bot.emojis.cache.get(emoji_id).url
		.setDescription(`${value.atk != null ? `**Poder de ataque:** ${value.atk}\n` : ""}${value.def != null ? `**Poder de defesa:** ${value.def}\n` : ""}${value.moneyAtk != null ? `**Valor roubado:** ${value.moneyAtk}%\n` : ""}${value.moneyDef != null ? `**Valor defendido:** ${value.moneyDef}%\n` : ""}${value.preço != null ? `**Preço:** R$ ${value.preço.toLocaleString().replace(/,/g, ".")}\n` : ""}${value.utilidade != null ? `${value.utilidade}` : ""}`)
		.setColor('GREEN')
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp()

	return message.channel.send({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `arma`"))

}
exports.config = {
	alias: ['gun', 'armas', 'guns', 'equipamentos', 'itens', 'item', 'equipamento', 'equip']
}