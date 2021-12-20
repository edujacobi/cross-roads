const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const embed = new Discord.MessageEmbed()
		.setTitle(`Comandos`)
		.setColor('GREEN')
		.addField(`${bot.config.loja} Comprar`,
			`\`;loja\` : Abre a loja
\`;loja [ID]\` : Compra um item
\`;mercadonegro\` : Produtos ilegais e trabalhos perigosos`)

		.addField(`${bot.config.bulldozer} Trabalhar`,
			`\`;trabalhos\` : Abre a lista de trabalhos
\`;trabalho [ID]\` : Inicia um trabalho
\`;trabalho parar\` : Pára um trabalho
\`;receber\` : Recebe pagamento pelo trabalho`)

		.addField(`${bot.config.propertyG} Investir`,
			`\`;investimentos\` : Abre a lista de investimentos
\`;investir [ID]\` : Compra um investimento
\`;investir notificar\` : Recebe notificações de lucro
\`;investir parar\` : Abandona o investimento atual`)

		.addField(`${bot.config.roubar} Roubar`,
			`\`;roubar\` : Informações sobre os roubos
\`;roubar [jogador]\` : Tenta roubar um jogador`)

		.addField(`${bot.config.police} Prisão`,
			`\`;prisao\` : Informações sobre a prisão
\`;prisao fugir\` : Tenta escapar da prisão
\`;prisao subornar\` : Tenta subornar os guardas`)

		.addField(`${bot.config.mafiaCasino} Apostar`,
			`\`;cassino\` : Informações sobre os jogos
\`;galo info\` : Informações sobre a rinha de galos`)

		.addField(`${bot.config.hospital} Hospital`,
			`\`;hospital\` : Informações sobre o hospital
\`;hospital particular\` : Paga pelo tratamento
\`;espancar\` : Informações sobre espancamentos
\`;espancar [jogador]\` : Tenta espancar um jogador`)

		.addField(`${bot.config.car} Informações`,
			`\`;inv [jogador]\` : Abre o inventário do jogador
\`;userinfo [jogador]\` : Informações relevantes sobre o jogador
\`;top\` : Rankings da temporada
\`;badges\` : Todas as badges existentes
\`;arma (nome)\` : Informações das armas
\`;stats\` : Estatísticas interessantes
\`;vip\` : Informações sobre o VIP`)

		.addField(`${bot.config.gang} Gangues`,
			`\`;gangue (info)\` : Informações sobre gangues
\`;gangue base (info)\` : Informações sobre bases de gangues`)

		.addField(`${bot.config.vadiando} Úteis`,
			`\`;daily\` : Recebe os R$ 500 diários
\`;weekly\` : Recebe os R$ 1000
\`;me <ação>\` : Realiza uma ação
\`;nick\` : Altera seu nick por R$ 50.000
\`;classe\` : Informações sobre as classes
\`;vasculhar\` : Procura por armas, fichas e dinheiro
\`;esmola [jogador]\` : Doa R$ 50 para outro jogador
\`;beber\` : Bebe uma refrescante bebida
\`;procurar [jogador]\` : Procura por jogadores
\`;ping\` : Verifica a latência
\`;convite\` : Adicione ao seu servidor`)

		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();
	message.channel.send({
		embeds: [embed]
	}).catch(err => console.log("Não consegui enviar mensagem `comandos`"))
}

exports.config = {
	alias: ['cmds', 'commands']
};