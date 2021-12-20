const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID)
		return

	if (!args || args.size < 1) {
		return message.channel.send({
			embeds: [new Discord.MessageEmbed({
				description: "Insira um Slash para ser recarregado",
				color: bot.colors.background
			})]
		})
	}

	const slashName = args[0];

	// Check if the command exists and is valid
	if (!bot.slashes.has(slashName)) {
		return message.channel.send({
			embeds: [new Discord.MessageEmbed({
				description: "O Slash não existe ou é inválido",
				color: bot.colors.background
			})]
		})
	}

	// the path is relative to the *current folder*, so just ./filename.js
	delete require.cache[require.resolve(`./${slashName}.js`)]

	// We also need to delete and reload the slash from the bot.slashes Enmap
	bot.slashes.delete(slashName)


	const props = require(`../slashes/${slashName}.js`);
	bot.slashes.set(slashName, props)

	message.channel.send({
		embeds: [new Discord.MessageEmbed({
			description: `O Slash \`${slashName}\` foi recarregado`,
			color: bot.colors.background
		})]
	})

};