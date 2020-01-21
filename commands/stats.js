const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (bot, message, args, level) => {
	const embed = new Discord.RichEmbed();
	embed.setTitle(bot.config.dateDrink + " Estatísticas")
		.setThumbnail(bot.user.avatarURL)
		.setColor(message.member.displayColor)
		.addField("• Uso de memória", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
		.addField("• Tempo online", ` ${bot.minToHour(Math.floor(bot.uptime / 1000 / 60))}`, true)
		.addField("• Usuários", ` ${bot.users.size}`, true)
		.addField("• Jogadores", ` ${bot.data.indexes.length}`, true)
		.addField("• Servidores", ` ${bot.guilds.size.toLocaleString()}`, true)
		.addField("• Canais", ` ${bot.channels.size.toLocaleString()}`, true)
		.addField("• Discord.js", ` v${Discord.version}`, true)
		.addField("• NodeJS", ` ${process.version}`, true)
		.addBlankField(true)
		.setFooter("Criador: Jacobi#5109 | Collaborator: idontknow#9247", bot.users.get('332228051871989761').avatarURL);

	message.channel.send({
		embed
	})
};

exports.help = {
	name: "stats",
	category: "Miscelaneous",
	description: "Gives some useful bot statistics",
	usage: "stats",
	example: "stats"
};