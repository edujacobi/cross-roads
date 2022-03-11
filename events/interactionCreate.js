const Discord = require('discord.js')
module.exports = async (bot, interaction) => {
	if (!interaction.isCommand()) return

	const cmd = bot.slashes.get(interaction.commandName)

	if (!cmd) return

	try {
		await cmd.run(bot, interaction)
		
		let uData = bot.data.get(interaction.user.id)

		const embed = new Discord.MessageEmbed()
			.setTitle("Slash")
			.setAuthor({
				name: uData.username ? `${uData.username} (${interaction.user.id})` : `${interaction.user.username} (${interaction.user.id})`,
				iconURL: interaction.user.avatarURL()
			})
			.setDescription(`${uData.username ? uData.username : interaction.user.username} **/${interaction.commandName}**`)
			.setColor(bot.colors.background)
			.setFooter({
				text: `Servidor ${interaction.guild.name}. Canal #${interaction.channel.name}`,
				iconURL: interaction.guild.iconURL()
			})
			.setTimestamp()

		bot.channels.cache.get('564988393713303579')?.send({embeds: [embed],})
			.catch(() => console.log('Não consegui fazer log de ', interaction.commandName, args))

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