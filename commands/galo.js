const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	let currTime = new Date().getTime()
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let aposta = args[1]

	if (!targetMention && option != "nome" && option != "titulo" && option != "info" && option != "treinar" && option != "avatar" && option != "boss") {

		if (!targetNoMention[0] && args[0] && !targetMention) {

			let name = args.join(" ").toLowerCase()

			bot.data.forEach((item, id) => {
				if (bot.data.has(id, "username") && item.username.toLowerCase() == name) // verifica se o usuário é um jogador
					targetNoMention.push(id)

				else if (id.toString() == name) {
					targetNoMention.push(id)
				}
			})

			if (!targetNoMention[0])
				return bot.createEmbed(message, "Usuário não encontrado", null, bot.colors.white)

		}

		let alvo

		if (targetNoMention.length > 0)
			alvo = targetNoMention[0]
		else {
			if (targetMention)
				alvo = targetMention.id
			else
				alvo = message.author.id
		}

		let tData = bot.data.get(alvo)
		if (!tData) return bot.createEmbed(message, "Este usuário não possui um inventário", null, bot.colors.white)

		bot.users.fetch(alvo).then(user => {
			alvo = user.id
		})


		if (alvo === message.author.id)
			return bot.showGalo(message, tData, true)
		else
			return bot.showGalo(message, tData, false)
	}

	if (option == "nome") { // setar nome
		if (!aposta)
			return bot.createEmbed(message, `Insira um nome para seu galo ${bot.config.galo}`, ";galo nome <novo-nome>", bot.colors.white)

		else {
			let uData = bot.data.get(message.author.id)
			if (uData.emRoubo)
				return bot.msgEmRoubo(message)
			// let nome = args.join(" ").replace(option, "")
			// nome = nome.substring(1, nome.length)

			option = args[0]
			let nome = args.join(" ").replace(option, "")

			let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{1,28}$/ugm

			if (nome.length > 28)
				return bot.createEmbed(message, `O nome escolhido é muito grande, escolha um menor ${bot.config.galo}`, "O limite é 28 caracteres", bot.colors.white)

			else {
				let nome = args.join(" ").replace(option, "")
				nome = nome.substring(1, nome.length)

				if (!regex.test(nome))
					return bot.createEmbed(message, `Escolha outro nome ${bot.config.galo}`, `Este nome é inválido`, bot.colors.white)

				uData.galoNome = nome
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `Você nomeou seu galo como **${uData.galoNome}** ${bot.config.galo}`, null, bot.colors.white)
			}
		}

	} else if (option == "titulo") { // setar titulo
		if (!aposta) {
			return bot.createEmbed(message, `Insira um título para seu galo ${bot.config.galo}`, ";galo titulo <novo-titulo>", bot.colors.white)

		} else {
			let uData = bot.data.get(message.author.id)
			if (uData.emRoubo)
				return bot.msgEmRoubo(message)
			// let titulo = args.join(" ").replace(option, "")
			// titulo = titulo.substring(1, titulo.length)

			option = args[0]
			let titulo = args.join(" ").replace(option, "")

			let regex = /^[a-zA-Z0-9 _!$.,%^&*()+=/\\]{1,64}$/ugm

			if (titulo.length > 64)
				return bot.createEmbed(message, `O título escolhido é muito grande, escolha um menor ${bot.config.galo}`, "O limite é 64 caracteres", bot.colors.white)

			else {
				if (!regex.test(titulo))
					return bot.createEmbed(message, `Escolha outro título ${bot.config.galo}`, `Este título é inválido`, bot.colors.white)

				uData.galoTit = titulo
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `Você deu o título **${uData.galoTit}** para seu galo ${bot.config.galo}`, null, bot.colors.white)
			}
		}

	} else if (option == "treinar") { // treinar galo para aumentar level
		if (aposta == "parar") {
			let uData = bot.data.get(message.author.id)
			if (uData.galoTrain != 1)
				return bot.createEmbed(message, `Você não pode parar o que nem começou ${bot.config.galo}`, null, bot.colors.white)
			if (uData.emRoubo)
				return bot.msgEmRoubo(message)

			else {
				uData.galoTrain = 0
				uData.galoTrainTime = 0
				uData.galoTrainNotification = false
				//clearTimeout(uData.galoTrainNotification)
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `**${uData.galoNome}** parou de treinar. Ele não subiu de nível ${bot.config.galo}`, null, bot.colors.white)
			}
		}

		let uData = bot.data.get(message.author.id)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha == true)
			return bot.createEmbed(message, `Seu galo está em uma rinha e não pode treinar ${bot.config.galo}`, null, bot.colors.white)

		if (uData.galoPower >= 60 && uData.galoTrain == 0)
			return bot.createEmbed(message, `**${uData.galoNome}** já superou seu mestre e treinar não irá aumentar seu nível ${bot.config.galo}`, null, bot.colors.white)

		if (uData.galoPower >= 70)
			return bot.createEmbed(message, `**${uData.galoNome}** já está no nível máximo ${bot.config.galo}`, null, bot.colors.white)

		if (uData.galoTrain == 1 && uData.galoTrainTime > currTime)
			return bot.createEmbed(message, `**${uData.galoNome}** está treinando por mais ${bot.segToHour((uData.galoTrainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)

		if (uData.tempoRinha > currTime)
			return bot.msgGaloDescansando(message, uData)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.galoTrain == 1 && uData.galoTrainTime < currTime) {
			uData.galoTrain = 0
			uData.galoTrainTime = 0
			uData.galoPower += 1
			uData.galoTrainNotification = false
			uData.tempoRinha = currTime + 600000 + ((uData.galoPower - 30) * 60000) // 10 min + 1min por level
			bot.data.set(message.author.id, uData)
			setTimeout(() => {
				bot.users.fetch(message.author.id).then(user => {
					user.send(`Seu galo descansou! Ele já pode treinar ou rinhar novamente! ${bot.config.galo}`)
						.catch(err => message.reply(`seu galo descansou! Ele já pode treinar ou rinhar novamente! ${bot.config.galo}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``))
				})
			}, uData.tempoRinha - currTime)
			return bot.createEmbed(message, `**${uData.galoNome}** encerrou o treinamento. Ele subiu para o nível ${uData.galoPower - 30} ${bot.config.galo}`, "Ele descansará por " + bot.segToHour((uData.tempoRinha - currTime) / 1000), bot.colors.white)
		}

		const baseTime = 2400000 //40 minutos
		const multiplicador_tempo_treino = 1
		let trainTime = (baseTime + ((uData.galoPower - 29) ** 2.3) * 1000 * 60) * multiplicador_tempo_treino + currTime
		//tempo de treino = (40 minutos + (nível do galo)^2.3) + tempo atual

		uData.galoTrainTime = trainTime
		uData.galoTrain = 1
		uData.galoTrainNotification = true

		let aviso = (Math.random() < 0.50 ? "" : "\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!")

		setTimeout(() => {
			bot.users.fetch(message.author.id).then(user => {
				let tData = bot.data.get(message.author.id)
				if (tData.galoTrainNotification) {
					user.send(`Seu galo encerrou o treinamento! ${bot.config.galo}`)
						.catch(err => message.reply(`seu galo encerrou o treinamento! ${bot.config.galo}${aviso}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``))
					tData.galoTrainNotification = false
					bot.data.set(message.author.id, tData)
				}
			})
		}, trainTime - currTime)

		bot.data.set(message.author.id, uData)
		return bot.createEmbed(message, `**${uData.galoNome}** treinará por ${bot.segToHour((trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)

	} else if (option == "info") { // ter infos sobre os galos
		//let uData = bot.data.get(message.author.id)
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.galo} Galos`)
			.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530616556518899722/unknown.png")
			.setColor('GREEN')
			.addField("Você ganhou um galo de batalha!",
				`Ele começa no nível 0 e avançará 1 nível ao ganhar uma rinha.
A partir do nível 30, seu galo perderá níveis se perder as rinhas, e o nível máximo que ele pode atingir é 40.
Você pode deixar seu galo treinando para aumentar seu nível, ou comprar ${bot.config.whey} **Whey Protein** para aumentar instantaneamente.
O tempo de treinamento e o valor do Whey aumentam com base no nível do seu galo.
Após cada rinha, seu galo precisará descansar por 25 minutos até se recuperar.`)

			.addField("Comandos",
				`\`;galo (jogador)\` Mostra informações de um galo
\`;galo nome [novo-nome]\` Escolhe um nome para seu galo
\`;galo titulo [novo-titulo]\` Escolhe um título para seu galo
\`;galo rinha [valor] [jogador]\` Desafia um jogador
\`;galo treinar (parar)\` Inicia ou encerra o treino
\`;galo avatar (id)\` Escolhe um novo avatar para seu galo
\`;galo boss (desafiar)\` Desafia o mestre Caramuru
\`;topgalo\` Galos com mais vitórias e win rate em rinhas
\`;royale\` Informações sobre Battle Royales`)
			//\`;royale [valor]\` Inicia um Battle Royale (em testes)`)

			// .addField(`${bot.config.whey} Whey Protein`, (bot.data.has(message.author.id, "galo") ?
			// 	(uData.galoPower >= 60 ? "Seu pinto já tá grande." :
			// 		`R$ ${(((uData.galoPower - 29) * 10) ** 2.2).toLocaleString().replace(/,/g, ".")}
			// 		Preço para **${uData.nome.length > 12 ? uData.nome.substring(0, 10) + "...**" :
			// 			`${uData.nome}**`}`) : "Primeiro, use `;galo`."))
			.setFooter(bot.data.get(message.author.id, "username"), message.member.user.avatarURL())
			.setTimestamp();
		return message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `galo info`", err))

	} else if (option == "rinha") { // desafiar outros players

		//return bot.createEmbed(message, "As Rinhas foram desativadas devido a um bug. ${bot.config.galo}")

		if (!targetMention)
			return bot.createEmbed(message, `Você precisa escolher um jogador para rinhar ${bot.config.galo}`, ";galo rinha <valor> <@jogador>", bot.colors.white)

		let alvo = targetMention.user
		let uData = bot.data.get(message.author.id)
		let tData = bot.data.get(alvo.id)

		if (!tData)
			return bot.createEmbed(message, `Este jogador não possui um galo ${bot.config.galo}`, null, bot.colors.white)

		if (message.author.id == targetMention.id)
			return bot.createEmbed(message, `Seu galo não pode lutar com ele mesmo ${bot.config.galo}`, null, bot.colors.white)

		if (uData.tempoRinha > currTime)
			return bot.msgGaloDescansando(message, uData)

		if (tData.tempoRinha > currTime)
			return bot.msgGaloDescansando(message, tData, tData.username)

		if (uData.galoTrain == 1) {
			if (uData.galoTrainTime > currTime)
				return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uData.galoTrainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)
			else
				return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de começar uma rinha ${bot.config.galo}`, null, bot.colors.white)
		}

		if (tData.galoTrain == 1) {
			if (tData.galoTrainTime > currTime)
				return bot.createEmbed(message, `O galo de ${tData.username} está treinando por mais ${bot.segToHour((tData.galoTrainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)
			else
				return bot.createEmbed(message, `O galo de ${tData.username} terminou o treinamento. Ele deve concluí-o antes de começar uma rinha ${bot.config.galo}`, null, bot.colors.white)
		}

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo já está em uma rinha ${bot.config.galo}`, null, bot.colors.white)
		if (tData.galoEmRinha)
			return bot.createEmbed(message, `O galo de ${tData.username} já está em uma rinha ${bot.config.galo}`, null, bot.colors.white)

		if (uData.moni < 1)
			return bot.msgSemDinheiro(message)

		if (tData.moni < 1)
			return bot.msgSemDinheiro(message, tData.username)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (tData.preso > currTime)
			return bot.msgPreso(message, tData, tData.username)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (tData.emRoubo)
			return bot.msgEmRoubo(message, tData.username)

		if (aposta <= 0 || (aposta % 1 != 0))
			return bot.msgValorInvalido(message)

		const MIN = 100
		const MAX = 1000000 //1000000

		if (aposta < MIN)
			return bot.createEmbed(message, `O valor mínimo de aposta na rinha é R$ ${MIN.toLocaleString().replace(/,/g, ".")} ${bot.config.galo}`, null, bot.colors.white)

		if (aposta > MAX)
			return bot.createEmbed(message, `O valor máximo de aposta na rinha é R$ ${MAX.toLocaleString().replace(/,/g, ".")} ${bot.config.galo}`, null, bot.colors.white)

		if (parseFloat(uData.moni) < aposta)
			return bot.msgDinheiroMenorQueAposta(message)

		if (parseFloat(tData.moni) < aposta)
			return bot.msgDinheiroMenorQueAposta(message, tData.username)

		if (uData.galoNome == '' || uData.galoNome == 'Galo')
			uData.galoNome = `Galo de ${uData.username}`

		if (tData.galoNome == '' || tData.galoNome == 'Galo')
			tData.galoNome = `Galo de ${tData.username}`

		// if (uData.preso > currTime && uData.celular > currTime)

		if (alvo.id == '526203502318321665')
			return bot.createEmbed(message, `Para desafiar o ${bot.config.caramuru} Caramuru, use \`;galo boss desafiar\``, null, bot.colors.white)

		let respondeu = false

		bot.data.set(message.author.id, true, 'galoEmRinha')
		bot.data.set(alvo.id, true, 'galoEmRinha')

		bot.createEmbed(message, `**${uData.username}** desafiou **${tData.username}** para uma rinha 1x1 valendo R$ ${parseInt(aposta).toLocaleString().replace(/,/g, ".")} ${bot.config.galo}\nClique em <:positive:572134588340633611> para aceitar ou <:negative:572134589863034884> para recusar`, `60 segundos para responder`, bot.colors.white)
			.then(msg => {
				msg.react('572134588340633611') // aceitar
					.then(() => msg.react('572134589863034884')) // negar
					.catch(err => console.log("Não consegui reagir mensagem `galo rinha`", err))

				let filter = (reaction, user) => ['572134588340633611', '572134589863034884'].includes(reaction.emoji.id) && user.id === alvo.id

				const collector = msg.createReactionCollector({
					filter,
					time: 90000,
					max: 1,
					errors: ['time']
				});
				collector.on('collect', reaction => {
					respondeu = true
					if (msg) msg.reactions.removeAll().then(async () => {
						if (reaction.emoji.id === '572134588340633611') { //aceitar
							uData = bot.data.get(message.author.id)
							tData = bot.data.get(alvo.id)

							bot.data.set(message.author.id, false, 'galoEmRinha')
							bot.data.set(alvo.id, false, 'galoEmRinha')

							if (uData.moni < 1)
								return bot.msgSemDinheiro(message)

							if (tData.moni < 1)
								return bot.msgSemDinheiro(message, tData.username)

							if (uData.preso > currTime)
								return bot.msgPreso(message, uData)

							if (tData.preso > currTime)
								return bot.msgPreso(message, tData, tData.username)

							if (parseFloat(uData.moni) < aposta)
								return bot.msgDinheiroMenorQueAposta(message)

							if (parseFloat(tData.moni) < aposta)
								return bot.msgDinheiroMenorQueAposta(message, tData.username)

							if (uData.emRoubo)
								return bot.msgEmRoubo(message, uData.username)

							if (tData.emRoubo)
								return bot.msgEmRoubo(message, tData.username)

							bot.data.set(message.author.id, true, 'galoEmRinha')
							bot.data.set(alvo.id, true, 'galoEmRinha')

							const inicioRinha = new Discord.MessageEmbed()
								.setDescription(`${bot.config.galo} **${tData.username}** aceitou o desafio!`)
								.setColor(bot.colors.white)
								.setFooter(`${bot.user.username} • Valendo R$ ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
								.setTimestamp()

							message.channel.send({
								embeds: [inicioRinha]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha`", err))

							let randomDesafiante = bot.getRandom(1, 100)
							let randomDesafiado = bot.getRandom(1, 100)

							let desafianteVencedor = (randomDesafiante * uData.galoPower) > (randomDesafiado * tData.galoPower)

							let textos_inicio = [
								`**${uData.galoNome}** começa a luta atacando **${tData.galoNome}** no queixo!`,
								`**${tData.galoNome}** começa a luta atacando **${uData.galoNome}** no queixo!`,
								`**${tData.galoNome}** provoca **${uData.galoNome}** chamando ele de galinha!`,
								`**${uData.galoNome}** provoca **${tData.galoNome}** chamando ele de galinha!`,
								`**${uData.galoNome}** falou que é filho do ${bot.config.caramuru} **Caramuru**!`,
								`**${tData.galoNome}** falou que é filho do ${bot.config.caramuru} **Caramuru**!`,
								`**${uData.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
								`**${tData.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
								`**${uData.galoNome}** disse que é rinha igual bumerangue, tudo que vai, volta.`,
								`**${tData.galoNome}** disse que é rinha igual bumerangue, tudo que vai, volta.`,
								`**${uData.galoNome}** se vangloria de todas suas cicatrizes!`,
								`**${tData.galoNome}** se vangloria de todas suas cicatrizes!`,
								`**${uData.galoNome}** inicia a luta puxando a crista de **${tData.galoNome}**!`,
								`**${tData.galoNome}** inicia a luta puxando a crista de **${uData.galoNome}**!`,
								`**${uData.galoNome}** provoca falando que terá canja de **${tData.galoNome}** no jantar!`,
								`**${tData.galoNome}** provoca falando que terá canja de **${uData.galoNome}** no jantar!`,
								`**${uData.galoNome}** fala que hoje vai ter tripa do **${tData.galoNome}** com pinga no buteco da esquina!`,
								`**${tData.galoNome}** fala que hoje vai ter tripa do **${uData.galoNome}** com pinga no buteco da esquina!`,
								`**${uData.galoNome}** põe tocar um rock paulera pra se motivar!`,
								`**${tData.galoNome}** põe tocar um rock paulera pra se motivar!`,
								`É notório que **${uData.galoNome}** está com pena de **${tData.galoNome}**!`,
								`É notório que **${tData.galoNome}** está com pena de **${uData.galoNome}**!`,
								`**${uData.galoNome}** cacareja muito alto e **${tData.galoNome}** se sente ameaçado!`,
								`**${tData.galoNome}** cacareja muito alto e **${uData.galoNome}** se sente ameaçado!`,
								`**${uData.galoNome}** entra na arena com uma rosa em sua boca!`,
								`**${tData.galoNome}** entra na arena com uma rosa em sua boca!`,
								`**${uData.galoNome}** diz: *"Você quer me matar? Você não seria capaz nem de matar meu tédio!"*, mas tudo que podemos escutar é *"có có cóóó"*.`,
								`**${tData.galoNome}** diz: *"Você quer me matar? Você não seria capaz nem de matar meu tédio!"*, mas tudo que podemos escutar é *"có có cóóó"*.`,
								`**${uData.galoNome}** diz que será o galo que superará o temido ${bot.config.caramuru} **Caramuru**!`,
								`**${tData.galoNome}** diz que será o galo que superará o temido ${bot.config.caramuru} **Caramuru**!`,
								`**${uData.galoNome}** diz: *"Não comece uma luta se você não pode terminá-la"*, mas a arena é tão grande que **${tData.galoNome}** não escutou.`,
								`**${tData.galoNome}** diz: *"Não comece uma luta se você não pode terminá-la"*, mas a arena é tão grande que **${uData.galoNome}** não escutou.`
							]

							let textos_luta = [
								`**${uData.galoNome}** voou por incríveis 2 segundos e deixou **${tData.galoNome}** perplecto!`,
								`**${tData.galoNome}** ciscou palha no olho de **${uData.galoNome}** e aproveitou para um ataque surpresa!`,
								`**${uData.galoNome}** arrancou o olho de **${tData.galoNome}**! Por sorte era o olho ruim.`,
								`**${tData.galoNome}** deu um rasante em **${uData.galoNome}** arrancando várias de suas penas!`,
								`**${uData.galoNome}** acertou um combo de 5 hits em **${tData.galoNome}**!`,
								`**${tData.galoNome}** aproveitou que **${uData.galoNome}** olhou para uma galinha da plateia e deu um mortal triplo carpado!`,
								`**${uData.galoNome}** usou um golpe especial e **${tData.galoNome}** ficou sem entender nada!`,
								`**${tData.galoNome}** apanha bastante, mas mostra para **${uData.galoNome}** que pau que nasce torto tanto bate até que fura!`,
								`**${uData.galoNome}** rasga o peito de **${tData.galoNome}** como se fosse manteiga!`,
								`**${tData.galoNome}** tentou usar *Raio Destruidor da Morte* em **${uData.galoNome}**, mas acaba errando e acerta o juiz.`,
								`**${uData.galoNome}** tenta acertar um *Fogo Sagrado da Conflagração* em **${tData.galoNome}**, erra por pouco e acerta a plateia!`,
								`**${tData.galoNome}** está paralizado e não consegue se mover!`,
								`**${uData.galoNome}** se sente lento e acaba errando diversos ataques.`,
								`A Polícia Federal adentra no recinto e todos ficam em pânico. Um dos policiais fala: "APOSTO MIL NO **${tData.galoNome.toUpperCase()}**"!`,
								`Pouco se importando com as regras, **${uData.galoNome}** pega uma ${bot.config.colt45} Colt 45 e atira em **${tData.galoNome}**.`,
								`**${tData.galoNome}** utiliza um *Z-Move* com **${tData.username}**, causando dano crítico em **${uData.galoNome}**!`,
								`**${uData.galoNome}** utiliza um *Z-Move* com **${uData.username}** em **${tData.galoNome}**. É super efetivo!`,
								`**${tData.galoNome}** tenta usar uma técnica especial, mas **${uData.galoNome}** aproveita a abertura e desce a porrada.`,
								`Após receber diversos golpes, **${uData.galoNome}** está atordoado, mas ainda continua de pé!`,
								`Mesmo após atacar diversas vezes, **${tData.galoNome}** percebe que seu oponente ainda está de pé!`,
								`**${uData.galoNome}** usa seu bico afiado para trucidar os membros de **${tData.galoNome}**.`,
								`**${tData.galoNome}** aproveita a distância e joga diversas penas afiadas em **${uData.galoNome}**!`,
								`**${uData.galoNome}** gira em círculos e levanta muita poeira. Nâo há como ver nada!`,
								`**${tData.galoNome}** cai no chão com tanta força que Sismólogos acharam que era um terremoto!`,
								`**${uData.galoNome}** derruba seu oponente no chão e sai cantando vitória. **${tData.galoNome}** aproveita a distração para atacar pelas costas!`,
								`Diversos xingamentos são proferidos por **${uData.username}** enquanto **${uData.galoNome}** se recusa a obedecer seus comandos!`,
								`Lembrando dos ensinamentos de seu mestre, **${tData.galoNome}** usa sua concentração para acertar um soco potente!`,
								`**${uData.galoNome}** consegue acertar uma boa sequência de chutes, bicadas, socos e penadas!`,
								`**${tData.galoNome}** pega várias pedras do chão e as atira em direção à **${uData.galoNome}**`,
								`**${uData.galoNome}** xinga a mãe de **${tData.galoNome}**! Ele não deixou barato e partiu pra cima!`,
								`**${tData.galoNome}** inicia uma dança espetacular de acasalamento, pensando que, talvez, seu oponente seja fêmea.`,
								`**${uData.galoNome}** apanha sua bíblia e começa a ler Êxodo 23:7 "Não se envolva em acusações falsas, e não mate o inocente e o justo, pois não vou declarar justo quem fizer o mal."`,
								`**${tData.galoNome}** ficou com tanto medo que botou um ovo...`,
								`**${uData.galoNome}** arremessa penas cortantes em **${tData.galoNome}**, mas acaba acertando **${tData.username}**.`,
								`Por algum motivo, **${tData.galoNome}** esqueceu da luta e começou a ciscar o chão.`,
								`**${uData.galoNome}** corre em direção de **${tData.galoNome}**, dá um duplo carpado fodinha e finaliza o combo com um MEGA ARRANHÃO FODÃO.`,
								`**${tData.galoNome}** reveste seu corpo com penas de latão, recebendo +5 DEF.`,
								`**${uData.galoNome}** levanta uma nuvem de poeira com suas asas, cegando temporariamente o **${tData.galoNome}**.`,
								`**${tData.galoNome}** prepara um golpe poderoso...`,
								`**${uData.galoNome}** prepara um golpe poderoso...`,
								`Uma nave alienígena aparece para abduzir **${tData.username}**, mas **${tData.galoNome}** protege seu dono e volta à rinha.`,
								`**${uData.galoNome}** começa a latir e **${tData.galoNome}** fica assustado.`,
								`**${tData.galoNome}** hipnotiza seu adversário, fazendo **${uData.galoNome}** dar um soco em seu mestre **${uData.username}**!`,
								`**${uData.galoNome}** utiliza um pedaço de vidro para refletir a luz na cara e cegar **${tData.galoNome}**!`,
								`**${tData.galoNome}** interrompe a luta e começa a tragar um cigarro. É o maldito Cocky Blinder.`,
								`**${uData.galoNome}** chamou **${tData.galoNome}** para um x1 de Pedra-Papel-Tesoura. Ambos perdem.`,
								`Um grupo de galinhas invade a rinha, distraindo os lutadores. **${uData.username}** e **${tData.username}** afugentam as galinhas para a luta continuar.`,
								`**${uData.galoNome}** ativa o instinto superior e desvia de todos os golpes de **${tData.galoNome}**.`,
								`**${tData.galoNome}** botou um ${bot.config.ovogranada2} Ovo-granada e o jogou em **${uData.galoNome}**, explodindo parte da arena com ele!`,
							]

							bot.shuffle(textos_luta)

							//gera textos de batalha
							const msg1 = new Discord.MessageEmbed().setDescription(textos_inicio[Math.floor(Math.random() * textos_inicio.length)]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg1]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 2000)

							if (uData.galoPower == tData.galoPower) {
								const msg2 = new Discord.MessageEmbed().setDescription(`**${uData.galoNome}** não sabe como atacar **${tData.galoNome}**! Eles já estão parados se encarando por 5 minutos!`).setColor(bot.colors.background)
								const msg3 = new Discord.MessageEmbed().setDescription(`Não há como prever quem ganhará esta rinha! Ambos os galos são incrivelmente e igualmente habilidosos!`).setColor(bot.colors.background)
								setTimeout(() => message.channel.send({
									embeds: [randomDesafiante >= randomDesafiado ? msg2 : msg3]
								}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 7000)

							} else {
								const msg4 = new Discord.MessageEmbed().setDescription(textos_luta[0]).setColor(bot.colors.background)
								setTimeout(() => message.channel.send({
									embeds: [msg4]
								}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 7000)
							}

							const msg5 = new Discord.MessageEmbed().setDescription(textos_luta[1]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg5]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 12000)

							const msg6 = new Discord.MessageEmbed().setDescription(textos_luta[2]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg6]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 17000)

							const msg7 = new Discord.MessageEmbed().setDescription(textos_luta[3]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg7]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 22000)

							const msg8 = new Discord.MessageEmbed().setDescription(textos_luta[4]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg8]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 27000)

							const msg9 = new Discord.MessageEmbed().setDescription(textos_luta[5]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg9]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 32000)

							// const msgNew1 = new Discord.MessageEmbed().setDescription(textos_luta[6]).setColor(bot.colors.background)
							// setTimeout(() => message.channel.send(msgNew1), 37000)

							// const msgNew2 = new Discord.MessageEmbed().setDescription(textos_luta[7]).setColor(bot.colors.background)
							// setTimeout(() => message.channel.send(msgNew2), 42000)

							const msg10 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomDesafiado ? (randomDesafiante % 2 == 0 ? `**${tData.galoNome}** é arremessado para longe da arena, e **${uData.galoNome}** sai vitorioso ` : `**${uData.galoNome}** está implacável e **${tData.galoNome}** já não resiste mais!`) : `**${tData.galoNome}** sabe que sua derrota foi digna e vai ao chão!`).setColor(bot.colors.background)
							const msg11 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomDesafiado ? (randomDesafiante % 2 == 0 ? `**${uData.galoNome}** está tão machucado que é levado pra UTI às pressas` : `Os golpes de **${tData.galoNome}** são certeiros e **${uData.galoNome}** está ciente de sua derrota!`) : `**${uData.galoNome}** cai na lona com um sorriso no rosto, pois sabe que deu o seu melhor.`).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [desafianteVencedor ? msg10 : msg11]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`", err)), 37000)

							setTimeout(() => {
								currTime = new Date().getTime()
								uData = bot.data.get(message.author.id)
								tData = bot.data.get(alvo.id)

								let vencedor
								let perdedor
								let mensagemLevelUp
								let mensagemLevelDown

								// let ovosGanhos = bot.getRandom(1, 10)

								if (desafianteVencedor) {
									uData.moni += parseInt(aposta)
									tData.moni -= parseInt(aposta)
									uData.galoW++

									// uData._ovo += ovosGanhos

									tData.galoL++
									vencedor = uData
									perdedor = tData

									if (tData.galoPower >= 60) {
										tData.galoPower -= 1
										mensagemLevelDown = `**${perdedor.galoNome}** desceu para o nível ${perdedor.galoPower - 30}`
									}

									if (uData.galoPower >= 70)
										mensagemLevelUp = `**${vencedor.galoNome}** está no nível ${vencedor.galoPower - 30} e não pode mais upar`

									else {
										uData.galoPower++
										mensagemLevelUp = `**${vencedor.galoNome}** subiu para o nível ${vencedor.galoPower - 30}`
									}

								} else {
									tData.moni += parseInt(aposta)
									uData.moni -= parseInt(aposta)
									tData.galoW++

									// tData._ovo += ovosGanhos

									uData.galoL++
									vencedor = tData
									perdedor = uData

									if (uData.galoPower >= 60) {
										uData.galoPower -= 1
										mensagemLevelDown = `**${perdedor.galoNome}** desceu para o nível ${perdedor.galoPower - 30}`
									}

									if (tData.galoPower >= 70)
										mensagemLevelUp = `**${vencedor.galoNome}** está no nível ${vencedor.galoPower - 30} e não pode mais upar`

									else {
										tData.galoPower++
										mensagemLevelUp = `**${vencedor.galoNome}** subiu para o nível ${vencedor.galoPower - 30}`
									}
								}

								// mensagemLevelUp += `\n\n**${vencedor.galoNome}** ganhou ${bot.config.ovo} ${ovosGanhos} Ovos de páscoa do ${bot.config.caramuru} Caramuru`

								const multiplicador_tempo_rinha = 0.5
								uData.tempoRinha = currTime + (1800000 * multiplicador_tempo_rinha)
								uData.galoEmRinha = false
								tData.tempoRinha = currTime + (1800000 * multiplicador_tempo_rinha)
								tData.galoEmRinha = false
								bot.data.set(message.author.id, uData)
								bot.data.set(targetMention.id, tData)

								setTimeout(() => {
									bot.users.fetch(message.author.id).then(user => {
										user.send(`Seu galo está pronto para outra batalha! ${bot.config.galo}`)
											.catch(err => message.reply(`seu galo está pronto para outra batalha! ${bot.config.galo}`)
												.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``));
									});
								}, uData.tempoRinha - currTime)

								setTimeout(() => {
									bot.users.fetch(targetMention.id).then(user => {
										user.send(`Seu galo está pronto para outra batalha! ${bot.config.galo}`)
											.catch(err => console.log(`Não consegui mandar mensagem privada para ${user.username} (${targetMention.id})`))
									});
								}, uData.tempoRinha - currTime)

								//bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(parseInt(aposta) * bot.imposto))

								const fimRinha = new Discord.MessageEmbed()
									.setDescription(`${bot.config.galo} **${vencedor.galoNome}** ganhou a rinha contra **${perdedor.galoNome}**!\n**${vencedor.username}** recebeu R$ ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}`)
									.setColor('WHITE')
									.setThumbnail(vencedor.galoAvatar)
									.setFooter(bot.user.username, bot.user.avatarURL())
									.setTimestamp()

								if (mensagemLevelUp)
									fimRinha.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b', true)
								if (mensagemLevelDown)
									fimRinha.addField(`🔻 ${mensagemLevelDown}`, '\u200b', true)

								// CONVITE EVENTO
								// let texto_convite = `Parabéns pela vitória, ${vencedor.username} e ${vencedor.galoNome}! Vocês foram convidados para participar dos torneios **Canja de Galinha das Américas** e **Canjica de Galinha Sul-América**. ${bot.config.galo}\n\nCada torneio terá 16 participantes e os vencedores levarão para casa R$ 50.000!\n**Inscrições encerradas para o torneio Canja de Galinha das Américas**\nOs vencedores se enfrentarão na **Supercopa das Canjas** que terá premiação de R$ 75.000 + badge exclusiva para o galo!\n\nPara se inscreverem, encontrem a categoria \`🐓 TORNEIO\` no servidor oficial do Cross Roads (\`;convite\`) e no canal \`#rinhas\`, mencione o jogador **Vince Lautaro** e mande um _printscreen_ deste convite.`
								// if (vencedor == uData) {
								// 	bot.users.fetch(message.author.id).then(user => {
								// 		user.send(texto_convite)
								// 			.catch();
								// 	});
								// } else {
								// 	bot.users.fetch(targetMention.id).then(user => {
								// 		user.send(texto_convite)
								// 			.catch();
								// 	});
								// }

								return message.channel.send({
									embeds: [fimRinha]
								}).catch(err => console.log("Não consegui enviar mensagem `galo fim rinha`", err))
							}, 38000)

						} else if (reaction.emoji.id === '572134589863034884') {
							bot.data.set(message.author.id, false, 'galoEmRinha')
							bot.data.set(alvo.id, false, 'galoEmRinha')
							return bot.createEmbed(message, `**${tData.username}** recusou o desafio. Que galinha! ${bot.config.galo}`, null, bot.colors.white)
						}
					}).catch(err => console.log("Não consegui remover as reações mensagem `galo`", err))
				})

				collector.on('end', async response => {
					// if (msg) msg.reactions.removeAll()
					bot.data.set(message.author.id, false, 'galoEmRinha')
					bot.data.set(alvo.id, false, 'galoEmRinha')
					if (!respondeu)
						return bot.createEmbed(message, `**${tData.username}** não respondeu. Ele está offline ou é um frangote. ${bot.config.galo}`, null, bot.colors.white)
				})
			})

	} else if (option == "avatar") { // trocar avatar do galo

		let uData = bot.data.get(message.author.id)

		let galosImagens = {
			1: 'https://media.discordapp.net/attachments/531174573463306240/754444939739398154/galo1.png',
			2: 'https://media.discordapp.net/attachments/531174573463306240/777687838778982410/galo3.png',
			3: 'https://media.discordapp.net/attachments/531174573463306240/777687841131331615/galo4.png',
			4: 'https://media.discordapp.net/attachments/531174573463306240/754444949742682263/galo4.png',
			5: 'https://media.discordapp.net/attachments/531174573463306240/754444945259102521/galo5.png',
			6: 'https://media.discordapp.net/attachments/531174573463306240/754444949025718282/galo6.png',
			7: 'https://media.discordapp.net/attachments/531174573463306240/754444942939783224/galo7.png',
			8: 'https://media.discordapp.net/attachments/531174573463306240/754444898001748028/galo8.png',
			9: 'https://media.discordapp.net/attachments/529674667414519810/530191738690732033/unknown.png',
			10: 'https://media.discordapp.net/attachments/531174573463306240/839690074345439273/galo12.png',
			11: 'https://media.discordapp.net/attachments/531174573463306240/839690073393070130/galo11.png',
			12: 'https://media.discordapp.net/attachments/531174573463306240/839690070168174602/galo10.png',
			13: 'https://media.discordapp.net/attachments/531174573463306240/777686382864760832/galo_vip3.gif',
			14: 'https://media.discordapp.net/attachments/531174573463306240/777686380926205952/galo_vip2.gif',
			15: 'https://media.discordapp.net/attachments/531174573463306240/777686414904918036/galo_vip1.gif',
			16: 'https://media.discordapp.net/attachments/531174573463306240/840362802253660170/galo_vip9.gif',
			17: 'https://media.discordapp.net/attachments/531174573463306240/840361321563160656/galo_vip5.gif',
			18: 'https://media.discordapp.net/attachments/531174573463306240/840361300478525440/galo_vip4.gif',
			19: 'https://media.discordapp.net/attachments/531174573463306240/840361331256328222/galo_vip7.gif',
			20: 'https://media.discordapp.net/attachments/531174573463306240/840361807117680701/galo_vip8_1.gif',
		}

		if (!aposta) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.galo} Avatar de ${uData.galoNome}`)
				.setDescription("Utilize `;galo avatar [id]` para alterar o avatar do seu galo.")
				.setColor(bot.colors.white)
				.setThumbnail(uData.galoAvatar)
				//.setImage('https://cdn.discordapp.com/attachments/531174573463306240/754444969141469324/galos.png')
				.setImage('https://media.discordapp.net/attachments/531174573463306240/840347960956551178/galos.png')
				.setFooter(uData.username, message.member.user.avatarURL())
				.setTimestamp();
			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo avatar`", err))

		} else {
			if (aposta < 1 || aposta > 20 || aposta % 1 != 0)
				return bot.createEmbed(message, `O ID deve ser entre 1 e 20 ${bot.config.galo}`, null, bot.colors.white)

			if (aposta >= 13 && aposta <= 20 && uData.vipTime < currTime)
				return bot.createEmbed(message, `Você precisa ser VIP para utilizar este avatar ${bot.config.galo}`, null, bot.colors.white)

			if (uData.emRoubo)
				return bot.msgEmRoubo(message)

			uData.galoAvatar = galosImagens[aposta]
			bot.data.set(message.author.id, uData)

			let textos = ["Olha que coisinha linda!", "Poderoso e imponente", "Que bunitinhu!!", "Winner winner, chicken dinner", "O barbeiro disse \"Corto cabelo e pinto\""]
			bot.shuffle(textos)

			const embed = new Discord.MessageEmbed()
				.setTitle(`Avatar de ${uData.galoNome} atualizado! ${bot.config.galo}`)
				.setDescription(textos[0])
				.setColor(bot.colors.white)
				.setThumbnail(uData.galoAvatar)
				.setFooter(uData.username, message.member.user.avatarURL())
				.setTimestamp();
			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo avatar`", err))
			// return bot.createEmbed(message, ``, null, bot.colors.white)
		}


	} else if (option == "boss") {
		let premio = 1000000 //2000000
		if (!aposta) { // ter infos sobre os galos
			//let uData = bot.data.get(message.author.id)
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.caramuru} O mestre dos galos`)
				.setThumbnail("https://images-ext-2.discordapp.net/external/VplqMHG9UrkjMXPUmrgcjhASbwUIScouDxvp9H3hB_s/%3Fformat%3Djpg%26name%3D360x360/https/pbs.twimg.com/media/D5kdJr0WwAEzH1k")
				.setColor('WHITE')
				.setDescription(`Caramuru é o mestre dos galos. Todos aqueles capazes de vencê-lo são recompensados.`)
				.addField("Como funciona",
					`**Caramuru**, o maior galo de batalha de Cidade da Cruz está humildemente permitindo que seja desafiado. Seu galo tem o que é preciso?
Após desafiar Caramuru, seu galo precisará esperar 2h até desafiá-lo novamente. Se ele, de alguma forma, conseguir derrotar Caramuru, você levará para casa R$ ${premio.toLocaleString().replace(/,/g, ".")}.
Você pode desafiar Caramuru quantas vezes quiser, e ele nunca fica cansado. Se seu galo vencer, ele subirá dois níveis! Seu galo precisa ter realizado 10 rinhas antes de desafiar Caramuru.
	
**Caramuru** só pode ser desafiado aos finais de semana.`)

				.addField("Comandos", `\`;galo Cross Roads\` Mostra o galo Caramuru\n\`;galo boss desafiar\` Desafia o Caramuru`)
				.setFooter(bot.user.username, bot.user.avatarURL())
				.setTimestamp();
			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss`", err))

		} else if (aposta == "desafiar") { // desafiar outros players
			let dia = new Date().getDay()
			let hora = new Date().getHours()
			//se não domingo e não sábado e não (quinta e depois 18) e não admin
			//se true e true e não true e true
			//se true e não true
			//se false
			// if (dia != 0 && dia != 6 && !(dia == 5 && hora >= 18))
			if (dia != 0 && dia != 6 && !(dia == 5 && hora >= 20))
				return bot.createEmbed(message, `**Caramuru** só pode ser desafiado aos finais de semana ${bot.config.caramuru}`, null, bot.colors.white)


			// return bot.createEmbed(message, `**Caramuru** está de folga durante a primeira semana da temporada ${bot.config.caramuru}`, null, bot.colors.white)

			let uData = bot.data.get(message.author.id)
			let caramuru = bot.data.get('526203502318321665')

			if (uData.tempoRinha > currTime)
				return bot.msgGaloDescansando(message, uData)

			if (uData.galoTrain == 1) {
				if (uData.galoTrainTime > currTime)
					return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uData.galoTrainTime - currTime) / 1000)} ${bot.config.caramuru}`, null, bot.colors.white)
				else
					return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de começar uma rinha ${bot.config.caramuru}`, null, bot.colors.white)
			}

			if (uData.galoEmRinha == true)
				return bot.createEmbed(message, `Seu galo já está em uma rinha ${bot.config.caramuru}`, null, bot.colors.white)

			if (caramuru.galoEmRinha == true)
				return bot.createEmbed(message, `Caramuru já está em uma rinha ${bot.config.caramuru}`, null, bot.colors.white)

			if (uData.preso > currTime)
				return bot.msgPreso(message, uData)

			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData)

			if (uData.job != null)
				return bot.msgTrabalhando(message, uData)

			if ((uData.galoW + uData.galoL) < 10)
				return bot.createEmbed(message, `Seu galo precisa participar de mais rinhas para desafiar o Caramuru ${bot.config.caramuru}`, null, bot.colors.white)

			if (uData.emRoubo)
				return bot.msgEmRoubo(message)


			if (uData.galoNome == '' || uData.galoNome == 'Galo')
				uData.galoNome = `Galo de ${uData.username}`

			bot.data.set(message.author.id, true, 'galoEmRinha')
			bot.createEmbed(message, `**${uData.username}** desafiou **Caramuru** para uma rinha 1x1 ${bot.config.caramuru}`, null, bot.colors.white)

			setTimeout(() => bot.createEmbed(message, `${bot.config.caramuru} **Caramuru** aceitou o desafio! O espetáculo tem início!`, null, bot.colors.white), 1500)

			let randomDesafiante = bot.getRandom(1, 100)
			let randomCaramuru = bot.getRandom(2, 100) // pra evitar derrotas críticas

			let desafianteVencedor = randomDesafiante * uData.galoPower > randomCaramuru * caramuru.galoPower

			let textos_inicio = [
				`**${caramuru.galoNome}** começa a luta atacando **${uData.galoNome}** no queixo!`,
				`**${caramuru.galoNome}** provoca **${uData.galoNome}** chamando ele de galinha!`,
				`**${uData.galoNome}** provoca **${caramuru.galoNome}** chamando ele de galinha!`,
				`**${caramuru.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
				`**${uData.galoNome}** disse que é rinha igual bumerangue, tudo que vai, volta.`,
				`**${caramuru.galoNome}** disse que é rinha igual bumerangue, tudo que vai, volta.`,
				`**${uData.galoNome}** se vangloria de todas suas cicatrizes!`,
				`**${caramuru.galoNome}** se vangloria de todas suas cicatrizes!`,
				`**${caramuru.galoNome}** inicia a luta puxando a crista de **${uData.galoNome}**!`,
				`**${uData.galoNome}** provoca falando que terá canja de **${caramuru.galoNome}** no jantar!`,
				`**${caramuru.galoNome}** provoca falando que terá canja de **${uData.galoNome}** no jantar!`,
				`**${caramuru.galoNome}** fica de braços cruzados esperando seu oponente atacar!`,
				`**${uData.galoNome}** está tremendo de medo!`,
				`**${caramuru.galoNome}** diz: *"Não comece uma luta se você não pode terminá-la"*.`,
				`**${caramuru.galoNome}** entra na arena com uma rosa em sua boca!`,

			]

			let textos_luta = [
				`**${caramuru.galoNome}** voou por incríveis 10 segundos e deixou **${uData.galoNome}** perplecto!`,
				`**${caramuru.galoNome}** ciscou palha no olho de **${uData.galoNome}** e aproveitou para um ataque surpresa!`,
				`**${caramuru.galoNome}** arrancou o olho de **${uData.galoNome}**! Infelizmente, era o olho bom.`,
				`**${caramuru.galoNome}** deu um rasante em **${uData.galoNome}** arrancando várias de suas penas!`,
				`**${caramuru.galoNome}** acertou um combo de 25 hits em **${uData.galoNome}**!`,
				`**${caramuru.galoNome}** aproveitou que **${uData.galoNome}** olhou para uma galinha da plateia e deu um mortal quádruplo carpado!`,
				`**${caramuru.galoNome}** usou um golpe especial e **${uData.galoNome}** ficou sem entender nada!`,
				`**${caramuru.galoNome}** rasga o peito de **${uData.galoNome}** como se fosse manteiga!`,
				`**${uData.galoNome}** tentou usar *Raio Destruidor da Morte* em **${caramuru.galoNome}**, mas acaba errando e acerta o juiz.`,
				`**${uData.galoNome}** tenta acertar um *Fogo Sagrado da Conflagração* em **${caramuru.galoNome}**, erra por pouco e acerta a plateia!`,
				`**${uData.galoNome}** está paralizado e não consegue se mover!`,
				`**${uData.galoNome}** se sente lento e acaba errando diversos ataques.`,
				`**${uData.galoNome}** tenta usar uma técnica especial, mas **${caramuru.galoNome}** aproveita a abertura e desce a porrada.`,
				`Após receber diversos golpes, **${uData.galoNome}** está atordoado, mas ainda continua de pé!`,
				`Mesmo após atacar diversas vezes, **${uData.galoNome}** percebe que seu oponente ainda está de pé!`,
				`**${caramuru.galoNome}** usa seu bico afiado para trucidar os membros de **${uData.galoNome}**.`,
				`**${caramuru.galoNome}** aproveita a distância e joga diversas penas afiadas em **${uData.galoNome}**!`,
				`**${caramuru.galoNome}** gira em círculos e levanta muita poeira. Nâo há como ver nada!`,
				`**${uData.galoNome}** cai no chão com tanta força que Sismólogos acharam que era um terremoto!`,
				`Diversos xingamentos são proferidos por **${uData.username}** enquanto **${uData.galoNome}** se recusa a obedecer seus comandos!`,
				`Sendo o mestre dos mestres, **${caramuru.galoNome}** usa sua concentração para acertar um soco potente!`,
				`**${caramuru.galoNome}** consegue acertar uma boa sequência de chutes, bicadas, socos e penadas!`,
				`**${caramuru.galoNome}** pega várias pedras do chão e as atira em direção à **${uData.galoNome}**`,
				`**${uData.galoNome}** xinga a mãe de **${caramuru.galoNome}**! Ele não deixou barato e partiu pra cima!`,
				`**${uData.galoNome}** inicia uma dança espetacular de acasalamento, pensando que, talvez, seu oponente seja fêmea.`,
				`**${caramuru.galoNome}** ataca mais rápido do que os olhos conseguem ver!`,
				`**${caramuru.galoNome}** se transformou em Super Sayajin!`,
				`Por algum motivo, **${uData.galoNome}** esqueceu da luta e começou a ciscar o chão.`,
				`**${caramuru.galoNome}** corre em direção de **${uData.galoNome}**, dá um quádruplo carpado fodinha e finaliza o combo com um DUPLO MEGA ARRANHÃO FODÃO.`,
				`**${caramuru.galoNome}** reveste seu corpo com penas de kevlar, recebendo +20 DEF.`,
				`**${caramuru.galoNome}** levanta uma nuvem de poeira com suas asas, cegando temporariamente o **${uData.galoNome}**.`,
				`**${caramuru.galoNome}** prepara um golpe poderoso...`,
			]

			bot.shuffle(textos_luta)

			//gera textos de batalha
			const msg0 = new Discord.MessageEmbed().setDescription(textos_inicio[Math.floor(Math.random() * textos_inicio.length)]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg0]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`", err)), 3500)

			const msg1 = new Discord.MessageEmbed().setDescription(textos_luta[0]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg1]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`", err)), 6500)

			const msg2 = new Discord.MessageEmbed().setDescription(textos_luta[1]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg2]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`", err)), 9500)

			const msg3 = new Discord.MessageEmbed().setDescription(textos_luta[2]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg3]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`", err)), 12500)

			const msg4 = new Discord.MessageEmbed().setDescription(textos_luta[3]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg4]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`", err)), 15500)

			const msg5 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomCaramuru ? `**${uData.galoNome}** fez o impensável e **${caramuru.galoNome}** é derrotado!` : `**${caramuru.galoNome}** percebe que seu oponente é digno, e desaba satisfeito!`).setColor(bot.colors.background)

			const msg6 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomCaramuru ? `Obviamente, **${caramuru.galoNome}** mostrou para **${uData.galoNome}** o porquê de ainda ser o Top 1!` : `**${caramuru.galoNome}** vence com facilidade, mas deseja mais sorte ao novato, na próxima vez.`).setColor(bot.colors.background)

			setTimeout(() => message.channel.send({
				embeds: [desafianteVencedor ? msg5 : msg6]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`", err)), 18500)
			setTimeout(() => {
				currTime = new Date().getTime()
				uData = bot.data.get(message.author.id)

				let vencedor
				let perdedor
				let mensagemLevelUp
				let mensagemLevelDown

				// let ovosGanhos = bot.getRandom(50, 100)

				if (desafianteVencedor) {
					uData.moni += premio
					uData.galoW++
					// uData._ovo += ovosGanhos
					vencedor = uData
					perdedor = caramuru

					if (uData.galoPower >= 70)
						mensagemLevelUp = `**${vencedor.galoNome}** está no nível ${vencedor.galoPower - 30} e não pode mais upar`

					else {
						if (uData.galoPower == 69)
							uData.galoPower += 1
						else if (uData.galoPower == 68)
							uData.galoPower += 2
						else
							uData.galoPower += 3
						mensagemLevelUp = `**${vencedor.galoNome}** subiu para o nível ${vencedor.galoPower - 30}`
					}

					// mensagemLevelUp += `\n\n**${vencedor.galoNome}** ganhou ${bot.config.ovo} ${ovosGanhos} Ovos de páscoa do ${bot.config.caramuru} Caramuru`

				} else {
					uData.galoL++
					vencedor = caramuru
					perdedor = uData

					if (uData.galoPower >= 60) {
						uData.galoPower -= 1
						mensagemLevelDown = `**${perdedor.galoNome}** desceu para o nível ${perdedor.galoPower - 30}`
					}
				}
				const multiplicador_tempo_rinha = 1
				uData.tempoRinha = currTime + (7200000 * multiplicador_tempo_rinha)
				uData.galoEmRinha = false
				bot.data.set(message.author.id, uData)
				bot.data.set('526203502318321665', caramuru)

				setTimeout(() => {
					bot.users.fetch(message.author.id).then(user => {
						user.send(`Seu galo está pronto para outra batalha! ${bot.config.galo}`)
							.catch(err => message.reply(`seu galo está pronto para outra batalha! ${bot.config.galo}`)
								.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``));
					});
				}, uData.tempoRinha - currTime)

				const fimRinha = new Discord.MessageEmbed()
					.setDescription(`${bot.config.caramuru} **${vencedor.galoNome}** ganhou a rinha contra **${perdedor.galoNome}**!${vencedor == uData ? `\n**${vencedor.username}** recebeu R$ ${premio.toLocaleString().replace(/,/g, ".")}` : ``}`)
					.setColor('WHITE')
					.setThumbnail(vencedor.galoAvatar)
					.setFooter(bot.user.username, bot.user.avatarURL())
					.setTimestamp()

				if (mensagemLevelUp)
					fimRinha.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b', true)
				if (mensagemLevelDown)
					fimRinha.addField(`🔻 ${mensagemLevelDown}`, '\u200b', true)

				return message.channel.send({
					embeds: [fimRinha]
				}).catch(err => console.log("Não consegui enviar mensagem `galo boss fim`", err))
			}, 20000)
		}

	} else { // mostra info do galo do targetMention com @
		let tData = bot.data.get(targetMention.id)
		return bot.showGalo(message, tData, false)
	}
}
exports.config = {
	alias: ['g', 'rooster', 'cock']
};