const wait = require('util').promisify(setTimeout)
const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	// if (message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, "Royale desativado temporiamente.")

	// if (!bot.isAdmin(message.author.id))
	// 	return message.reply("Comando em manutenção")
	let players = []
	const MAX = 20
	const MIN = 5
	const LVL_MIN = 5
	// const apostaMAX = 2000000
	const apostaMIN = 10000
	players.push(message.author.id)

	let time = new Date().getTime()
	let uData = await bot.data.get(message.author.id)
	let uGalo = await bot.galos.get(message.author.id)

	if (!args[0]) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.galo} Battle Royale!`)
			.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530616556518899722/unknown.png")
			.setColor(bot.colors.white)
			.setDescription(`Coloque seu galo em uma batalha real!
Entre em uma rinha de ${MIN} a ${MAX} galos, onde o vencedor leva tudo! A aposta mínima é de R$ ${apostaMIN.toLocaleString().replace(/,/g, ".")}.
Seu galo precisa estar no mínimo no nível ${LVL_MIN} para participar de uma batalha.
Independente de sua classe, o Battle Royale sempre terá imposto.`)
			.addField("\u200b", "`;royale [galos] [valor]`: Inicia um Battle Royale")
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
			.setTimestamp()

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `royale`"))
	}

	if (!args[1])
		return bot.createEmbed(message, `Você deve inserir o número de galos do Battle Royale e o valor a ser apostado ${bot.config.galo}`, null, bot.colors.white)

	let max_players = args[0]
	let aposta = parseInt(args[1])
	let apostaComImposto = parseInt(args[1] * (1 - bot.imposto))

	const multiplicador_tempo_rinha = 1
	const multiplicador_premio = 1

	let premio = max_players * apostaComImposto * multiplicador_premio

	if (max_players < MIN)
		return bot.createEmbed(message, `O número mínimo de galos no Battle Royale é ${MIN} ${bot.config.galo}`, null, bot.colors.white)
	if (max_players > MAX)
		return bot.createEmbed(message, `O número máximo de galos no Battle Royale é ${MAX} ${bot.config.galo}`, null, bot.colors.white)
	if (uGalo.power < LVL_MIN)
		return bot.createEmbed(message, `Seu galo precisa estar nível ${LVL_MIN} para poder participar do Battle Royale ${bot.config.galo}`, null, bot.colors.white)
	if (uGalo.descansar > time)
		return bot.msgGaloDescansando(message, uGalo)
	if (uData.moni < 1)
		return bot.msgSemDinheiro(message)
	else if (aposta <= 0 || aposta % 1 !== 0 || max_players <= 0 || max_players % 1 !== 0)
		return bot.msgValorInvalido(message)
	if (aposta < apostaMIN)
		return bot.createEmbed(message, `O valor mínimo de aposta no Battle Royale é R$ ${apostaMIN.toLocaleString().replace(/,/g, ".")} ${bot.config.galo}`, null, bot.colors.white)
		// if (aposta > apostaMAX)
	// 	return bot.createEmbed(message, `O valor máximo de aposta no Battle Royale é R$ ${apostaMAX.toLocaleString().replace(/,/g, ".")} ${bot.config.galo}`, null, bot.colors.white)
	else if (uData.preso > time)
		return bot.msgPreso(message, uData)
	if (await bot.isUserEmRouboOuEspancamento(message, uData))
		return
	if (uData.hospitalizado > time)
		return bot.msgHospitalizado(message, uData)
	if (uGalo.emRinha)
		return bot.createEmbed(message, `Seu galo já está em uma rinha ${bot.config.galo}`, null, bot.colors.white)
	else if (uGalo.train) {
		return uGalo.trainTime > time ? bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - time) / 1000)} ${bot.config.galo}`, null, bot.colors.white) : bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de entrar no Battle Royale ${bot.config.galo}`, null, bot.colors.white)
	}
	if (uData.moni < aposta)
		return bot.msgDinheiroMenorQueAposta(message)

	let texto = `${uGalo.nome} (${uData.username})\n`

	const embed = new Discord.MessageEmbed()
		.setAuthor(`${uData.username} iniciou um Battle Royale de ${max_players} jogadores!`, message.author.avatarURL())
		.setTitle(`${bot.config.galo} Battle Royale`)
		.setDescription(`Aposta: R$ ${aposta.toLocaleString().replace(/,/g, ".")}\nPrêmio: R$ ${premio.toLocaleString().replace(/,/g, ".")}`)
		.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530616556518899722/unknown.png")
		.addField(`Galos [${players.length}/${max_players}]`, texto)
		.setFooter(message.guild.name, message.guild.iconURL())
		.setColor(bot.colors.white)

	let participar = '798219260782575626'
	let cancelar = '572134589863034884'

	let row = new Discord.MessageActionRow()
		.addComponents(new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Participar')
			.setEmoji(participar)
			.setCustomId('participar'))
		.addComponents(new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel('Cancelar')
			.setEmoji(cancelar)
			.setCustomId('cancelar'))

	let msg = await message.channel.send({embeds: [embed], components: [row]})
		.catch(() => console.log("Não consegui enviar mensagem `royale`"))

	// await bot.galos.set(message.author.id, true, 'emRinha')

	const filter = (button) => [
		'participar',
		'cancelar',
	].includes(button.customId)

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 90000,
	})

	let cancel = false
	let canCancel = true

	collector.on('collect', async b => {
		await b.deferUpdate()
		if (b.customId === 'participar') {
			if (players.includes(b.user.id))
				return

			let newplayer = b.user
			let jogador = await bot.data.get(newplayer.id)
			let galo = await bot.galos.get(newplayer.id)
			time = new Date().getTime()

			//verificador
			if (!jogador)
				bot.createEmbed(message, `${newplayer.username} não é um jogador.`)
			else if (jogador.username === undefined)
				bot.createEmbed(message, `${newplayer.username} deve configurar um nick.`)

			if (players.length <= max_players) {
				if (galo.descansar > time)
					bot.createEmbed(message, `**${jogador.username}**, seu galo está descansando. Ele poderá lutar em ${bot.segToHour((galo.descansar - time) / 1000)} ${bot.config.galo}`, null, bot.colors.background)
				else if (galo.train) {
					if (galo.trainTime > time)
						bot.createEmbed(message, `**${jogador.username}**, seu galo está treinando por mais ${bot.segToHour((galo.trainTime - time) / 1000)} ${bot.config.galo}`, null, bot.colors.background)
					else
						bot.createEmbed(message, `**${jogador.username}**, seu galo terminou o treinamento. Conclua-o antes de entrar no Battle Royale ${bot.config.galo}`, null, bot.colors.background)
				}
				else if (jogador.preso > time)
					bot.createEmbed(message, `**${jogador.username}**, você está preso por mais ${bot.segToHour((jogador.preso - time) / 1000)} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
				else if (jogador.hospitalizado > time)
					bot.createEmbed(message, `**${jogador.username}**, você está hospitalizado por mais ${bot.segToHour((jogador.hospitalizado - time) / 1000)} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.background)
				else if (await bot.isPlayerMorto(jogador))
					bot.msgPlayerMorto(message, jogador.username)
				else if (await bot.isPlayerViajando(jogador))
					bot.msgPlayerViajando(message, jogador, jogador.username)
				else if (jogador.moni < 1)
					bot.createEmbed(message, `**${jogador.username}** não tem dinheiro suficiente para fazer isto`, null, bot.colors.background)
				else if (jogador.emRoubo.tempo > time || jogador.emEspancamento.tempo > time)
					await bot.isUserEmRouboOuEspancamento(message, jogador, jogador.username)
				else if (jogador.moni < aposta)
					bot.createEmbed(message, `**${jogador.username}** não tem esta quantidade de dinheiro para fazer isto`, null, bot.colors.background)
				else if (galo.power < LVL_MIN)
					bot.createEmbed(message, `**${jogador.username}**, seu galo precisa estar nível ${LVL_MIN} para poder participar do Battle Royale ${bot.config.galo}`, null, bot.colors.background)
				else if (galo.emRinha)
					bot.createEmbed(message, `**${jogador.username}**, seu galo já está em uma rinha ${bot.config.galo}`, null, bot.colors.background)
				else if (await bot.isPlayerViajando(jogador))
					bot.msgPlayerViajando(message, jogador, jogador.username)

				else if (players.indexOf(newplayer.id < 0)) {
					// await bot.galos.set(newplayer.id, true, 'emRinha')
					players.push(newplayer.id)

					// copia o campo do embed pra um novo objeto
					let embedField = Object.assign({}, embed.fields[0])

					texto += `${galo.nome} (${jogador.username})\n`
					embedField.name = `Galos [${players.length}/${max_players}]`
					embedField.value = texto

					// const newEmbed = new Discord.MessageEmbed()
					embed.fields[0] = embedField

					if (players.length == max_players)
						collector.stop()

					msg.edit({embeds: [embed]})
						.catch(() => console.log("Não consegui editar mensagem `royale`"))
				}
			}

		}
		else if (b.customId === 'cancelar') {
			if (b.user.id !== message.author.id)
				return
			if (canCancel) {
				cancel = true
				collector.stop()
				embed
					.setTitle(`${bot.config.galo} Battle Royale (Cancelado)`)
					.setColor('RED')
					.setFooter(`${message.guild.name} • Cancelado!`, message.guild.iconURL())

				msg.edit({embeds: [embed], components: []})
					.catch(() => console.log("Não consegui editar mensagem `royale`"))
			}
		}
	})

	collector.on('end', async () => {
		time = new Date().getTime()
		if (players.length < max_players) {
			embed
				.setTitle(`${bot.config.galo} Battle Royale (Cancelado)`)
				.setColor('RED')
				.setFooter(`${message.guild.name} • Galos insuficientes!`, message.guild.iconURL())

			msg.edit({embeds: [embed], components: []})
				.catch(() => console.log("Não consegui editar mensagem `royale`"))

			if (!cancel)
				return bot.createEmbed(message, `Número insuficiente de galos para começar o Battle Royale ${bot.config.galo}`, `A rinha foi cancelada`, bot.colors.white)
			return
		}

		for (const id of players) {
			let jogador = await bot.data.get(id)
			let galo = await bot.galos.get(id)

			if (galo.descansar > time)
				return bot.createEmbed(message, `**${jogador.username}**, seu galo está descansando. Ele poderá lutar em ${bot.segToHour((galo.descansar - time) / 1000)} ${bot.config.galo}`, null, bot.colors.background)
			else if (galo.train)
				return galo.trainTime > time ? 
					bot.createEmbed(message, `**${jogador.username}**, seu galo está treinando por mais ${bot.segToHour((galo.trainTime - time) / 1000)} ${bot.config.galo}`, null, bot.colors.background)
					: bot.createEmbed(message, `**${jogador.username}**, seu galo terminou o treinamento. Conclua-o antes de entrar no Battle Royale ${bot.config.galo}`, null, bot.colors.background)
			else if (jogador.preso > time)
				return bot.createEmbed(message, `**${jogador.username}**, você está preso por mais ${bot.segToHour((jogador.preso - time) / 1000)} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
			else if (jogador.hospitalizado > time)
				return bot.createEmbed(message, `**${jogador.username}**, você está hospitalizado por mais ${bot.segToHour((jogador.hospitalizado - time) / 1000)} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.background)
			else if (await bot.isPlayerMorto(jogador))
				return bot.msgPlayerMorto(message, jogador, jogador.username)
			else if (await bot.isPlayerViajando(jogador))
				return bot.msgPlayerViajando(message, jogador, jogador.username)
			else if (jogador.moni < 1)
				return bot.createEmbed(message, `**${jogador.username}** não tem dinheiro suficiente para fazer isto`, null, bot.colors.background)
			else if (jogador.emRoubo.tempo > time || jogador.emEspancamento.tempo > time)
				return await bot.isUserEmRouboOuEspancamento(message, jogador, jogador.username)
			else if (jogador.moni < aposta)
				return bot.createEmbed(message, `**${jogador.username}** não tem esta quantidade de dinheiro para fazer isto`, null, bot.colors.background)
			else if (galo.power < LVL_MIN)
				return bot.createEmbed(message, `**${jogador.username}**, seu galo precisa estar nível ${LVL_MIN} para poder participar do Battle Royale ${bot.config.galo}`, null, bot.colors.background)
			else if (galo.emRinha)
				return bot.createEmbed(message, `**${jogador.username}**, seu galo já está em uma rinha ${bot.config.galo}`, null, bot.colors.background)
			else if (await bot.isPlayerViajando(jogador))
				return bot.msgPlayerViajando(message, jogador, jogador.username)
		}

		for (const player of players)
			await bot.galos.set(player + '.emRinha', true)
		
		await bot.galos.set(message.author.id + '.emRinha', true)

		canCancel = false
		//return bot.createEmbed(message, "Obrigado por testar. O Battle Royale estará disponível em breve")
		let participantes = []
		for (const player of players)
			participantes.push({
				id: player,
				data: await bot.data.get(player),
				galo: await bot.galos.get(player),
				chance: await bot.galos.get(player + '.power') * bot.getRandom(1, 100)
			})
		

		participantes = participantes.sort((a, b) => {
			return a.chance - b.chance
		})

		participantes.forEach(pl =>
			console.log('Participantes:', pl.data.username, pl.chance, pl.data.moni))

		let perdedores = [...participantes]
		perdedores.pop()

		msg.edit({
			embeds: [embed.setColor('GREEN')],
			components: []
		})

		bot.createEmbed(message, `**A BATALHA REAL COMEÇOU!**`, `Somente um restará!`, bot.colors.white)

		let mensagensBatalha = [
			`tentou o máximo que pôde, mas foi eliminado por`,
			`ficou para trás enquanto tentava pegar loot e acabou eliminado por`,
			`foi bombardeado por uma chuva de penas flamejantes lançadas por`,
			`esqueceu que estava em uma rinha e foi facilmente eliminado por`,
			`capotou o corsa no dia anterior e desmaiou ao ver`,
			`foi eliminado depois de levar uma rasteira poderosíssima de`,
			`foi atacado pelas costas e foi eliminado por`,
			`levou um golpe na nuca e teve seu chi bloqueado por`,
			`está mais perdido que galo cego em tiroteio e foi eliminado após levar um tiro de`,
			`se distraiu com um ovo achando que era algum filho seu, mas era uma granada lançada por`,
			`foi pego tentando entender o minimapa e levou um sacode de`,
			`se escondeu em um arbusto mas levou uma picada de uma jararaca colocada por`,
			`acabou ficando sem penas após levar ataques super rápidos de `,
			`tentou se defender de diversos ataques, mas não foi o suficiente e foi eliminado por`,
			`acabou se afogando ao tentar nadar para alcançar`,
			`foi eliminado após cair numa armadilha deixada por`,
			`tentou pular uma cerca de arame farpado, mas ficou preso e foi eliminado por`,
			`estava escalando uma montanha, mas foi eliminado por uma pena sniper atirada por`,
			`foi eliminado após uma troca de socos e chutes intensa com`,
			`confundiu um oponente com uma galinha, e ao persegui-lo, foi atacado e eliminado por`,
			`foi eliminado após levar um combo de 5 hits de`,
			`recebeu um mortal duplo carpado e foi eliminado por`,
			`foi tentar puxar sua peixeira, mas percebeu que a esqueceu em casa. Foi facilmente eliminado por`,
			`bateu a cabeça com força, e desorientado, foi eliminado por`,
			`voou em direção ao seu oponente, mas não foi páreo para a agilidade de`,
			`é atingido por flashback's do passado, perde a concentração e é derrotado por`,
			`faz um discurso sobre a paz mundial e a proibição de rinhas, é interrompido e destroçado por`,
			`gritou que quem toma Whey é galinha. Foi eliminado pelo nada contente`,
			`não consegue ser eficiente e é eliminado por uma estratégia mirabolante traçada por`,
			`começa a ter ataques de pânico e se esconde atrás de alguns entulhos. Foi eliminado ao ser encontrado por`,
			`está perdido diante de poderosos oponentes, sem perceber de onde seu rival se aproxima, é apunhalado pelas costas e eliminado por`,
			`cansou de correr e se esconder e decide sair do matagal, somente para ser brutalmente espancado por`,
			`foi atingido por uma flecha certeira de`,
			`ficou incapacitado de lutar após ser surpreendido por um arame farpado. Só é finalmente eliminado pelo _Kamehameha_ de`,
			`trava uma batalha intensa, mas é incapacitado pelas lâminas afiadas nas garras de`,
			`é ardiloso e causa bastante dano em seu oponente, mas sucumbe ao levar gancho de direita dado por`,
			`teve sua asa arrancada em uma emboscada preparada por`,
			`foi eliminado depois de ter a cara arrastada nas bordas da arena por`,
			`escorregou enquanto lutava, bateu a cabeça e foi eliminado. A eliminação foi contabilizada para`,
		]
		// let mensagensBatalhaSolo = [
		// 	`botou um ${bot.config.ovogranada2} Ovo-Granada, mas acabou explodindo com ela`,
		// 	`tentou quebrar as regras e sofreu a ira do Coroamuru`,
		// 	`escorregou enquanto lutava, bateu a cabeça e foi eliminado`,
		// 	`caiu em um buraco e ficou impedido de continuar a batalha`,
		// 	`encontrou um portal para outra dimensão, e ao entrar de curioso, foi desclassificado`,
		// 	`tentou achar um local para se esconder, mas acabou se perdendo`,
		// ]

		// let mensagensErro = [
		// 	'Os competidores estão todos calmos, organizando planos para derrotar seus adversários!',
		// 	'Os espectadores vão à loucura enquanto todos os galos começam a se aproximar do centro da arena!',
		// 	'Caramuru se sente honrado de assistir tão gloriosa batalha!',
		// 	'Armadilhas são preparadas pelos competidores enquanto nenhuma eliminação acontece',
		// 	'Comunicado da Conmegalo: A vitória nesta batalha real não garante vaga nas competições nacionais!',
		// ]

		bot.shuffle(mensagensBatalha)

		let tamanho = participantes.length

		let batalhadores = [...participantes]
		let perdedoresCopy = [...perdedores]

		for (let i = 0; i < tamanho - 1; i++) {
			await wait(7500)

			let eliminado = perdedoresCopy.shift()

			let lutador = batalhadores[Math.floor(bot.getRandom(0, batalhadores.length - 1))]
			batalhadores.shift()
			let restantes = [...batalhadores]
			bot.shuffle(restantes)
			let restantesTexto = ''

			restantes.forEach(user => {
				restantesTexto += `${user.galo.nome}, `
			})

			message.channel.send({
				embeds: [new Discord.MessageEmbed()
					.setDescription(`**${eliminado.galo.nome}** ${mensagensBatalha.shift()} **${lutador.galo.nome}**!`)
					.setColor(bot.colors.background)
					.setFooter(`Restantes: ${restantesTexto}`)
				]
			}).catch(() => console.log("Não consegui enviar mensagem `royale`"))
		}


		await wait(1000)

		let mensagemLevelUp

		let currTime = new Date().getTime()

		let vencedor = participantes.pop()
		vencedor.data.moni += (premio - aposta)
		vencedor.galo.wins += 1
		vencedor.galo.emRinha = false
		vencedor.galo.descansar = currTime + (1800000 * multiplicador_tempo_rinha)


		if (vencedor.galo.power >= 70)
			mensagemLevelUp = `**${vencedor.galo.nome}** está no nível ${vencedor.galo.power - 30} e não pode mais upar!\n`

		else {
			if (vencedor.galo.power === 68 && participantes.length >= 10)
				vencedor.galo.power += 2
			else if (vencedor.galo.power <= 67 && participantes.length >= 20)
				vencedor.galo.power += 3
			else
				vencedor.galo.power += 1
			mensagemLevelUp = `**${vencedor.galo.nome}** subiu para o nível ${vencedor.galo.power - 30}!\n`
		}

		await bot.data.set(vencedor.id, vencedor.data)
		await bot.galos.set(vencedor.id, vencedor.galo)

		console.log(`Win: ${vencedor.data.username} R$ ${await bot.data.get(vencedor.id, 'moni')}`)

		await wait(500)

		const fimRinha = new Discord.MessageEmbed()
			.setDescription(`${bot.config.galo} **${vencedor.galo.nome}** venceu o Battle Royale, e **${vencedor.data.username}** ganhou R$ ${premio.toLocaleString().replace(/,/g, ".")}`)
			.setColor('WHITE')
			.setThumbnail(vencedor.galo.avatar)
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		if (mensagemLevelUp)
			fimRinha.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b')

		for (const player of perdedores){
			let userData = await bot.data.get(player.id)
			let userGalo = await bot.galos.get(player.id)

			if (userGalo.power >= 60) {
				userGalo.power -= 1
				fimRinha.addField(`🔻 **${userGalo.nome}** desceu para o nível ${userGalo.power - 30}.`, '\u200b', true)
			}
			userGalo.loses += 1
			userData.moni -= aposta
			userGalo.emRinha = false
			userGalo.descansar = currTime + (1800000 * multiplicador_tempo_rinha)

			await bot.data.set(player.id, userData)
			await bot.galos.set(player.id, userGalo)

			console.log(`Lost: ${userData.username} R$ ${await bot.data.get(player.id, 'moni')}`)
		}

		message.channel.send({embeds: [fimRinha]})
			.catch(() => console.log("Não consegui enviar mensagem `royale fim`"))

		let logTextoComp = ''

		for (const user of participantes) {
			logTextoComp += `${user.data.username}, `
		}

		return bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${vencedor.data.username} ganhou o Battle Royale de R$ ${premio.toLocaleString().replace(/,/g, ".")}**`)
			.addField("Ficou com", vencedor.data.moni.toLocaleString().replace(/,/g, "."), true)
			.addField(`Participantes (${max_players})`, logTextoComp, true)
			.setColor(bot.colors.white))

	})

}
exports.config = {
	alias: ['ro']
}