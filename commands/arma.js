const Discord = require("discord.js");
exports.run = async (bot, message, args) => {

	if (!args[0]) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.emmetGun} Armas e Equipamentos`)
			.setDescription("As seguintes armas e equipamentos estão disponíveis:")
			.setColor('GREEN')
		Object.values(bot.guns).forEach(arma => {
			// let emote = bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote)
			embed.addField(`${bot.config[arma.emote]} ${arma.desc}`, `${arma.atk ? arma.atk : '_'}/${arma.def ? arma.def : '_'}`, true)
		})
		embed.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp();

		return message.channel.send({
				embeds: [embed]
			})
			.catch(err => console.log("Não consegui enviar mensagem `arma`", err));

	} else {
		let arma = args.join(" ").toLowerCase()
		let achou = false

		Object.entries(bot.guns).forEach(([key, value]) => {
			if (arma == value.desc.toLowerCase())
				achou = key
		})

		if (achou == false)
			return bot.createEmbed(message, "Arma não encontrada")


		let value = bot.guns[achou]
		let emoji = bot.config[value.emote]
		let emoji_id = emoji.substring(emoji.indexOf(':', 3) + 1, emoji.indexOf('>'))

		const embed = new Discord.MessageEmbed()
			.setTitle(`${emoji} ${value.desc}`)
			//.setThumbnail(bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == value.emote).url)
			.setThumbnail(bot.emojis.cache.get(emoji_id).url)
			.setDescription(`${value.atk != null ? `**Poder de ataque:** ${value.atk}\n` : ""}${value.def != null ? `**Poder de defesa:** ${value.def}\n` : ""}${value.moneyAtk != null ? `**Valor roubado:** ${value.moneyAtk}%\n` : ""}${value.moneyDef != null ? `**Valor defendido:** ${value.moneyDef}%\n` : ""}${value.preço != null ? `**Preço:** R$ ${value.preço.toLocaleString().replace(/,/g, ".")}\n` : ""}${value.utilidade != null ? `${value.utilidade}` : ""}`)
			.setColor('GREEN')
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp();
		return message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `arma`", err))
	}
};
exports.config = {
	alias: ['gun', 'armas', 'guns', 'equipamentos', 'itens']
};