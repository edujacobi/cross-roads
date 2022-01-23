const Discord = require('discord.js')

function getLifeBar(vidaAtual, VIDAMAX, hp) {
	let esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.rigFull

	if (vidaAtual / VIDAMAX < 0.9)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.80)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.70)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.60)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.50)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midFull + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.40)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midFull + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.30)
		esquema = hp.esqFull + hp.midFull + hp.midFull + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.20)
		esquema = hp.esqFull + hp.midFull + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX < 0.10)
		esquema = hp.esqFull + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	if (vidaAtual / VIDAMAX <= 0)
		esquema = hp.esqEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.midEmpty + hp.rigEmpty
	return esquema
}

exports.run = async (bot, message, args) => {
	// if (message.author.id != bot.config.adminID) return message.reply("Comando em manutenção").catch(er => `Não consegui responder ${bot.data.get(btn.user.id, "username")} nem no PV nem no canal. \`Coroamuru\``)
	const hp = {
		esqFull: '<:HP_L:852210883240263691>',
		esqEmpty: '<:noHP_L:852210883505553440>',
		midFull: '<:HP:852210883425468446>',
		midEmpty: '<:noHP:852210883383656539>',
		rigFull: '<:HP_R:852210883252977695>',
		rigEmpty: '<:noHP_R:852210883429007370>',
	}
	
	function getTop(bot, max) {
		let top = []

		bot.coroamuru.indexes.forEach(user => { //gera lista para top global
			if (user !== 'vidaMAX' && user !== 'vidaATUAL' && bot.data.get(user) && user !== bot.config.adminID) {
				top.push({
					nick: bot.data.get(user, "username"),
					id: user,
					galo: bot.galos.get(user, "nome"),
					dano: parseInt(bot.coroamuru.get(user, "danoCausado"))
				})
			}
		})

		return top.sort((a, b) => b.dano - a.dano).slice(0, max)
	}

	let coroamuru = '<:Coroamuru2:881007505717751858>'
	let premio = 1000000

	const HORA = 2700000 //45 min
	const TRINTA_SEG = 30000

	let dia = new Date().getDay()
	let hora = new Date().getHours()

	function getEmbed() {
		const VIDAMAX = bot.coroamuru.get('vidaMAX')
		let vidaAtual = bot.coroamuru.get('vidaATUAL')

		return new Discord.MessageEmbed()
			.setTitle(`${coroamuru} Coroamuru`)
			.setColor(0x0e64d1)
			.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/881007405549367296/Coroamuru2.png')
			// .setDescription(`Coroamuru despertou de seu sono profundo!\n
			// \nRenascido das sombras, tão antigo quanto o próprio tempo e muito mais poderoso que seu irmão Caramuru.\n
			// \nComo galoficação da ganância, ele absorveu toda a grana e itens dos jogadores, deixando todos igualmente pobres.\n
			// \nEle agora absorve energia de todos os jogadores, esperando pelo momento em que dominará todo o mundo!`)
			.setDescription(`Coroamuru aceita novos desafios!
			\nRenascido da luz, tão antigo quanto o próprio tempo e muito mais poderoso que seu irmão Caramuru.
			\nJunto com apostas simplórias de cara ou coroa, ele renasce para equilibrar o universo.
			\nEle não mais absorve energia de todos os jogadores, mas ainda procura pelo seu objetivo neste novo mundo!`)
			.addField("Ataque o Coroamuru!", `Ele dará recompensas para os galos que ousarem desafiá-lo! Toda vez que ele for derrotado, o Top Dano receberá R$ ${premio.toLocaleString().replace(/,/g, ".")}!`)
			.addField("Vida atual", `${getLifeBar(vidaAtual, VIDAMAX, hp)} **${vidaAtual}/${VIDAMAX}** _(${~~(vidaAtual / VIDAMAX * 100)}%)_`)
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp()
	}
	
	function getRow() {
		let vidaAtual = bot.coroamuru.get('vidaATUAL')
		
		return new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('DANGER')
				.setLabel('Atacar!')
				.setDisabled(vidaAtual <= 0 || (dia !== 0 && dia !== 6 && !(dia === 5 && hora >= 20)))
				.setCustomId(message.id + message.author.id + 'attack'))

			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Top dano')
				.setCustomId(message.id + message.author.id + 'top'))
	}

	// return bot.createEmbed(message, `${coroamuru} Coroamuru está viajando de férias durante a primeira semana de temporada`)

	if (args[0] === 'reset' && message.author.id === bot.config.adminID) {
		bot.coroamuru.clear()
		bot.coroamuru.set("vidaMAX", '200000')
		bot.coroamuru.set("vidaATUAL", '200000')

		return bot.createEmbed(message, `${coroamuru} Coroamuru descansou e está curado!`, `Quem vai encarar?`, 0x0e64d1)
	}
		
	let msg = await message.channel.send({
		components: [getRow()],
		embeds: [getEmbed()]
	}).catch(() => console.log("Não consegui enviar mensagem `coroamuru`"))

	const filter = (button) => [
		message.id + message.author.id + 'attack',
		message.id + message.author.id + 'top'
	].includes(button.customId) && button.user.id === message.author.id

	const collector = message.channel.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	collector.on('collect', async btn => {
		await btn.deferUpdate()
		
		if (btn.customId === message.id + message.author.id + 'attack') {
			let vidaAtual = bot.coroamuru.get('vidaATUAL')
			if (vidaAtual <= 0)
				return bot.createEmbed(message, `COROAMURU FOI DERROTADO! ${coroamuru}`, null, bot.colors.white)

			let uData = bot.data.get(btn.user.id)
			if (!uData)
				return bot.createEmbed(message, `${btn.user.id}, você não é registrado! Use qualquer comando e registre-se para jogar!`)
			let uGalo = bot.galos.get(btn.user.id)
			let galoData = bot.coroamuru.get(btn.user.id)
			if (!galoData) {
				let obj = {
					danoCausado: 0,
					tempoNovoAtaque: 0,
				}
				bot.coroamuru.set(btn.user.id, obj)
				galoData = bot.coroamuru.get(btn.user.id)
			}
			let currTime = new Date().getTime()

			if (uGalo.power < 35)
				return bot.createEmbed(message, `${uData.username}, seu galo deve ser no mínimo level 5 para atacar o Coroamuru ${coroamuru}`, null, bot.colors.white)

			if (uGalo.descansar > currTime)
				return bot.msgGaloDescansando(message, uGalo, uData.username)

			if (uGalo.train) {
				return uGalo.trainTime > currTime ?
					bot.createEmbed(message, `${uData.username}, seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} ${coroamuru}`, null, bot.colors.white) :
					bot.createEmbed(message, `${uData.username}, seu galo terminou o treinamento. Conclua-o antes de atacar ${coroamuru}`, null, bot.colors.white)
			}

			if (bot.isGaloEmRinha(message.author.id))
				return bot.createEmbed(message, `${uData.username}, seu galo não pode atacar enquanto está em uma rinha ${coroamuru}`, null, bot.colors.white)

			if (uData.preso > currTime)
				return bot.msgPreso(message, uData, uData.username)

			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData, uData.username)

			if (uData.job != null)
				return bot.msgTrabalhando(message, uData)

			if (bot.isUserEmRouboOuEspancamento(message, uData))
				return

			if (galoData.tempoNovoAtaque > currTime)
				return bot.createEmbed(message, `${uData.username}, seu galo poderá atacar o Coroamuru novamente em ${bot.segToHour((galoData.tempoNovoAtaque - currTime) / 1000)} ${coroamuru}`, null, bot.colors.white)

			// collector.stop()
			let randomDano = Math.random() * (1.5 - 1) + 1
			let dano = Math.round((uGalo.power - 30) * randomDano * 10)

			let isCritico = bot.getRandom(0, 100) < ((uGalo.power - 10) / 3)
			if (isCritico)
				dano *= 2.5

			let randomLevelUp = bot.getRandom(0, 100)
			let subiuDeLevel = randomLevelUp < (55 - (uGalo.power - 30))

			let tempoAtacarNovamente = HORA - (TRINTA_SEG * (uGalo.power - 10))

			let randomLevelDown = bot.getRandom(0, 100)
			let desceuDeLevel = randomLevelDown < 5

			let textosLevelDown = [
				'quebrou o braço',
				'torceu o joelho',
				'rasgou a asa',
				'entrou em depressão',
				'perdeu o fôlego',
				'raspou o cóccix',
				'ralou as pata',
				'teve um ataque de pânico',
				`ficou cego pelo poder do ${coroamuru} Coroamuru`,
				`se esforçou demais`,
				`quebrou o bico`
			]
			bot.shuffle(textosLevelDown)
			let textoLevelDown = textosLevelDown[0]

			const embedATK = new Discord.MessageEmbed()
				.setDescription(isCritico ?
					`**${uGalo.nome.toUpperCase()}** ATACOU ${coroamuru} **COROAMURU** CAUSANDO CRÍTICOS ${dano} DE DANO! ${bot.config.galo}` :
					`**${uGalo.nome}** atacou ${coroamuru} **Coroamuru** causando ${dano} de dano ${bot.config.galo}`)
				.setColor(bot.colors.white)
				.setFooter(`${uData.username} • Tempo para atacar novamente: ${bot.segToHour(tempoAtacarNovamente / 1000)}`, btn.user.avatarURL())
				.setTimestamp()

			if (subiuDeLevel && uGalo.power <= 69) {
				uGalo.power += 1
				embedATK.addField(`<:small_green_triangle:801611850491363410> **${uGalo.nome}** foi agraciado por ${bot.config.caramuru} Caramuru e subiu para o level ${uGalo.power - 30}`, '\u200b', true)

				bot.users.fetch(btn.user.id).then(user => {
					setTimeout(() => {
						user.send(`Você pode atacar o Coroamuru novamente! ${coroamuru}`)
							.catch(() => message.reply(`você pode atacar o Coroamuru novamente! ${coroamuru}`)
								.catch(() => `Não consegui responder ${bot.data.get(btn.user.id, "username")} nem no PV nem no canal. \`Coroamuru\``))
					}, galoData.tempoNovoAtaque - currTime)
				})
			}
			if (!subiuDeLevel && desceuDeLevel) {
				uGalo.power -= 1
				uGalo.descansar = currTime + tempoAtacarNovamente * 2
				embedATK.addField(`🔻 **${uGalo.nome}** ${textoLevelDown} e desceu para o level ${uGalo.power - 30}`, '\u200b', true)
					.setFooter(`${uData.username} • Tempo para descansar: ${bot.segToHour((tempoAtacarNovamente) * 2 / 1000)}`, btn.user.avatarURL())

				bot.users.fetch(btn.user.id).then(user => {
					setTimeout(() => {
						user.send(`Seu galo descansou! ${coroamuru}`)
							.catch(() => message.reply(`seu galo descansou ${coroamuru}`)
								.catch(() => `Não consegui responder ${bot.data.get(btn.user.id, "username")} nem no PV nem no canal. \`Coroamuru\``))
					}, uGalo.descansar - currTime)
				})
			}

			galoData.tempoNovoAtaque = currTime + tempoAtacarNovamente
			galoData.danoCausado += dano
			vidaAtual -= dano

			if (vidaAtual <= 0) {
				bot.users.fetch(bot.config.adminID).then(user => {
					user.send(`Derrotou o Coroamuru: ${uData.username} (${btn.user.id})`)
				})

				let topDano = getTop(bot,1)
				
				const embedWin = new Discord.MessageEmbed()
					.setTitle(`${coroamuru} Coroamuru`)
					.setColor(0x0e64d1)
					.setDescription(`Você recebeu ${premio.toLocaleString().replace(/,/g, ".")} por ser o Top Dano na derrota de Coroamuru!\nSeu galo ${topDano.galo} causou ${topDano.dano}`)

				let uDataWin = bot.data.get(topDano[0].id)

				uDataWin.moni += premio
				bot.data.set(topDano[0].id, uDataWin)

				bot.users.fetch(topDano[0].id).then(user => {
					user.send({embeds: [embedWin]})
				})
			}

			msg.edit({
				embeds: [getEmbed()],
				components: [getRow()],
			}).catch(() => console.log("Não consegui editar mensagem `coroamuru`"))

			bot.coroamuru.set('vidaATUAL', vidaAtual)
			bot.coroamuru.set(btn.user.id, galoData)
			bot.galos.set(btn.user.id, uGalo)

			message.channel.send({embeds: [embedATK]})
				.catch(() => console.log("Não consegui enviar mensagem `coroamuru`"))

		} else if (btn.customId === message.id + message.author.id + 'top') {
			let topGlobal = getTop(bot, 15)

			const embed = new Discord.MessageEmbed()
				.setTitle(`${coroamuru} Top Dano`)
				.setColor(bot.colors.background)
				.setFooter(bot.user.username, bot.user.avatarURL())
				.setTimestamp()

			topGlobal.forEach((user, i) => {
				embed.addField(`\`${i + 1}.\` **${user.galo}**`, `Galo de ${user.nick}\n${user.dano.toLocaleString().replace(/,/g, ".")}`, true)
			})

			message.channel.send({embeds: [embed]})
				.catch(() => console.log("Não consegui enviar mensagem `coroamuru`"))
		}
	})
}
exports.config = {
	alias: ['coroa']
}