const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID) return message.reply("Comando em manutenção")
	let uData = bot.data.get(message.author.id)

	let adjetivo = ['campeão', 'guerreiro', 'meu bruxo', 'meu amigo', 'meu chapa', 'cliente', 'comparsa']

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
		.setFooter(uData.username, message.member.user.avatarURL())

	const button = new DiscordButton.MessageButton()
		.setStyle('gray')
		.setLabel('Beber!')
		.setID('beber')

	let msg = await message.channel.send({
		button: button,
		embed: embed
	}).catch(err => console.log("Não consegui enviar mensagem `beber`", err))

	const filter = (button) => button.clicker.user.id === message.author.id

	const collector = msg.createButtonCollector(filter, {
		idle: 60000
	});

	button.setLabel('Beber mais!')

	collector.on('collect', b => {
		b.defer();
		let uData = bot.data.get(message.author.id)
		let dia = new Date().getDay()
		let hora = new Date().getHours()
		let currTime = new Date().getTime()

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.job != null)
			return bot.msgTrabalhando(message, uData)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		let bebidas = [
			'água mineral', 'whisky', 'café', 'vodka', 'vinho', 'gin', 'tônica', 'caipirinha', 'cerveja', 'chá', 
			'sakê', 'leite', 'energético', 'refrigerante', 'suco', 'cachaça', 'água da torneira', 'chimarrão', 
			'tererê', 'nescau', 'toddynho', 'catuaba', 'limonada', 'corote', 'champanha', 'licor', 'água sanitária',
			'tequila', 'iogurte', 'tubaína', 'água da chuva', 'caldo de cana', 'água de coco', 'água do miojo',
			'gasolina', 'mel', 'vitamina'
		]

		let sensacoes = [
			'forte', 'vigoroso', 'potente', 'poderoso', 'ativo', 'dinâmico', 'robusto', 'másculo', 'viril',
			'masculino', 'firme', 'decidido', 'resoluto', 'enfático', 'veemente', 'expressivo', 'drástico',
			'radical', 'vivo', 'vivaz', 'incansável', 'incisivo', 'caloroso', 'agradável', 'jovial', 'álacre',
			'animado', 'animoso', 'aprazerado', 'bem-disposto', 'bem-humorado', 'contente', 'divertido', 'exultante',
			'feliz', 'festejador', 'festivo', 'folgazão', 'foliador', 'fortunoso', 'galhardo', 'jubiloso', 'jucundo',
			'ledo', 'lépido', 'prazenteiro', 'radiante', 'risonho', 'satisfeito', 'sorridente', 'abatido', 'apático',
			'indiferente', 'desinteressado', 'desempolgado', 'parado', 'caído', 'cabisbaixo', 'prostrado', 'desencorajado',
			'desestimulado', 'desalentado', 'desapontado', 'desiludido', 'deprimido', 'triste', 'esmorecido', 'entorpecido',
			'sucumbido', 'desacoroçoado', 'descorçoado', 'derrotado', 'feminino'
		]

		bot.shuffle(bebidas)
		bot.shuffle(sensacoes)

		let bebida = bebidas[0]
		let sensacao = sensacoes[0]

		count++

		let texto_coma = ''

		let chance_coma = 5
		if (dia == 0 || dia == 6 || (dia == 5 && hora >= 20)) //FDS
			chance_coma = 15

		if (bot.getRandom(0, 100) < chance_coma) {
			uData.qtHospitalizado += 1
			let minutos = Math.floor(bot.getRandom(1, 5))
			uData.hospitalizado = currTime + minutos * 60 * 1000
			bot.data.set(message.author.id, uData)
			texto_coma = `\n${bot.config.hospital} Você bebeu demais e entrou em coma alcoólico, e ficará hospitalizado por ${bot.segToHour(minutos * 60)}`
		}

		let textoCount = ''
		if (count > 5)
			textoCount += "\n\"Desce redondo, hein?\"\n"
		if (count > 10)
			textoCount += `\"Vai com calma, ${adjetivo[1]}.\"\n`
		if (count > 15)
			textoCount += "\"Acho que já deu por hoje.\"\n"
		if (count > 20)
			textoCount += "\"Depois de hoje, duvido não ter cirrose.\"\n"
		if (count > 25)
			textoCount += "\"Você é um deus ou algo do tipo?\"\n"

		const embed = new Discord.MessageEmbed()
			.setDescription(`${bot.config.dateDrink} Você bebeu **${bebida}** e se sente **${sensacao}**!${textoCount}${texto_coma}`)
			.setColor(texto_coma != '' ? bot.colors.hospital : 'AQUA')
			.setTimestamp()
			.setFooter(uData.username, message.member.user.avatarURL())

		const buttonHosp = new DiscordButton.MessageButton()
			.setStyle('gray')
			.setLabel('Você já bebeu demais.')
			.setID('beber2')
			.setDisabled()


		button.setLabel(button.label + "!")
		if (texto_coma == '')
			msg.edit({
				embed: embed,
				button: button
			}).catch(err => console.log("Não consegui editar mensagem `beber`", err));

		else msg.edit({
			embed: embed,
			button: buttonHosp
		}).catch(err => console.log("Não consegui editar mensagem `beber`", err));

	});


};
exports.config = {
	alias: ['bb', 'bar']
};