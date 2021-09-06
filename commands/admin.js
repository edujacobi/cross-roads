exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.qmark} Comandos de Administração`)
		.setDescription("*Blá blá blá, você saberá como usar.*")
		.setColor('GREEN')
		.addField(`${bot.config.coin} Adicionar, remover ou setar grana`, "`;money`", true)
		.addField(`${bot.config.ficha} Adicionar, remover ou setar ficha`, "`;ficha`", true)
		.addField(`${bot.config.ak47} Adicionar ou remover armas`, "`;setgun`", true)
		.addField(`📝 Alterar nick`, "`;setnick`", true)
		.addField(`🚫 Liberar ação`, "`;liberar opcoes`", true)
		.addField(`💬 Comunicar`, "`;comunicar`", true)
		.addField(`👥 Trocar conta`, "`;trocarconta`", true)
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();
	return message.channel.send({
			embeds: [embed]
		})
		.catch(err => console.log("Não consegui enviar mensagem `admin`", err));
};

exports.config = {
	alias: ['adm', 'ademir', 'mod']
};