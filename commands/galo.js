const Discord = require("discord.js");
const Canvas = require('canvas')
exports.run = async (bot, message, args) => {
	let calcStats = (galo) => {
		return `ATK ${galo.power - 30} | DEF ${(galo.power - 30)/2}\nSPD ${((galo.power - 30)/3).toFixed(1)} | CRT ${((galo.power - 10)/3).toFixed(1)} %`
	}

	let getSituation = (galo) => {
		let situation = "Pronto para lutar!";

		if (galo.train == 1) {
			if (galo.trainTime - currTime < 0)
				situation = "Encerrou o treinamento";

			else
				situation = `Treinando por mais ${bot.segToHour((galo.trainTime - currTime) / 1000)}`;

		} else if (galo.descansar - currTime > 0 && galo.train == 0)
			situation = `${bot.segToHour((galo.descansar - currTime) / 1000)} até descansar`;

		else if (galo.emRinha)
			situation = "Participando de uma rinha"

		return situation
	}

	let showGalo = async ({
		message,
		id,
		isAuthor
	}) => {
		let galo = bot.galos.get(id)
		let user = bot.data.get(id)
		let currTime = new Date().getTime();
		if (!galo)
			return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.galo}`, null, bot.colors.white);

		let winrate = galo.wins + galo.loses > 0 ? (galo.wins / (galo.loses + galo.wins) * 100).toFixed(2) : '0';

		let textoBadge = ''
		if (user.badgePascoa2020_galo != undefined)
			textoBadge += bot.badges.galoelho
		if (user.badgeCampeaoCanja != undefined)
			textoBadge += bot.badges.campeao_canja
		if (user.badgeCoroamuruUniao != undefined)
			textoBadge += bot.badges.coroamuruUniao
		if (user.badgeBaileMandrake != undefined)
			textoBadge += bot.badges.mandrake

		let nacionalidade = 'Desconhecido'

		if ((!isAuthor && galo.nacionalidade) || isAuthor)
			nacionalidade = getRarity(galo)

		if (!nacionalidade)
			return

		// if (message.author.id != bot.config.adminID)
		// 	return message.reply("Comando em manutenção")

		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.galo} ${(galo.nome == "Galo" ? `Galo de ${user.username}` : galo.nome)}`)
			.setDescription(`${textoBadge}\n${(galo.titulo == '' ? "Garnizé" : galo.titulo)}`)
			.addField("Nível", (galo.power - 30).toString(), true)
			.addField("Chance de vitória", galo.power + "%", true)
			.addField("Raça e Nacionalidade", nacionalidade)
			.addField("Dados", `Vitórias: \`${galo.wins}\`\nDerrotas: \`${galo.loses}\`\nWin rate: \`${winrate}%\``, true)
			.addField("Stats", calcStats(galo), true)
			.addField("\u200b", `**${getSituation(galo)}**`)
			.setThumbnail(galo.avatar)
			.setColor(bot.colors.white)
			.setFooter(`Galo de ${user.username}`)
			.setTimestamp();

		if (user.username == "Cross Roads") embed.setTitle(`${bot.config.caramuru} Caramuru`)

		if (isAuthor) {
			const desconto = user.classe == 'mafioso' ? 0.95 : 1 // 1 = 0%, 0.7 = 30%
			let preco_whey = Math.floor((((galo.power - 29) * 5) ** 2.7) * desconto);

			message.channel.send({
					embeds: [embed],
				}).catch(err => console.log("Não consegui enviar mensagem `galo view`"))
				.then(msg => {

					const buttonWhey = new Discord.MessageButton()
						.setStyle('SECONDARY')
						.setLabel('Whey Protein')
						.setEmoji(bot.config.whey)
						.setCustomId(msg.id + 'whey')

					const buttonTreinar = new Discord.MessageButton()
						.setStyle('SECONDARY')
						.setLabel(galo.train ? 'Parar' : 'Treinar')
						.setEmoji('💪')
						.setCustomId(msg.id + 'treinar')


					if (galo.emRinha || (galo.power >= 60 && !galo.train) || (galo.descansar > currTime) || (uData.preso > currTime)) {
						buttonTreinar.setDisabled(true)
						buttonWhey.setDisabled(true)
					}

					if (galo.train && galo.trainTime < currTime) {
						buttonTreinar.setLabel('Concluir')
							.setStyle('SUCCESS')
					}

					if (galo.train)
						buttonWhey.setDisabled(true)

					const buttonEditar = new Discord.MessageButton()
						.setStyle('PRIMARY')
						.setLabel('Editar')
						.setEmoji(bot.config.galo)
						.setCustomId(msg.id + 'editar')

					const row = new Discord.MessageActionRow()
						.addComponents(buttonWhey)
						.addComponents(buttonTreinar)
					// .addComponents(buttonEditar)

					msg.edit({
						embeds: [embed],
						components: [row]
					})

					const filter = (button) => [
						msg.id + 'whey',
						msg.id + 'treinar',
						msg.id + 'editar',
						msg.id + 'confirmar',
					].includes(button.customId) && button.user.id === message.author.id

					const collector = message.channel.createMessageComponentCollector({
						filter,
						time: 60000,
					});

					collector.on('collect', async b => {
						await b.deferUpdate()

						if (b.customId == msg.id + 'whey') {
							if (msg) msg.edit({
								components: [new Discord.MessageActionRow()
									.addComponents(buttonWhey.setDisabled(true))
									.addComponents(buttonTreinar)
									// .addComponents(buttonEditar)
								]
							}).catch(err => console.log("Não consegui editar mensagem `galo whey`"))

							user = bot.data.get(message.author.id)
							galo = bot.galos.get(message.author.id)
							preco_whey = Math.floor((((galo.power - 29) * 5) ** 2.7) * desconto);

							if (galo.power >= 60)
								return bot.createEmbed(message, `Seu galo já está muito forte, e só subirá de nível ganhando rinhas ${bot.config.galo}`);
							if (galo.train == 1) {
								if (galo.trainTime > currTime)
									return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((galo.trainTime - currTime) / 1000)} e não pode consumir ${bot.config.whey} **Whey Protein** no momento ${bot.config.galo}`, null, bot.colors.white)
								else
									return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar ${bot.config.whey} **Whey Protein**${bot.config.galo}`, null, bot.colors.white)
							}

							// const comprarWhey = new Discord.MessageEmbed()
							// 	.setColor(bot.colors.background)
							// 	.setDescription(`Comprar ${bot.config.whey} **Whey Protein** para ${galo.nome}? Ele subirá para o nível ${galo.power - 30 + 1} ${bot.config.galo}\nPreço: R$ ${preco_whey.toLocaleString().replace(/,/g, ".")}`);

							const rowConfirmar = new Discord.MessageActionRow()
								.addComponents(new Discord.MessageButton()
									.setStyle('SUCCESS')
									.setLabel(`Comprar Whey Protein por R$ ${preco_whey.toLocaleString().replace(/,/g, ".")}`)
									.setEmoji(bot.config.whey)
									.setCustomId(msg.id + 'confirmar'))

							msg.edit({
								components: [rowConfirmar]
							}).catch(err => console.log("Não consegui enviar mensagem `galo whey`"))

						} else if (b.customId == msg.id + 'confirmar') {

							if (b.customId == msg.id + 'confirmar') {
								if (b.user.id !== message.author.id)
									return
								user = bot.data.get(message.author.id)
								galo = bot.galos.get(message.author.id)
								preco_whey = Math.floor(((galo.power - 29) * 5) ** 2.7)
								if (galo.train) {
									if (galo.trainTime > currTime)
										return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((galo.trainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, null, bot.colors.white)
									else
										return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, ';galo treinar', bot.colors.white)
								}

								if (galo.power >= 60)
									return bot.createEmbed(message, `Seu galo já está muito forte, e só subirá de nível ganhando rinhas ${bot.config.galo}`, null, bot.colors.white);
								if (user.moni < preco_whey)
									return bot.msgSemDinheiro(message);
								if (bot.isUserEmRouboOuEspancamento(message, user))
									return

								const comprarWheyConfirm = new Discord.MessageEmbed()
									.setColor(bot.colors.background)
									.setDescription(`Você comprou um ${bot.config.whey} **Whey Protein** para ${galo.nome} e ele subiu para o nível ${galo.power - 30 + 1} ${bot.config.galo}`);

								message.channel.send({
									embeds: [comprarWheyConfirm]
								}).catch(err => console.log("Não consegui mandar mensagem `galo whey comprado`"));

								// reset de estados
								buttonTreinar.setDisabled(false)
								buttonWhey.setDisabled(false)

								// Mesma coisa que la em cima, melhorar isso aqui, Jacobi
								if ((galo.train && galo.trainTime > currTime) || galo.emRinha || (galo.power >= 60 && galo.train) || (galo.descansar > currTime) || (uData.preso > currTime)) {
									buttonTreinar.setDisabled(true)
									buttonWhey.setDisabled(true)
								}

								if (galo.train && galo.trainTime < currTime) {
									buttonTreinar.setLabel('Concluir')
										.setStyle('SUCCESS')
								}

								const row = new Discord.MessageActionRow()
									.addComponents(buttonWhey)
									.addComponents(buttonTreinar)

								galo.power += 1;
								user.moni -= preco_whey;
								user.lojaGastos += preco_whey;

								embed.fields[0].value = `${galo.power - 30}`
								embed.fields[1].value = `${galo.power}%`
								embed.fields[4].value = calcStats(galo)

								if (msg) msg.edit({
									embeds: [embed],
									components: [row]
								})

								bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(preco_whey * bot.imposto));

								bot.data.set(message.author.id, user);
								bot.galos.set(message.author.id, galo)
							}

						} else if (b.customId == msg.id + 'treinar') {
							if (bot.isUserEmRouboOuEspancamento(message, uData))
								return

							let uGalo = bot.galos.get(message.author.id)

							if (buttonTreinar.label == 'Parar') {
								if (!uGalo.train)
									return bot.createEmbed(message, `Você não pode parar o que nem começou ${bot.config.galo}`, null, bot.colors.white)

								uGalo.train = 0
								uGalo.trainTime = 0
								uGalo.trainNotification = false

								bot.galos.set(message.author.id, uGalo)

								embed.fields[5].value = `**${getSituation(uGalo)}**`
								if (msg) msg.edit({
									embeds: [embed],
									components: [new Discord.MessageActionRow()
										.addComponents(buttonWhey.setDisabled(false))
										.addComponents(buttonTreinar.setLabel(uGalo.train ? 'Parar' : 'Treinar'))
										// .addComponents(buttonEditar)
									]
								}).catch(err => console.log("Não consegui editar mensagem `galo treinar`"))

								return
								// return bot.createEmbed(message, `**${uGalo.nome}** parou de treinar. Ele não subiu de nível ${bot.config.galo}`, null, bot.colors.white)
							}


							if (uGalo.emRinha)
								return bot.createEmbed(message, `Seu galo está em uma rinha e não pode treinar ${bot.config.galo}`, null, bot.colors.white)

							if (uGalo.power >= 60 && !uGalo.train)
								return bot.createEmbed(message, `**${uGalo.nome}** já superou seu mestre e treinar não irá aumentar seu nível ${bot.config.galo}`, null, bot.colors.white)

							if (uGalo.power >= 70)
								return bot.createEmbed(message, `**${uGalo.nome}** já está no nível máximo ${bot.config.galo}`, null, bot.colors.white)

							if (uGalo.train && uGalo.trainTime > currTime)
								return bot.createEmbed(message, `**${uGalo.nome}** está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)

							if (uGalo.descansar > currTime)
								return bot.msgGaloDescansando(message, uGalo)

							if (uData.preso > currTime)
								return bot.msgPreso(message, uData)

							if (uGalo.train && uGalo.trainTime < currTime) {
								uGalo.train = 0
								uGalo.trainTime = 0
								uGalo.power += 1
								uGalo.descansar = currTime + 600000 + ((uGalo.power - 30) * 60000) // 10 min + 1min por level
								bot.galos.set(message.author.id, uGalo)
								setTimeout(() => {
									message.author.send(`Seu galo descansou! Ele já pode treinar ou rinhar novamente! ${bot.config.galo}`)
										.catch(err => message.reply(`seu galo descansou! Ele já pode treinar ou rinhar novamente! ${bot.config.galo}`)
											.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``))
								}, uGalo.descansar - currTime)

								embed.fields[5].value = `**${getSituation(uGalo)}**`
								if (msg) msg.edit({
									embeds: [embed],
									components: [new Discord.MessageActionRow()
										.addComponents(buttonWhey)
										.addComponents(buttonTreinar.setLabel('Treinar').setStyle('SECONDARY').setDisabled(true))
										// .addComponents(buttonEditar)
									]
								}).catch(err => console.log("Não consegui editar mensagem `galo treinar`"))

								return bot.createEmbed(message, `**${uGalo.nome}** encerrou o treinamento. Ele subiu para o nível ${uGalo.power - 30} ${bot.config.galo}`, "Ele descansará por " + bot.segToHour((uGalo.descansar - currTime) / 1000), bot.colors.white)
							}

							const baseTime = 2400000 //40 minutos
							const multiplicador_tempo_treino = 1
							let trainTime = (baseTime + ((uGalo.power - 29) ** 2.3) * 1000 * 60) * multiplicador_tempo_treino + currTime
							//tempo de treino = (40 minutos + (nível do galo)^2.3) + tempo atual

							uGalo.trainTime = trainTime
							uGalo.train = 1

							let aviso = (Math.random() < 0.50 ? "" : "\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!")

							setTimeout(() => {
								bot.users.fetch(message.author.id).then(user => {
									user.send(`Seu galo encerrou o treinamento! ${bot.config.galo}`)
										.catch(err => message.reply(`seu galo encerrou o treinamento! ${bot.config.galo}${aviso}`)
											.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``))
								})
							}, trainTime - currTime)

							bot.galos.set(message.author.id, uGalo)


							embed.fields[5].value = `**${getSituation(uGalo)}**`
							if (msg) msg.edit({
								embeds: [embed],
								components: [new Discord.MessageActionRow()
									.addComponents(buttonWhey.setDisabled(uGalo.train))
									.addComponents(buttonTreinar.setLabel(uGalo.train ? 'Parar' : 'Treinar'))
									// .addComponents(buttonEditar)
								]
							}).catch(err => console.log("Não consegui editar mensagem `galo treinar`"))

							// return bot.createEmbed(message, `**${uGalo.nome}** treinará por ${bot.segToHour((trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)
							return
						}
					})
					collector.on('end', reaction => {
						if (msg)
							msg.edit({
								components: []
							}).catch(err => console.log("Não consegui editar mensagem `galo view`"));
					})
				});



		} else
			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo view`"));
	}

	let nacionalidades = [{
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇧🇷',
		pais: 'Brasil',
		gentilico: 'Brasileiro'
	}, {
		flag: '🇵🇹',
		pais: 'Portugal',
		gentilico: 'Português'
	}, {
		flag: '🇨🇦',
		pais: 'Canadá',
		gentilico: 'Canadense'
	}, {
		flag: '🇹🇷',
		pais: 'Turquia',
		gentilico: 'Turco'
	}, {
		flag: '🇯🇵',
		pais: 'Japão',
		gentilico: 'Japonês'
	}, {
		flag: '🇩🇪',
		pais: 'Alemanha',
		gentilico: 'Alemão'
	}, {
		flag: '🇪🇸',
		pais: 'Espanha',
		gentilico: 'Espanhol'
	}, {
		flag: '🇨🇴',
		pais: 'Colômbia',
		gentilico: 'Colombiano'
	}, {
		flag: '🇦🇺',
		pais: 'Austrália',
		gentilico: 'Australiano'
	}, {
		flag: '🇪🇬',
		pais: 'Egito',
		gentilico: 'Egípcio'
	}, {
		flag: '🇦🇷',
		pais: 'Argentina',
		gentilico: 'Argentino'
	}, {
		flag: '🇫🇷',
		pais: 'França',
		gentilico: 'Francês'
	}, {
		flag: '🇮🇹',
		pais: 'Itália',
		gentilico: 'Italiano'
	}, {
		flag: '🇸🇪',
		pais: 'Suécia',
		gentilico: 'Sueco'
	}, {
		flag: '🇲🇽',
		pais: 'México',
		gentilico: 'Mexicano'
	}, {
		flag: '🇸🇦',
		pais: 'Arábia Saudita',
		gentilico: 'Árabe'
	}, {
		flag: '🇦🇴',
		pais: 'Angola',
		gentilico: 'Angolano'
	}, {
		flag: '🇿🇦',
		pais: 'África do Sul',
		gentilico: 'Sul-africano'
	}, {
		flag: '🇺🇸',
		pais: 'Estados Unidos da América',
		gentilico: 'Estadunidense'
	}, {
		flag: '🇺🇬',
		pais: 'Uganda',
		gentilico: 'Ugandês'
	}, {
		flag: '🇧🇾',
		pais: 'Bielorrússia',
		gentilico: 'Bielorrusso'
	}, {
		flag: '🇷🇺',
		pais: 'Russia',
		gentilico: 'Russo'
	}, {
		flag: '🇵🇾',
		pais: 'Paraguai',
		gentilico: 'Paraguaio'
	}, {
		flag: '🇨🇺',
		pais: 'Cuba',
		gentilico: 'Cubano'
	}, {
		flag: '🇧🇴',
		pais: 'Bolívia',
		gentilico: 'Boliviano'
	}, {
		flag: '🇯🇲',
		pais: 'Jamaica',
		gentilico: 'Jamaicano'
	}]
	let raças = {
		comum: ['Boca-braba', 'Unha-preta', 'Combatente', 'Crista-mole', 'Rabo-sujo', 'Testa-dura', 'Pena-branca', 'Enzo', 'Caipira', 'Pintado'], // 10
		incomum: ['Shamo', 'Asyl', 'Ganoi', 'Tuzo', 'Malayo', 'Calcutá', 'Carijó', 'Skey', 'Sedoso', 'Rhode'], // 10
		raro: ['Pena-de-aço', 'Crista-resplandecente', 'Unha-d\'ouro', 'Galossauro', 'Cérberus', 'Puro-sangue', 'Estripador', 'Kadaknath'] // 78
	}
	let emojis = {
		'comum': '<:Comum:894353110401703987>',
		'incomum': '<:Incomum:894353110401695764>',
		'raro': '<:Raro:894353110271656016>',
		'lendario': '<:Lendario:894353110296838144>'
	}

	const getRarity = (uGalo) => {
		if (uGalo.raridade == undefined) {
			let rarity = generateRarity(uGalo)
			bot.createEmbed(message, `Você descobriu a raça e nacionalidade do seu galo!\n\n**${emojis[rarity.raridade]} ${rarity.raça} ${rarity.nacionalidade.gentilico} ${rarity.nacionalidade.flag}**`, null, bot.colors.white)
			return false
		}

		return `${emojis[uGalo.raridade]} ${uGalo.raça} ${uGalo.nacionalidade.gentilico} ${uGalo.nacionalidade.flag}`
	}

	const generateRarity = (uGalo) => {
		// let chance = bot.getRandom(0, 100)

		let raridade = 'comum'

		// if (chance > 90)
		// 	raridade = 'raro'
		// else if (chance > 60)
		// 	raridade = 'incomum'

		let raça = bot.shuffle(raças[raridade])[0]
		let nacionalidade = bot.shuffle(nacionalidades)[0]

		uGalo.raça = raça
		uGalo.nacionalidade = nacionalidade
		uGalo.raridade = raridade
		bot.galos.set(message.author.id, uGalo)
		return uGalo
	}

	// if (message.author.id !== bot.config.adminID) {
	// 	return message.reply("Comando em manutenção")
	// }

	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	let currTime = new Date().getTime()
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let aposta = args[1]
	let uData = bot.data.get(message.author.id)

	if (!targetMention && !["nome", "titulo", 'título', "info", "treinar", "avatar", "boss"].includes(option)) {

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
		else
			alvo = targetMention ? targetMention.id : message.author.id


		let tData = bot.data.get(alvo)
		if (!tData) return bot.createEmbed(message, "Este usuário não possui um inventário", null, bot.colors.white)

		bot.users.fetch(alvo).then(user => {
			alvo = user.id
		})

		return showGalo({
			message: message,
			id: alvo,
			isAuthor: alvo === message.author.id
		})

	}

	if (option == "nome") { // setar nome
		if (!aposta)
			return bot.createEmbed(message, `Insira um nome para seu galo ${bot.config.galo}`, ";galo nome <novo-nome>", bot.colors.white)

		let uGalo = bot.galos.get(message.author.id)

		option = args[0]
		let nome = args.join(" ").replace(option, "")

		let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{1,28}$/ugm

		if (nome.length > 28)
			return bot.createEmbed(message, `O nome escolhido é muito grande, escolha um menor ${bot.config.galo}`, "O limite é 28 caracteres", bot.colors.white)

		nome = args.join(" ").replace(option, "")
		nome = nome.substring(1, nome.length)

		if (!regex.test(nome))
			return bot.createEmbed(message, `Escolha outro nome ${bot.config.galo}`, `Este nome é inválido`, bot.colors.white)

		uGalo.nome = nome
		bot.galos.set(message.author.id, uGalo)

		return bot.createEmbed(message, `Você nomeou seu galo como **${uGalo.nome}** ${bot.config.galo}`, null, bot.colors.white)


	} else if (option == "titulo" || option == 'título') { // setar titulo
		if (!aposta)
			return bot.createEmbed(message, `Insira um título para seu galo ${bot.config.galo}`, ";galo titulo <novo-titulo>", bot.colors.white)

		let uGalo = bot.galos.get(message.author.id)

		// let titulo = args.join(" ").replace(option, "")
		// titulo = titulo.substring(1, titulo.length)

		option = args[0]
		let titulo = args.join(" ").replace(option, "")

		let regex = /^[a-zA-Z0-9 _!$.,%^&*()+=/\\]{1,100}$/ugm

		if (titulo.length > (uData.vipTime > currTime ? 200 : 100))
			return bot.createEmbed(message, `O título escolhido é muito grande, escolha um menor ${bot.config.galo}`, "O limite é 100 caracteres. VIPs possuem 200 caracteres de limite.", bot.colors.white)

		if (!regex.test(titulo))
			return bot.createEmbed(message, `Escolha outro título ${bot.config.galo}`, `Este título é inválido`, bot.colors.white)

		uGalo.titulo = titulo
		bot.galos.set(message.author.id, uGalo)
		return bot.createEmbed(message, `Você deu o título **${uGalo.titulo}** para seu galo ${bot.config.galo}`, null, bot.colors.white)

	} else if (option == "treinar") { // treinar galo para aumentar level
		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return

		let uGalo = bot.galos.get(message.author.id)

		if (aposta == "parar") {
			if (uGalo.train != 1)
				return bot.createEmbed(message, `Você não pode parar o que nem começou ${bot.config.galo}`, null, bot.colors.white)

			uGalo.train = 0
			uGalo.trainTime = 0
			uGalo.trainNotification = false

			bot.galos.set(message.author.id, uGalo)

			return bot.createEmbed(message, `**${uGalo.nome}** parou de treinar. Ele não subiu de nível ${bot.config.galo}`, null, bot.colors.white)
		}


		if (uGalo.emRinha == true)
			return bot.createEmbed(message, `Seu galo está em uma rinha e não pode treinar ${bot.config.galo}`, null, bot.colors.white)

		if (uGalo.power >= 60 && uGalo.train == 0)
			return bot.createEmbed(message, `**${uGalo.nome}** já superou seu mestre e treinar não irá aumentar seu nível ${bot.config.galo}`, null, bot.colors.white)

		if (uGalo.power >= 70)
			return bot.createEmbed(message, `**${uGalo.nome}** já está no nível máximo ${bot.config.galo}`, null, bot.colors.white)

		if (uGalo.train == 1 && uGalo.trainTime > currTime)
			return bot.createEmbed(message, `**${uGalo.nome}** está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)

		if (uGalo.descansar > currTime)
			return bot.msgGaloDescansando(message, uGalo)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uGalo.train == 1 && uGalo.trainTime < currTime) {
			uGalo.train = 0
			uGalo.trainTime = 0
			uGalo.power += 1
			uGalo.descansar = currTime + 600000 + ((uGalo.power - 30) * 60000) // 10 min + 1min por level
			bot.galos.set(message.author.id, uGalo)
			setTimeout(() => {
				bot.users.fetch(message.author.id).then(user => {
					user.send(`Seu galo descansou! Ele já pode treinar ou rinhar novamente! ${bot.config.galo}`)
						.catch(err => message.reply(`seu galo descansou! Ele já pode treinar ou rinhar novamente! ${bot.config.galo}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``))
				})
			}, uGalo.descansar - currTime)
			return bot.createEmbed(message, `**${uGalo.nome}** encerrou o treinamento. Ele subiu para o nível ${uGalo.power - 30} ${bot.config.galo}`, "Ele descansará por " + bot.segToHour((uGalo.descansar - currTime) / 1000), bot.colors.white)
		}

		const baseTime = 2400000 //40 minutos
		const multiplicador_tempo_treino = 0.5
		let trainTime = (baseTime + ((uGalo.power - 29) ** 2.3) * 1000 * 60) * multiplicador_tempo_treino + currTime
		//tempo de treino = (40 minutos + (nível do galo)^2.3) + tempo atual

		uGalo.trainTime = trainTime
		uGalo.train = 1

		let aviso = (Math.random() < 0.50 ? "" : "\nHabilite mensagens privadas com o Cross Roads e seja avisado sobre notificações importantes!")

		setTimeout(() => {
			bot.users.fetch(message.author.id).then(user => {
				user.send(`Seu galo encerrou o treinamento! ${bot.config.galo}`)
					.catch(err => message.reply(`seu galo encerrou o treinamento! ${bot.config.galo}${aviso}`)
						.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``))
			})
		}, trainTime - currTime)

		bot.galos.set(message.author.id, uGalo)
		return bot.createEmbed(message, `**${uGalo.nome}** treinará por ${bot.segToHour((trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)

	} else if (option == "info") { // ter infos sobre os galos
		//let uGalo = bot.galos.get(message.author.id)
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
			.setFooter(uData.username, message.member.user.avatarURL())
			.setTimestamp()

		return message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `galo info`"))

	} else if (option == "rinha") { // desafiar outros players
		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return
		//return bot.createEmbed(message, "As Rinhas foram desativadas devido a um bug. ${bot.config.galo}")

		if (!targetMention)
			return bot.createEmbed(message, `Você precisa escolher um jogador para rinhar ${bot.config.galo}`, ";galo rinha <valor> <@jogador>", bot.colors.white)

		let alvo = targetMention.user
		let uGalo = bot.galos.get(message.author.id)
		let tGalo = bot.galos.get(alvo.id)
		let tData = bot.data.get(alvo.id)

		if (!tGalo)
			return bot.createEmbed(message, `Este usuário não é um jogador ${bot.config.galo}`, null, bot.colors.white)

		if (message.author.id == targetMention.id)
			return bot.createEmbed(message, `Seu galo não pode lutar com ele mesmo ${bot.config.galo}`, null, bot.colors.white)

		if (uGalo.descansar > currTime)
			return bot.msgGaloDescansando(message, uGalo)

		if (tGalo.descansar > currTime)
			return bot.msgGaloDescansando(message, tGalo, tData.username)

		if (uGalo.train == 1) {
			if (uGalo.trainTime > currTime)
				return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)
			else
				return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de começar uma rinha ${bot.config.galo}`, null, bot.colors.white)
		}

		if (tGalo.train == 1) {
			if (tGalo.trainTime > currTime)
				return bot.createEmbed(message, `O galo de ${tData.username} está treinando por mais ${bot.segToHour((tGalo.trainTime - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)
			else
				return bot.createEmbed(message, `O galo de ${tData.username} terminou o treinamento. Ele deve concluí-o antes de começar uma rinha ${bot.config.galo}`, null, bot.colors.white)
		}

		if (uGalo.emRinha)
			return bot.createEmbed(message, `Seu galo já está em uma rinha ${bot.config.galo}`, null, bot.colors.white)
		if (tGalo.emRinha)
			return bot.createEmbed(message, `O galo de ${tData.username} já está em uma rinha ${bot.config.galo}`, null, bot.colors.white)

		if (uData.moni < 1)
			return bot.msgSemDinheiro(message)

		if (tData.moni < 1)
			return bot.msgSemDinheiro(message, tData.username)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (tData.preso > currTime)
			return bot.msgPreso(message, tData, tData.username)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (tData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, tData, tData.username)

		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return

		if (bot.isAlvoEmRouboOuEspancamento(message, tData))
			return

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

		if (uGalo.nome == '' || uGalo.nome == 'Galo')
			uGalo.nome = `Galo de ${uData.username}`

		if (tGalo.nome == '' || tGalo.nome == 'Galo')
			tGalo.nome = `Galo de ${tData.username}`

		// if (uData.preso > currTime && uData.celular > currTime)

		if (alvo.id == '526203502318321665')
			return bot.createEmbed(message, `Para desafiar o ${bot.config.caramuru} Caramuru, use \`;galo boss desafiar\``, null, bot.colors.white)

		let respondeu = false

		bot.galos.set(message.author.id, true, 'emRinha')
		bot.galos.set(alvo.id, true, 'emRinha')

		bot.createEmbed(message, `**${uData.username}** desafiou **${tData.username}** para uma rinha 1x1 valendo R$ ${parseInt(aposta).toLocaleString().replace(/,/g, ".")} ${bot.config.galo}\nClique em <:positive:572134588340633611> para aceitar ou <:negative:572134589863034884> para recusar`, `60 segundos para responder`, bot.colors.white)
			.then(msg => {
				msg.react('572134588340633611') // aceitar
					.then(() => msg.react('572134589863034884')) // negar
					.catch(err => console.log("Não consegui reagir mensagem `galo rinha`"))

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

							bot.galos.set(message.author.id, false, 'emRinha')
							bot.galos.set(alvo.id, false, 'emRinha')

							if (uData.moni < 1)
								return bot.msgSemDinheiro(message)

							if (tData.moni < 1)
								return bot.msgSemDinheiro(message, tData.username)

							if (uData.preso > currTime)
								return bot.msgPreso(message, uData)

							if (tData.preso > currTime)
								return bot.msgPreso(message, tData, tData.username)

							if (uData.hospitalizado > currTime)
								return bot.msgHospitalizado(message, uData)

							if (tData.hospitalizado > currTime)
								return bot.msgHospitalizado(message, tData, tData.username)

							if (bot.isPlayerMorto(tData))
								return bot.msgPlayerMorto(message, tData.username);

							if (bot.isPlayerViajando(tData))
								return bot.msgPlayerViajando(message, tData.username);

							if (parseFloat(uData.moni) < aposta)
								return bot.msgDinheiroMenorQueAposta(message)

							if (parseFloat(tData.moni) < aposta)
								return bot.msgDinheiroMenorQueAposta(message, tData.username)

							if (bot.isUserEmRouboOuEspancamento(message, uData))
								return

							if (bot.isAlvoEmRouboOuEspancamento(message, tData))
								return

							bot.galos.set(message.author.id, true, 'emRinha')
							bot.galos.set(alvo.id, true, 'emRinha')

							const inicioRinha = new Discord.MessageEmbed()
								.setDescription(`${bot.config.galo} **${tData.username}** aceitou o desafio!`)
								.setColor(bot.colors.white)
								.setFooter(`${bot.user.username} • Valendo R$ ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())
								.setTimestamp()

							message.channel.send({
								embeds: [inicioRinha]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha`"))

							let randomDesafiante = bot.getRandom(1, 100)
							let randomDesafiado = bot.getRandom(1, 100)

							let desafianteVencedor = (randomDesafiante * uGalo.power) > (randomDesafiado * tGalo.power)

							let textos_inicio = [
								`**${uGalo.nome}** começa a luta atacando **${tGalo.nome}** no queixo!`,
								`**${tGalo.nome}** começa a luta atacando **${uGalo.nome}** no queixo!`,
								`**${tGalo.nome}** provoca **${uGalo.nome}** chamando ele de galinha!`,
								`**${uGalo.nome}** provoca **${tGalo.nome}** chamando ele de galinha!`,
								`**${uGalo.nome}** falou que é filho do ${bot.config.caramuru} **Caramuru**!`,
								`**${tGalo.nome}** falou que é filho do ${bot.config.caramuru} **Caramuru**!`,
								`**${uGalo.nome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
								`**${tGalo.nome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
								`**${uGalo.nome}** disse que rinha é igual bumerangue, tudo que vai, volta.`,
								`**${tGalo.nome}** disse que rinha é igual bumerangue, tudo que vai, volta.`,
								`**${uGalo.nome}** se vangloria de todas suas cicatrizes!`,
								`**${tGalo.nome}** se vangloria de todas suas cicatrizes!`,
								`**${uGalo.nome}** inicia a luta puxando a crista de **${tGalo.nome}**!`,
								`**${tGalo.nome}** inicia a luta puxando a crista de **${uGalo.nome}**!`,
								`**${uGalo.nome}** provoca falando que terá canja de **${tGalo.nome}** no jantar!`,
								`**${tGalo.nome}** provoca falando que terá canja de **${uGalo.nome}** no jantar!`,
								`**${uGalo.nome}** fala que hoje vai ter tripa do **${tGalo.nome}** com pinga no buteco da esquina!`,
								`**${tGalo.nome}** fala que hoje vai ter tripa do **${uGalo.nome}** com pinga no buteco da esquina!`,
								`**${uGalo.nome}** põe tocar um rock paulera pra se motivar!`,
								`**${tGalo.nome}** põe tocar um rock paulera pra se motivar!`,
								`É notório que **${uGalo.nome}** está com pena de **${tGalo.nome}**!`,
								`É notório que **${tGalo.nome}** está com pena de **${uGalo.nome}**!`,
								`**${uGalo.nome}** cacareja muito alto e **${tGalo.nome}** se sente ameaçado!`,
								`**${tGalo.nome}** cacareja muito alto e **${uGalo.nome}** se sente ameaçado!`,
								`**${uGalo.nome}** entra na arena com uma rosa em sua boca!`,
								`**${tGalo.nome}** entra na arena com uma rosa em sua boca!`,
								`**${uGalo.nome}** diz: *"Você quer me matar? Você não seria capaz nem de matar meu tédio!"*, mas tudo que podemos escutar é *"có có cóóó"*.`,
								`**${tGalo.nome}** diz: *"Você quer me matar? Você não seria capaz nem de matar meu tédio!"*, mas tudo que podemos escutar é *"có có cóóó"*.`,
								`**${uGalo.nome}** diz que será o galo que superará o temido ${bot.config.caramuru} **Caramuru**!`,
								`**${tGalo.nome}** diz que será o galo que superará o temido ${bot.config.caramuru} **Caramuru**!`,
								`**${uGalo.nome}** diz: *"Não comece uma luta se você não pode terminá-la"*, mas a arena é tão grande que **${tGalo.nome}** não escutou.`,
								`**${tGalo.nome}** diz: *"Não comece uma luta se você não pode terminá-la"*, mas a arena é tão grande que **${uGalo.nome}** não escutou.`
							]

							let textos_luta = [
								`**${uGalo.nome}** voou por incríveis 2 segundos e deixou **${tGalo.nome}** perplecto!`,
								`**${tGalo.nome}** ciscou palha no olho de **${uGalo.nome}** e aproveitou para um ataque surpresa!`,
								`**${uGalo.nome}** arrancou o olho de **${tGalo.nome}**! Por sorte era o olho ruim.`,
								`**${tGalo.nome}** deu um rasante em **${uGalo.nome}** arrancando várias de suas penas!`,
								`**${uGalo.nome}** acertou um combo de 5 hits em **${tGalo.nome}**!`,
								`**${tGalo.nome}** aproveitou que **${uGalo.nome}** olhou para uma galinha da plateia e deu um mortal triplo carpado!`,
								`**${uGalo.nome}** usou um golpe especial e **${tGalo.nome}** ficou sem entender nada!`,
								`**${tGalo.nome}** apanha bastante, mas mostra para **${uGalo.nome}** que pau que nasce torto tanto bate até que fura!`,
								`**${uGalo.nome}** rasga o peito de **${tGalo.nome}** como se fosse manteiga!`,
								`**${tGalo.nome}** tentou usar *Raio Destruidor da Morte* em **${uGalo.nome}**, mas acaba errando e acerta o juiz.`,
								`**${uGalo.nome}** tenta acertar um *Fogo Sagrado da Conflagração* em **${tGalo.nome}**, erra por pouco e acerta a plateia!`,
								`**${tGalo.nome}** está paralizado e não consegue se mover!`,
								`**${uGalo.nome}** se sente lento e acaba errando diversos ataques.`,
								`A Polícia Federal adentra no recinto e todos ficam em pânico. Um dos policiais fala: "APOSTO MIL NO **${tGalo.nome.toUpperCase()}**"!`,
								`Pouco se importando com as regras, **${uGalo.nome}** pega uma ${bot.config.colt45} Colt 45 e atira em **${tGalo.nome}**.`,
								`**${tGalo.nome}** utiliza um *Z-Move* com **${tData.username}**, causando dano crítico em **${uGalo.nome}**!`,
								`**${uGalo.nome}** utiliza um *Z-Move* com **${uData.username}** em **${tGalo.nome}**. É super efetivo!`,
								`**${tGalo.nome}** tenta usar uma técnica especial, mas **${uGalo.nome}** aproveita a abertura e desce a porrada.`,
								`Após receber diversos golpes, **${uGalo.nome}** está atordoado, mas ainda continua de pé!`,
								`Mesmo após atacar diversas vezes, **${tGalo.nome}** percebe que seu oponente ainda está de pé!`,
								`**${uGalo.nome}** usa seu bico afiado para trucidar os membros de **${tGalo.nome}**.`,
								`**${tGalo.nome}** aproveita a distância e joga diversas penas afiadas em **${uGalo.nome}**!`,
								`**${uGalo.nome}** gira em círculos e levanta muita poeira. Nâo há como ver nada!`,
								`**${tGalo.nome}** cai no chão com tanta força que Sismólogos acharam que era um terremoto!`,
								`**${uGalo.nome}** derruba seu oponente no chão e sai cantando vitória. **${tGalo.nome}** aproveita a distração para atacar pelas costas!`,
								`Diversos xingamentos são proferidos por **${uData.username}** enquanto **${uGalo.nome}** se recusa a obedecer seus comandos!`,
								`Lembrando dos ensinamentos de seu mestre, **${tGalo.nome}** usa sua concentração para acertar um soco potente!`,
								`**${uGalo.nome}** consegue acertar uma boa sequência de chutes, bicadas, socos e penadas!`,
								`**${tGalo.nome}** pega várias pedras do chão e as atira em direção à **${uGalo.nome}**`,
								`**${uGalo.nome}** xinga a mãe de **${tGalo.nome}**! Ele não deixou barato e partiu pra cima!`,
								`**${tGalo.nome}** inicia uma dança espetacular de acasalamento, pensando que, talvez, seu oponente seja fêmea.`,
								`**${uGalo.nome}** apanha sua bíblia e começa a ler Êxodo 23:7 "Não se envolva em acusações falsas, e não mate o inocente e o justo, pois não vou declarar justo quem fizer o mal."`,
								`**${tGalo.nome}** ficou com tanto medo que botou um ovo...`,
								`**${uGalo.nome}** arremessa penas cortantes em **${tGalo.nome}**, mas acaba acertando **${tData.username}**.`,
								`Por algum motivo, **${tGalo.nome}** esqueceu da luta e começou a ciscar o chão.`,
								`**${uGalo.nome}** corre em direção de **${tGalo.nome}**, dá um duplo carpado fodinha e finaliza o combo com um MEGA ARRANHÃO FODÃO.`,
								`**${tGalo.nome}** reveste seu corpo com penas de latão, recebendo +5 DEF.`,
								`**${uGalo.nome}** levanta uma nuvem de poeira com suas asas, cegando temporariamente o **${tGalo.nome}**.`,
								`**${tGalo.nome}** prepara um golpe poderoso...`,
								`**${uGalo.nome}** prepara um golpe poderoso...`,
								`Uma nave alienígena aparece para abduzir **${tData.username}**, mas **${tGalo.nome}** protege seu dono e volta à rinha.`,
								`**${uGalo.nome}** começa a latir e **${tGalo.nome}** fica assustado.`,
								`**${tGalo.nome}** hipnotiza seu adversário, fazendo **${uGalo.nome}** dar um soco em seu mestre **${uData.username}**!`,
								`**${uGalo.nome}** utiliza um pedaço de vidro para refletir a luz na cara e cegar **${tGalo.nome}**!`,
								`**${tGalo.nome}** interrompe a luta e começa a tragar um cigarro. É o maldito Cocky Blinder.`,
								`**${uGalo.nome}** chamou **${tGalo.nome}** para um x1 de Pedra-Papel-Tesoura. Ambos perdem.`,
								`Um grupo de galinhas invade a rinha, distraindo os lutadores. **${uData.username}** e **${tData.username}** afugentam as galinhas para a luta continuar.`,
								`**${uGalo.nome}** ativa o instinto superior e desvia de todos os golpes de **${tGalo.nome}**.`,
								`**${tGalo.nome}** botou um ${bot.config.ovogranada2} Ovo-granada e o jogou em **${uGalo.nome}**, explodindo parte da arena com ele!`,
							]

							bot.shuffle(textos_luta)

							//gera textos de batalha
							const msg1 = new Discord.MessageEmbed().setDescription(textos_inicio[Math.floor(Math.random() * textos_inicio.length)]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg1]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 2000)

							if (uGalo.power == tGalo.power) {
								const msg2 = new Discord.MessageEmbed().setDescription(`**${uGalo.nome}** não sabe como atacar **${tGalo.nome}**! Eles já estão parados se encarando por 5 minutos!`).setColor(bot.colors.background)
								const msg3 = new Discord.MessageEmbed().setDescription(`Não há como prever quem ganhará esta rinha! Ambos os galos são incrivelmente e igualmente habilidosos!`).setColor(bot.colors.background)
								setTimeout(() => message.channel.send({
									embeds: [randomDesafiante >= randomDesafiado ? msg2 : msg3]
								}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 7000)

							} else {
								const msg4 = new Discord.MessageEmbed().setDescription(textos_luta[0]).setColor(bot.colors.background)
								setTimeout(() => message.channel.send({
									embeds: [msg4]
								}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 7000)
							}

							const msg5 = new Discord.MessageEmbed().setDescription(textos_luta[1]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg5]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 12000)

							const msg6 = new Discord.MessageEmbed().setDescription(textos_luta[2]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg6]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 17000)

							const msg7 = new Discord.MessageEmbed().setDescription(textos_luta[3]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg7]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 22000)

							const msg8 = new Discord.MessageEmbed().setDescription(textos_luta[4]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg8]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 27000)

							const msg9 = new Discord.MessageEmbed().setDescription(textos_luta[5]).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [msg9]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 32000)

							// const msgNew1 = new Discord.MessageEmbed().setDescription(textos_luta[6]).setColor(bot.colors.background)
							// setTimeout(() => message.channel.send(msgNew1), 37000)

							// const msgNew2 = new Discord.MessageEmbed().setDescription(textos_luta[7]).setColor(bot.colors.background)
							// setTimeout(() => message.channel.send(msgNew2), 42000)

							const msg10 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomDesafiado ? (randomDesafiante % 2 == 0 ? `**${tGalo.nome}** é arremessado para longe da arena, e **${uGalo.nome}** sai vitorioso ` : `**${uGalo.nome}** está implacável e **${tGalo.nome}** já não resiste mais!`) : `**${tGalo.nome}** sabe que sua derrota foi digna e vai ao chão!`).setColor(bot.colors.background)
							const msg11 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomDesafiado ? (randomDesafiante % 2 == 0 ? `**${uGalo.nome}** está tão machucado que é levado pra UTI às pressas` : `Os golpes de **${tGalo.nome}** são certeiros e **${uGalo.nome}** está ciente de sua derrota!`) : `**${uGalo.nome}** cai na lona com um sorriso no rosto, pois sabe que deu o seu melhor.`).setColor(bot.colors.background)
							setTimeout(() => message.channel.send({
								embeds: [desafianteVencedor ? msg10 : msg11]
							}).catch(err => console.log("Não consegui enviar mensagem `galo rinha msg`")), 37000)

							setTimeout(() => {
								currTime = new Date().getTime()
								uData = bot.data.get(message.author.id)
								tData = bot.data.get(alvo.id)
								uGalo = bot.galos.get(message.author.id)
								tGalo = bot.galos.get(alvo.id)

								let vencedor
								let perdedor
								let vencedorU
								let perdedorU
								let mensagemLevelUp
								let mensagemLevelDown

								// let ovosGanhos = bot.getRandom(1, 10)

								if (desafianteVencedor) {
									uData.moni += parseInt(aposta)
									tData.moni -= parseInt(aposta)
									uGalo.wins++

									// uData._ovo += ovosGanhos

									tGalo.loses++
									vencedor = uGalo
									perdedor = tGalo
									vencedorU = uData
									perdedorU = tData

									if (tGalo.power >= 60) {
										tGalo.power -= 1
										mensagemLevelDown = `**${perdedor.nome}** desceu para o nível ${perdedor.power - 30}`
									}

									if (uGalo.power >= 70)
										mensagemLevelUp = `**${vencedor.nome}** está no nível ${vencedor.power - 30} e não pode mais upar`

									else {
										uGalo.power++
										mensagemLevelUp = `**${vencedor.nome}** subiu para o nível ${vencedor.power - 30}`
									}

								} else {
									tData.moni += parseInt(aposta)
									uData.moni -= parseInt(aposta)
									tGalo.wins++

									// tData._ovo += ovosGanhos

									uGalo.loses++
									vencedor = tGalo
									perdedor = uGalo
									vencedorU = tData
									perdedorU = uData

									if (uGalo.power >= 60) {
										uGalo.power -= 1
										mensagemLevelDown = `**${perdedor.nome}** desceu para o nível ${perdedor.power - 30}`
									}

									if (tGalo.power >= 70)
										mensagemLevelUp = `**${vencedor.nome}** está no nível ${vencedor.power - 30} e não pode mais upar`

									else {
										tGalo.power++
										mensagemLevelUp = `**${vencedor.nome}** subiu para o nível ${vencedor.power - 30}`
									}
								}

								// mensagemLevelUp += `\n\n**${vencedor.galoNome}** ganhou ${bot.config.ovo} ${ovosGanhos} Ovos de páscoa do ${bot.config.caramuru} Caramuru`

								const multiplicador_tempo_rinha = 0.5
								uGalo.descansar = currTime + (1800000 * multiplicador_tempo_rinha)
								uGalo.emRinha = false
								tGalo.descansar = currTime + (1800000 * multiplicador_tempo_rinha)
								tGalo.emRinha = false
								bot.data.set(message.author.id, uData)
								bot.data.set(targetMention.id, tData)
								bot.galos.set(message.author.id, uGalo)
								bot.galos.set(targetMention.id, tGalo)

								setTimeout(() => {
									bot.users.fetch(message.author.id).then(user => {
										user.send(`Seu galo está pronto para outra batalha! ${bot.config.galo}`)
											.catch(err => message.reply(`seu galo está pronto para outra batalha! ${bot.config.galo}`)
												.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``));
									});
								}, uGalo.descansar - currTime)

								setTimeout(() => {
									bot.users.fetch(targetMention.id).then(user => {
										user.send(`Seu galo está pronto para outra batalha! ${bot.config.galo}`)
											.catch(err => console.log(`Não consegui mandar mensagem privada para ${user.username} (${targetMention.id})`))
									});
								}, tGalo.descansar - currTime)

								//bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(parseInt(aposta) * bot.imposto))

								const fimRinha = new Discord.MessageEmbed()
									.setDescription(`${bot.config.galo} **${vencedor.nome}** ganhou a rinha contra **${perdedor.nome}**!\n**${vencedorU.username}** recebeu R$ ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}`)
									.setColor('WHITE')
									.setThumbnail(vencedor.avatar)
									.setFooter(bot.user.username, bot.user.avatarURL())
									.setTimestamp()

								const log = new Discord.MessageEmbed()
									.setDescription(`${bot.config.galo} **${vencedorU.username} ganhou a rinha contra ${perdedorU.username}!**`)
									.addField("Aposta", "R$" + parseInt(aposta).toLocaleString().replace(/,/g, "."), true)
									.setColor(bot.colors.white)

								if (mensagemLevelUp) {
									fimRinha.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b', true)
									log.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b', true)
								}
								if (mensagemLevelDown) {
									fimRinha.addField(`🔻 ${mensagemLevelDown}`, '\u200b', true)
									log.addField(`🔻 ${mensagemLevelDown}`, '\u200b', true)
								}

								bot.log(message, log)


								// CONVITE EVENTO
								// if (uGalo.power > 40 && tGalo.power > 40) {
								// 	let texto_convite = `Parabéns pela vitória, ${vencedorU.username} e ${vencedor.nome}! Vocês foram convidados para participar dos torneios **Canja de Galinha das Américas** e **Canjica de Galinha Sul-América**. ${bot.config.galo}\n\nCada torneio terá 16 participantes e os vencedores levarão para casa R$ 100.000!\n\nOs vencedores se enfrentarão na **Supercopa das Canjas** que terá premiação de R$ 200.000 + badge ${bot.badges.campeao_canja} exclusiva para o galo!\n\nPara se inscreverem, encontrem a categoria \`🐓 TORNEIO\` no servidor oficial do Cross Roads (\`;convite\`) e no canal \`#arena\`, mencione o moderador **SFoster** e mande um _printscreen_ deste convite.`
								// 	if (vencedorU == uData) {
								// 		message.author.send(texto_convite)
								// 			.catch();
								// 	} else {
								// 		bot.users.fetch(targetMention.id).then(user => {
								// 			user.send(texto_convite)
								// 				.catch();
								// 		});
								// 	}
								// }

								return message.channel.send({
									embeds: [fimRinha]
								}).catch(err => console.log("Não consegui enviar mensagem `galo fim rinha`"))
							}, 38000)

						} else if (reaction.emoji.id === '572134589863034884') {
							bot.galos.set(message.author.id, false, 'emRinha')
							bot.galos.set(alvo.id, false, 'emRinha')

							bot.log(message, new Discord.MessageEmbed()
								.setDescription(`${bot.config.galo} **${tData.username} recusou a rinha de ${tData.username}**`)
								.addField("Aposta", "R$" + parseInt(aposta).toLocaleString().replace(/,/g, "."), true)
								.setColor(bot.colors.white))

							return bot.createEmbed(message, `**${tData.username}** recusou o desafio. Que galinha! ${bot.config.galo}`, null, bot.colors.white)
						}
					}).catch(err => console.log("Não consegui remover as reações mensagem `galo`"))
				})

				collector.on('end', async response => {
					// if (msg) msg.reactions.removeAll()
					bot.galos.set(message.author.id, false, 'emRinha')
					bot.galos.set(alvo.id, false, 'emRinha')

					bot.log(message, new Discord.MessageEmbed()
						.setDescription(`${bot.config.galo} **${tData.username} não respondeu o desafio de ${tData.username}**`)
						.addField("Aposta", "R$" + parseInt(aposta).toLocaleString().replace(/,/g, "."), true)
						.setColor(bot.colors.white))

					if (!respondeu)
						return bot.createEmbed(message, `**${tData.username}** não respondeu. Ele está offline ou é um frangote. ${bot.config.galo}`, null, bot.colors.white)
				})
			})

	} else if (option == "avatar") { // trocar avatar do galo

		let uGalo = bot.galos.get(message.author.id)

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

		if (bot.isAdmin(message.author.id)) {

			const embed = new Discord.MessageEmbed()
				.setDescription("Carregando avatares...")

			let p1 = new Date().getTime();
			let msg = await message.channel.send({
				embeds: [embed]
			})


			let avatares = [
				[
					await Canvas.loadImage('./img/Galos/galo1.png'),
					await Canvas.loadImage('./img/Galos/galo2.png'),
					await Canvas.loadImage('./img/Galos/galo3.png'),
					await Canvas.loadImage('./img/Galos/galo4.png'),
				],
				[
					await Canvas.loadImage('./img/Galos/galo5.png'),
					await Canvas.loadImage('./img/Galos/galo6.png'),
					await Canvas.loadImage('./img/Galos/galo7.png'),
					await Canvas.loadImage('./img/Galos/galo8.png'),
				],
				[
					await Canvas.loadImage('./img/Galos/galo9.png'),
					await Canvas.loadImage('./img/Galos/galo10.png'),
					await Canvas.loadImage('./img/Galos/galo11.png'),
					await Canvas.loadImage('./img/Galos/galo12.png')
				],
				//VIPS
				[
					await Canvas.loadImage('./img/Galos/galo_vip1.gif'),
					await Canvas.loadImage('./img/Galos/galo_vip2.gif'),
					await Canvas.loadImage('./img/Galos/galo_vip3.gif'),
					await Canvas.loadImage('./img/Galos/galo_vip4.gif')
				],
				[
					await Canvas.loadImage('./img/Galos/galo_vip5.gif'),
					await Canvas.loadImage('./img/Galos/galo_vip6.gif'),
					await Canvas.loadImage('./img/Galos/galo_vip7.gif'),
					await Canvas.loadImage('./img/Galos/galo_vip8.gif')
				],

			]

			let quantidadeX = avatares.length
			let quantidadeY = avatares[0].length


			const canvas = Canvas.createCanvas(quantidadeY * 128, quantidadeX * 128);
			const context = canvas.getContext('2d');

			avatares.forEach((linha, idxL) => {
				linha.forEach((col, idxC) => {
					context.drawImage(col,
						idxC * canvas.width / (quantidadeY),
						idxL * canvas.height / (quantidadeX),
						canvas.width / (quantidadeY),
						canvas.height / (quantidadeX)
					)
				})
				// context.drawImage(avatar,
				// 	idx * canvas.width / (quantidade / (idx % 3)),
				// 	idx * canvas.height / (quantidade / (idx % 3)),
				// 	canvas.width / (quantidade / 3),
				// 	canvas.height / (quantidade / 3)
				// )

			})


			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'galos.png');
			embed.setDescription(`${Math.round(new Date().getTime() - p1)}ms`)

			return msg.edit({
				embeds: [embed],
				files: [attachment]
			});
		}

		if (!aposta) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.galo} Avatar de ${uGalo.nome}`)
				.setDescription("Utilize `;galo avatar [id]` para alterar o avatar do seu galo.")
				.setColor(bot.colors.white)
				.setThumbnail(uGalo.avatar)
				//.setImage('https://cdn.discordapp.com/attachments/531174573463306240/754444969141469324/galos.png')
				.setImage('https://media.discordapp.net/attachments/531174573463306240/840347960956551178/galos.png')
				.setFooter(uData.username, message.member.user.avatarURL())
				.setTimestamp()

			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo avatar`"))

		} else {
			if (aposta < 1 || aposta > 20 || aposta % 1 != 0)
				return bot.createEmbed(message, `O ID deve ser entre 1 e 20 ${bot.config.galo}`, null, bot.colors.white)

			if (aposta >= 13 && aposta <= 20 && uData.vipTime < currTime)
				return bot.createEmbed(message, `Você precisa ser VIP para utilizar este avatar ${bot.config.galo}`, null, bot.colors.white)

			uGalo.avatar = galosImagens[aposta]
			bot.galos.set(message.author.id, uGalo)

			let textos = ["Olha que coisinha linda!", "Poderoso e imponente", "Que bunitinhu!!", "Winner winner, chicken dinner", "O barbeiro disse \"Corto cabelo e pinto\""]
			bot.shuffle(textos)

			const embed = new Discord.MessageEmbed()
				.setTitle(`Avatar de ${uGalo.nome} atualizado! ${bot.config.galo}`)
				.setDescription(textos[0])
				.setColor(bot.colors.white)
				.setThumbnail(uGalo.avatar)
				.setFooter(uData.username, message.member.user.avatarURL())
				.setTimestamp()

			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo avatar`"))
		}


	} else if (option == "boss") {
		let premio = 500000 //2000000
		if (!aposta) {
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
				.setTimestamp()

			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss`"))

		} else if (aposta == "desafiar") { // desafiar outros players
			let dia = new Date().getDay()
			let hora = new Date().getHours()

			if (dia != 0 && dia != 6 && !(dia == 5 && hora >= 20))
				return bot.createEmbed(message, `**Caramuru** só pode ser desafiado aos finais de semana ${bot.config.caramuru}`, null, bot.colors.white)

			// return bot.createEmbed(message, `**Caramuru** está de folga durante a primeira semana da temporada ${bot.config.caramuru}`, null, bot.colors.white)
			if (bot.isUserEmRouboOuEspancamento(message, uData))
				return
			let uGalo = bot.galos.get(message.author.id)
			let caramuru = bot.galos.get('526203502318321665')

			if (uGalo.descansar > currTime)
				return bot.msgGaloDescansando(message, uGalo)

			if (uGalo.train == 1) {
				if (uGalo.trainTime > currTime)
					return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} ${bot.config.caramuru}`, null, bot.colors.white)
				else
					return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de começar uma rinha ${bot.config.caramuru}`, null, bot.colors.white)
			}

			if (uGalo.emRinha == true)
				return bot.createEmbed(message, `Seu galo já está em uma rinha ${bot.config.caramuru}`, null, bot.colors.white)

			if (caramuru.emRinha == true)
				return bot.createEmbed(message, `Caramuru já está em uma rinha ${bot.config.caramuru}`, null, bot.colors.white)

			if (uData.preso > currTime)
				return bot.msgPreso(message, uData)

			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData)

			if (uData.job != null)
				return bot.msgTrabalhando(message, uData)

			if ((uGalo.wins + uGalo.loses) < 10)
				return bot.createEmbed(message, `Seu galo precisa participar de mais rinhas para desafiar o Caramuru ${bot.config.caramuru}`, null, bot.colors.white)

			if (uGalo.nome == '' || uGalo.nome == 'Galo')
				uGalo.nome = `Galo de ${uData.username}`

			bot.galos.set(message.author.id, true, 'emRinha')
			bot.createEmbed(message, `**${uData.username}** desafiou **Caramuru** para uma rinha 1x1 ${bot.config.caramuru}`, null, bot.colors.white)

			setTimeout(() => bot.createEmbed(message, `${bot.config.caramuru} **Caramuru** aceitou o desafio! O espetáculo tem início!`, null, bot.colors.white), 2000)

			let randomDesafiante = bot.getRandom(1, 100)
			let randomCaramuru = bot.getRandom(2, 100) // pra evitar derrotas críticas

			let desafianteVencedor = randomDesafiante * uGalo.power > randomCaramuru * caramuru.power

			let textos_inicio = [
				`**${caramuru.nome}** começa a luta atacando **${uGalo.nome}** no queixo!`,
				`**${caramuru.nome}** provoca **${uGalo.nome}** chamando ele de galinha!`,
				`**${uGalo.nome}** provoca **${caramuru.nome}** chamando ele de galinha!`,
				`**${caramuru.nome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
				`**${uGalo.nome}** disse que rinha é igual bumerangue, tudo que vai, volta.`,
				`**${caramuru.nome}** disse que rinha é igual bumerangue, tudo que vai, volta.`,
				`**${uGalo.nome}** se vangloria de todas suas cicatrizes!`,
				`**${caramuru.nome}** se vangloria de todas suas cicatrizes!`,
				`**${caramuru.nome}** inicia a luta puxando a crista de **${uGalo.nome}**!`,
				`**${uGalo.nome}** provoca falando que terá canja de **${caramuru.nome}** no jantar!`,
				`**${caramuru.nome}** provoca falando que terá canja de **${uGalo.nome}** no jantar!`,
				`**${caramuru.nome}** fica de braços cruzados esperando seu oponente atacar!`,
				`**${uGalo.nome}** está tremendo de medo!`,
				`**${caramuru.nome}** diz: *"Não comece uma luta se você não pode terminá-la"*.`,
				`**${caramuru.nome}** entra na arena com uma rosa em sua boca!`,
			]

			let textos_luta = [
				`**${caramuru.nome}** voou por incríveis 10 segundos e deixou **${uGalo.nome}** perplecto!`,
				`**${caramuru.nome}** ciscou palha no olho de **${uGalo.nome}** e aproveitou para um ataque surpresa!`,
				`**${caramuru.nome}** arrancou o olho de **${uGalo.nome}**! Infelizmente, era o olho bom.`,
				`**${caramuru.nome}** deu um rasante em **${uGalo.nome}** arrancando várias de suas penas!`,
				`**${caramuru.nome}** acertou um combo de 25 hits em **${uGalo.nome}**!`,
				`**${caramuru.nome}** aproveitou que **${uGalo.nome}** olhou para uma galinha da plateia e deu um mortal quádruplo carpado!`,
				`**${caramuru.nome}** usou um golpe especial e **${uGalo.nome}** ficou sem entender nada!`,
				`**${caramuru.nome}** rasga o peito de **${uGalo.nome}** como se fosse manteiga!`,
				`**${uGalo.nome}** tentou usar *Raio Destruidor da Morte* em **${caramuru.nome}**, mas acaba errando e acerta o juiz.`,
				`**${uGalo.nome}** tenta acertar um *Fogo Sagrado da Conflagração* em **${caramuru.nome}**, erra por pouco e acerta a plateia!`,
				`**${uGalo.nome}** está paralizado e não consegue se mover!`,
				`**${uGalo.nome}** se sente lento e acaba errando diversos ataques.`,
				`**${uGalo.nome}** tenta usar uma técnica especial, mas **${caramuru.nome}** aproveita a abertura e desce a porrada.`,
				`Após receber diversos golpes, **${uGalo.nome}** está atordoado, mas ainda continua de pé!`,
				`Mesmo após atacar diversas vezes, **${uGalo.nome}** percebe que seu oponente ainda está de pé!`,
				`**${caramuru.nome}** usa seu bico afiado para trucidar os membros de **${uGalo.nome}**.`,
				`**${caramuru.nome}** aproveita a distância e joga diversas penas afiadas em **${uGalo.nome}**!`,
				`**${caramuru.nome}** gira em círculos e levanta muita poeira. Nâo há como ver nada!`,
				`**${uGalo.nome}** cai no chão com tanta força que Sismólogos acharam que era um terremoto!`,
				`Diversos xingamentos são proferidos por **${uData.username}** enquanto **${uGalo.nome}** se recusa a obedecer seus comandos!`,
				`Sendo o mestre dos mestres, **${caramuru.nome}** usa sua concentração para acertar um soco potente!`,
				`**${caramuru.nome}** consegue acertar uma boa sequência de chutes, bicadas, socos e penadas!`,
				`**${caramuru.nome}** pega várias pedras do chão e as atira em direção à **${uGalo.nome}**`,
				`**${uGalo.nome}** xinga a mãe de **${caramuru.nome}**! Ele não deixou barato e partiu pra cima!`,
				`**${uGalo.nome}** inicia uma dança espetacular de acasalamento, pensando que, talvez, seu oponente seja fêmea.`,
				`**${caramuru.nome}** ataca mais rápido do que os olhos conseguem ver!`,
				`**${caramuru.nome}** se transformou em Super Sayajin!`,
				`Por algum motivo, **${uGalo.nome}** esqueceu da luta e começou a ciscar o chão.`,
				`**${caramuru.nome}** corre em direção de **${uGalo.nome}**, dá um quádruplo carpado fodinha e finaliza o combo com um DUPLO MEGA ARRANHÃO FODÃO.`,
				`**${caramuru.nome}** reveste seu corpo com penas de kevlar, recebendo +20 DEF.`,
				`**${caramuru.nome}** levanta uma nuvem de poeira com suas asas, cegando temporariamente o **${uGalo.nome}**.`,
				`**${caramuru.nome}** prepara um golpe poderoso...`,
			]

			bot.shuffle(textos_luta)

			//gera textos de batalha
			const msg0 = new Discord.MessageEmbed().setDescription(textos_inicio[Math.floor(Math.random() * textos_inicio.length)]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg0]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`")), 4000)

			const msg1 = new Discord.MessageEmbed().setDescription(textos_luta[0]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg1]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`")), 7000)

			const msg2 = new Discord.MessageEmbed().setDescription(textos_luta[1]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg2]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`")), 10000)

			const msg3 = new Discord.MessageEmbed().setDescription(textos_luta[2]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg3]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`")), 13000)

			const msg4 = new Discord.MessageEmbed().setDescription(textos_luta[3]).setColor(bot.colors.background)
			setTimeout(() => message.channel.send({
				embeds: [msg4]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`")), 16000)

			const msg5 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomCaramuru ? `**${uGalo.nome}** fez o impensável e **${caramuru.nome}** é derrotado!` : `**${caramuru.nome}** percebe que seu oponente é digno, e desaba satisfeito!`).setColor(bot.colors.background)

			const msg6 = new Discord.MessageEmbed().setDescription(randomDesafiante >= randomCaramuru ? `Obviamente, **${caramuru.nome}** mostrou para **${uGalo.nome}** o porquê de ainda ser o Top 1!` : `**${caramuru.nome}** vence com facilidade, mas deseja mais sorte ao novato, na próxima vez.`).setColor(bot.colors.background)

			setTimeout(() => message.channel.send({
				embeds: [desafianteVencedor ? msg5 : msg6]
			}).catch(err => console.log("Não consegui enviar mensagem `galo boss msg`")), 19000)

			setTimeout(() => {
				currTime = new Date().getTime()
				uData = bot.data.get(message.author.id)
				uGalo = bot.galos.get(message.author.id)

				let vencedor
				let perdedor
				let vencedorU
				let mensagemLevelUp
				let mensagemLevelDown

				// let ovosGanhos = bot.getRandom(50, 100)

				if (desafianteVencedor) {
					uData.moni += premio
					uGalo.wins++
					// uData._ovo += ovosGanhos
					vencedor = uGalo
					perdedor = caramuru
					vencedorU = uData

					if (uGalo.power >= 70)
						mensagemLevelUp = `**${vencedor.nome}** está no nível ${vencedor.power - 30} e não pode mais upar`

					else {
						if (uGalo.power == 69)
							uGalo.power += 1
						else if (uGalo.power == 68)
							uGalo.power += 2
						else
							uGalo.power += 3
						mensagemLevelUp = `**${vencedor.nome}** subiu para o nível ${vencedor.power - 30}`
					}

					// mensagemLevelUp += `\n\n**${vencedor.galoNome}** ganhou ${bot.config.ovo} ${ovosGanhos} Ovos de páscoa do ${bot.config.caramuru} Caramuru`

				} else {
					uGalo.loses++
					vencedor = caramuru
					perdedor = uGalo

					if (uGalo.power >= 60) {
						uGalo.power -= 1
						mensagemLevelDown = `**${perdedor.nome}** desceu para o nível ${perdedor.power - 30}`
					}
				}
				const multiplicador_tempo_rinha = 1
				uGalo.descansar = currTime + (7200000 * multiplicador_tempo_rinha)
				uGalo.emRinha = false
				bot.data.set(message.author.id, uData)
				bot.galos.set(message.author.id, uGalo)
				bot.galos.set('526203502318321665', caramuru)

				setTimeout(() => {
					bot.users.fetch(message.author.id).then(user => {
						user.send(`Seu galo está pronto para outra batalha! ${bot.config.galo}`)
							.catch(err => message.reply(`seu galo está pronto para outra batalha! ${bot.config.galo}`)
								.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Galo\``));
					});
				}, uGalo.descansar - currTime)

				const fimRinha = new Discord.MessageEmbed()
					.setDescription(`${bot.config.caramuru} **${vencedor.nome}** ganhou a rinha contra **${perdedor.nome}**!${vencedorU == uData ? `\n**${vencedorU.username}** recebeu R$ ${premio.toLocaleString().replace(/,/g, ".")}` : ``}`)
					.setColor('WHITE')
					.setThumbnail(vencedor.avatar)
					.setFooter(bot.user.username, bot.user.avatarURL())
					.setTimestamp()

				const log = new Discord.MessageEmbed()
					.setDescription(`${bot.config.caramuru} **${vencedorU == uData ? uData.username : 'Caramuru'} ganhou a rinha contra ${vencedorU == uData ? 'Caramuru' : uData.username}!**`)
					.addField("Prêmio", "R$" + premio.toLocaleString().replace(/,/g, "."), true)
					.setColor(bot.colors.white)

				if (mensagemLevelUp) {
					fimRinha.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b', true)
					log.addField(`<:small_green_triangle:801611850491363410> ${mensagemLevelUp}`, '\u200b', true)
				}
				if (mensagemLevelDown) {
					fimRinha.addField(`🔻 ${mensagemLevelDown}`, '\u200b', true)
					log.addField(`🔻 ${mensagemLevelDown}`, '\u200b', true)
				}

				bot.log(message, log)

				return message.channel.send({
					embeds: [fimRinha]
				}).catch(err => console.log("Não consegui enviar mensagem `galo boss fim`"))
			}, 20000)
		}

	} else { // mostra info do galo do targetMention com @
		return showGalo({
			message: message,
			id: targetMention.id,
			isAuthor: false
		})
	}
}
exports.config = {
	alias: ['g', 'rooster', 'cock']
};