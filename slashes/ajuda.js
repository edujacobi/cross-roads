exports.run = async (bot, interaction) => {
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.qmark} Ajuda`)
		.setDescription("*Bem vindo à Cidade da Cruz! Aqui, todos os caminhos se cruzam, sejam eles bons ou ruins. Decida seu caminho e molde seu futuro nesse jogo de RPG!*")
		.setColor('GREEN')
		.setThumbnail("https://media.discordapp.net/attachments/531174573463306240/854876909564461066/Interrogacao.png")
		.addField("Jogue agora mesmo!", "Veja seu inventário usando `;inv`.\nVocê pode usar `;daily` diariamente para receber um pequeno valor e `;weekly` semanalmente para mais!")
		.addField("Ganhe dinheiro", "Há muitas maneiras de ganhar dinheiro no jogo. Trabalhando, investindo, apostando, roubando e até vasculhando lugares.")
		.addField("Comandos", "Para ver todos os comandos, use `;comandos`.", true)
		.addField("Novidades", "Atualizações são publicadas toda semana! `;updates`.", true)
		.addField("Notificações e funcionamento", "Para tudo ocorrer belezinha, certifique-se que você pode receber mensagens privadas de usuários que não estão na sua lista de amigos. Se você colocou Cross Roads no seu servidor, certifique-se que a permissão Gerenciar Mensagens está ativa!")
		.addField("Ajude o bot a continuar online", "Adquira VIP! O VIP não torna o jogo _pay-to-win_, os benefícios são, em sua maioria, somente cosméticos!")
		.addField("Entre no servidor oficial!", `[Saiba de eventos e atualizações!](https://discord.gg/ruasdacruz)`)
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp();

	await interaction.reply({
		embeds: [embed]
	})
	// .catch(err => console.log("Não consegui enviar mensagem `ajuda`"));
};

exports.commandData = {
	name: "ajuda",
	description: "Mostra informações iniciais de como jogar",
	options: [],
	defaultPermission: true,
};

exports.conf = {
	permLevel: "User",
	guildOnly: false
};