const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const semana = 7 * 24 * 60 * 60 * 1000 // 7 dias
	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	let currTime = new Date().getTime()
	let textGuns = ''
	let textGuns2 = ''
	let textGuns3 = ''
	let textoBadge = ''

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

	// let avatar
	// bot.users.fetch(alvo).then(user => {
	// 	alvo = user.id
	// 	// avatar = user.avatarURL({
	// 	// 	dynamic: true,
	// 	// 	size: 256
	// 	// })
	// }).then(() => {
	//if (message.author.id == bot.config.adminID) message.reply(avatar)

	/*
	Montagem do Inventário + Informações do usuário
	 Há dois embed, sendo o primeiro as informações básicas do inventário (armas, dinheiro e investimento)
	 e o segundo, estas mesmas informações com o acréscimo das informações do usuário (vitórias/derrotas no cassino, etc).
	*/
	let investimento = uData.invest != null ? `• ${(currTime < uData.investTime + semana ? bot.config.propertyG : bot.config.propertyR)} ${bot.investimentos[uData.invest].desc}` : ''

	let classe = (uData.classe != undefined) ? `, ${bot.classes[uData.classe].desc}` : ""

	// let miniSituation = uData.emRoubo ? `Em roubo` :
	// 	(uData.morto > currTime ? `Morto` :
	// 		(uData.preso > currTime ? `Preso` :
	// 			((uData.jobTime > currTime) ? `Trabalhando` :
	// 				uData.hospitalizado > currTime ? `Hospitalizado` :
	// 				`Vadiando`)))

	let miniSituation = `Vadiando`
	if (uData.emRoubo)
		miniSituation = `Em roubo`
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

	textoBadge = bot.getUserBadges(alvo, true)

	let uGang = bot.gangs.get(uData.gangID)

	const invClosed = new Discord.MessageEmbed()
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setAuthor(`Inventário de ${(uGang && uGang.tag != '') ? `[${uGang.tag}] ` : ``}${uData.username}`) //, avatar)
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : 'https://cdn.discordapp.com/attachments/531174573463306240/814662917696782376/Inventario.png')
		// .setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/814662917696782376/Inventario.png')
		.setDescription(`${textoBadge != '' ? `${textoBadge}\n` : '' }R$ ${uData.moni != null ? uData.moni.toLocaleString().replace(/,/g, ".") : 'Bugado'} ${investimento}`)
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
			if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.atk) == "number")
				atkPower = arma.atk
		})
	})
	Object.entries(uData).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (value > currTime && arma.def > defPower && (key == "_" + arma.data || (key == "_9mm" && arma.data == "colt45")) && typeof (arma.def) == "number")
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

	if (uData.classe == 'assassino') {
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


	const invOpen = new Discord.MessageEmbed()
		.setTitle(`${online} Inventário de ${uData.username}${classe}`)
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : 'https://cdn.discordapp.com/attachments/691019843159326757/817186806218358784/Inventario_Aberto_20210304205450.png')
		// .setThumbnail('https://cdn.discordapp.com/attachments/691019843159326757/817186806218358784/Inventario_Aberto_20210304205450.png')
		.setDescription(`${textoBadge != '' ? textoBadge + "\n" : '' }R$ ${uData.moni != null ? uData.moni.toLocaleString().replace(/,/g, ".") : 'Bugado'} ${investimento}${horaInvestimento}`)
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
	// if (uData._ovo > 0) {
	// 	textGuns3 != '' ? textGuns3 += bot.config.ovo : textGuns2 += bot.config.ovo
	// 	invOpen.addField(`${bot.config.ovo} Ovos de páscoa`, uData._ovo.toLocaleString().replace(/,/g, "."), true)
	// }
	if (uData._flor > 0) {
		textGuns3 != '' ? textGuns3 += bot.config.flor : (textGuns2 != '' ? textGuns2 += bot.config.flor : textGuns += bot.config.flor)
		invOpen.addField(`${bot.config.flor} Flores`, uData._flor.toLocaleString().replace(/,/g, "."), true)
	}

	textGuns != "" ? invClosed.addField(textGuns, "\u200b󠀀󠀀", true) : textGuns = ''
	textGuns2 != "" ? invClosed.addField(textGuns2, "\u200b󠀀󠀀", true) : textGuns2 = ''
	textGuns3 != "" ? invClosed.addField(textGuns3, "\u200b󠀀󠀀", true) : textGuns3 = ''

	/*if (total == 0) {
		invOpen.addField('\u200b', '\u200b', true)
		invOpen.addField('\u200b', '\u200b', true)
		invOpen.addField('\u200b', '\u200b', true)
	} else */
	// if (total == 1 || total == 4 || total == 7 || total == 10 || total == 13 || total == 16) {
	// 	invOpen.addField('\u200b', '\u200b', true)
	// 	invOpen.addField('\u200b', '\u200b', true)
	// } else if (total == 2 || total == 5 || total == 8 || total == 11 || total == 14 || total == 17)
	// 	invOpen.addField('\u200b', '\u200b', true)


	// let textSituation = uData.emRoubo ? `${bot.config.roubar} Em roubo` : (uData.morto > currTime ? `:headstone: Morto` : (uData.preso > currTime ? `${bot.config.prisao} Preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)}` :
	// 	((uData.jobTime > currTime ? `${bot.config.bulldozer} Trabalhando como ${bot.jobs[uData.job].desc} por mais ${bot.segToHour((uData.jobTime - currTime) / 1000)}` :
	// 		(uData.hospitalizado > currTime ? `${bot.config.hospital} Hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)}` :
	// 			`${bot.config.vadiando} Vadiando`)))))

	let textSituation = `${bot.config.vadiando} Vadiando`
	if (uData.emRoubo)
		textSituation = `${bot.config.roubar} Em roubo`
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

	invOpen.addField("\u200b󠀀󠀀", textSituation)

	/*
	Reações
	> O bot irá reagir à mensagem do inventário. Se o usuário que chamou o comando clicar na reação, a mensagem
	 será editada para mostrar o segundo embed, as reações serão limpas e o bot irá reagir novamente, para "fechar"
	 o inventario.
	*/
	message.channel.send({
		embeds: [invClosed]
	}).then(msg => { // troca de página
		msg.react('823344220966223972').catch(err => console.log("Não consegui reagir mensagem `inv`", err)).then(() => {

			// 		const openFilter = (reaction, user) => reaction.emoji.id === '823344220966223972' && user.id === message.author.id
			// 		const closeFilter = (reaction, user) => reaction.emoji.id === '823344220597256223' && user.id === message.author.id

			// 		const open = msg.createReactionCollector({
			// 			openFilter,
			// 			time: 90000
			// 		})
			// 		const close = msg.createReactionCollector({
			// 			closeFilter,
			// 			time: 90000
			// 		})

			// 		open.on('collect', r => {
			// 			if (msg) msg.reactions.removeAll()
			// 			msg.edit({
			// 				embeds: [invOpen]
			// 			})
			// 			msg.react('823344220597256223')
			// 		})

			// 		close.on('collect', r => {
			// 			if (msg) msg.reactions.removeAll()
			// 			msg.edit({
			// 				embeds: [invClosed]
			// 			})
			// 			msg.react('823344220966223972')
			// 		})

			// 	})
			// })
			msg.react('823344220966223972').catch(err => console.log("Não consegui reagir mensagem `inv`", err))

			const filter = (reaction, user) => ['823344220966223972', '823344220597256223'].includes(reaction.emoji.id) && user.id === message.author.id

			const collector = msg.createReactionCollector({
				filter,
				idle: 90000
			})

			collector.on('collect', reaction => {
				if (msg) msg.reactions.removeAll().then(async () => {
					if (reaction.emoji.id === '823344220966223972') {
						msg.edit({
							embeds: [invOpen]
						}).catch(err => console.log("Não consegui editar mensagem `inv`", err))
						msg.react('823344220597256223').catch(err => console.log("Não consegui reagir mensagem `inv`", err))
					} else if (reaction.emoji.id === '823344220597256223') {
						msg.edit({
							embeds: [invClosed]
						}).catch(err => console.log("Não consegui editar mensagem `inv`", err))
						msg.react('823344220966223972').catch(err => console.log("Não consegui reagir mensagem `inv`", err))
					}
				}).catch(err => console.log("Não consegui remover as reações mensagem `inv`", err))
			})
			collector.on('end', reaction => {
				if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `inv`", err))
			})
		}).catch(err => console.log("Não consegui reagir mensagem `inv`", err))
	}).catch(err => console.log("Não consegui enviar mensagem `inv`", err))
}
exports.config = {
	alias: ['i', 'inventario', 'mochila', 'bag']
};