const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID)
		return;

	else {
		if (!args || args.size < 1)
			return message.channel.send(new Discord.RichEmbed({
				description: "Enter a command to be reloaded",
				color: 0x36393e
			}))

		const commandName = args[0];
		// Check if the command exists and is valid
		if (!bot.commands.has(commandName)) {
			return message.channel.send(new Discord.RichEmbed({
				description: "The command doesn't exists",
				color: 0x36393e
			}))
		}
		// the path is relative to the *current folder*, so just ./filename.js
		delete require.cache[require.resolve(`./${commandName}.js`)];
		// We also need to delete and reload the command from the bot.commands Enmap
		bot.commands.delete(commandName);
		const props = require(`./${commandName}.js`);
		bot.commands.set(commandName, props);

		message.channel.send(new Discord.RichEmbed({
			description: `The command \`${commandName}\` was reloaded`,
			color: 0x36393e
		}))
	}
};