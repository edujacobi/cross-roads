const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	const semana = 7 * 24 * 60 * 60 * 1000 // 7 dias
	let currTime = new Date().getTime()
	let textGuns = ''
	let textGuns2 = ''
	let textGuns3 = ''
	let emoteFechar = '<:Fechar_Inventario:823344220597256223>'
	let emoteAbrir = '<:Abrir_Inventario:823344220966223972>'

	let {
		uData,
		alvo
	} = await bot.findUser(message, args)

	if (!uData) return

	/*
	Montagem do Inventário + Informações do usuário
	 Há dois embed, sendo o primeiro as informações básicas do inventário (armas, dinheiro e investimento)
	 e o segundo, estas mesmas informações com o acréscimo das informações do usuário (vitórias/derrotas no cassino, etc).
	*/
	let investimento = uData.invest != null ? ` • ${(currTime < uData.investTime + semana ? bot.config.propertyG : bot.config.propertyR)} ${bot.investimentos[uData.invest].desc}` : ''

	let classe = uData.classe !== undefined ? `, ${bot.classes[uData.classe].desc}` : ""

	let isViajando = await bot.isPlayerViajando(uData)
	
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
	if (uData.roubo > currTime && uData.preso < currTime)
		miniSituation += ` e procurado`
	if (uData.jobTime < currTime && uData.job)
		miniSituation += ` e pode receber salário`
	if (isViajando)
		miniSituation = 'Viajando'

	let badges = await bot.getUserBadges(alvo, true)

	let uGang = await bot.gangs.get(uData.gangID?.toString())

	let conjugeClosed = uData.conjuge != null ? ` • <:girlfriend:799053368189911081> ${await bot.data.get(uData.conjuge + '.username')}` : ''

	const invClosed = new Discord.MessageEmbed()
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setAuthor({
			name: `Inventário de ${(uGang && uGang.tag !== '') ? `[${uGang.tag}] ` : ``}${uData.username}`
		}) //, avatar)
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : 'https://cdn.discordapp.com/attachments/531174573463306240/814662917696782376/Inventario.png')
		.setDescription(`${badges}R$ ${uData.moni != null ? uData.moni.toLocaleString().replace(/,/g, ".") : 'Bugado'}${investimento}${conjugeClosed}`)
		.setFooter({
			text: `${miniSituation} • Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")}`
		})
		.setTimestamp()

	let horaInvestimento = uData.invest != null ? (currTime < uData.investTime + semana ?
		`: ${bot.segToHour(((uData.investTime + semana) - currTime) / 1000)}` :
		": Encerrado") : ""

	let online = bot.onlineNow.get(alvo) > currTime - 1200000 ? '<:online:763539013574459402>' : '<:offline:763539013587566592>'

	// Cálculo de ATK e DEF
	let atkPower = 0
	let defPower = 0

	Object.entries(uData.arma).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (typeof (arma.atk) == "number" && value.tempo > currTime && arma.atk > atkPower && key == arma.data)
				atkPower = arma.atk
		})
	})
	Object.entries(uData.arma).forEach(([key, value]) => {
		Object.values(bot.guns).forEach(arma => {
			if (typeof (arma.def) == "number" && value.tempo > currTime && arma.def > defPower && key == arma.data)
				defPower = arma.def
		})
	})
	let hora = new Date().getHours()

	if (uData.arma.goggles.tempo > currTime && !(hora > 4 && hora < 20))
		atkPower += 3

	if (defPower !== 0 && uData.hospitalizado > currTime)
		defPower -= 5
	if (uData.arma.colete.tempo > currTime)
		defPower += 2
	if (uData.arma.colete_p.tempo > currTime)
		defPower += 5
	if (uData.arma.goggles.tempo > currTime && !(hora > 4 && hora < 20))
		defPower += 3
	if (uData.arma.exoesqueleto.tempo > currTime)
		defPower += 5

	if (uGang && uGang.base === 'bunker')
		defPower += 0.5 * uGang.baseLevel

	if (uData.classe === 'mendigo') {
		if (atkPower * 0.9 === Math.floor(atkPower * 0.9))
			atkPower = (atkPower * 0.9)
		else
			atkPower = (atkPower * 0.9).toFixed(1)
	}

	else if (uData.classe === 'assassino') {
		if (atkPower * 1.1 === Math.floor(atkPower * 1.1))
			atkPower = (atkPower * 1.1)
		else
			atkPower = (atkPower * 1.1).toFixed(1)
	}

	if (uData.classe === 'assassino' || uData.classe === 'empresario') {
		if (defPower * 0.9 === Math.floor(defPower * 0.9))
			defPower = (defPower * 0.9)
		else
			defPower = (defPower * 0.9).toFixed(1)
	}

	let conjugeOpen = uData.conjuge != null ? ` • <:girlfriend:799053368189911081> Casado com ${await bot.data.get(uData.conjuge + '.username')}` : ''

	const invOpen = new Discord.MessageEmbed()
		.setTitle(`${online} Inventário de ${uData.username}${classe}`)
		.setColor(uGang ? uGang.cor : bot.colors.darkGrey)
		.setThumbnail(uData.classe ? bot.classes[uData.classe].imagem : 'https://cdn.discordapp.com/attachments/691019843159326757/817186806218358784/Inventario_Aberto_20210304205450.png')
		.setDescription(`${badges}R$ ${uData.moni != null ? uData.moni.toLocaleString().replace(/,/g, ".") : 'Bugado'}${investimento}${horaInvestimento}${conjugeOpen}`)
		.setFooter({
			text: `Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")} • ${atkPower} ATK • ${defPower} DEF`
		})
		.setTimestamp()

	if (uData.gangID != null) {
		let cargo = 'Membro'
		let uGang = await bot.gangs.get(uData.gangID?.toString())
		if (uGang.membros.find(user => user.cargo === 'lider') && uGang.membros.find(user => user.cargo === 'lider').id == alvo)
			cargo = "Líder"
		else if (uGang.membros.find(user => user.cargo === 'vice') && uGang.membros.find(user => user.cargo === 'vice').id == alvo)
			cargo = "Vice-Líder"
		invOpen.setAuthor({name: `${cargo} de ${uGang.nome}`, iconURL: uGang.icone})
	}

	// let total = 0
	Object.entries(bot.guns).forEach(([id_arma, arma]) => {
		Object.entries(uData.arma).forEach(([key, value]) => {
			let emoji
			if (arma.data === 'granada') {
				if (value.quant > 0 && key === arma.data) {
					emoji = arma.skins[uData.arma[arma.data].skinAtual].emote
					if ((textGuns + emoji).length < 225)
						textGuns += `${emoji} `
					else if ((textGuns2 + emoji).length < 225)
						textGuns2 += `${emoji} `
					else
						textGuns3 += `${emoji} `

					invOpen.addField(`${emoji} ${arma.desc}`, value.quant.toString(), true)
					// total += 1

				}

			}
			else {
				if (value.tempo > currTime && key === arma.data) {
					emoji = arma.skins[uData.arma[arma.data].skinAtual].emote
					if ((textGuns + emoji).length < 225)
						textGuns += `${emoji} `
					else if ((textGuns2 + emoji).length < 225)
						textGuns2 += `${emoji} `
					else
						textGuns3 += `${emoji} `

					invOpen.addField(`${emoji} ${arma.desc}`, bot.segToHour((value.tempo - currTime) / 1000), true)
					// total += 1
				}
			}
		})
	})
	// if (uData._ovo > 0) {
	// 	textGuns3 += bot.config.ovo
	// 	invOpen.addField(`${bot.config.ovo} Presentes de natal`, uData._ovo.toLocaleString().replace(/,/g, "."), true)
	// }
	if (uData._flor > 0) {
		textGuns3 !== '' ? textGuns3 += bot.config.flor : (textGuns2 !== '' ? textGuns2 += bot.config.flor : textGuns += bot.config.flor)
		invOpen.addField(`${bot.config.flor} Flores`, uData._flor.toLocaleString().replace(/,/g, "."), true)
	}

	textGuns !== "" ? invClosed.addField(textGuns, "\u200b󠀀󠀀", true) : textGuns = ''
	textGuns2 !== "" ? invClosed.addField(textGuns2, "\u200b󠀀󠀀", true) : textGuns2 = ''
	textGuns3 !== "" ? invClosed.addField(textGuns3, "\u200b󠀀󠀀", true) : textGuns3 = ''

	let textSituation = `${bot.config.vadiando} Vadiando`
	if (uData.emRoubo.tempo > currTime && uData.emRoubo.isAlvo)
		textSituation = `${bot.config.roubar} Sendo roubado por ${await bot.data.get(uData.emRoubo.user + '.username')}`
	else if (uData.emRoubo.tempo > currTime && !uData.emRoubo.isAlvo)
		textSituation = `${bot.config.roubar} Roubando ${!isNaN(uData.emRoubo.user) ? await bot.data.get(uData.emRoubo.user + '.username') : uData.emRoubo.user}`
	else if (uData.emEspancamento.tempo > currTime && uData.emEspancamento.isAlvo)
		textSituation = `${bot.config.espancar} Sendo espancado por ${await bot.data.get(uData.emEspancamento.user + '.username')}`
	else if (uData.emEspancamento.tempo > currTime && !uData.emEspancamento.isAlvo)
		textSituation = `${bot.config.espancar} Espancando ${await bot.data.get(uData.emEspancamento.user + '.username')}`
	else if (uData.fugindo > currTime)
		textSituation = `${bot.config.prisao} Fugindo`
	else if (uData.morto > currTime)
		textSituation = `:headstone: Morto`
	else if (uData.preso > currTime && uData.hospitalizado > currTime)
		textSituation = `${bot.config.prisao} Preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)} e ${bot.config.hospital} Hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)}`
	else if (uData.preso > currTime)
		textSituation = `${bot.config.prisao} Preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)}`
	else if (uData.jobTime > currTime)
		textSituation = `${bot.config.trabalhando} Trabalhando como ${bot.jobs[uData.job].desc} por mais ${bot.segToHour((uData.jobTime - currTime) / 1000)}`
	else if (uData.hospitalizado > currTime)
		textSituation = `${bot.config.hospital} Hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)}`

	if (uData.roubo > currTime && uData.preso < currTime)
		textSituation += ` e ${bot.config.police} Procurado por mais ${bot.segToHour((uData.roubo - currTime) / 1000)}`
	if (uData.jobTime < currTime && uData.job)
		textSituation += ` e ${bot.config.trabalhando} pode receber salário`
	if (isViajando)
		textSituation = `${bot.config.aviao} Viajando por mais ${bot.segToHour((bot.casais.get(uData.casamentoID + '.viagem') - currTime) / 1000)}`
	invOpen.addField("\u200b󠀀󠀀", textSituation)

	/*
	Botões
	> O bot irá adicionar botões à mensagem do inventário. Se o usuário que chamou o comando clicar no botão, a mensagem
	 será editada para mostrar o segundo embed, o botão será trocado para fechar o inv.
	*/

	let isAberto = false

	const rowActions = new Discord.MessageActionRow()
	const rowAbrir = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Abrir')
			.setEmoji(emoteAbrir)
			.setCustomId('abrir'))

	const rowFechar = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Fechar')
			.setEmoji(emoteFechar)
			.setCustomId('fechar'))

	const buttonUI = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('User info')
		.setEmoji(uData.classe != null ? bot.classes[uData.classe].emote : '<:CrossRoadsLogo:757021182020157571>')
		.setCustomId('userinfo')

	const buttonAnuncio = new Discord.MessageButton()
		.setStyle('PRIMARY')
		.setLabel('Slashes!')
		.setCustomId('anuncio')

	let boneco = uGang?.boneco === 0 ? bot.config.gang : bot.config['gang' + uGang?.boneco]

	let canUseGang = await bot.isComandoUsavelViagem(message, 'gang')
	
	const buttonGang = new Discord.MessageButton()
		.setStyle('SECONDARY')
		// .setLabel(`Gangue ${uGang.tag !== '' ? `[${uGang.tag}]` : ''} ${uGang.nome}`)
		.setLabel(`Gangue`)
		.setEmoji(boneco)
		.setDisabled(!canUseGang)
		.setCustomId('gang')

	rowAbrir.addComponents(buttonUI)
	rowFechar.addComponents(buttonUI)

	if (uGang) {
		rowAbrir.addComponents(buttonGang)
		rowFechar.addComponents(buttonGang)
	}

	let userD = await bot.data.get(message.author.id)

	let galoEmRinhaAuthor = await bot.isGaloEmRinha(message.author.id)
	let galoEmRinhaAlvo = await bot.isGaloEmRinha(alvo)
	
	let canUseInvestir = await bot.isComandoUsavelViagem(message, 'investir')
	let canUseRoubar = await bot.isComandoUsavelViagem(message, 'roubar')
	let canUseEspancar = await bot.isComandoUsavelViagem(message, 'espancar')
	let canUseEsmola = await bot.isComandoUsavelViagem(message, 'esmola')

	const buttonInvest = new Discord.MessageButton()
		.setStyle('SECONDARY')
		// .setLabel(bot.investimentos[uData.invest].desc)
		.setLabel('Investimento')
		.setEmoji(bot.config.propertyG)
		.setDisabled(!canUseInvestir)
		.setCustomId('invest')
	
	const buttonRoubar = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Roubar')
		.setEmoji(bot.config.roubar)
		.setDisabled(
			userD.job != null ||
			userD.roubo > currTime ||
			userD.preso > currTime ||
			userD.hospitalizado > currTime ||
			userD.classe == undefined ||
			uData.username == undefined ||
			userD.emRoubo.tempo > currTime ||
			userD.emEspancamento.tempo > currTime ||
			uData.emRoubo.tempo > currTime ||
			uData.emEspancamento.tempo > currTime ||
			userD.gangID != null && userD.gangID === uData.gangID ||
			alvo === uData.conjuge ||
			galoEmRinhaAuthor ||
			galoEmRinhaAlvo  ||
			isViajando ||
			!canUseRoubar
		)
		.setCustomId('roubar')

	const buttonEspancar = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Espancar')
		.setEmoji(bot.config.espancar)
		.setDisabled(
			userD.job != null ||
			uData.jobTime > currTime ||
			userD.roubo > currTime ||
			userD.preso > currTime && uData.preso < currTime ||
			uData.preso > currTime && userD.preso < currTime ||
			userD.hospitalizado > currTime ||
			userD.fugindo > currTime ||
			uData.fugindo > currTime ||
			userD.classe == undefined ||
			uData.username == undefined ||
			userD.emRoubo.tempo > currTime ||
			userD.emEspancamento.tempo > currTime ||
			uData.emRoubo.tempo > currTime ||
			uData.emEspancamento.tempo > currTime ||
			userD.gangID != null && userD.gangID === uData.gangID ||
			alvo === uData.conjuge ||
			galoEmRinhaAuthor ||
			galoEmRinhaAlvo  ||
			isViajando ||
			!canUseEspancar
		)
		.setCustomId('espancar')
	
	const buttonEsmola = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Dar esmola')
		.setEmoji(bot.config.coin)
		.setDisabled(
			userD.emRoubo.tempo > currTime ||
			userD.emEspancamento.tempo > currTime ||
			uData.emRoubo.tempo > currTime ||
			uData.emEspancamento.tempo > currTime ||
			galoEmRinhaAuthor ||
			galoEmRinhaAlvo  ||
			userD.esmolaEntregueHoje > currTime ||
			uData.esmolaRecebidaHoje > currTime ||
			!canUseEsmola
		)
		.setCustomId('esmola')

	if (alvo === message.author.id) {
		if (uData.invest != null) {
			rowAbrir.addComponents(buttonInvest)
			rowFechar.addComponents(buttonInvest)
		}

		if (bot.getRandom(0, 100) < 75) {
			rowAbrir.addComponents(buttonAnuncio)
			rowFechar.addComponents(buttonAnuncio)
		}

	}
	else {
		rowActions.addComponents(buttonRoubar)
			.addComponents(buttonEspancar)
			.addComponents(buttonEsmola)
	}

	let msg = await message.channel.send({
		embeds: [invClosed],
		components: rowActions.components.length === 0 ? [rowAbrir] : [rowAbrir, rowActions]
	})
		// .catch(() => console.log("Não consegui enviar mensagem `inv`"))


	const filter = (button) => [
		'abrir',
		'fechar',
		'invest',
		'userinfo',
		'roubar',
		'espancar',
		'esmola',
		'gang',
		'anuncio',
	].includes(button.customId) && button.user.id === message.author.id

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async b => {
		await b.deferUpdate()
		if (b.customId === 'abrir') {
			isAberto = true
		}
		else if (b.customId === 'fechar') {
			isAberto = false
		}
		else if (b.customId === 'invest') {
			buttonInvest.setDisabled(true)
			bot.commands.get('investir').run(bot, message, args)
		}
		else if (b.customId === 'userinfo') {
			buttonUI.setDisabled(true)
			bot.commands.get('userinfo').run(bot, message, [alvo])
		}
		else if (b.customId === 'roubar') {
			buttonRoubar.setDisabled(true)
			bot.commands.get('roubar').run(bot, message, [alvo])
		}
		else if (b.customId === 'espancar') {
			buttonEspancar.setDisabled(true)
			bot.commands.get('espancar').run(bot, message, [alvo])
		}
		else if (b.customId === 'esmola') {
			buttonEsmola.setDisabled(true)
			bot.commands.get('esmola').run(bot, message, [alvo])
		}
		else if (b.customId === 'gang') {
			buttonGang.setDisabled(true)
			bot.commands.get('gang').run(bot, message, [uGang?.nome])
		}
		else if (b.customId === 'anuncio') {
			buttonAnuncio.setDisabled(true)

			let avatar

			await bot.users.fetch('332228051871989761').then(user => {
				avatar = user.avatarURL({
					dynamic: true,
					size: 128
				})
			})

			const embedAnuncio = new Discord.MessageEmbed()
				.setTitle(`<:CrossRoadsLogo:757021182020157571> Comandos Slash!`)
				// .setDescription("Quer acompanhar novos updates? Saber quando e como serão os próximos eventos?\nReceba benefícios por dar boost!\n\n[Entre no servidor oficial do Cross Roads clicando aqui!](https://discord.gg/sNf8avn)")
				// .addField("A Temporada 6 encerrou dia 23/01 às 00h00min!", `Quer entender o porquê de existir temporadas? Acompanhar updates e eventos? [Entre no servidor oficial do Cross Roads!](https://discord.gg/sNf8avn)`)
				// .addField("A Temporada 7 iniciou dia 31/01!", `Um reset total aconteceu!`)
				.setDescription("Vários comandos estão sendo convertidos para os novos *Slash Commands*. Para utilizá-los, talvez seja necessário que você atualize as permissões do Cross Roads (você pode clicar novamente no botão de convidá-lo para o servidor).\n\n[Entre no servidor oficial do Cross Roads!](https://discord.gg/sNf8avn)")
				.setColor(bot.colors.admin)
				.setFooter({text: `Atenciosamente, Jacobi`, iconURL: avatar})

			message.channel.send({embeds: [embedAnuncio]})
				.catch(() => console.log("Não consegui enviar mensagem `comunicado`"))
		}

		msg.edit({
			embeds: isAberto ? [invOpen] : [invClosed],
			components: rowActions.components.length === 0 ?
				(isAberto ? [rowFechar] : [rowAbrir]) :
				(isAberto ? [rowFechar, rowActions] : [rowAbrir, rowActions])
		}).catch(() => console.log("Não consegui editar mensagem `inv`"))

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

	collector.on('end', () => {
		if (msg)
			msg.edit({components: []})
				.catch(() => console.log("Não consegui editar mensagem `inv`"))
	})


}
exports.config = {
	alias: ['i', 'inventario', 'mochila', 'bag']
}