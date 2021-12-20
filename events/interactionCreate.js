module.exports = async (bot, interaction) => {
	if (!interaction.isCommand()) return;

	const cmd = bot.slashes.get(interaction.commandName);

	if (!cmd) return;

	try {
		await cmd.run(bot, interaction);

	} catch (e) {
		console.error(e);
		if (interaction.replied)
			interaction.followUp({
				content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
				ephemeral: true
			})
			.catch(e => console.error("An error occurred following up on an error", e));

		else if (interaction.deferred)
			interaction.editReply({
				content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
				ephemeral: true
			})
			.catch(e => console.error("An error occurred following up on an error", e));

		else
			interaction.reply({
				content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
				ephemeral: true
			})
			.catch(e => console.error("An error occurred replying on an error", e));
	}
};