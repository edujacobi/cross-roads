const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const semana = 7 * 24 * 60 * 60 * 1000 // 7 dias
	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	let currTime = new Date().getTime()
	let textGuns = ''
	let textGuns2 = ''
	let textGuns3 = ''
	let emoteFechar = '<:Fechar_Inventario:823344220597256223>'
	let emoteAbrir = '<:Abrir_Inventario:823344220966223972>'

	/*
	Para ver inventário sem pingar (funciona para outros servidores)
	 Se não tiver uma menção, ele irá pegar a string fornecida (espera-se o username do usuário) e irá procurar
	 em todo o banco de dados se há alguém com o user. Caso houver mais de um usuário com o mesmo username, ele
	 informará uma lista dos usuários junto de suas tags (username + discriminator). Se informar a tag ou id, 
	 o usuário será selecionado corretamente
	*/
	if (!targetNoMention[0] && args[0] && !targetMention) { // se não mencionou mas quer ver inv de outro user

		let name = args.join(" ").toLowerCase()

		bot.data.forEach((item, id) => {
			if (bot.data.has(id, "username") && item.username.toLowerCase() == name)
				targetNoMention.push(id)

			else if (id.toString() == name) {
				targetNoMention.push(id)
			}
		})

		if (!targetNoMention[0])
			return bot.createEmbed(message, "Usuário não encontrado.")
	}

	let alvo

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0]
	else
		alvo = targetMention ? targetMention.id : message.author.id

	let uData = bot.data.get(alvo)
	if (!uData || uData.username == undefined) return bot.createEmbed(message, "Este usuário não possui um inventário")

	/*
	Montagem do Inventário + Informações do usuário
	 Há dois embed, sendo o primeiro as informações básicas do inventário (armas, dinheiro e investimento)
	 e o segundo, estas mesmas informações com o acréscimo das informações do usuário (vitórias/derrotas no cassino, etc).
	*/
	let investimento = uData.invest != null ? ` • ${(currTime < uData.investTime + semana ? bot.config.propertyG : bot.config.propertyR)} ${bot.investimentos[uData.invest].desc}` : ''

	let classe = (uData.classe != undefined) ? `, ${bot.classes[uData.classe].desc}` : ""

	let miniSituation = `Vadiando`
	if (uData.emRoubo.tempo > currTime && uData.emRoubo.isAlvo)
		miniSituation = `Sendo roubado`
	else if (uData.emRoubo.tempo > currTime && !uData.emRoubo.isAlvo)
		miniSituation = `Roubando`
	else if (uData.emEspancamento.tempo > currTime && uData.emEspancamento.isAlvo)
		miniSituation = `Sendo espancado`
	else if (uData.emEspancamento.tempo > currTime && !uData.emEspancamento.isAlvo)
		miniSituation = `Espancando`
	else if (uData.fugindo > currTime)
		miniSituation = `Fugindo`
	else if (uData.morto > currTime)
		miniSituation = `Morto`
	else if (uData.preso > currTime && uData.hospitalizado > currTime)
		miniSituation = `Preso e Hospitalizado`
	else if (uData.preso > currTime)
		miniSituation = `Preso`
	else if (uData.jobTime > currTime)
		miniSituation = `Trabalhando`
	else if (uData.hospitalizado > currTime)
		miniSituation = `Hospitalizado`
	if (uData.roubar > currTime && uData.preso < currTime)
		miniSituation += ` e procurado`
	if (uData.jobTime < currTime && uData.job)
		miniSituation += ` e pode receber salário`
	if (bot.isPlayerViajando(uData))
		miniSituation = 'Viajando'

	let badges = bot.getUserBadges(alvo, true)

	let uGang = bot.gangs.get(uData.gangID)

	let conjugeClosed = uData.conjuge != null ? ` • <:girlfriend:799053368189911081> ${bot.data.get(uData.conjuge, 'username')}` : ''

	const invClosed = new Discord.MessageEmbed()
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setAuthor(`Inventário de ${(uGang && uGang.tag != '') ? `[${uGang.tag}] ` : ``}${uData.username}`) //, avatar)
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : 'https://cdn.discordapp.com/attachments/531174573463306240/814662917696782376/Inventario.png')
		.setDescription(`${badges}R$ ${uData.moni != null ? uData.moni.toLocaleString().replace(/,/g, ".") : 'Bugado'}${investimento}${conjugeClosed}`)
		.setFooter(`${miniSituation} • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}`)
		.setTimestamp();

	let horaInvestimento = uData.invest != null ? (currTime < uData.investTime + semana ?
		`: ${bot.segToHour(((uData.investTime + semana) - currTime) / 1000)}` :
		": Encerrado") : ""

	let online = bot.onlineNow.get(alvo) > currTime - 1200000 ? '<:online:763539013574459402>' : '<:offline:763539013587566592>'

	// Cálculo de ATK e DEF
	let atkPower = 0
	let defPower = 0

	Object.entries(uData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.atk > atkPower && key == "_" + arma.data && typeof (arma.atk) == "number")
				atkPower = arma.atk
		})
	})
	Object.entries(uData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.def > defPower && key == "_" + arma.data && typeof (arma.def) == "number")
				defPower = arma.def
		})
	})
	let hora = new Date().getHours()

	if (uData._goggles > currTime && !(hora > 4 && hora < 20))
		atkPower += 3

	if (defPower != 0 && uData.hospitalizado > currTime)
		defPower -= 5
	if (uData._colete > currTime)
		defPower += 2
	if (uData._colete_p > currTime)
		defPower += 5
	if (uData._goggles > currTime && !(hora > 4 && hora < 20))
		defPower += 3
	if (uData._exoesqueleto > currTime)
		defPower += 5

	if (uGang && uGang.base == 'bunker')
		defPower += 0.5 * uGang.baseLevel

	if (uData.classe == 'mendigo') {
		if (atkPower * 0.9 == Math.floor(atkPower * 0.9))
			atkPower = (atkPower * 0.9)
		else
			atkPower = (atkPower * 0.9).toFixed(1)

	} else if (uData.classe == 'assassino') {
		if (atkPower * 1.1 == Math.floor(atkPower * 1.1))
			atkPower = (atkPower * 1.1)
		else
			atkPower = (atkPower * 1.1).toFixed(1)
	}

	if (uData.classe == 'assassino' || uData.classe == 'empresario') {
		if (defPower * 0.9 == Math.floor(defPower * 0.9))
			defPower = (defPower * 0.9)
		else
			defPower = (defPower * 0.9).toFixed(1)
	}

	let conjugeOpen = uData.conjuge != null ? ` • <:girlfriend:799053368189911081> Casado com ${bot.data.get(uData.conjuge, 'username')}` : ''

	const invOpen = new Discord.MessageEmbed()
		.setTitle(`${online} Inventário de ${uData.username}${classe}`)
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : 'https://cdn.discordapp.com/attachments/691019843159326757/817186806218358784/Inventario_Aberto_20210304205450.png')
		.setDescription(`${badges}R$ ${uData.moni != null ? uData.moni.toLocaleString().replace(/,/g, ".") : 'Bugado'}${investimento}${horaInvestimento}${conjugeOpen}`)
		.setFooter(`Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")} • ${atkPower} ATK • ${defPower} DEF`)
		.setTimestamp()

	if (uData.gangID != null) {
		let cargo = 'Membro'
		let uGang = bot.gangs.get(uData.gangID)
		if (uGang.membros.find(user => user.cargo == 'lider') && uGang.membros.find(user => user.cargo == 'lider').id == alvo)
			cargo = "Líder"
		else if (uGang.membros.find(user => user.cargo == 'vice') && uGang.membros.find(user => user.cargo == 'vice').id == alvo)
			cargo = "Vice-Líder"
		invOpen.setAuthor(`${cargo} de ${uGang.nome}`, uGang.icone)
	}

	// let total = 0
	Object.entries(bot.guns).forEach(([id_arma, arma]) => {
		Object.entries(uData).forEach(([key, value]) => {
			let emoji
			if (arma.data == 'ovogranada') {
				if (key.includes("_") && value > 0) {
					if (key.substring(1) == arma.data) {
						emoji = bot.config[arma.emote]
						if ((textGuns + emoji).length < 225)
							textGuns += `${emoji} `
						else if ((textGuns2 + emoji).length < 225)
							textGuns2 += `${emoji} `
						else
							textGuns3 += `${emoji} `

						invOpen.addField(`${emoji} ${arma.desc}`, value.toString(), true)
						// total += 1
					}
				}

			} else {
				if (key.includes("_") && value > currTime) {
					if (key.substring(1) == arma.data) {
						emoji = bot.config[arma.emote]
						if ((textGuns + emoji).length < 225)
							textGuns += `${emoji} `
						else if ((textGuns2 + emoji).length < 225)
							textGuns2 += `${emoji} `
						else
							textGuns3 += `${emoji} `

						invOpen.addField(`${emoji} ${arma.desc}`, bot.segToHour((value - currTime) / 1000), true)
						// total += 1
					}
				}
			}
		})
	})
	if (uData._ovo > 0) {
		textGuns3 += bot.config.ovo
		invOpen.addField(`${bot.config.ovo} Presentes de natal`, uData._ovo.toLocaleString().replace(/,/g, "."), true)
	}
	if (uData._flor > 0) {
		textGuns3 != '' ? textGuns3 += bot.config.flor : (textGuns2 != '' ? textGuns2 += bot.config.flor : textGuns += bot.config.flor)
		invOpen.addField(`${bot.config.flor} Flores`, uData._flor.toLocaleString().replace(/,/g, "."), true)
	}

	textGuns != "" ? invClosed.addField(textGuns, "\u200b󠀀󠀀", true) : textGuns = ''
	textGuns2 != "" ? invClosed.addField(textGuns2, "\u200b󠀀󠀀", true) : textGuns2 = ''
	textGuns3 != "" ? invClosed.addField(textGuns3, "\u200b󠀀󠀀", true) : textGuns3 = ''

	let textSituation = `${bot.config.vadiando} Vadiando`
	if (uData.emRoubo.tempo > currTime && uData.emRoubo.isAlvo)
		textSituation = `${bot.config.roubar} Sendo roubado por ${bot.data.get(uData.emRoubo.user, 'username')}`
	else if (uData.emRoubo.tempo > currTime && !uData.emRoubo.isAlvo)
		textSituation = `${bot.config.roubar} Roubando ${!isNaN(uData.emRoubo.user) ? bot.data.get(uData.emRoubo.user, 'username') : uData.emRoubo.user}`
	else if (uData.emEspancamento.tempo > currTime && uData.emEspancamento.isAlvo)
		textSituation = `${bot.config.espancar} Sendo espancado por ${bot.data.get(uData.emEspancamento.user, 'username')}`
	else if (uData.emEspancamento.tempo > currTime && !uData.emEspancamento.isAlvo)
		textSituation = `${bot.config.espancar} Espancando ${bot.data.get(uData.emEspancamento.user, 'username')}`
	else if (uData.fugindo > currTime)
		textSituation = `${bot.config.prisao} Fugindo`
	else if (uData.morto > currTime)
		textSituation = `:headstone: Morto`
	else if (uData.preso > currTime && uData.hospitalizado > currTime)
		textSituation = `${bot.config.prisao} Preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)} e ${bot.config.hospital} Hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)}`
	else if (uData.preso > currTime)
		textSituation = `${bot.config.prisao} Preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)}`
	else if (uData.jobTime > currTime)
		textSituation = `${bot.config.bulldozer} Trabalhando como ${bot.jobs[uData.job].desc} por mais ${bot.segToHour((uData.jobTime - currTime) / 1000)}`
	else if (uData.hospitalizado > currTime)
		textSituation = `${bot.config.hospital} Hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)}`

	if (uData.roubar > currTime && uData.preso < currTime)
		textSituation += ` e ${bot.config.police} Procurado`
	if (uData.jobTime < currTime && uData.job)
		textSituation += ` e ${bot.config.bulldozer} pode receber salário`
	if (bot.isPlayerViajando(uData))
		textSituation = `${bot.config.aviao} Viajando por mais ${bot.segToHour((bot.casais.get(uData.casamentoID, 'viagem') - currTime)/1000)}`
	invOpen.addField("\u200b󠀀󠀀", textSituation)

	/*
	Botões
	> O bot irá adicionar botões à mensagem do inventário. Se o usuário que chamou o comando clicar no botão, a mensagem
	 será editada para mostrar o segundo embed, o botão será trocado para fechar o inv.
	*/
	const rowAbrir = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Abrir')
			.setEmoji(emoteAbrir)
			.setCustomId(message.id + message.author.id + 'abrir'))

	const rowFechar = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Fechar')
			.setEmoji(emoteFechar)
			.setCustomId(message.id + message.author.id + 'fechar'))


	let msg = await message.channel.send({
		embeds: [invClosed],
		components: [rowAbrir],
	}).catch(err => console.log("Não consegui enviar mensagem `inv`"));


	const filter = (button) => [
		message.id + message.author.id + 'abrir',
		message.id + message.author.id + 'fechar',
	].includes(button.customId) && button.user.id === message.author.id

	const collector = message.channel.createMessageComponentCollector({
		filter,
		time: 90000,
	});

	collector.on('collect', async b => {
		await b.deferUpdate()
		if (b.customId == message.id + message.author.id + 'abrir') {
			if (msg)
				msg.edit({
					embeds: [invOpen],
					components: [rowFechar]
				})

		} else if (b.customId == message.id + message.author.id + 'fechar') {
			if (msg)
				msg.edit({
					embeds: [invClosed],
					components: [rowAbrir]
				})

		}
		// else if (reaction.emoji.name === '📢') {
		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle(`<:CrossRoadsLogo:757021182020157571>	Comunicado`)
		// 		.setDescription("Temporada 6")
		// 		// .setImage('https://cdn.discordapp.com/attachments/819942506585522196/854883927210983434/banner.png')
		// 		.addField("Final da temporada 5", `Dia 03/10 ocorrereu o final da temporada 5 do Cross Roads! Iniciamos a **Pré-temporada**!`, true)
		// 		// .addField("Pré-temporada", `A pré-temporada é um momento de descontração, com eventos divertidos e testes de novas funcionalidades`, true)
		// 		.addField("Início da temporada 6", `A temporada 6 começou dia 11/10. Todos os jogadores foram resetados.`, true)
		// 		.addField("Temporadas", `Quer entender o porquê de existir temporadas? Acompanhar updates e eventos? [Entre no servidor oficial do Cross Roads!](https://discord.gg/sNf8avn)`)
		// 		.setColor(bot.colors.admin)
		// 		.setFooter(`Atenciosamente, Jacobi.`)

		// 	message.channel.send({
		// 		embeds: [embed]
		// 	})
		// }
	})

	collector.on('end', reaction => {
		if (msg)
			msg.edit({
				components: []
			}).catch(err => console.log("Não consegui editar mensagem `inv`"));
	})


}
exports.config = {
	alias: ['i', 'inventario', 'mochila', 'bag']
};