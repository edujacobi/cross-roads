const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

let buttons = [
	{label: 'Valores', emoji: '934631819444355112', value: 'topvalor'},
	{label: 'Grana', emoji: '539572031436619777', value: 'topgrana'},
	{label: 'Ficha', emoji: '757021259451203665', value: 'topficha'},
	{label: 'Galo', emoji: '853053236952825856', value: 'topgalo'},
	// {label: 'Gangue', emoji: '816407267665510440', value: 'topgang'},
	{label: 'Pancada', emoji: '816407267246211084', value: 'toppancada'},
	{label: 'Sortudo', emoji: '819694112076726303', value: 'topsortudo'},
	{label: 'Roubos', emoji: '856346384721772555', value: 'toproubo'},
	{label: 'Prisão', emoji: '853053234632458240', value: 'toppreso'},
	{label: 'Esmolas', emoji: '816407267707453490', value: 'topesmola'},
	{label: 'Investidores', emoji: '816407267556851712', value: 'topinvestidor'},
	{label: 'Trabalhadores', emoji: '816407267246211115', value: 'toptrabalhador'},
	{label: 'Gastadores', emoji: '817097198860894310', value: 'topgastador'},
	{label: 'Subornadores', emoji: '816407267779411989', value: 'topsuborno'},
	{label: 'Doentes', emoji: '817965402621083748', value: 'topdoente'},
	{label: 'Vasculhadores', emoji: '934632286337503264', value: 'topvasculhar'},
	// {label: 'Presentes', emoji: '921753148610211901', value: 'toppresente'},
]

const getChoices = () => {
	let choices = []
	buttons.forEach(btn => choices.push([btn.label, btn.value]))
	return choices
}

