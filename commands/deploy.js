exports.run = async (bot, message, args) => {

	if (message.author.id != bot.config.adminID) return

	// We'll partition the slash commands based on the guildOnly boolean.
	// Separating them into the correct objects defined in the array below.
	const [globalCmds, guildCmds] = bot.slashes.partition(c => !c.conf.guildOnly);

	// Give the user a notification the commands are deploying.
	await message.channel.send("Deploying commands!");

	// We'll use set but please keep in mind that `set` is overkill for a singular command.
	// Set the guild commands like 
	await bot.guilds.cache.get(message.guild.id)?.commands.set(guildCmds.map(c => c.commandData));

	// Then set the global commands like 
	await bot.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));

	// Reply to the user that the commands have been deployed.
	await message.channel.send("All commands deployed!");
};