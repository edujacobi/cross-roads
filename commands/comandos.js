const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    const embed = new Discord.RichEmbed()
		.setTitle(bot.config.spray + " Comandos")
		.setColor(message.member.displayColor)
		.addField(bot.config.ammugun + " Comprar",
			"`;loja` : Abre a loja\n" +
			"`;loja [ID]` : Compra um item\n" +
			"`;mercadonegro` : Produtos ilegais e trabalhos perigosos")
									  
		.addField(bot.config.bulldozer + " Trabalhar", 
			"`;jobs` : Abre a lista de trabalhos\n" +
			"`;job [ID]` : Inicia um trabalho\n" +
			"`;job parar` : Pára um trabalho\n" +
			"`;receber` : Recebe pagamento pelo trabalho")

		.addField(bot.config.propertyG + " Investir",
			"`;investimentos` : Abre a lista de investimentos\n" +
			"`;investir [ID]` : Compra um investimento\n" +
			"`;investir parar` : Abandona o investimento atual\n" +
			"`;receber` : Recebe lucros do investimento")
									 
		.addField(bot.config.emmetGun + " Roubar",
			"`;roubar` : Mais informações sobre os roubos\n" +
			"`;roubar user [jogador]` : Tenta roubar um jogador\n" +
			"`;roubar lugar [ID]` : Tenta roubar um lugar")

		.addField(bot.config.police + " Prisão",
			"`;prisao` : Veja os prisioneiros e os jogadores procurados do servidor\n" +
			"`;prisao fugir` : Tenta escapar da prisão\n"  +
			"`;prisao subornar [valor]` : Tenta subornar os guardas")

		.addField(bot.config.mafiaCasino + " Apostas",
			"`;cassino` : Mais informações sobre os jogos\n" +
			"`;bet [cara | coroa] [valor]` : Aposta em Cara ou Coroa\n" +
			"`;cambio [quantidade]` : Troca suas fichas por dinheiro\n" +
			"`;niquel` : Máquina caça-níqueis. Usa fichas\n" +
			"`;galo info` : Informações sobre a rinha de galos")

		.addField(bot.config.car + " Informações",
			"`;topgrana` : Mostra os jogadores mais ricos do jogo\n" +
			"`;topserver` : Mostra os melhores servidores\n" +
			"`;inv [player]` : Abre o inventário de um jogador\n" +
			"`;arma` : Mostra todas as armas disponíveis\n" +
			"`;arma [nome]` : Apresenta informações sobre a arma")

		.addField(bot.config.dateDrink + " Úteis", 
			"`;daily` : Recebe 500 diários\n" +
			"`;stats` : Mostra estatísticas interessantes sobre o bot\n" +
			"`;ping` : Verifica a latência\n" +
			"`;presente` : Recebe um presente para iniciar o jogo")			

		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
    message.channel.send({embed})
}