exports.run = async (bot, interaction) => {
	function getRankingData(ranking) {
		let objeto = {
			titulo: 'Ranking ',
			emote: '',
			descricao: '',
			coisas: [{
				unit: '',
				subtitulo: '',
				isPercent: false,
			}],
			footer: '',
		}
		if (ranking === 'topvalor') {
			objeto.titulo += 'Valores'
			objeto.emote = bot.badges.topGrana1_s6
			objeto.descricao = '**Valores = Grana + Fichas**\n'
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'topgrana') {
			objeto.titulo += 'Grana'
			objeto.emote = bot.config.coin
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'topficha') {
			objeto.titulo += 'Ficha'
			objeto.emote = bot.config.ficha
		}
		if (ranking === 'topdoente') {
			objeto.titulo += 'Doentes'
			objeto.emote = bot.badges.hipocondriaco_s6
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'toptrabalhador') {
			objeto.titulo += 'Trabalhadores'
			objeto.emote = bot.badges.workaholic_s6
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'topvasculhar') {
			objeto.titulo += 'Vasculhadores'
			objeto.emote = bot.badges.xeroqueHolmes_s6
		}
		if (ranking === 'topgastador') {
			objeto.titulo += 'Gastadores'
			objeto.emote = bot.badges.patricinha_s6
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'topinvestidor') {
			objeto.titulo += 'Investidores'
			objeto.emote = bot.badges.investidor_s6
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'topsuborno') {
			objeto.titulo += 'Subornadores'
			objeto.emote = bot.badges.deputado_s6
			objeto.coisas = [{unit: 'R$ '}]
		}
		if (ranking === 'toproubo') {
			objeto.titulo += 'Roubos'
			objeto.emote = bot.badges.maoBoba_s6
			objeto.coisas = [{
				unit: '',
				subtitulo: 'Top Ladrões'
			},{
				unit: '',
				subtitulo: 'Top Roubados'
			},{
				unit: 'R$ ',
				subtitulo: 'Quantidade roubada'
			}]
		}
		if (ranking === 'toppreso') {
			objeto.titulo += 'Presos'
			objeto.emote = bot.badges.fujao_s6
			objeto.coisas = [{
				unit: '',
				subtitulo: 'Top Presos'
			},{
				unit: '',
				subtitulo: 'Top Fujão'
			}]
		}
		if (ranking === 'toppancada') {
			objeto.titulo += 'Espancamentos'
			objeto.emote = bot.badges.esmagaCranio_s6
			objeto.coisas = [{
				unit: '',
				subtitulo: 'Espancados'
			},{
				unit: '',
				subtitulo: 'Espancadores'
			}]
		}
		if (ranking === 'topesmola') {
			objeto.titulo += 'Esmolas'
			objeto.emote = bot.badges.filantropo_s6
			objeto.coisas = [{
				unit: 'R$ ',
				subtitulo: 'Top Filantropos'
			},{
				unit: 'R$ ',
				subtitulo: 'Top Mendigos'
			}]
		}
		if (ranking === 'topgalo') {
			objeto.titulo += 'Galos'
			objeto.emote = bot.badges.topGalo_s6
			objeto.coisas = [{
				unit: '',
				subtitulo: 'Vitórias'
			},{
				unit: '',
				subtitulo: 'Level'
			},{
				unit: '%',
				subtitulo: 'Win rate',
				isPercent: true
			},{
				unit: '',
				subtitulo: 'Vitórias vs Caramuru'
			}]
			objeto.footer = 'Para entrar no Ranking, seu galo deve realizar 20 rinhas'
		}
		if (ranking === 'topsortudo') {
			objeto.titulo += 'Sortudo'
			objeto.emote = bot.badges.sortudo_s6
			objeto.coisas = [{
				unit: '%',
				subtitulo: 'Top Winrate',
				isPercent: true,
			},{
				unit: 'R$ ',
				subtitulo: 'Top Ganhos'
			}]
			objeto.footer = 'Para entrar no ranking, jogue 200 vezes no cassino'
		}
		// if (ranking === 'topgang') {
		// 	objeto.titulo += 'Gangue'
		// 	objeto.emote = bot.badges.topGangue_s6
		// 	objeto.coisas = [{
		// 		unit: 'R$ ',
		// 		subtitulo: 'Top Grana'
		// 	},{
		// 		unit: '',
		// 		subtitulo: 'Top Base'
		// 	}]
		// }
		return objeto
	}

	function getMyTop(mytop) {
		let top = []
		let teste = true
		
		for (let [id, user] of bot.data) {
			if (mytop === 'topvalor')
				teste = user.moni !== 0 || user.ficha !== 0
			if (mytop === 'topgrana')
				teste = user.moni !== 0
			if (mytop === 'topficha')
				teste = user.ficha !== 0
			if (mytop === 'topdoente')
				teste = user.hospitalGastos !== 0
			if (mytop === 'toptrabalhador')
				teste = user.jobGanhos !== 0
			if (mytop === 'topvasculhar')
				teste = user.vasculharAchou !== 0
			if (mytop === 'topgastador')
				teste = user.lojaGastos !== 0
			if (mytop === 'topinvestidor')
				teste = user.investGanhos !== 0
			if (mytop === 'topsuborno')
				teste = user.prisaoGastos !== 0
			if (mytop === 'toproubo')
				teste = user.roubosW !== 0
			if (mytop === 'toppreso')
				teste = user.roubosL !== 0
			if (mytop === 'toppancada')
				teste = user.espancarW !== 0
			if (mytop === 'topesmola')
				teste = user.qtEsmolasDadas > 0 || user.qtEsmolasRecebidas > 0
			if (mytop === 'topgalo') {
				let galo = bot.galos.get(id)
				teste = (galo.wins + galo.loses) >= 20
			}
			if (mytop === 'topsortudo')
				teste = user.betJ >= 200

			if (user.username != undefined && teste) {
				if (id !== bot.config.adminID) {
					let objeto = {
						nick: user.username,
						id: id,
						classe: user.classe,
						parametros: [],
						galo: bot.galos.get(id)
					}

					if (mytop === 'topvalor')
						objeto.parametros.push(user.moni + user.ficha * 80) // Principal, usado pra fazer ordenação
					if (mytop === 'topgrana')
						objeto.parametros.push(user.moni)
					if (mytop === 'topficha')
						objeto.parametros.push(user.ficha)
					if (mytop === 'topdoente')
						objeto.parametros.push(user.hospitalGastos)
					if (mytop === 'toptrabalhador')
						objeto.parametros.push(user.jobGanhos)
					if (mytop === 'topvasculhar')
						objeto.parametros.push(user.vasculharAchou)
					if (mytop === 'topgastador')
						objeto.parametros.push(user.lojaGastos)
					if (mytop === 'topinvestidor')
						objeto.parametros.push(user.investGanhos)
					if (mytop === 'topsuborno')
						objeto.parametros.push(user.prisaoGastos)
					if (mytop === 'toproubo') {
						objeto.parametros.push(user.roubosW)
						objeto.parametros.push(user.qtRoubado)
						objeto.parametros.push(user.valorRoubado)
					}
					if (mytop === 'toppreso') {
						objeto.parametros.push(user.roubosL)
						objeto.parametros.push(user.qtFugas)
					}
					if (mytop === 'toppancada') {
						objeto.parametros.push(user.espancarL)
						objeto.parametros.push(user.espancarW)
					}
					if (mytop === 'topesmola') {
						objeto.parametros.push(user.qtEsmolasDadas)
						objeto.parametros.push(user.qtEsmolasRecebidas)
					}
					if (mytop === 'topgalo') {
						objeto.parametros.push(objeto.galo.wins)
						objeto.parametros.push(objeto.galo.power - 30)
						objeto.parametros.push(objeto.galo.wins / (objeto.galo.loses + objeto.galo.wins) * 100)
						objeto.parametros.push(objeto.galo.caramuruWins)
					}
					if (mytop === 'topsortudo') {
						objeto.parametros.push((user.betW / user.betJ) * 100)
						objeto.parametros.push(user.cassinoGanhos)
					}
					// if (mytop === 'topgang') {
					// 	objeto.titulo += 'gangue'
					// 	objeto.emote = bot.badges.topGangue_s6
					// 	objeto.units = ['R$ ', '']
					// 	objeto.subtitulos = ['Top Grana', 'Top Base']
					// }

					top.push(objeto)
				}
			}
		}

		return top
	}

	const generateEmbed = ({start, top, rankingData, isID}) => {
		const current = top.slice(start, start + 10)
		let topGlobal = []

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${rankingData.emote} ${rankingData.titulo}`)
			.setColor('GREEN')
			.setFooter({
				text: `${bot.user.username} • ${rankingData.footer !== '' ? `${rankingData.footer} • ` : ''}Mostrando ${start + 1}-${start + current.length} resultados de ${top.length.toLocaleString().replace(/,/g, ".")}`,
				iconURL: bot.user.avatarURL()
			})
			.setTimestamp()

		if (top.length > 0) {
			for (let i = 0; i < rankingData.coisas.length; i++) {

				topGlobal = top.sort((a, b) => b.parametros[i] - a.parametros[i]).slice(start, start + 10)

				let userComando
				if (!topGlobal.some(user => user.id === interaction.user.id))
					userComando = top.find(user => user.id === interaction.user.id)

				let topGlobalString = ""
				let topGlobalStringID = ""

				topGlobal.forEach((user, j) => {
					let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id === bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
					let mod = user.id === interaction.user.id ? "__" : ""
					let viagem = bot.isPlayerViajando(bot.data.get(user.id)) ? `${bot.config.aviao} ` : ''
					
					if (rankingData.titulo === 'Ranking Galos'){
						if (rankingData.coisas[i].isPercent)
							topGlobalString += `\`${j + start + 1}.\` ${mod}**${user.galo.nome}**${mod}: \`${user.parametros[i].toFixed(1).toLocaleString().replace(/,/g, ".")}\` (${viagem}${emote} ${user.nick})\n`
						else
							topGlobalString += `\`${j + start + 1}.\` ${mod}**${user.galo.nome}**${mod}: \`${user.parametros[i].toLocaleString().replace(/,/g, ".")}${rankingData.coisas[i].unit}\` (${viagem}${emote} ${user.nick})\n`
						topGlobalStringID += `\`${j + start + 1}.\` ${mod}**${user.galo.nome}**${mod}: ${user.id}\n`
					} else {
						if (rankingData.coisas[i].isPercent)
							topGlobalString += `\`${j + start + 1}.\` ${viagem}${emote} ${mod}**${user.nick}**${mod} ${user.parametros[i].toFixed(1).toLocaleString().replace(/,/g, ".")}${rankingData.coisas[i].unit}\n`
						else
							topGlobalString += `\`${j + start + 1}.\` ${viagem}${emote} ${mod}**${user.nick}**${mod} ${rankingData.coisas[i].unit}${user.parametros[i].toLocaleString().replace(/,/g, ".")}\n`
						topGlobalStringID += `\`${j + start + 1}.\` ${viagem}${emote} ${mod}**${user.nick}**${mod} ${user.id}\n`
					}
				})

				// if (userComando) {
				// 	let user = bot.data.get(userComando.id)
				// 	const i = top.indexOf(userComando)
				// 	let viagem = bot.isPlayerViajando(user) ? `${bot.config.aviao} ` : ''
				// 	let emote = user.classe ? bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id === bot.classes[user.classe].emote) : `<:Inventario:814663379536052244>`
				// 	topGlobalString += `\`${i + 1}.\` ${viagem}${emote} __**${user.username}**__ R$ ${(user.moni + user.ficha * 80).toLocaleString().replace(/,/g, ".")}\n`
				// }
				if (rankingData.coisas.length === 1)
					resultado.setDescription(`${rankingData.descricao}${isID ? topGlobalStringID : topGlobalString}`)
				else
					resultado.addField(rankingData.coisas[i].subtitulo, isID ? topGlobalStringID : topGlobalString, rankingData.titulo !== 'Ranking Galos')
			}

		}
		else
			resultado.addField("\u200b", 'Tem ninguém nessa porra?')

		return resultado
	}

	let seletorSlash = interaction.options.getString('rankings')

	let buttonAnterior = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Anterior')
		.setEmoji('⬅️')
		.setCustomId(interaction.id + interaction.user.id + 'prev')

	let buttonProx = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Próximo')
		.setEmoji('➡️')
		.setCustomId(interaction.id + interaction.user.id + 'next')

	let buttonId = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setEmoji('🆔')
		.setCustomId(interaction.id + interaction.user.id + 'id')

	let buttonNome = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setEmoji('🔡')
		.setCustomId(interaction.id + interaction.user.id + 'nome')

	if (seletorSlash) {
		let currentIndex = 0
		let myTop = getMyTop(seletorSlash)

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageSelectMenu()
				.setCustomId(interaction.id + interaction.user.id + 'select')
				.setPlaceholder('Selecione o ranking')
				.addOptions(buttons))

		interaction.reply({
			embeds: [generateEmbed({
				start: currentIndex,
				top: getMyTop(seletorSlash),
				rankingData: getRankingData(seletorSlash),
				isID: false
			})],
			components: myTop.length > 10 ? [new Discord.MessageActionRow().addComponents(buttonId).addComponents(buttonProx)] : [row, new Discord.MessageActionRow().addComponents(buttonId)]
		})

		const filter = (button) => [
			interaction.id + interaction.user.id + 'prev',
			interaction.id + interaction.user.id + 'next',
			interaction.id + interaction.user.id + 'id',
			interaction.id + interaction.user.id + 'nome',
		].includes(button.customId) && button.user.id === interaction.user.id

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			time: 90000,
		})

		let isID = false

		collector.on('collect', async b => {
			await b.deferUpdate()

			let rowBtn = new Discord.MessageActionRow()

			if (b.customId === interaction.id + interaction.user.id + 'prev')
				currentIndex -= 10
			else if (b.customId === interaction.id + interaction.user.id + 'next')
				currentIndex += 10
			else if (b.customId === interaction.id + interaction.user.id + 'id')
				isID = true
			else if (b.customId === interaction.id + interaction.user.id + 'nome')
				isID = false

			if (isID)
				rowBtn.addComponents(buttonNome)
			else
				rowBtn.addComponents(buttonId)
			if (currentIndex !== 0)
				rowBtn.addComponents(buttonAnterior)
			if (currentIndex + 10 < myTop.length)
				rowBtn.addComponents(buttonProx)

			await interaction.editReply({
				embeds: [generateEmbed({
					start: currentIndex,
					top: myTop,
					rankingData: getRankingData(seletorSlash),
					isID
				})],
				components: [rowBtn]
			})
		})
		collector.on('end', () => {
			if (interaction) interaction.editReply({components: []})
				.catch(() => console.log("Não consegui editar mensagem `top`"))
		})
	}
	else {
		const embed = new Discord.MessageEmbed()
			.setTitle(`🏆 Rankings`)
			.setDescription(`Os melhores jogadores em determinadas áreas e ações!\nClique no seletor e abra o ranking selecionado!`)
			.setColor('GREEN')
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageSelectMenu()
				.setCustomId(interaction.id + interaction.user.id + 'select')
				.setPlaceholder('Selecione o ranking')
				.addOptions(buttons))

		await interaction.reply({embeds: [embed], components: [row]})
			.catch(() => console.log("Não consegui enviar mensagem `top`"))

		const filter = (select) => [
			interaction.id + interaction.user.id + 'select',
		].includes(select.customId) && select.user.id === interaction.user.id

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			idle: 60000,
		})

		collector.on('collect', async r => {
			await r.deferUpdate()
			let myTop = getMyTop(r.values[0])
			let myRankingData = getRankingData(r.values[0])
			let currentIndex = 0

			await interaction.editReply({
				embeds: [embed, generateEmbed({
					start: 0,
					top: myTop,
					rankingData: myRankingData
				})],
				components: myTop.length > 10 ? [row, new Discord.MessageActionRow().addComponents(buttonId).addComponents(buttonProx)] : [row, new Discord.MessageActionRow().addComponents(buttonId)]
			})
			.catch(() => console.log("Não consegui editar mensagem `top`"))

			const filter = (button) => [
				interaction.id + interaction.user.id + 'prev',
				interaction.id + interaction.user.id + 'next',
				interaction.id + interaction.user.id + 'id',
				interaction.id + interaction.user.id + 'nome',
			].includes(button.customId) && button.user.id === interaction.user.id

			const collector2 = interaction.channel.createMessageComponentCollector({
				filter,
				idle: 60000,
			})

			let isID = false

			collector2.on('collect', async b => {
				await b.deferUpdate()

				let rowBtn = new Discord.MessageActionRow()

				if (b.customId === interaction.id + interaction.user.id + 'prev')
					currentIndex -= 10
				else if (b.customId === interaction.id + interaction.user.id + 'next')
					currentIndex += 10
				else if (b.customId === interaction.id + interaction.user.id + 'id')
					isID = true
				else if (b.customId === interaction.id + interaction.user.id + 'nome')
					isID = false

				if (isID)
					rowBtn.addComponents(buttonNome)
				else
					rowBtn.addComponents(buttonId)
				if (currentIndex !== 0)
					rowBtn.addComponents(buttonAnterior)
				if (currentIndex + 10 < myTop.length)
					rowBtn.addComponents(buttonProx)


				await interaction.editReply({
					embeds: [embed, generateEmbed({
						start: currentIndex,
						top: myTop,
						rankingData: myRankingData,
						isID
					})],
					components: [row, rowBtn]
				}).catch(() => console.log("Não consegui editar mensagem `top`"))
			})

			collector2.on('end', () => {
				if (interaction) interaction.editReply({components: []})
					.catch(() => console.log("Não consegui editar mensagem `top`"))
			})
		})

		collector.on('end', () => {
			if (interaction) interaction.editReply({components: []})
				.catch(() => console.log("Não consegui editar mensagem `top`"))
		})
	}
}

exports.commandData = new SlashCommandBuilder()
	.setName('top')
	.setDescription('Os melhores jogadores em determinadas áreas e ações!')
	.setDefaultPermission(true)
	.addStringOption(option =>
		option.setName('rankings')
			.setDescription('Rankings disponíveis')
			.setRequired(false)
			.addChoices(getChoices()))

exports.conf = {
	permLevel: "User",
	guildOnly: false
}