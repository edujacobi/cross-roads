const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	// if (message.author.id != bot.config.adminID) return message.reply("Comando em manutenção")
	let currTime = new Date().getTime()

	function isHappyHour() {
		let dia = new Date().getDay()
		let hora = new Date().getHours()

		// if (dia === 0 || dia === 6 || (dia === 5 && hora >= 20)) //FDS
		return hora >= 20 && hora <= 22 || dia === 0 || dia === 6
	}

	async function getTop(max) {
		let top = []

		await bot.beberroes.map(async (user, id) => {
			// console.log(user)
			if (typeof user != 'number' && (user.maximo.normal > 0 || user.maximo.happyHour > 0)) {
				top.push({
					nick: await bot.data.get(`${id}.username`),
					id: id,
					maximo: user.maximo,
					ultima: Math.round(user.ultimaBebida / 1000),
				})
			}
		})

		return isHappyHour() ? top.sort((a, b) => b.maximo.happyHour - a.maximo.happyHour).slice(0, max) : top.sort((a, b) => b.maximo.normal - a.maximo.normal).slice(0, max)
	}

	const MINUTOS = 3

	async function getStrBeberroes() {
		let uData = await bot.data.get(message.author.id)
		let bbrs = uData.username
		await bot.beberroes.map(async (user, id) => {
			// console.log(user)
			let name = await bot.data.get(`${id}.username`)
			if (id !== message.author.id && user.ultimaBebida + MINUTOS * 60 * 1000 > Date.now()) {
				console.log(user.ultimaBebida)
				bbrs += `, ${name}`
			}
		})
		console.log(bbrs)
		return bbrs
	}

	async function getQtBeberroes() {
		let count = 1
		await bot.beberroes.map((user, id) => { //gera lista para top global
			if (id !== message.author.id && user.ultimaBebida + MINUTOS * 60 * 1000 > Date.now()) {
				count += 1
			}
		})

		return count
	}

	let uData = await bot.data.get(message.author.id)

	let adjetivo = ['campeão', 'guerreiro', 'meu bruxo', 'meu amigo', 'meu chapa', 'cliente', 'comparsa', 'parceiro', 'meu cupinxa']

	bot.shuffle(adjetivo)

	let count = 1

	let canal = message.channel.name.replace(/-/g, " ")
	canal = canal.charAt(0).toUpperCase() + canal.slice(1)

	const embed = new Discord.MessageEmbed()
		.setTitle(`**Bar de ${canal}**`)
		.setDescription(`Chega aí, ${adjetivo[0]}, gostaria de beber alguma coisa?`)
		.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/847607054419492874/radar_dateDrink.png')
		.setTimestamp()
		.setColor('AQUA')
		.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})

	if (isHappyHour) embed.setAuthor({name: `Happy Hour! Chance de se embebedar x3`})

	const button = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Beber!')
		.setDisabled(uData.preso > currTime || uData.hospitalizado > currTime || (uData.jobTime > currTime && uData.job != null) || uData.emRoubo.tempo > currTime || uData.emEspancamento.tempo > currTime)
		.setCustomId('beber')

	const buttonTop = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Beberrões')
		.setEmoji(bot.config.vadiando)
		.setCustomId('top')

	let row = new Discord.MessageActionRow()
		.addComponents(button)
		.addComponents(buttonTop)

	let msg = await message.channel.send({
		components: [row], embeds: [embed]
	}).catch(() => console.log("Não consegui enviar mensagem `beber`"))

	const filter = (button) => ['beber', 'top'].includes(button.customId) && button.user.id === message.author.id

	const collector = msg.createMessageComponentCollector({
		filter, idle: 60000
	})

	let textoComa = ''

	collector.on('collect', async i => {
		await i.deferUpdate()
		if (i.user.id !== message.author.id) return

		if (i.customId === 'top') {
			let topGlobal = await getTop(15)
			//hora >= 20 && hora <= 22 || dia === 0 || dia === 6
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.vadiando} Top Beberrões ${isHappyHour() ? `(Happy Hour)` : ''}`)
				.setDescription(isHappyHour() ? `O Happy Hour ocorre todo dia das 19h às 22h e aos finais de semana` : '')
				.setColor(bot.colors.background)
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
				.setTimestamp()

			if (!isHappyHour())
				topGlobal.forEach((user, i) => {
					embed.addField(`\`${i + 1}.\` **${user.nick}**`, `Bebeu máx \`${user.maximo.normal}\`\nBebeu <t:${user.ultima}:R>`, true)
				})
			else
				topGlobal.forEach((user, i) => {
					embed.addField(`\`${i + 1}.\` **${user.nick}**`, `Bebeu máx \`${user.maximo.happyHour}\` no Happy Hour\nBebeu <t:${user.ultima}:R>`, true)
				})

			buttonTop.setDisabled(true)

			msg.edit({embeds: [...msg.embeds, embed], components: [row]})
				.catch(() => console.log("Não consegui editar mensagem `beber`"))

			// return message.channel.send({})
			// 	.catch(() => console.log("Não consegui enviar mensagem `beber beberroes`"))
		}

		else if (i.customId === 'beber') {

			let uData = await bot.data.get(message.author.id)
			let currTime = new Date().getTime()

			if (uData.preso > currTime) return bot.msgPreso(message, uData)
			if (uData.hospitalizado > currTime) return bot.msgHospitalizado(message, uData)
			if (uData.jobTime > currTime && uData.job != null) return bot.msgTrabalhando(message, uData)
			if (await bot.isUserEmRouboOuEspancamento(message, uData)) return
			if (await bot.isPlayerMorto(uData)) return
			if (await bot.isPlayerViajando(uData)) return bot.msgPlayerViajando(message)

			let beberrao = await bot.beberroes.get(message.author.id)
			if (!beberrao) {
				let obj = {
					maximo: {
						normal: 0, happyHour: 0,
					},
					ultimaBebida: 0,
				}
				await bot.beberroes.set(message.author.id, obj)
			}

			button.setLabel('Beber mais!')
			let bebidas = ['whisky', 'vodka', 'vinho', 'gin', 'tônica', 'amarula', 'caipirinha', 'cerveja', 'sakê', 'cachaça', 'água da torneira', 'rum', 'caipiroska', 'sidra', 'cerveja', 'catuaba', 'corote', 'champanha', 'licor', 'água sanitária', 'cerveja', 'tequila', 'tubaína', 'água do miojo', 'absinto', 'Jägermeister', 'cerveja', 'gasolina', 'cerveja artesanal', 'Red Ale', 'American Pale Ale', 'Belgian Wheat Ale', 'cerveja', // 'água mineral', 'whisky', 'café', 'vodka', 'vinho', 'gin', 'tônica', 'caipirinha', 'cerveja', 'chá',
				// 'sakê', 'leite', 'energético', 'refrigerante', 'suco', 'cachaça', 'água da torneira', 'chimarrão',
				// 'tererê', 'nescau', 'toddynho', 'catuaba', 'limonada', 'corote', 'champanha', 'licor', 'água sanitária',
				// 'tequila', 'iogurte', 'tubaína', 'água da chuva', 'caldo de cana', 'água de coco', 'água do miojo',
				// 'gasolina', 'mel', 'vitamina', 'cerveja artesanal'
			]

			let sensacoes = ['forte', 'vigoroso', 'potente', 'poderoso', 'ativo', 'dinâmico', 'robusto', 'másculo', 'viril', 'masculino', 'firme', 'decidido', 'resoluto', 'enfático', 'veemente', 'expressivo', 'drástico', 'radical', 'vivo', 'vivaz', 'incansável', 'incisivo', 'caloroso', 'agradável', 'jovial', 'álacre', 'animado', 'animoso', 'aprazerado', 'bem-disposto', 'bem-humorado', 'contente', 'divertido', 'exultante', 'feliz', 'festejador', 'festivo', 'folgazão', 'foliador', 'fortunoso', 'galhardo', 'jubiloso', 'jucundo', 'ledo', 'lépido', 'prazenteiro', 'radiante', 'risonho', 'satisfeito', 'sorridente', 'abatido', 'apático', 'indiferente', 'desinteressado', 'desempolgado', 'parado', 'caído', 'cabisbaixo', 'prostrado', 'desencorajado', 'desestimulado', 'desalentado', 'desapontado', 'desiludido', 'deprimido', 'triste', 'esmorecido', 'entorpecido', 'sucumbido', 'desacoroçoado', 'descorçoado', 'derrotado', 'feminino']


			let bebida = bot.shuffle(bebidas)[0]
			let sensacao = bot.shuffle(sensacoes)[0]

			await bot.beberroes.set(message.author.id + '.ultimaBebida', Date.now())

			let maxNormal = await bot.beberroes.get(message.author.id, 'maximo.normal')
			let maxHappy = await bot.beberroes.get(message.author.id, 'maximo.happyHour')

			if (!isHappyHour() && count > maxNormal)
				await bot.beberroes.set(message.author.id + '.maximo.normal', count)

			if (isHappyHour() && count > maxHappy)
				await bot.beberroes.set(message.author.id + '.maximo.happyHour', count)

			count++

			let chanceComa = isHappyHour() ? 15 : 5

			if (bot.getRandom(0, 100) < chanceComa) {
				// uData.qtHospitalizado += 1
				let minutos = Math.floor(bot.getRandom(1, 5))
				uData.hospitalizado = currTime + minutos * 60 * 1000
				await bot.data.set(message.author.id, uData)
				textoComa = `\n${bot.config.hospital} Você bebeu demais e entrou em coma alcoólico. Você ficará hospitalizado por ${bot.segToHour(minutos * 60)}`
				collector.stop()
			}

			let textoCount = ''
			if (count > 5) textoCount += "\n\n\"Desce redondo, hein?\"\n"
			if (count > 10) textoCount += `\"Vai com calma, ${adjetivo[1]}.\"\n`
			if (count > 15) textoCount += "\"Acho que já deu por hoje.\"\n"
			if (count > 20) textoCount += "\"Depois de hoje, duvido não ter cirrose.\"\n"
			if (count > 30) textoCount += "\"Você é um deus ou algo do tipo?\"\n"
			if (count > 40) textoCount += "\"Você é o diabo, isso sim.\"\n"
			if (count > 50) textoCount += "\"Estou declarando falência!\"\n"
			if (count > 60) textoCount += "\"Minha mulher falou que vai me abandonar...\"\n"
			if (count > 70) textoCount += "\"Por favor, pare.\"\n"
			if (count > 80) textoCount += "\"Meu estoque acabou, eu nem sei mais o que você está bebendo.\"\n"
			if (count > 100) textoCount += "\"POR ACASO VOCÊ É O JACOBI???!.\"\n"

			let qtBbrs = await getQtBeberroes()
			let strBbrs = await getStrBeberroes()

			const embed = new Discord.MessageEmbed()
				.setDescription(`${bot.config.dateDrink} Você bebeu **${bebida}** e se sente **${sensacao}**!${textoCount}${textoComa}`)
				.setColor(textoComa === '' ? 'AQUA' : bot.colors.hospital)
				.setTimestamp()
				.setFooter({
					text: `Bebendo agora (${qtBbrs}): ${strBbrs}`,
					iconURL: message.member.user.avatarURL()
				})

			if (textoComa !== '') embed.setFooter({
				text: `${uData.username} • Você bebeu ${count - 1}`, iconURL: message.member.user.avatarURL()
			})

			const rowHosp = new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Você já bebeu demais.')
					.setCustomId('hosp')
					.setDisabled(true))
				.addComponents(new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Beberrões')
					.setEmoji(bot.config.vadiando)
					.setCustomId('top'))

			if (button.label.length < 64) button.setLabel(button.label + "!")

			msg.edit({
				embeds: [embed], components: textoComa === '' ? [row] : [rowHosp]
			})
			// .catch(() => console.log("Não consegui editar mensagem `beber`"))
		}
	})

	collector.on('end', () => {
		const embed = new Discord.MessageEmbed()
			.setTitle(`**Bar de ${canal}**`)
			.setDescription(`Você saiu do bar.`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/847607054419492874/radar_dateDrink.png')
			.setTimestamp()
			.setColor('AQUA')
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})

		if (msg) {
			if (textoComa === '')
				msg.edit({embeds: [embed], components: []})
					.catch(() => console.log("Não consegui editar mensagem `beber`"))
			else
				msg.edit({components: []})
					.catch(() => console.log("Não consegui editar mensagem `beber`"))
		}
	})
}

exports.config = {
	alias: ['bb', 'bar']
}