const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

exports.run = async (bot, interaction) => {
	const embed = new Discord.MessageEmbed()
		.setTitle(`Comandos`)
		.setColor('GREEN')
		.addField(`${bot.config.loja} Comprar`,
			`\`;loja\` ou \`;l\` Abre a loja
\`;loja [ID]\` ou \`;l [ID]\` Compra um item
\`;mercadonegro\` ou \`;mn\` Produtos ilegais e trabalhos perigosos`)

		.addField(`${bot.config.trabalhos} Trabalhar`,
			`\`;trabalhos\` ou \`;ts\` Abre a lista de trabalhos
\`;trabalho [ID]\` ou \`;t [ID]\` Inicia um trabalho
\`;trabalho parar\` ou \`;t p\` Pára um trabalho
\`;receber\` ou \`;rcb\` Recebe pagamento pelo trabalho`)

		.addField(`${bot.config.propertyG} Investir`,
			`\`;investir\` ou \`;in\`  Compra e administra seu investimento`)

		.addField(`${bot.config.vasculhar} Vasculhar`,
			`\`;vasculhar\` ou \`;v\` Abre a lista de locais para vasculhar
\`;vasculhar [id]\` ou \`;v [ID]\` Procura por itens`)

		.addField(`${bot.config.roubar} Roubar`,
			`\`;roubar\` ou \`;r\` Informações sobre os roubos
\`;roubar [jogador]\` ou \`;r [jogador]\` Tenta roubar um jogador`)

		.addField(`${bot.config.police} Prisão`,
			`\`;prisao\` ou \`;p\` Informações sobre a prisão
\`;prisao fugir\` ou \`;p f\` Tenta escapar da prisão
\`;prisao subornar\` ou \`;p s\` Tenta subornar os guardas`)

		.addField(`${bot.config.mafiaCasino} Apostar`,
			`\`;cassino\` Informações sobre os jogos
\`;galo info\` ou \`;g info\` Informações sobre a rinha de galos`)

		.addField(`${bot.config.hospital} Hospital`,
			`\`;hospital\` ou \`;h\` Informações sobre o hospital
\`;hospital particular\` ou \`;h p\` Paga pelo tratamento`)

		.addField(`${bot.config.espancar} Espancar`,
			`\`;espancar\` ou \`;esp\` Informações sobre espancamentos
\`;espancar [jogador]\` ou \`;esp [jogado]\` Tenta espancar um jogador`)

		.addField(`${bot.config.car} Informações`,
			`\`;inventario [jogador]\` ou \`;i\` Abre o inventário do jogador
\`;userinfo [jogador]\` ou \`;ui\` Informações relevantes sobre o jogador
\`/top\` Rankings da temporada
\`/badges\` Todas as badges existentes
\`;arma (nome)\` Informações das armas
\`/stats\` Estatísticas interessantes
\`/vip\` Informações sobre o VIP`)

		.addField(`${bot.config.gangues} Gangues`,
			`\`;gangue (info)\` ou \`;gg\` Informações sobre gangues
\`;gangue base (info)\` ou \`;gg b\` Informações sobre bases de gangues`)

		.addField(`${bot.config.namoro} Casamento`,
			`\`;casar\` Informações sobre o casamento
\`;casamento\` ou \`;nós\` Visualiza seu casamento`)

		.addField(`${bot.config.vadiando} Úteis`,
			`\`/daily\` Recebe o bônus diário
\`/weekly\` Recebe o bônus semanal
\`;me [ação]\` Realiza uma ação
\`;nick\` Altera seu nick
\`;classe\` Informações sobre as classes
\`;esmola [jogador]\` ou \`;esm\` Doa R$ 50 para outro jogador
\`;beber\` ou \`;bb\` Bebe uma refrescante bebida
\`;procurar [jogador]\` Procura por jogadores
\`/ping\` Verifica a latência
\`/convite\` Adicione ao seu servidor
\`/updates\` Vê o último Patch Notes
\`/eventos\` Vê o último registro de Eventos`)
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp()

	await interaction.reply({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `comandos`"))
}


exports.commandData = new SlashCommandBuilder()
	.setName('comandos')
	.setDescription('Todos os comandos disponíveis')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}