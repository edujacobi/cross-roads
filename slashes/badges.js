const {SlashCommandBuilder} = require('@discordjs/builders')
exports.run = async (bot, interaction) => {
	const Discord = require('discord.js')
	const embed1 = new Discord.MessageEmbed()
		.setAuthor({
			name: `Badges`
		})
		.setTitle(`Badges de final de temporada`)
		.setDescription("Fique em destaque no final de uma temporada e ganhe uma badge por toda a duração da seguinte")
		.setColor('GREEN')
		.addField(`${bot.badges.topGrana1_s6}${bot.badges.topGrana2_s6}${bot.badges.topGrana3_s6} Top Grana`, "Fique entre os três primeiros jogadores no Top Valor", true)
		.addField(`${bot.badges.maoBoba_s6} Mão Boba`, "Seja o jogador que mais teve sucesso em roubos", true)
		.addField(`${bot.badges.bolsoLargo_s6} Bolso Largo`, "Tenha o maior valor roubado acumulado", true)
		// .addField(`${bot.badges.alvoAmbulante_s6} Alvo Ambulante`, "Seja o jogador mais roubado", true)
		.addField(`${bot.badges.esmagaCranio_s6} Esmaga Crânio`, "Espanque o maior número de jogadores", true)
		// .addField(`${bot.badges.mortoMuitoLouco_s6} Morto Muito Louco`, "Seja o jogador mais espancado", true)
		.addField(`${bot.badges.fujao_s6} Fujão`, "Fuja da prisão mais vezes do que todos", true)
		.addField(`${bot.badges.sortudo_s6} Sortudo`, "Tenha o maior Win Rate do Cassino", true)
		.addField(`${bot.badges.topGalo_s6} Top Galo`, "Possua o galo com maior Win Rate (excluindo Caramuru)", true)
		.addField(`${bot.badges.filantropo_s6} Filantropo`, "Entregue o maior valor em esmolas", true)
		.addField(`${bot.badges.hipocondriaco_s6} Hipocondríaco`, "Gaste mais que todos em tratamento no hospital", true)
		.addField(`${bot.badges.investidor_s6} Investidor`, "Possua o maior lucro de investimentos", true)
		.addField(`${bot.badges.deputado_s6} Deputado`, "Gaste mais que todos em suborno na prisão", true)
		.addField(`${bot.badges.workaholic_s6} Workaholic`, "Trabalhe duro e ganhe mais que todos", true)
		.addField(`${bot.badges.patricinha_s6} Patricinha`, "Gaste mais que todos em lojas", true)
		.addField(`${bot.badges.topGangue_s6} Top Gangue`, "Para o grupo que mais acumulou dinheiro em caixa", true)
		.addField(`${bot.badges.traderElite_s6} Trader Elite`, "Acumule mais ganhos no cassino", true)
		.addField(`${bot.badges.xeroqueHolmes_s6} Xeroque Holmes`, "Encontre mais itens vasculhando", true)

	const embed2 = new Discord.MessageEmbed()
		.setTitle(`Badges de evento`)
		.setDescription("Badges especiais permanentes dadas como premiação")
		.setColor('GREEN')
		.addField(`${bot.badges.evento_natal_2020} Natal 2020`, "Ganhadores do evento de ilustração do Natal 2020", true)
		.addField(`${bot.badges.campeao_canja} Campeão das Canjas (Galo)`, "Entregue ao vencedor do torneio Supercopa das Canjas", true)
		.addField(`${bot.badges.coroamuruDerrotei} Eu Derrotei Coroamuru`, `Ganhadores do evento de final da Temporada 4`, true)
		.addField(`${bot.badges.coroamuruUniao} A União faz a Força (Galo)`, `Entregue aos participantes do evento de final da Temporada 4`, true)
		.addField(`${bot.badges.galoelho} Galoelho (Galo)`, `Disponível para compra no Mercado de Ovos (Páscoa 2021)`, true)
		.addField(`${bot.badges.ovos_dourados} Ovos dourados`, `Disponível para compra no Mercado de Ovos (Páscoa 2021)`, true)
		.addField(`${bot.badges.mandrake} Óculos Mandrake (Galo)`, `Encontrável para vasculhar no Bailão no final da Temporada 5`, true)
		.addField(`${bot.badges.evento_natal_galo_2021} Papai Galoel (Galo)`, `Disponível para compra no Mercado do Natal (Natal 2021)`, true)
		.addField(`${bot.badges.evento_natal_2021} Biscoito Natalino`, `Disponível para compra no Mercado do Natal (Natal 2021)`, true)
		.addField(`${bot.badges.mandrakeChavoso} Óculos Mandrake Chavoso`, `Entregue aos jogadores mais empenhados no Bailão no final da Temporada 6`, true)

	const embed3 = new Discord.MessageEmbed()
		.setTitle(`Badges por ação realizada`)
		.setDescription("Independente do momento, ao realizar estes feitos, você receberá a badge")
		.setColor('GREEN')
		.addField(`${bot.badges.bilionario} Bilionário`, "Tenha R$ 1.000.000.000 em mãos", true)
		.addField(`${bot.badges.cataBug} Cata Bug`, "Reporte um bug gravíssimo que poderia quebrar o jogo", true)
		.addField(`${bot.badges.vip} VIP`, "Adquira VIP", true)
		.addField(`${bot.badges.art} Artista`, "Crie artes para o Cross Roads", true)
		.setFooter({
			text: `${bot.user.username} • Badges criadas por Cesar e Jacobi`, iconURL: bot.user.avatarURL()
		})
		.setTimestamp()

	return interaction.reply({embeds: [embed1, embed2, embed3]})
		.catch(() => console.log("Não consegui enviar mensagem `badges`"))
}

exports.commandData = new SlashCommandBuilder()
	.setName('badges')
	.setDescription('Insígnias entregues à jogadores vitoriosos e importantes!')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}