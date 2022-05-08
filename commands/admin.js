exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.qmark} Comandos de Administração`)
		.setDescription("*Blá blá blá, você saberá como usar.*")
		.setColor('GREEN')
		.addField(`${bot.config.coin} Adicionar, remover ou setar grana`, "`;money`", true)
		.addField(`${bot.config.ficha} Adicionar, remover ou setar ficha`, "`;ficha`", true)
		.addField(`${bot.guns.ak47.skins.default.emote} Adicionar ou remover armas`, "`;setgun`", true)
		.addField(`${bot.config.prisao} Prender`, "`;prender`", true)
		.addField(`📝 Alterar nick`, "`;setnick`", true)
		.addField(`🚫 Liberar ação`, "`;liberar opcoes`", true)
		.addField(`💬 Comunicar`, "`;comunicar`", true)
		.addField(`👥 Trocar conta`, "`;trocarconta`", true)
		.addField(`${bot.classes.mafioso.emote} Top classes`, "`;classes top`", true)
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp();
	return message.channel.send({
			embeds: [embed]
		})
		.catch(err => console.log("Não consegui enviar mensagem `admin`"));
};

exports.config = {
	alias: ['adm', 'ademir', 'mod']
};