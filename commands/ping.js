const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let botPing = Math.round(bot.ws.ping);
	let svPing = new Date().getTime();

	const embed = new Discord.MessageEmbed()
		.setDescription(`:satellite_orbital: ${botPing}ms API.`)
		.setColor('GREEN')
		.setTimestamp()
		.setFooter(bot.user.username, bot.user.avatarURL())

	message.channel.send({
		embeds: [embed]
	}).then(msg => msg.edit({
			embeds: [embed.setDescription(`:satellite_orbital: ${botPing}ms API. ${Math.round(new Date().getTime() - svPing)}ms Server.`)]
		})
		.catch(err => console.log("Não consegui editar mensagem `ping`")));
};