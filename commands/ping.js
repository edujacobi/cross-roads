const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let botPing = Math.round(bot.ws.ping);
	let svPing = new Date().getTime();

	bot.createEmbed(message, `:satellite_orbital: ${botPing}ms API.`, null, 'GREEN').then(msg => msg.edit({
			embeds: [
				new Discord.MessageEmbed()
				.setDescription(`:satellite_orbital: ${botPing}ms API. ${Math.round(new Date().getTime() - svPing)}ms Server.`)
				.setColor('GREEN')
				.setTimestamp()
				.setFooter(bot.user.username, bot.user.avatarURL())
			]
		})
		.catch(err => console.log("Não consegui editar mensagem `ping`", err)));
};