const Discord = require("discord.js");
const wait = require('util').promisify(setTimeout);

exports.run = async (bot, message, args) => {
	// if (!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id)))
    //     return
	let currTime = new Date().getTime()
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let multiplicador_evento_chance_fuga = 1
	let uData = bot.data.get(message.author.id)
	let chanceBase = uData.classe == 'advogado' ? 15 : uData.classe == 'ladrao' ? 25 : 20
	let chanceJetpack = chanceBase + 30

	if (option == 'fugir' || option == 'f') {
		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)

		if (uData.fuga == uData.preso)
			return bot.createEmbed(message, `Os policiais estão te observando! ${bot.config.prisao}`, "Você não conseguirá fugir", bot.colors.policia)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.fugindo > currTime)
			return bot.createEmbed(message, `Você já está tentando fugir ${bot.config.prisao}`, 'Este tipo de coisa pede paciência', bot.colors.policia)

		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return

		let frasesSucesso = [
			'Durante o banho de sol você aproveita a distração dos policiais e consegue fugir pulando o muro da prisão',
			'Você cavou um túnel pequeno, mas que com muito esforço, te permite fugir',
			'Você percebeu que seu parceiro de cela está cavando um buraco no piso. Juntos vocês conseguiram fugir',
			'Enquanto te transferiam de cela, você percebe alguns portões abertos e consegue fugir',
			'Um detento começou uma rebelião, e no meio da confusão você consegue fugir'
		]

		let frasesSucessoCasal = [
			'Durante o banho de sol vocês aproveitam a distração dos policiais e conseguem fugir pulando o muro da prisão',
			'Vocês cavaram um túnel pequeno, mas que com muito esforço, os permite fugir',
			'Seu cônjuge começa a cavar um buraco no piso usando uma colher. Juntos vocês conseguiram fugir',
			'Enquanto te transferiam de cela, você percebe que seu cônjuge distraiu alguns policiais a deixar alguns portões abertos e conseguem fugir',
			'Um detento começou uma rebelião, e no meio da confusão vocês conseguem fugir'
		]

		let frasesSucessoJetpack = [
			`Mesmo com pouco combustível, sua ${bot.config.jetpack} Jetpack funcionou muito bem e você conseguiu fugir`,
			`Você utilizou sua ${bot.config.jetpack} Jetpack e apesar da dificuldade, consegue fugir sem sofrer nenhum arranhão`,
			`Sua ${bot.config.jetpack} Jetpack demorou pra pegar e chamou a atenção dos policiais, porém você consegue fugir`,
			`Durante o banho de sol você simplesmente liga sua ${bot.config.jetpack} Jetpack e foge voando sem problemas`,
			`Você usou as chamas da sua ${bot.config.jetpack} Jetpack para derreter as barras de ferro da janela e consegue fugir`
		]

		let frasesSucessoJetpackCasal = [
			`Mesmo com pouco combustível, suas ${bot.config.jetpack} Jetpacks funcionaram muito bem e vocês conseguiram fugir`,
			`Vocês utilizaran suas ${bot.config.jetpack} Jetpacks e apesar da dificuldade, conseguem fugir sem sofrer nenhum arranhão`,
			`Suas ${bot.config.jetpack} Jetpack demoraram pra pegar e chamaram a atenção dos policiais, porém vocês conseguem fugir`,
			`Durante o banho de sol vocês simplesmente ligam suas ${bot.config.jetpack} Jetpacks e fogem voando sem problemas`,
			`Vocês usaram as chamas das suas ${bot.config.jetpack} Jetpacks para derreter as barras de ferro da janela e conseguem fugir`
		]

		let frasesProcurado = [
			'está na sua cola!',
			'colocou os cães para te farejar!',
			'está fazendo buscas!',
			'já informou seu desaparecimento!',
			'está te procurando!'
		]

		let frasesProcuradoCasal = [
			'está nas suas colas!',
			'colocou os cães para farejar vocês!',
			'está fazendo buscas!',
			'já informou o desaparecimento de vocês!',
			'está procurando vocês!'
		]

		let frasesFracasso = [
			'Você tentou iniciar uma rebelião para conseguir fugir, mas um X9 te denunciou',
			'Você cavou um túnel pequeno, mas infelizmente a polícia descobriu',
			'Você tentou fazer outro detento refém, mas ele conseguiu escapar e avisar os policiais',
			'Durante o banho de sol, você tentou causar uma briga entre membros de gangue, os policiais não gostaram',
			'Você tentou serrar as barras da cela com uma lima, mas acabou fazendo muito barulho e alertando os policiais'
		]

		let frasesFracassoCasal = [
			'Vocês tentaram iniciar uma rebelião para conseguir fugir, mas um X9 os denunciou',
			'Vocês cavaram um túnel pequeno, mas infelizmente a polícia descobriu',
			'Vocês tentaram fazer outro detento refém, mas ele conseguiu escapar e avisar os policiais',
			'Durante o banho de sol, vocês tentaram causar uma briga entre membros de gangue, os policiais não gostaram',
			'Vocês tentaram serrar as barras da cela com uma lima, mas acabaram fazendo muito barulho e alertando os policiais'
		]

		let frasesFracassoJetpack = [
			`Você tentou voar com sua ${bot.config.jetpack} Jetpack, mas ela estava com pouco combustível e você desceu lentamente até os policiais`,
			`Você usou sua ${bot.config.jetpack} Jetpack para passar pelos portões, mas foi derrubado por uma barreira de choque`,
			`Você tenta ligar sua ${bot.config.jetpack} Jetpack para fugir, mas alertou os policias`,
			`Você se prepara para fugir com sua ${bot.config.jetpack} Jetpack, mas outro detento avisou os policiais`,
			`Você começa a voar com a ${bot.config.jetpack} Jetpack, mas outros detentos se agarram em você na esperança de fugir juntos, mas você é arrastado para o chão`,
		]

		let frasesFracassoJetpackCasal = [
			`Vocês tentaram voar com suas ${bot.config.jetpack} Jetpacks, mas elas estavam com pouco combustível e vocês desceram lentamente até os policiais`,
			`Vocês usaram suas ${bot.config.jetpack} Jetpacks para passar pelos portões, mas foram derrubados por uma barreira de choque`,
			`Vocês tentam ligar suas ${bot.config.jetpack} Jetpacks para fugir, mas alertaram os policias`,
			`Vocês se preparam para fugir com suas ${bot.config.jetpack} Jetpacks, mas outro detento avisou os policiais`,
			`Vocês começam a voar com as ${bot.config.jetpack} Jetpacks, mas outros detentos se agarram em vocês na esperança de fugir juntos, mas vocês são arrastados para o chão`,
		]

		let chance = bot.getRandom(0, 100)

		let tempoFugindo = 15000

		bot.data.set(message.author.id, currTime + 16000, 'fugindo')

		const fugaInicio = new Discord.MessageEmbed()
			.setAuthor('Fuga em andamento...', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'prisao').url)
			.setColor(bot.colors.policia)
			.setFooter(`${uData.username} • ${uData._jetpack > currTime ? `Com Jetpack` : `Sem Jetpack`}`, message.member.user.avatarURL())
			.setTimestamp()

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Participar')
				.setEmoji(bot.config.prisao)
				.setCustomId(message.id + 'participar'))

		let msgFuga = await message.channel.send({
			embeds: [fugaInicio],
			components: uData.casamentoID != null ? [row] : []
		})

		const filter = (button) => message.id + 'participar' == button.customId && button.user.id === uData.conjuge

		const collector = message.channel.createMessageComponentCollector({
			filter,
			time: tempoFugindo,
		});

		let isConjugeParticipando = false
		let conjuge = false

		let sucessoNecessario = uData._jetpack > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga

		collector.on('collect', async b => {
			await b.deferUpdate()
			let currTime = new Date().getTime()
			let cData = bot.data.get(uData.conjuge)

			if (isConjugeParticipando) return

			if (cData.preso < currTime)
				return bot.createEmbed(message, `${cData.username} não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)

			if (cData.fuga == cData.preso)
				return bot.createEmbed(message, `Os policiais estão te observando, ${cData.username}! ${bot.config.prisao}`, "Você não conseguirá fugir", bot.colors.policia)

			if (cData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, cData, cData.username)

			if (cData.fugindo > currTime)
				return bot.createEmbed(message, `Você já está tentando fugir, ${cData.username} ${bot.config.prisao}`, 'Este tipo de coisa pede paciência', bot.colors.policia)

			if (bot.isUserEmRouboOuEspancamento(message, cData)) return

			let uCasamento = bot.casais.get(uData.casamentoID)

			let bonus = currTime - uCasamento.viagem < 72 * 60 * 60 * 1000 ? 1.5 : 1

			chanceBase *= 1 + bot.aneis[uCasamento.anel].bonus * bonus / 100
			chanceJetpack = chanceBase + 30

			sucessoNecessario = uData._jetpack > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga
			let sucessoConjuge = cData._jetpack > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga

			sucessoNecessario = (sucessoNecessario + sucessoConjuge) / 2

			uCasamento.nivel += 1
			uCasamento.ultimoDecrescimo = 1
			isConjugeParticipando = true

			bot.data.set(cData.conjuge, currTime + 11000, 'fugindo')

			msgFuga.edit({
				components: [],
				embeds: [fugaInicio
					.setAuthor('Fuga em andamento... O amor pode tudo!', bot.guilds.cache.get('529674666692837378').emojis.cache.find(emoji => emoji.name == 'prisao').url)
					// .addField("Debug", `Chance base: ${chanceBase}\nSucesso necessarario: ${sucessoNecessario}\nSucesso conjuge: ${sucessoConjuge}\nChance calculada: ${chance}`)
					.setFooter(`${uData.username} e ${cData.username} • ${uData._jetpack > currTime ? `Com Jetpack` : `Sem Jetpack`} e ${cData._jetpack > currTime ? `com Jetpack` : `sem Jetpack`}`, message.member.user.avatarURL())
				]
			})

			bot.data.set(uData.conjuge, cData)
			bot.casais.set(uData.casamentoID, uCasamento)

			conjuge = bot.data.get(uData.conjuge)
		})

		let sucesso = (chance <= sucessoNecessario)

		await wait(tempoFugindo)

		uData = bot.data.get(message.author.id)

		uData.fugindo = 0

		if (sucesso) {
			uData.fuga = uData.preso
			uData.roubo = currTime + (uData.classe == 'advogado' ? 1530000 : 1800000) //+30m
			uData.preso = 0
			uData.qtFugas += 1

			bot.data.set(message.author.id, uData)

			const embedFinal = new Discord.MessageEmbed()
				.setTitle('Fuga bem sucedida!')
				.setColor(bot.colors.policia)
				.setDescription(`${uData._jetpack > currTime ? bot.shuffle(frasesSucessoJetpack)[0] : bot.shuffle(frasesSucesso)[0]}, mas a polícia ${bot.shuffle(frasesProcurado)[0]} ${bot.config.police}`)
				.setFooter(`${uData.username} • Espere 30 minutos para roubar novamente`, message.member.user.avatarURL())
				.setTimestamp()

			const embedFinalCasal = new Discord.MessageEmbed()
				.setTitle('Fuga bem sucedida!')
				.setColor(bot.colors.policia)
				.setDescription(`${uData._jetpack > currTime && conjuge._jetpack > currTime? bot.shuffle(frasesSucessoJetpackCasal)[0] : bot.shuffle(frasesSucessoCasal)[0]}, mas a polícia ${bot.shuffle(frasesProcuradoCasal)[0]} ${bot.config.police}`)
				.setFooter(`${uData.username} e ${conjuge.username} • Esperem 30 minutos para roubar novamente`, message.member.user.avatarURL())
				.setTimestamp()

			msgFuga.edit({
				components: [],
				embeds: isConjugeParticipando ? [embedFinalCasal] : [embedFinal]
			})

			const embedPV = new Discord.MessageEmbed()
				.setTitle(`${bot.config.roubar} Você já pode roubar novamente!`)
				.setColor(bot.colors.roubar)

			setTimeout(() => {
				message.author.send({
					embeds: [embedPV]
				}).catch(err => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
					.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Prisao Fugir\``))
			}, uData.roubo - currTime)

			if (isConjugeParticipando && conjuge) {
				conjuge = bot.data.get(uData.conjuge)
				conjuge.fuga = conjuge.preso
				conjuge.roubo = currTime + (conjuge.classe == 'advogado' ? 1530000 : 1800000) //+30m
				conjuge.preso = 0
				conjuge.qtFugas += 1
				conjuge.fugindo = 0
				bot.data.set(uData.conjuge, conjuge)

				setTimeout(() => {
					bot.users.fetch(uData.conjuge).then(user => {
						user.send({
							embeds: [embedPV]
						}).catch(er => `Não consegui enviar PV para ${uData.conjuge} \`Prisao Fugir\``)
					})
				}, conjuge.roubo - currTime)
			}

			const logF = new Discord.MessageEmbed()
				.setDescription(`**${uData.username} conseguiu fugir da prisão**`)
				.addField(`${bot.config.jetpack} Jetpack`, uData._jetpack > currTime ? `Sim` : `Não`, true)
				.setColor(bot.colors.policia)

			if (isConjugeParticipando && conjuge)
				logF.addField("Junto de seu conjuge", conjuge.username)
				.addField(`${bot.config.jetpack} Jetpack`, conjuge._jetpack > currTime ? `Sim` : `Não`, true)

			return bot.log(message, logF)

		} else {
			let chanceBaleado = bot.getRandom(0, 100)

			let atkPower = 0
			let atkPowerConjuge = 0
			Object.entries(uData).forEach(([key, value]) => {
				Object.values(bot.guns).forEach(arma => {
					if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data))
						atkPower = arma.atk
				})
			})
			if (isConjugeParticipando && conjuge) {
				Object.entries(conjuge).forEach(([key, value]) => {
					Object.values(bot.guns).forEach(arma => {
						if (value > currTime && arma.atk > atkPower && (key == "_" + arma.data))
							atkPowerConjuge = arma.atk
					})
				})
			}

			if (atkPowerConjuge > atkPower)
				atkPower = atkPowerConjuge

			let tempo_adicional = (0.5 * atkPower) * 1000 * 60
			uData.preso += 900000 + tempo_adicional // 15 min + adicional
			uData.fuga = uData.preso

			if (isConjugeParticipando && conjuge) {
				conjuge.preso += 900000 + tempo_adicional // 15 min + adicional
				conjuge.fuga = conjuge.preso
			}

			let tempoHospitalizado = (900000 + tempo_adicional) / 2
			if (chanceBaleado <= 10) {
				uData.hospitalizado = currTime + tempoHospitalizado
				uData.qtHospitalizado += 1

				if (isConjugeParticipando && conjuge) {
					conjuge.hospitalizado = currTime + tempoHospitalizado
					conjuge.qtHospitalizado += 1
				}

				const embedPV = new Discord.MessageEmbed()
					.setTitle(`${bot.config.hospital} Você está curado!`)
					.setColor(bot.colors.hospital)

				setTimeout(() => {
					message.author.send({
							embeds: [embedPV]
						})
						.catch(err => message.reply(`você está curado! ${bot.config.hospital}`)
							.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Prisao fugir\``))

					if (isConjugeParticipando && conjuge) {
						bot.users.fetch(uData.conjuge).then(user => {
							user.send({
									embeds: [embedPV]
								})
								.catch(err => message.channel.send(`<@${uData.conjuge}> você está curado! ${bot.config.hospital}`)
									.catch(er => `Não consegui responder ${bot.data.get(uData.conjuge, "username")} nem no PV nem no canal. \`Prisao fugir\``))
						})
					}
				}, uData.hospitalizado - currTime)
			}

			bot.data.set(message.author.id, uData)

			if (isConjugeParticipando && conjuge)
				bot.data.set(uData.conjuge, conjuge)

			const embed = new Discord.MessageEmbed()
				.setTitle('Fuga fracassada')
				.setColor(bot.colors.policia)
				.setDescription(`${uData._jetpack > currTime ? bot.shuffle(frasesFracassoJetpack)[0] : bot.shuffle(frasesFracasso)[0]}. Você ficará preso por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}! ${bot.config.prisao}`)
				.setFooter(`${uData.username} • Tempo preso: ${bot.segToHour((uData.preso - currTime) / 1000)}`, message.member.user.avatarURL())
				.setTimestamp()

			const embedCasal = new Discord.MessageEmbed()
				.setTitle('Fuga fracassada')
				.setColor(bot.colors.policia)
				.setDescription(`${uData._jetpack > currTime && conjuge._jetpack > currTime ? bot.shuffle(frasesFracassoJetpackCasal)[0] : bot.shuffle(frasesFracassoCasal)[0]}. Vocês ficarão presos por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}! ${bot.config.prisao}`)
				.setFooter(`${uData.username} • Tempo preso: ${bot.segToHour((uData.preso - currTime) / 1000)}\n${conjuge.username} • Tempo preso: ${bot.segToHour((conjuge.preso - currTime) / 1000)}`, message.member.user.avatarURL())
				.setTimestamp()

			if (chanceBaleado <= 10) {
				embed.addField('\u200b', `Você foi baleado e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado/1000)}. ${bot.config.hospital}`)
				embedCasal.addField('\u200b', `Vocês foram baleados e ficarão hospitalizados por ${bot.segToHour(tempoHospitalizado/1000)}. ${bot.config.hospital}`)
			}

			msgFuga.edit({
				components: [],
				embeds: isConjugeParticipando ? [embedCasal] : [embed]
			})

			const embedPV = new Discord.MessageEmbed()
				.setTitle(`${bot.config.prisao} Você está livre!`)
				.setColor(bot.colors.policia)

			setTimeout(() => {
				message.author.send({
						embeds: [embedPV]
					})
					.catch(err => message.reply(`você está livre! ${bot.config.prisao}`)
						.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Prisao\``))
			}, uData.preso - currTime)

			const logF = new Discord.MessageEmbed()
				.setDescription(`**${uData.username} não conseguiu fugir da prisão e ficará preso por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}**`)
				.addField(`${bot.config.jetpack} Jetpack`, uData._jetpack > currTime ? `Sim` : `Não`, true)
				.addField(`Baleado`, chanceBaleado <= 10 ? `Sim` : `Não`, true)
				.setColor(bot.colors.policia)

			if (isConjugeParticipando && conjuge)
				logF.addField("Junto de seu conjuge", conjuge.username)
				.addField(`${bot.config.jetpack} Jetpack`, conjuge._jetpack > currTime ? `Sim` : `Não`, true)

			return bot.log(message, logF)
		}


	} else if (option == 'subornar' || option == 's' || option == 'suborno') {
		let atkPower = 0
		Object.entries(uData).forEach(([key, value]) => {
			Object.values(bot.guns).forEach(arma => {
				if (value > currTime && arma.atk > atkPower && key == "_" + arma.data)
					atkPower = arma.atk
			})
		})

		let preço = Math.floor((20000 + (atkPower * (atkPower / 20)) ** 1.91) + (uData.moni * 0.1) + (uData.ficha * 80 * 0.1))

		if (uData.classe == 'advogado')
			preço = Math.floor(preço * 0.9)

		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
		if (uData.fugindo > currTime)
			return bot.createEmbed(message, `Você está tentando fugir e não pode subornar ${bot.config.prisao}`, 'Foco!', bot.colors.policia)
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.policia)

		const confirmed = new Discord.MessageEmbed()
			.setColor(bot.colors.policia)
			.setDescription(`"Assim que se faz! Caia fora daqui antes que mais alguém te veja." ${bot.config.police}`)
			.setFooter(`${uData.username} • Espere 30 minutos para fazer alguma besteira`, message.member.user.avatarURL())
			.setTimestamp()

		bot.createEmbed(message, `"Sabemos que você tem um certo dinheiro escondido aí... Nos dê **R$ ${preço.toLocaleString().replace(/,/g, ".")}** e deixaremos você sair de fininho." ${bot.config.police}\nConfirmar pagamento?`)
			.then(msg => {
				msg.react('✅').catch(err => console.log("Não consegui reagir mensagem `prisao`")).then(r => {
					const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id

					const confirm = msg.createReactionCollector({
						filter,
						max: 1,
						time: 30000
					})

					confirm.on('collect', r => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `prisao`"))
							.then(m => {
								uData = bot.data.get(message.author.id)
								currTime = new Date().getTime()
								if (uData.moni < preço)
									return bot.msgSemDinheiro(message)
								if (uData.preso < currTime)
									return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
								if (uData.fugindo > currTime)
									return bot.createEmbed(message, `Você está tentando fugir e não pode subornar ${bot.config.prisao}`, 'Foco!', bot.colors.policia)
								if (uData.hospitalizado > currTime)
									return bot.msgHospitalizado(message, uData)
								if (bot.isUserEmRouboOuEspancamento(message, uData))
									return
								if (bot.isGaloEmRinha(message.author.id))
									return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.policia)

								uData.moni -= preço
								uData.prisaoGastos += preço
								uData.roubo = currTime + (uData.classe == 'advogado' ? 1530000 : 1800000) // 30 min
								uData.preso = 0
								bot.data.set(message.author.id, uData)
								msg.edit({
									embeds: [confirmed]
								}).catch(err => console.log("Não consegui editar mensagem `prisao`"))

								return bot.log(message, new Discord.MessageEmbed()
									.setDescription(`**${uData.username} pagou suborno de R$ ${preço.toLocaleString().replace(/,/g, ".")} e ficou livre da prisão**`)
									.setColor(bot.colors.policia))
							})

					})
				})
			})
		// }

	} else {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.prisao} Prisão`) // de ${message.guild.name}
			.setDescription(`Ao tentar roubar alguém e falhar, você será preso por um tempo determinado pelo poder de sua arma.\nEstar preso limita muitas de suas ações no jogo, como trabalhar, investir, apostar, vasculhar, e claro, roubar.\nVocê pode tentar espancar outros presos.\nCaso falhe em fugir, há uma pequena chance de ser baleado e hospitalizado.`)
			.addField("Fugir", `Você tem ${chanceBase * multiplicador_evento_chance_fuga}% (${chanceJetpack * multiplicador_evento_chance_fuga}% se possuir uma ${bot.config.jetpack} **Jetpack**) de chance de fugir da prisão!\n\`;prisao fugir\``, true)
			.addField("Subornar", `Os guardas são gananciosos, e quanto melhor sua arma, mais eles pedirão!\n\`;prisao subornar\``, true)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/817102027183357992/prisao.png') //message.guild.iconURL()
			.setColor(bot.colors.policia)
			.setFooter(`${bot.user.username} • Clique na reação para abrir a lista de prisioneiros`, bot.user.avatarURL())
			.setTimestamp();

		message.channel.send({
			embeds: [embed]
		}).then(msg => {
			msg.react('817097391840296980').catch(err => console.log("Não consegui reagir mensagem `prisao`"))
				.then(() => {
					const filter = (reaction, user) => reaction.emoji.id === '817097391840296980' && user.id == message.author.id;
					const prisioneiros_ = msg.createReactionCollector({
						filter,
						time: 90000,
					});

					let presos = []
					let total = 0

					bot.data.indexes.forEach(user => {
						if (user != bot.config.adminID) { // && message.guild.members.cache.get(user)
							let uData = bot.data.get(user)
							if (uData.preso > currTime) {
								if (bot.users.fetch(user) != undefined)
									presos.push({
										nick: uData.username,
										tempo: uData.preso - currTime,
										vezes: uData.roubosL,
										fugiu: uData.qtFugas
									})
								total += 1
							}
						}
					})

					presos.sort((a, b) => b.tempo - a.tempo)

					const prisioneiros = new Discord.MessageEmbed()
						.setTitle(`${bot.config.prisao} Prisioneiros`)
						.setColor(bot.colors.background)

					if (presos.length > 0) {
						presos.forEach(preso => prisioneiros.addField(preso.nick, `Livre em ${bot.segToHour((preso.tempo / 1000))}\nPreso ${preso.vezes} vezes\nFugiu ${preso.fugiu} vezes`, true))
					} else
						prisioneiros.setDescription("Não há prisioneiros")

					// if (total == 1 || total == 4 || total == 7 || total == 10 || total == 13 || total == 16 || total == 19) {
					// 	prisioneiros.addField('\u200b', '\u200b', true)
					// 	prisioneiros.addField('\u200b', '\u200b', true)
					// } else if (total == 2 || total == 5 || total == 8 || total == 11 || total == 14 || total == 17 || total == 20) {
					// 	prisioneiros.addField('\u200b', '\u200b', true)
					// }

					prisioneiros_.on('collect', r => {
						message.channel.send({
							embeds: [prisioneiros]
						}).then(m => {
							if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `prisao`"))
						}).catch(err => console.log("Não consegui enviar mensagem `prisao`"))
					})
				})

		}).catch(err => console.log("Não consegui enviar mensagem `prisao`"))
	}
};
exports.config = {
	alias: ['p', 'cadeia', 'prison']
};