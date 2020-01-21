const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const embed = new Discord.RichEmbed()
		.setColor(message.member.displayColor)
		.setTitle("Convite GTA Discord")
		.addField("<:propertyG:539497344996212736> Coloque o GTA Discord em seu server", "https://discordapp.com/oauth2/authorize?client_id=526203502318321665&permissions=8&scope=bot")
		.addField("<:GTAD2:529879187381551104> Entre no server do GTA Discord", "http://discord.gg/sNf8avn")

		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();

	message.channel.send({
		embed
	})
}