const Discord = require('discord.js')
module.exports = async (bot, interaction) => {
	if (!interaction.isCommand()) return

	const cmd = bot.slashes.get(interaction.commandName)

	if (!cmd) return

	// if (!(bot.isAdmin(interaction.user.id) || bot.isMod(interaction.user.id) || bot.isAjudante(interaction.user.id) || await bot.data.get(interaction.user.id + ".vipTime") > Date.now()))
	// 	return

	try {
		await cmd.run(bot, interaction)

		await bot.data.set(interaction.user.id + ".lastCommandChannelId", interaction.channel.id)

		let uData = await bot.data.get(interaction.user.id)
		

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: uData?.username ? `${uData.username} (${interaction.user.id})` : `${interaction.user.username} (${interaction.user.id})`,
				iconURL: interaction.user.avatarURL()
			})
			.setDescription(`${uData.username ? uData.username : interaction.user.username} **/${interaction.commandName}**`)
			.setColor(bot.colors.background)
			.setFooter({
				text: `Servidor ${interaction.guild.name}. Canal #${interaction.channel.name}`,
				iconURL: interaction.guild.iconURL()
			})
			.setTimestamp()

		const LOG_CHANNEL_ID = '564988393713303579'

		bot.shard.broadcastEval(async (c, {channelId, embed}) => {
			const channel = c.channels.cache.get(channelId)
			if (!channel)
				return false
			
			await channel.send({embeds: [embed]})

			return true

		}, {context: {channelId: LOG_CHANNEL_ID, embed}})
			.then(sentArray => {
				if (!sentArray.includes(true))
					return console.warn('Não encontrei o canal de log.')

			})

	} catch (e) {
		console.error(e)
		if (interaction.replied)
			interaction.followUp({
				content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
				ephemeral: true
			})
				.catch(e => console.error("An error occurred following up on an error", e))

		else if (interaction.deferred)
			interaction.editReply({
				content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
				ephemeral: true
			})
				.catch(e => console.error("An error occurred following up on an error", e))

		else
			interaction.reply({
				content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
				ephemeral: true
			})
				.catch(e => console.error("An error occurred replying on an error", e))
	}
}