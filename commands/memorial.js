exports.run = async (bot, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()

		.setTitle(`${bot.config.rpg} Memorial Cross Roads`)
		.setColor(message.member.displayColor)
		.setDescription("Estes usuários contribuíram com o desenvolvimento e sucesso deste jogo:\n\n<@384811752245690368>\n<@215955539274760192>\n<@621480481975959562>\n\nObrigado pelo seu apoio!")
		.setFooter(bot.data.get(message.author.id, "username"), message.member.user.avatarURL())
		.setTimestamp();
	return message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `memorial`"))
};