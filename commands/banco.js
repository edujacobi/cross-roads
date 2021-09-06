exports.run = async (bot, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()

		.setTitle(`${bot.config.cash} Banco Central`)
		.setDescription("Toda movimentação financeira lícita na Cidade da Cruz possui imposto. 5% de qualquer valor é pego pelo governo, goste você ou não, e guardado no cofre do Banco")
		.setColor('GREEN')
		.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/757057425735024720/radar_cash.png")
		// .addField("Segurança aumentada", "Altamente protegido!")
		.addField("Cofre", `R$ ${bot.banco.get('caixa').toLocaleString().replace(/,/g, ".")}`)
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();
	message.channel.send({
			embeds: [embed]
		})
		.catch(err => console.log("Não consegui enviar mensagem `banco`", err));
};
exports.config = {
	alias: ['bank']
};