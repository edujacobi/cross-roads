exports.run = async (bot, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()

		.setTitle(`<:CrossRoadsLogo:757021182020157571> Badges`)
		.setDescription("Realize feitos e seja recompensado!\n**Badges de final de temporada**\nFique em destaque no final de uma temporada e ganhe uma badge por toda a duração da seguinte")
		.setColor('GREEN')
		.addField(`${bot.badges.topGrana1_s4}${bot.badges.topGrana2_s4}${bot.badges.topGrana3_s4} Top Grana`, "Fique entre os três primeiros jogadores no Top Grana", true)
		.addField(`${bot.badges.maoBoba_s4} Mão Boba`, "Seja o jogador que mais teve sucesso em roubos", true)
		.addField(`${bot.badges.bolsoLargo_s4} Bolso Largo`, "Tenha o maior valor roubado acumulado", true)
		// .addField(`${bot.badges.alvoAmbulante_s4} Alvo Ambulante`, "Seja o jogador mais roubado", true)
		.addField(`${bot.badges.esmagaCranio_s4} Esmaga Crânio`, "Espanque o maior número de jogadores", true)
		// .addField(`${bot.badges.mortoMuitoLouco_s4} Morto Muito Louco`, "Seja o jogador mais espancado", true)
		.addField(`${bot.badges.fujao_s4} Fujão`, "Fuja da prisão mais vezes do que todos", true)
		.addField(`${bot.badges.sortudo_s4} Sortudo`, "Tenha o maior Win Rate do Cassino", true)
		.addField(`${bot.badges.topGalo_s4} Top Galo`, "Possua o galo com maior Win Rate (excluindo Caramuru)", true)
		.addField(`${bot.badges.filantropo_s4} Filantropo`, "Entregue o maior valor em esmolas", true)
		.addField(`${bot.badges.hipocondriaco_s4} Hipocondríaco`, "Gaste mais que todos em tratamento no hospital", true)
		.addField(`${bot.badges.investidor_s4} Investidor`, "Possua o maior lucro de investimentos", true)
		.addField(`${bot.badges.deputado_s4} Deputado`, "Gaste mais que todos em suborno na prisão", true)
		.addField(`${bot.badges.workaholic_s4} Workaholic`, "Trabalhe duro e ganhe mais que todos", true)
		.addField(`${bot.badges.patricinha_s4} Patricinha`, "Gaste mais que todos em lojas", true)
		.addField(`${bot.badges.topGangue_s4} Top Gangue`, "Para o grupo que mais acumulou dinheiro em caixa", true)
		.addField(`${bot.badges.traderElite_s4} Trader Elite`, "Acumule mais ganhos no cassino", true)
		.addField("Badges de Evento", "Badges especiais permanentes dadas como premiação")
		.addField(`${bot.badges.evento_natal_2020} Natal 2020`, "Ganhadores do evento de ilustração do Natal 2020", true)
		.addField(`${bot.badges.campeao_canja} Campeão das Canjas`, "Entregue ao vencedor do torneio Supercopa das Canjas", true)
		.addField(`${bot.badges.coroamuruDerrotei} Eu Derrotei Coroamuru`, `Ganhadores do evento de final da Temporada 4`, true)
		.addField(`${bot.badges.galoelho} Galoelho`, `Disponível para compra no Mercado de Ovos (Páscoa 2021)`, true)
		.addField(`${bot.badges.ovos_dourados} Ovos dourados`, `Disponível para compra no Mercado de Ovos (Páscoa 2021)`, true)
		.addField("Badges por ação realizada", "Independente do momento, ao realizar estes feitos, você receberá a badge")
		.addField(`${bot.badges.bilionario} Bilionário`, "Tenha R$ 1.000.000.000 em mãos", true)
		.addField(`${bot.badges.cataBug} Cata Bug`, "Reporte um bug gravíssimo que poderia quebrar o jogo", true)
		.addField(`${bot.badges.vip} VIP`, "Adquira VIP", true)
		.setFooter(`${bot.user.username} • Badges criadas por: Cesar`, bot.user.avatarURL())
		.setTimestamp();
	return message.channel.send({
			embeds: [embed]
		})
		.catch(err => console.log("Não consegui enviar mensagem `badges`", err));
};
exports.config = {
	alias: ['insignias', 'medalhas', 'emblemas']
};