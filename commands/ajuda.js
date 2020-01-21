exports.run = (bot, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.RichEmbed()

		.setTitle(bot.config.qmark + " Ajuda")
		.setColor(message.member.displayColor)

		.addField("Começando a jogar", "Crie seu inventário usando `;inv`, e então, use `;presente` para receber um dinheiro inicial. Você pode usar `;daily` diariamente para receber mais!")
		.addField("Ganhando dinheiro", "Há muitas maneiras de ganhar dinheiro no jogo. Trabalhando, investindo, roubando ou apostando.")
		//.addField("Subindo de nível", "Quanto mais você trabalha, rouba, aposta e investe, mais experiência você acumula. (EM BREVE)")
		.addField("Comandos", "Para ver todos os comandos, use `;comandos`")
		.addField("Informações", "Jogadores, criador, tempo online e mais: `;stats`.")
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send({
		embed
	})
};