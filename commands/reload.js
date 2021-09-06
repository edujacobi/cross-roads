const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID)
		return

	else {
		if (!args || args.size < 1)
			return message.channel.send({
				embeds: [new Discord.MessageEmbed({
					description: "Insira um comando para ser recarregado",
					color: bot.colors.background
				})]
			}).catch(err => console.log("Não consegui enviar mensagem `reload`", err))

		const commandName = args[0];
		// Check if the command exists and is valid
		if (!bot.commands.has(commandName)) {
			return message.channel.send({
				embeds: [new Discord.MessageEmbed({
					description: "O comando não existe ou é inválido",
					color: bot.colors.background
				})]
			}).catch(err => console.log("Não consegui enviar mensagem `reload`", err))
		}
		// the path is relative to the *current folder*, so just ./filename.js
		delete require.cache[require.resolve(`./${commandName}.js`)]
		// We also need to delete and reload the command from the bot.commands Enmap
		bot.commands.delete(commandName)
		const props = require(`./${commandName}.js`)
		bot.commands.set(commandName, props)

		message.channel.send({
			embeds: [new Discord.MessageEmbed({
				description: `O comando \`${commandName}\` foi recarregado`,
				color: bot.colors.background
			})]
		}).catch(err => console.log("Não consegui enviar mensagem `reload`", err))
	}
};