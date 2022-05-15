const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

exports.run = async (bot, interaction) => {
	
	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.emmetGun} Armas, equipamentos e itens`)
		.setDescription("As seguintes armas, equipamentos e itens estão disponíveis.\nVocê pode ver mais detalhes usando `/item MP5`, por exemplo.")
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

	let escolhas = []
	Object.values(bot.guns).forEach(item => {
		if (item.data !== 'celular')
			escolhas.push({
				label: item.desc,
				emoji: item.skins.default.emote,
				value: item.data
			})
	})

	const row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageSelectMenu()
			.setCustomId('select')
			.setPlaceholder('Selecione o item')
			.addOptions(escolhas))

	await interaction.reply({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `arma`"))

	const filter = (select) => [
		'select',
	].includes(select.customId) && select.user.id === interaction.user.id

	const collector = interaction.channel.createMessageComponentCollector({
		filter,
		idle: 60000,
	})

	collector.on('collect', async r => {
		await r.deferUpdate()


		// let arma = args.join(" ").toLowerCase()
		let achou = r.values[0]
		//
		// Object.entries(bot.guns).forEach(([key, value]) => {
		// 	if (item == value.desc.toLowerCase())
		// 		achou = key
		// })
		//
		// if (achou === false)
		// 	return await interaction.reply("Arma não encontrada")

		let uData = await bot.data.get(interaction.user.id)

		let value = bot.guns[achou]
		let emoji = value.skins[uData.arma[achou].skinAtual].emote
		let emoji_id = emoji.substring(emoji.indexOf(':', 3) + 1, emoji.indexOf('>'))
		let emojiUrl = await bot.shard.broadcastEval(bot.findEmoji, {context: {nameOrId: emoji_id}})
			.then(emojiArray => {
				const foundEmoji = emojiArray.find(emoji => emoji)
				return foundEmoji ? foundEmoji.url : console.warn('I could not find such an emoji.')
			})

		const embed2 = new Discord.MessageEmbed()
			.setTitle(`${emoji} ${value.desc}`)
			.setThumbnail(emojiUrl) //bot.emojis.cache.get(emoji_id).url
			.setDescription(`${value.atk != null ? `**Poder de ataque:** ${value.atk}\n` : ""}${value.def != null ? `**Poder de defesa:** ${value.def}\n` : ""}${value.moneyAtk != null ? `**Valor roubado:** ${value.moneyAtk}%\n` : ""}${value.moneyDef != null ? `**Valor defendido:** ${value.moneyDef}%\n` : ""}${value.preço != null ? `**Preço:** R$ ${value.preço.toLocaleString().replace(/,/g, ".")}\n` : ""}${value.utilidade != null ? `${value.utilidade}` : ""}`)
			.setColor('GREEN')
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		return interaction.editReply({embeds: [embed2]})
			.catch(() => console.log("Não consegui enviar mensagem `arma`"))
	})

}

exports.commandData = new SlashCommandBuilder()
	.setName('item')
	.setDescription('Mostra informações dos itens')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}