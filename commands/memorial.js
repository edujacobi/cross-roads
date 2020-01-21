exports.run = (bot, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.RichEmbed()

		.setTitle(bot.config.rpg + " Memorial GTA Discord")
		.setColor(message.member.displayColor)

		.setDescription("Estes usuários contribuíram com o desenvolvimento e sucesso deste jogo:\n\n<@384811752245690368>\n<@215955539274760192>\n<@621480481975959562>\n\nObrigado pelo seu apoio!")
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send({
		embed
	})
};