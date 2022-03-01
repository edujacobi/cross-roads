const Discord = require("discord.js")
minToDays = (minutes) => {
	let d = Math.floor(minutes / 1440) // 60*24
	let h = Math.floor((minutes - (d * 1440)) / 60)

	if (d > 0)
		return (`${d} dias e ${h} horas`)
	else
		return (`${h} horas`)
}
exports.run = async (bot, message, args) => {
	const semana = 604800000 // 7 dias
	const dia = 86400000
	const hora = 3600000
	let currTime = new Date().getTime()

	let {
		uData,
		alvo
	} = bot.findUser(message, args)

	if (!uData) return

	let investimento = uData.invest != null ? bot.investimentos[uData.invest].desc : ''

	let uGang = bot.gangs.get(uData.gangID)

	let badges = bot.getUserBadges(alvo, false)

	let trabalhando = (uData.jobTime > currTime) && uData.job != null

	let emojiSituação = bot.config.vadiando
	if (uData.emRoubo.tempo > currTime)
		emojiSituação = bot.config.roubar
	else if (uData.emEspancamento.tempo > currTime)
		emojiSituação = bot.config.espancar
	else if (uData.fugindo > currTime)
		emojiSituação = bot.config.prisao
	else if (uData.morto > currTime)
		emojiSituação = `:headstone:`
	else if (uData.preso > currTime && uData.hospitalizado > currTime)
		emojiSituação = bot.config.prisao + bot.config.hospital
	else if (uData.preso > currTime)
		emojiSituação = bot.config.prisao
	else if (trabalhando)
		emojiSituação = bot.config.trabalhando
	else if (uData.hospitalizado > currTime)
		emojiSituação = bot.config.hospital
	if (bot.isPlayerViajando(uData))
		emojiSituação = bot.config.aviao

	let conjuge = uData.conjuge != null ? `\n<:girlfriend:799053368189911081> Casado com ${bot.data.get(uData.conjuge, 'username')}` : ''
	
	let miniSituation = `Vadiando`
	if (uData.emRoubo.tempo > currTime && uData.emRoubo.isAlvo)
		miniSituation = `Sendo roubado por ${bot.data.get(uData.emRoubo.user, 'username')}`
	else if (uData.emRoubo.tempo > currTime && !uData.emRoubo.isAlvo)
		miniSituation = `Roubando ${!isNaN(uData.emRoubo.user) ? bot.data.get(uData.emRoubo.user, 'username') : uData.emRoubo.user}`
	else if (uData.emEspancamento.tempo > currTime && uData.emEspancamento.isAlvo)
		miniSituation = `Sendo espancado por ${bot.data.get(uData.emEspancamento.user, 'username')}`
	else if (uData.emEspancamento.tempo > currTime && !uData.emEspancamento.isAlvo)
		miniSituation = `Espancando ${bot.data.get(uData.emEspancamento.user, 'username')}`
	else if (uData.fugindo > currTime)
		miniSituation = `Fugindo`
	else if (uData.morto > currTime)
		miniSituation = `Morto`
	else if (uData.preso > currTime && uData.hospitalizado > currTime)
		miniSituation = `Preso e Hospitalizado`
	else if (uData.preso > currTime)
		miniSituation = `Preso`
	else if (trabalhando)
		miniSituation = `Trabalhando como ${bot.jobs[uData.job].desc}`
	else if (uData.hospitalizado > currTime)
		miniSituation = `Hospitalizado`
	if (uData.roubo > currTime && uData.preso < currTime)
		miniSituation += ` e procurado`
	if (uData.jobTime < currTime && uData.job)
		miniSituation += ` e pode receber salário`
	if (bot.isPlayerViajando(uData))
		miniSituation = 'Viajando'

	const embed = new Discord.MessageEmbed()
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setAuthor(`Informações de ${uData.username}`, uGang ? bot.gangs.get(uData.gangID, 'icone') : "")
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : '')
		.setDescription(`${badges}R$ ${uData.moni.toLocaleString().replace(/,/g, ".")} • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}${uData.vipTime > currTime ? ` • ${bot.badges.vip} VIP restante: ${minToDays((uData.vipTime - currTime) / 1000 / 60)}` : ""}${conjuge}`)
		.addField(`${emojiSituação} Situação󠀀󠀀`,
			miniSituation, true)
		.addField(`${bot.config.propertyG} Investimento`,
			`${uData.invest != null ? investimento : "Não possui"}`, true)
		.addField(`${bot.config.coin} Daily e Weekly`,
			`D: ${currTime > uData.day + dia ? "Disponível" : bot.segToHour((uData.day + dia - currTime) / 1000)}\nW: ${currTime > uData.weekly + semana ? "Disponível" : bot.segToHour((uData.weekly + semana - currTime) / 1000)}`, true)
		.addField(`${bot.config.prisao} Prisão`,
			`\`${uData.qtFugas.toLocaleString().replace(/,/g, ".")}\` fugas
\`${uData.roubosL.toLocaleString().replace(/,/g, ".")}\` vezes preso
\`R$ ${Math.floor(uData.prisaoGastos).toLocaleString().replace(/,/g, ".")}\` em suborno`, true)
		.addField(`${bot.config.roubar} Roubos`,
			`${uData.roubo > currTime ? bot.segToHour((uData.roubo - currTime) / 1000) : `Pode roubar`}
\`${uData.roubosW.toLocaleString().replace(/,/g, ".")}\` sucessos
\`${uData.qtRoubado.toLocaleString().replace(/,/g, ".")}\` vezes roubado`, true)
		.addField(`${bot.config.espancar} Espancamentos`,
			`${uData.espancar > currTime ? bot.segToHour((uData.espancar - currTime) / 1000) : `Pode espancar`}
\`${uData.espancarW.toLocaleString().replace(/,/g, ".")}\` sucessos
\`${uData.espancarL.toLocaleString().replace(/,/g, ".")}\` vezes espancado`, true)
		.addField(`${bot.badges.bilionario} Dinheiro`,
			`\`R$ ${uData.jobGanhos.toLocaleString().replace(/,/g, ".")}\` de trabalhos
\`R$ ${uData.investGanhos.toLocaleString().replace(/,/g, ".")}\` de investimentos
\`R$ ${uData.lojaGastos.toLocaleString().replace(/,/g, ".")}\` gastos em lojas
\`R$ ${uData.valorRoubado.toLocaleString().replace(/,/g, ".")}\` roubados`, true)
		.addField(`${bot.config.mafiaCasino} Cassino`,
			`\`${(uData.betJ).toLocaleString().replace(/,/g, ".")}\` jogos
\`${uData.betW.toLocaleString().replace(/,/g, ".")}\` vitórias
\`${uData.betL.toLocaleString().replace(/,/g, ".")}\` derrotas
${isNaN(uData.betW / uData.betJ) ? `Nenhum jogo` : `\`${(uData.betW / (uData.betJ) * 100).toFixed(2)}%\` win rate`}
\`R$ ${uData.cassinoGanhos.toLocaleString().replace(/,/g, ".")}\` ganhos
\`R$ ${uData.cassinoPerdidos.toLocaleString().replace(/,/g, ".")}\` perdidos`, true)
		.addField(`${bot.badges.filantropo_s4} Esmolas`,
			`${uData.esmolaEntregueHoje > currTime ? `${bot.segToHour((uData.esmolaEntregueHoje - currTime) / 1000)} para entregar` : "Pode entregar"}
${uData.esmolaRecebidaHoje > currTime ? `${bot.segToHour((uData.esmolaRecebidaHoje - currTime) / 1000)} para receber` : "Pode receber"}
\`R$ ${(uData.qtEsmolasDadas).toLocaleString().replace(/,/g, ".")}\` entregues 
\`R$ ${(uData.qtEsmolasRecebidas).toLocaleString().replace(/,/g, ".")}\` recebidos`, true)
		.addField(`${bot.config.hospital} Hospital`,
			`\`${uData.qtHospitalizado.toLocaleString().replace(/,/g, ".")}\` vezes hospitalizado
\`R$ ${uData.hospitalGastos.toLocaleString().replace(/,/g, ".")}\` em tratamento`, true)
		.addField(`${bot.config.vasculhar} Vasculhar`,
			`${uData.vasculhar < currTime ? "Pode vasculhar" : bot.segToHour((uData.vasculhar - currTime) / 1000)}
Encontrou \`${uData.vasculharAchou}\` itens`, true)

	if (uGang) {
		embed.addField(`${bot.config.gang} Gangue`,
			`${uGang.tag ? `[${uGang.tag}] ` : ''}${uGang.nome}
${uData.depositoGang > currTime ? `${bot.segToHour((uData.depositoGang - currTime) / 1000)} para depositar` : "Pode depositar"}
Cargo \`${uGang.membros.find(user => user.id === alvo).cargo}\``, true)
	}
	embed.setFooter(`ID: ${alvo} • Jogando desde: ${uData.dataInicio}`)

	message.channel.send({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `userinfo`"))
	// .then(msg => {
	// 	msg.react('757021182020157571').catch(err => console.log("Não consegui reagir mensagem `userinfo`")).then(r => {
	// 		const filter = (reaction, user) => reaction.emoji.id === '757021182020157571' && user.id == message.author.id
	// 		const announce = msg.createReactionCollector({
	// 			filter,
	// 			time: 90000
	// 		})
	// 		announce.on('collect', r => {
	// 			if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `userinfo`"))
	// 			const embed = new Discord.MessageEmbed()
	// 				.setTitle(`<:CrossRoadsLogo:757021182020157571>	Comunicado`)
	// 				.setDescription("Temporada 6")
	// 				// .setImage('https://cdn.discordapp.com/attachments/819942506585522196/854883927210983434/banner.png')
	// 				// .addField("Final da temporada 4", `Dia 12/06 ocorreu o final da temporada 4 do Cross Roads, após derrotar o Boss <:Coroamuru:817889856142704670> Coroamuru, iniciando a **Pré-temporada**`, true)
	// 				// .addField("Início da temporada 5", `A temporada 5 começou dia 21/06. Todos os jogadores foram resetados.`, true)
	// 				.addField("A Temporada 5 acabou e já estamos na Temporada 6!", `Quer entender o porquê de existir temporadas? Acompanhar updates e eventos? [Entre no servidor oficial do Cross Roads!](https://discord.gg/sNf8avn)`)
	// 				.setColor(bot.colors.admin)
	// 				.setFooter(`Atenciosamente, Jacobi.`)
	// 			message.channel.send({
	// 				embeds: [embed]
	// 			}).catch(err => console.log("Não consegui enviar mensagem `userinfo`"))
	// 		})
	// 	})
	// })
}
exports.config = {
	alias: ['info', 'ui']
}