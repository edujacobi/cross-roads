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
	if (message.author.id != bot.config.adminID) return message.reply("Comando em manutenção").catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Coroamuru\``)

	let coroamuru = '<:Coroamuru2:881007505717751858>'

	if (args[0] == 'reset' && message.author.id == bot.config.adminID) {
		bot.coroamuru.clear()
		bot.coroamuru.set("vidaMAX", '250000')
		bot.coroamuru.set("vidaATUAL", '250000')

		return bot.createEmbed(message, `${coroamuru} Coroamuru descansou e está curado!`, `Quem vai encarar?`, 0x0e64d1)
	}

	const Discord = require('discord.js');
	const DiscordButton = require("discord-buttons");
	const VIDAMAX = bot.coroamuru.get('vidaMAX')
	let vidaAtual = bot.coroamuru.get('vidaATUAL')

	const hp = {
		esqFull: '<:HP_L:852210883240263691>',
		esqEmpty: '<:noHP_L:852210883505553440>',
		midFull: '<:HP:852210883425468446>',
		midEmpty: '<:noHP:852210883383656539>',
		rigFull: '<:HP_R:852210883252977695>',
		rigEmpty: '<:noHP_R:852210883429007370>',
	}
	const HORA = 2700000 //45 min
	const TRINTA_SEG = 30000

	const embed = new Discord.MessageEmbed()
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
		.addField("Ataque o Coroamuru!", "Ele dará recompensas para os galos que ousarem desafiá-lo!")
		.addField("Vida atual", `${getLifeBar(vidaAtual, VIDAMAX, hp)} **${vidaAtual}/${VIDAMAX}** _(${~~(vidaAtual/VIDAMAX*100)}%)_`)
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();

	const button = new DiscordButton.MessageButton()
		.setStyle('red')
		.setLabel('Atacar!')
		.setID('attack')

	let dia = new Date().getDay()
	let hora = new Date().getHours()

	if (vidaAtual <= 0 || (dia != 0 && dia != 6 && !(dia == 5 && hora >= 20)))
		button.setDisabled()

	const buttonTop = new DiscordButton.MessageButton()
		.setStyle('gray')
		.setLabel('Top dano')
		.setID('top')

	let msg = await message.channel.send({
		buttons: [button, buttonTop],
		embed: embed
	}).catch(err => console.log("Não consegui enviar mensagem `coroamuru`", err))

	// const filter = (button) => button.clicker.user.id === message.author.id

	const ATACAR = msg.createButtonCollector((button) => button.id === 'attack' && button.clicker.user.id === message.author.id, {
		time: 90000,
	});

	const TOPDANO = msg.createButtonCollector((button) => button.id === 'top' && button.clicker.user.id === message.author.id, {
		time: 90000,
		max: 1
	});

	ATACAR.on('collect', b => {
		b.defer();
		vidaAtual = bot.coroamuru.get('vidaATUAL')
		if (vidaAtual <= 0)
			return bot.createEmbed(message, `COROAMURU FOI DERROTADO! ${coroamuru}`, null, bot.colors.white)

		let uData = bot.data.get(b.clicker.user.id)
		if (!uData)
			return bot.createEmbed(message, `${b.clicker.user.username}, você não é registrado! Use qualquer comando e registre-se para jogar!`)
		let galoData = bot.coroamuru.get(b.clicker.user.id)
		if (!galoData) {
			let obj = {
				danoCausado: 0,
				tempoNovoAtaque: 0,
			}
			bot.coroamuru.set(b.clicker.user.id, obj)
			galoData = bot.coroamuru.get(b.clicker.user.id)
		}
		let currTime = new Date().getTime()

		if (uData.galoPower < 35)
			return bot.createEmbed(message, `${uData.username}, seu galo deve ser no mínimo level 5 para atacar o Coroamuru ${coroamuru}`, null, bot.colors.white)

		if (uData.tempoRinha > currTime)
			return bot.msgGaloDescansando(message, uData, uData.username)

		if (uData.galoTrain == 1) {
			if (uData.galoTrainTime > currTime)
				return bot.createEmbed(message, `${uData.username}, seu galo está treinando por mais ${bot.segToHour((uData.galoTrainTime - currTime) / 1000)} ${coroamuru}`, null, bot.colors.white)
			else
				return bot.createEmbed(message, `${uData.username}, seu galo terminou o treinamento. Conclua-o antes de atacar ${coroamuru}`, null, bot.colors.white)
		}

		if (uData.galoEmRinha == true)
			return bot.createEmbed(message, `${uData.username}, seu galo não pode atacar enquanto está em uma rinha ${coroamuru}`, null, bot.colors.white)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData, uData.username)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData, uData.username)

		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message, uData.username)

		if (galoData.tempoNovoAtaque > currTime)
			return bot.createEmbed(message, `${uData.username}, seu galo poderá atacar o Coroamuru novamente em ${bot.segToHour((galoData.tempoNovoAtaque - currTime) / 1000)} ${coroamuru}`, null, bot.colors.white)

		let randomDano = Math.random() * (1.5 - 1) + 1
		let dano = Math.round((uData.galoPower - 30) * randomDano * 10)

		let isCritico = bot.getRandom(0, 100) < ((uData.galoPower - 10) / 3)
		if (isCritico)
			dano *= 2.5

		let randomLevelUp = bot.getRandom(0, 100)
		let subiuDeLevel = randomLevelUp < (55 - (uData.galoPower - 30))

		let tempoAtacarNovamente = HORA - (TRINTA_SEG * (uData.galoPower - 10))

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
				`**${uData.galoNome.toUpperCase()}** ATACOU ${coroamuru} **COROAMURU** CAUSANDO CRÍTICOS ${dano} DE DANO! ${bot.config.galo}` :
				`**${uData.galoNome}** atacou ${coroamuru} **Coroamuru** causando ${dano} de dano ${bot.config.galo}`)
			.setColor(bot.colors.white)
			.setFooter(`${uData.username} • Tempo para atacar novamente: ${bot.segToHour(tempoAtacarNovamente/1000)}`, b.clicker.member.user.avatarURL())
			.setTimestamp();

		if (subiuDeLevel && uData.galoPower <= 69) {
			uData.galoPower += 1
			embedATK.addField(`<:small_green_triangle:801611850491363410> **${uData.galoNome}** foi agraciado por ${bot.config.caramuru} Caramuru e subiu para o level ${uData.galoPower - 30}`, '\u200b', true)

			bot.users.fetch(b.clicker.user.id).then(user => {
				setTimeout(() => {
					user.send(`Você pode atacar o Coroamuru novamente! ${coroamuru}`)
						.catch(err => message.reply(`você pode atacar o Coroamuru novamente! ${coroamuru}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Coroamuru\``))
				}, galoData.tempoNovoAtaque - currTime)
			})
		}
		if (!subiuDeLevel && desceuDeLevel) {
			uData.galoPower -= 1
			uData.tempoRinha = currTime + tempoAtacarNovamente * 2
			embedATK.addField(`🔻 **${uData.galoNome}** ${textoLevelDown} e desceu para o level ${uData.galoPower - 30}`, '\u200b', true)
				.setFooter(`${uData.username} • Tempo para descansar: ${bot.segToHour((tempoAtacarNovamente)*2/1000)}`, message.member.user.avatarURL())

			bot.users.fetch(b.clicker.user.id).then(user => {
				setTimeout(() => {
					user.send(`Seu galo descansou! ${coroamuru}`)
						.catch(err => message.reply(`seu galo descansou ${coroamuru}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Coroamuru\``))
				}, uData.tempoRinha - currTime)
			})
		}
		galoData.tempoNovoAtaque = currTime + tempoAtacarNovamente
		galoData.danoCausado += dano
		vidaAtual -= dano
		if (vidaAtual <= 0)
			bot.users.fetch(bot.config.adminID).then(user => {
				user.send(b.clicker.user.id + " " + uData.username)
			})

		const embed2 = new Discord.MessageEmbed()
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
			.addField("Ataque o Coroamuru!", "Ele dará recompensas para os galos que ousarem desafiá-lo!")
			.addField("Vida atual", `${getLifeBar(vidaAtual, VIDAMAX, hp)} **${vidaAtual}/${VIDAMAX}** _(${~~(vidaAtual/VIDAMAX*100)}%)_  **-${dano} !**`)
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp();

		msg.edit({
			embed: embed2,
			buttons: [button, buttonTop],
		}).catch(err => console.log("Não consegui editar mensagem `coroamuru`", err))

		bot.coroamuru.set('vidaATUAL', vidaAtual)
		bot.coroamuru.set(b.clicker.user.id, galoData)
		bot.data.set(b.clicker.user.id, uData)
		message.channel.send({
			embeds: [embedATK]
		}).catch(err => console.log("Não consegui enviar mensagem `coroamuru`", err))
	})

	TOPDANO.on('collect', b => {
		let top = []
		let topGlobal = []

		b.defer()

		bot.coroamuru.indexes.forEach(user => { //gera lista para top global
			if (user != 'vidaMAX' && user != 'vidaATUAL' && bot.data.get(user) && user != bot.config.adminID) {
				top.push({
					nick: bot.data.get(user, "username"),
					id: user,
					galo: bot.data.get(user, "galoNome"),
					dano: parseInt(bot.coroamuru.get(user, "danoCausado"))
				})
			}
		})

		topGlobal = top.sort(function (a, b) {
			return b.dano - a.dano
		}).slice(0, 9)

		const embed = new Discord.MessageEmbed()
			.setTitle(`${coroamuru} Top Dano`)
			.setColor(bot.colors.background)
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp();

		topGlobal.forEach((user, i) => {
			embed.addField(`\`${i+1}.\` **${user.galo}**`, `Galo de ${user.nick}\n` + user.dano.toLocaleString().replace(/,/g, "."), true)
		})

		message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `coroamuru`", err))


	})
};
exports.config = {
	alias: ['coroa']
};