const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

	let time = new Date().getTime();
	uData = bot.data.get(message.author.id)
	const embed = new Discord.RichEmbed()

	embed.setTitle("<:gangG:537843840871038987> Gangue Latão de Polar")
		.setColor(message.member.displayColor)
		.setThumbnail('https://cdn.discordapp.com/emojis/529796763867938822.png?size=2048')

		.addField("Membros", "Jacobi\nJake_", true)
		.addField("Total em caixa", "0" + bot.config.coin, true)
		.addField("Sucessos em roubos", uData.roubosW.toLocaleString().replace(/,/g, "."), true)
		.addField("Falhas em roubos", uData.roubosL.toLocaleString().replace(/,/g, "."), true)
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send(embed);
};

exports.help = {
	name: "base",
	category: "Code",
	description: "base",
	usage: "base",
	example: "base"
};