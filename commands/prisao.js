const Discord = require("discord.js")
const wait = require('util').promisify(setTimeout)

exports.run = async (bot, message, args) => {
	// if (!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id)))
	//     return
	let currTime = new Date().getTime()
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let multiplicador_evento_chance_fuga = 1
	let uData = await bot.data.get(message.author.id)
	let chanceBase = uData.classe === 'advogado' ? 15 : uData.classe === 'ladrao' ? 25 : 20
	let chanceJetpack = chanceBase + 30

	if (option === 'fugir' || option === 'f') {
		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
		if (uData.fuga === uData.preso)
			return bot.createEmbed(message, `Os policiais estão te observando! ${bot.config.prisao}`, "Você não conseguirá fugir", bot.colors.policia)
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (uData.fugindo > currTime)
			return bot.createEmbed(message, `Você já está tentando fugir ${bot.config.prisao}`, 'Este tipo de coisa pede paciência', bot.colors.policia)
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
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
			`Mesmo com pouco combustível, sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack funcionou muito bem e você conseguiu fugir`,
			`Você utilizou sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack e apesar da dificuldade, consegue fugir sem sofrer nenhum arranhão`,
			`Sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack demorou pra pegar e chamou a atenção dos policiais, porém você consegue fugir`,
			`Durante o banho de sol você simplesmente liga sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack e foge voando sem problemas`,
			`Você usou as chamas da sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack para derreter as barras de ferro da janela e consegue fugir`
		]

		let frasesSucessoJetpackCasal = [
			`Mesmo com pouco combustível, suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks funcionaram muito bem e vocês conseguiram fugir`,
			`Vocês utilizaran suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks e apesar da dificuldade, conseguem fugir sem sofrer nenhum arranhão`,
			`Suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack demoraram pra pegar e chamaram a atenção dos policiais, porém vocês conseguem fugir`,
			`Durante o banho de sol vocês simplesmente ligam suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks e fogem voando sem problemas`,
			`Vocês usaram as chamas das suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks para derreter as barras de ferro da janela e conseguem fugir`
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
			`Você tentou voar com sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack, mas ela estava com pouco combustível e você desceu lentamente até os policiais`,
			`Você usou sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack para passar pelos portões, mas foi derrubado por uma barreira de choque`,
			`Você tenta ligar sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack para fugir, mas alertou os policias`,
			`Você se prepara para fugir com sua ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack, mas outro detento avisou os policiais`,
			`Você começa a voar com a ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack, mas outros detentos se agarram em você na esperança de fugir juntos, mas você é arrastado para o chão`,
		]

		let frasesFracassoJetpackCasal = [
			`Vocês tentaram voar com suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks, mas elas estavam com pouco combustível e vocês desceram lentamente até os policiais`,
			`Vocês usaram suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks para passar pelos portões, mas foram derrubados por uma barreira de choque`,
			`Vocês tentam ligar suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks para fugir, mas alertaram os policias`,
			`Vocês se preparam para fugir com suas ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks, mas outro detento avisou os policiais`,
			`Vocês começam a voar com as ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpacks, mas outros detentos se agarram em vocês na esperança de fugir juntos, mas vocês são arrastados para o chão`,
		]

		let chance = bot.getRandom(0, 100)

		let tempoFugindo = 15000

		await bot.data.set(message.author.id + '.fugindo', currTime + 16000,)

		const fugaInicio = new Discord.MessageEmbed()
			.setTitle(`${bot.config.prisao} Fuga em andamento...`)
			.setColor(bot.colors.policia)
			.setFooter(`${uData.username} • ${uData.arma.jetpack.tempo > currTime ? `Com Jetpack` : `Sem Jetpack`}`, message.member.user.avatarURL())
			.setTimestamp()

		let uCasamento = await bot.casais.get(uData.casamentoID?.toString())

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Participar')
				.setEmoji(bot.config.prisao)
				.setDisabled(uCasamento?.anel === null)
				.setCustomId('participar'))

		let msgFuga = await message.channel.send({
			embeds: [fugaInicio],
			components: uData.casamentoID != null ? [row] : []
		})

		const filter = (button) => 'participar' === button.customId && button.user.id === uData.conjuge

		const collector = msgFuga.createMessageComponentCollector({
			filter,
			time: tempoFugindo,
		})

		let isConjugeParticipando = false
		let conjuge = false

		let sucessoNecessario = uData.arma.jetpack.tempo > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga

		collector.on('collect', async b => {
			await b.deferUpdate()
			let currTime = new Date().getTime()
			let cData = await bot.data.get(uData.conjuge)

			if (isConjugeParticipando) return

			if (cData.preso < currTime)
				return bot.createEmbed(message, `${cData.username} não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)

			if (cData.fuga === cData.preso)
				return bot.createEmbed(message, `Os policiais estão te observando, ${cData.username}! ${bot.config.prisao}`, "Você não conseguirá fugir", bot.colors.policia)

			if (cData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, cData, cData.username)

			if (cData.fugindo > currTime)
				return bot.createEmbed(message, `Você já está tentando fugir, ${cData.username} ${bot.config.prisao}`, 'Este tipo de coisa pede paciência', bot.colors.policia)

			if (await bot.isUserEmRouboOuEspancamento(message, cData)) return

			uCasamento = await bot.casais.get(uData.casamentoID?.toString())

			if (uCasamento.nivel === 0)
				return bot.createEmbed(message, `Vocês estão com o nível do casamento muito baixo para realizar ações em dupla!`, null, bot.colors.casamento)

			let bonus = currTime - uCasamento.ultimaViagem < 72 * 60 * 60 * 1000 ? 1.5 : 1

			chanceBase *= 1 + bot.aneis[uCasamento.anel].bonus * bonus / 100
			chanceJetpack = chanceBase + 30

			sucessoNecessario = uData.arma.jetpack.tempo > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga
			let sucessoConjuge = cData.arma.jetpack.tempo > currTime ? chanceJetpack * multiplicador_evento_chance_fuga : chanceBase * multiplicador_evento_chance_fuga

			sucessoNecessario = (sucessoNecessario + sucessoConjuge) / 2

			uCasamento.nivel += uCasamento.nivel >= 100 ? 0 : 1
			uCasamento.ultimoDecrescimo = 1
			isConjugeParticipando = true

			await bot.data.set(uData.conjuge + '.fugindo', currTime + 11000)

			msgFuga.edit({
				components: [],
				embeds: [fugaInicio
					.setTitle(`${bot.config.prisao} Fuga em andamento... O amor pode tudo!`)
					// .addField("Debug", `Chance base: ${chanceBase}\nSucesso necessarario: ${sucessoNecessario}\nSucesso conjuge: ${sucessoConjuge}\nChance calculada: ${chance}`)
					.setFooter({
						text: `${uData.username} e ${cData.username} • ${uData.arma.jetpack.tempo > currTime ? `Com Jetpack` : `Sem Jetpack`} e ${cData.arma.jetpack.tempo > currTime ? `com Jetpack` : `sem Jetpack`}`,
						iconURL: message.member.user.avatarURL()
					})
				]
			})

			await bot.data.set(uData.conjuge, cData)
			await bot.casais.set(uData.casamentoID.toString(), uCasamento)

			conjuge = await bot.data.get(uData.conjuge)
		})

		let sucesso = (chance <= sucessoNecessario)

		await wait(tempoFugindo)

		uData = await bot.data.get(message.author.id)

		uData.fugindo = 0

		if (sucesso) {
			uData.fuga = uData.preso
			uData.roubo = currTime + (uData.classe === 'advogado' ? 1530000 : 1800000) //+30m
			uData.preso = 0
			uData.qtFugas += 1

			await bot.data.set(message.author.id, uData)

			const embedFinal = new Discord.MessageEmbed()
				.setTitle('Fuga bem sucedida!')
				.setColor(bot.colors.policia)
				.setDescription(`${uData.arma.jetpack.tempo > currTime ? bot.shuffle(frasesSucessoJetpack)[0] : bot.shuffle(frasesSucesso)[0]}, mas a polícia ${bot.shuffle(frasesProcurado)[0]} ${bot.config.police}`)
				.setFooter({
					text: `${uData.username} • Espere 30 minutos para roubar novamente`,
					iconURL: message.member.user.avatarURL()
				})
				.setTimestamp()
			
			console.log(conjuge)

			const embedFinalCasal = new Discord.MessageEmbed()
				.setTitle('Fuga bem sucedida!')
				.setColor(bot.colors.policia)
				.setDescription(`${uData.arma.jetpack.tempo > currTime && conjuge?.arma?.jetpack?.tempo > currTime ? bot.shuffle(frasesSucessoJetpackCasal)[0] : bot.shuffle(frasesSucessoCasal)[0]}, mas a polícia ${bot.shuffle(frasesProcuradoCasal)[0]} ${bot.config.police}`)
				.setFooter({
					text: `${uData.username} e ${conjuge?.username} • Esperem 30 minutos para roubar novamente`,
					iconURL: message.member.user.avatarURL()
				})
				.setTimestamp()

			msgFuga.edit({
				components: [],
				embeds: isConjugeParticipando ? [embedFinalCasal] : [embedFinal]
			})

			const embedPV = new Discord.MessageEmbed()
				.setTitle(`${bot.config.roubar} Você já pode roubar novamente!`)
				.setColor(bot.colors.roubar)

			setTimeout(() => {
				message.author.send({embeds: [embedPV]})
					.catch(() => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
						.catch(() => `Não consegui responder ${bot.data.get(message.author.id + ".username")} nem no PV nem no canal. \`Prisao Fugir\``))
			}, uData.roubo - currTime)

			if (isConjugeParticipando && conjuge) {
				conjuge = await bot.data.get(uData.conjuge)
				conjuge.fuga = conjuge.preso
				conjuge.roubo = currTime + (conjuge.classe === 'advogado' ? 1530000 : 1800000) //+30m
				conjuge.preso = 0
				conjuge.qtFugas += 1
				conjuge.fugindo = 0
				await bot.data.set(uData.conjuge, conjuge)

				setTimeout(() => {
					bot.users.fetch(uData.conjuge).then(user => {
						user.send({embeds: [embedPV]})
							.catch(() => `Não consegui enviar PV para ${uData.conjuge} \`Prisao Fugir\``)
					})
				}, conjuge.roubo - currTime)
			}

			const logF = new Discord.MessageEmbed()
				.setDescription(`**${uData.username} conseguiu fugir da prisão**`)
				.addField(`${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack`, uData.arma.jetpack.tempo > currTime ? `Sim` : `Não`, true)
				.setColor(bot.colors.policia)

			if (isConjugeParticipando && conjuge)
				logF.addField("Junto de seu conjuge", conjuge.username)
					.addField(`${bot.guns.jetpack.skins[conjuge.arma.jetpack.skinAtual].emote} Jetpack`, conjuge.arma.jetpack.tempo > currTime ? `Sim` : `Não`, true)

			return bot.log(message, logF)

		}
		else {
			let chanceBaleado = bot.getRandom(0, 100)

			let atkPower = 0
			let atkPowerConjuge = 0
			Object.entries(uData.arma).forEach(([key, value]) => {
				Object.values(bot.guns).forEach(arma => {
					if (value.tempo > currTime && arma.atk > atkPower && (key == arma.data))
						atkPower = arma.atk
				})
			})
			if (isConjugeParticipando && conjuge) {
				Object.entries(conjuge.arma).forEach(([key, value]) => {
					Object.values(bot.guns).forEach(arma => {
						if (value.tempo > currTime && arma.atk > atkPower && (key == arma.data))
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
					message.author.send({embeds: [embedPV]})
						.catch(() => message.reply(`você está curado! ${bot.config.hospital}`)
							.catch(() => `Não consegui responder ${bot.data.get(message.author.id + ".username")} nem no PV nem no canal. \`Prisao fugir\``))

					if (isConjugeParticipando && conjuge) {
						bot.users.fetch(uData.conjuge).then(user => {
							user.send({embeds: [embedPV]})
								.catch(() => message.channel.send(`<@${uData.conjuge}> você está curado! ${bot.config.hospital}`)
									.catch(() => `Não consegui responder ${bot.data.get(uData.conjuge + ".username")} nem no PV nem no canal. \`Prisao fugir\``))
						})
					}
				}, uData.hospitalizado - currTime)
			}

			await bot.data.set(message.author.id, uData)

			if (isConjugeParticipando && conjuge)
				await bot.data.set(uData.conjuge, conjuge)

			const embed = new Discord.MessageEmbed()
				.setTitle('Fuga fracassada')
				.setColor(bot.colors.policia)
				.setDescription(`${uData.arma.jetpack.tempo > currTime ? bot.shuffle(frasesFracassoJetpack)[0] : bot.shuffle(frasesFracasso)[0]}. Você ficará preso por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}! ${bot.config.prisao}`)
				.setFooter({
					text: `${uData.username} • Tempo preso: ${bot.segToHour((uData.preso - currTime) / 1000)}`,
					iconURL: message.member.user.avatarURL()
				})
				.setTimestamp()

			const embedCasal = new Discord.MessageEmbed()
				.setTitle('Fuga fracassada')
				.setColor(bot.colors.policia)
				.setDescription(`${uData.arma.jetpack.tempo > currTime && conjuge?.arma?.jetpack.tempo > currTime ? bot.shuffle(frasesFracassoJetpackCasal)[0] : bot.shuffle(frasesFracassoCasal)[0]}. Vocês ficarão presos por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}! ${bot.config.prisao}`)
				.setFooter({
					text: `${uData.username} • Tempo preso: ${bot.segToHour((uData.preso - currTime) / 1000)}\n${conjuge?.username} • Tempo preso: ${bot.segToHour((conjuge.preso - currTime) / 1000)}`,
					iconURL: message.member.user.avatarURL()
				})
				.setTimestamp()

			if (chanceBaleado <= 10) {
				embed.addField('\u200b', `Você foi baleado e ficará hospitalizado por ${bot.segToHour(tempoHospitalizado / 1000)}. ${bot.config.hospital}`)
				embedCasal.addField('\u200b', `Vocês foram baleados e ficarão hospitalizados por ${bot.segToHour(tempoHospitalizado / 1000)}. ${bot.config.hospital}`)
			}

			msgFuga.edit({
				components: [],
				embeds: isConjugeParticipando ? [embedCasal] : [embed]
			})

			const embedPV = new Discord.MessageEmbed()
				.setTitle(`${bot.config.prisao} Você está livre!`)
				.setColor(bot.colors.policia)

			setTimeout(() => {
				message.author.send({embeds: [embedPV]})
					.catch(() => message.reply(`você está livre! ${bot.config.prisao}`)
						.catch(() => `Não consegui responder ${bot.data.get(message.author.id + ".username")} nem no PV nem no canal. \`Prisao\``))
			}, uData.preso - currTime)

			const logF = new Discord.MessageEmbed()
				.setDescription(`**${uData.username} não conseguiu fugir da prisão e ficará preso por mais ${bot.segToHour((900000 + tempo_adicional) / 1000)}**`)
				.addField(`${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} Jetpack`, uData.arma.jetpack.tempo > currTime ? `Sim` : `Não`, true)
				.addField(`Baleado`, chanceBaleado <= 10 ? `Sim` : `Não`, true)
				.setColor(bot.colors.policia)

			if (isConjugeParticipando && conjuge)
				logF.addField("Junto de seu conjuge", conjuge.username)
					.addField(`${bot.guns.jetpack.skins[conjuge.arma.jetpack.skinAtual].emote} Jetpack`, conjuge.arma.jetpack.tempo > currTime ? `Sim` : `Não`, true)

			return bot.log(message, logF)
		}

	}
	else if (option === 'subornar' || option === 's' || option === 'suborno') {
		let atkPower = 0
		Object.entries(uData.arma).forEach(([key, value]) => {
			Object.values(bot.guns).forEach(arma => {
				if (value.tempo > currTime && arma.atk > atkPower && key == arma.data)
					atkPower = arma.atk
			})
		})

		let preço = Math.floor((20000 + (atkPower * (atkPower / 20)) ** 2) + (uData.moni * (uData.fuga === uData.preso ? 0.1 : 0.05)) + (uData.ficha * 80 * (uData.fuga === uData.preso ? 0.1 : 0.05)))

		let chance = bot.getRandom(0, 100)
		let sucesso = uData.classe === 'advogado' ? true : chance < 75
		if (uData.subornoPago === uData.preso)
			return bot.createEmbed(message, `Não aceitaremos nada vindo de você, espertalhão! ${bot.config.prisao}`, "\"Quem sabe na próxima tu deixa de ser idiota\"", bot.colors.policia)
		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
		if (uData.fugindo > currTime)
			return bot.createEmbed(message, `Você está tentando fugir e não pode subornar ${bot.config.prisao}`, 'Foco!', bot.colors.policia)
		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (await bot.isUserEmRouboOuEspancamento(message, uData))
			return
		if (await bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.policia)

		const confirmed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.police} Suborno aceito`)
			.setColor(bot.colors.policia)
			.setDescription(`"Assim que se faz! Caia fora daqui antes que mais alguém te veja."`)
			.setFooter(`${uData.username} • Espere 30 minutos para fazer alguma besteira`, message.member.user.avatarURL())
			.setTimestamp()

		const suborno = new Discord.MessageEmbed()
			.setTitle(`${bot.config.police} Subornar`)
			.setColor(bot.colors.policia)
			.setDescription(`"Sabemos que você tem um certo dinheiro escondido aí... Nos dê **R$ ${preço.toLocaleString().replace(/,/g, ".")}** e deixaremos você sair de fininho."\n\nConfirmar pagamento?`)
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
			.setTimestamp()

		let btnConfirmar = new Discord.MessageButton()
			.setStyle('SUCCESS')
			.setLabel('Confirmar')
			.setCustomId('confirmar')

		const row = new Discord.MessageActionRow()
			.addComponents(btnConfirmar)

		let msg = await message.channel.send({
			embeds: [suborno],
			components: [row]
		})

		const filterConfirmar = (button) => [
			'confirmar',
		].includes(button.customId) && button.user.id === message.author.id

		const collectorConfirmar = msg.createMessageComponentCollector({
			filter: filterConfirmar,
			time: 90000,
		})

		collectorConfirmar.on('collect', async b => {
			await b.deferUpdate()
			uData = await bot.data.get(message.author.id)
			currTime = new Date().getTime()
			if (uData.subornoPago === uData.preso)
				return bot.createEmbed(message, `Não aceitaremos nada vindo de você, espertalhão! ${bot.config.prisao}`, "\"Quem sabe na próxima tu deixa de ser idiota\"", bot.colors.policia)
			if (uData.moni < preço)
				return bot.msgSemDinheiro(message)
			if (uData.preso < currTime)
				return bot.createEmbed(message, `Você não está preso ${bot.config.prisao}`, "\"Mas podemos te prender. O que acha?\"", bot.colors.policia)
			if (uData.fugindo > currTime)
				return bot.createEmbed(message, `Você está tentando fugir e não pode subornar ${bot.config.prisao}`, 'Foco!', bot.colors.policia)
			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData)
			if (await bot.isUserEmRouboOuEspancamento(message, uData))
				return
			if (await bot.isGaloEmRinha(message.author.id))
				return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.policia)

			if (sucesso) {
				uData.moni -= preço
				uData.prisaoGastos += preço
				uData.roubo = currTime + (uData.classe === 'advogado' ? 1530000 : 1800000) // 30 min
				uData.preso = 0

				await bot.data.set(message.author.id, uData)

				msg.edit({
					embeds: [confirmed], components: []
				}).catch(() => console.log("Não consegui editar mensagem `prisao suborno`"))

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} pagou suborno de R$ ${preço.toLocaleString().replace(/,/g, ".")} e ficou livre da prisão**`)
					.setColor(bot.colors.policia))
			}
			else {
				uData.moni -= preço
				uData.prisaoGastos += preço
				uData.subornoPago = uData.preso

				await bot.data.set(message.author.id, uData)

				const failed = new Discord.MessageEmbed()
					.setTitle(`${bot.config.police} Suborno recusado`)
					.setColor(bot.colors.policia)
					.setDescription(`"Caralho mané, tu tem que ser muito burro pra pagar esse valor e achar que iríamos te liberar."`)
					.setFooter(`${uData.username} • Você continuará preso`, message.member.user.avatarURL())
					.setTimestamp()

				msg.edit({
					embeds: [failed], components: []
				}).catch(() => console.log("Não consegui editar mensagem `prisao suborno`"))

				return bot.log(message, new Discord.MessageEmbed()
					.setDescription(`**${uData.username} pagou suborno de R$ ${preço.toLocaleString().replace(/,/g, ".")} mas continuou preso kkk**`)
					.setColor(bot.colors.policia))
			}
		})

		collectorConfirmar.on('end', () => {
			if (msg)
				msg.edit({
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `prisao suborno`"))
		})

	}
	else {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.prisao} Prisão`) // de ${message.guild.name}
			.setDescription(`Ao tentar roubar alguém e falhar, você será preso por um tempo determinado pelo poder de sua arma.
Estar preso limita muitas de suas ações no jogo, como trabalhar, investir, apostar, vasculhar, e claro, roubar.
Você pode tentar espancar outros presos.
Caso falhe em fugir, há uma pequena chance de ser baleado e hospitalizado.`)
			.addField(`${bot.badges.fujao_s5} Fugir`, `Você tem ${chanceBase * multiplicador_evento_chance_fuga}% (${chanceJetpack * multiplicador_evento_chance_fuga}% se possuir uma ${bot.guns.jetpack.skins[uData.arma.jetpack.skinAtual].emote} **Jetpack**) de chance de fugir da prisão!`)
			.addField(`${bot.badges.deputado_s5} Subornar`, `Os guardas são gananciosos, e quanto melhor sua arma, mais eles pedirão! Eles também podem recusar seu suborno, mas ficarão com seu dinheiro.`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/817102027183357992/prisao.png') //message.guild.iconURL()
			.setColor(bot.colors.policia)
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setTimestamp()

		let btnPresos = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Prisioneiros')
			.setEmoji(bot.config.prisao)
			.setCustomId('presos')

		let btnFugir = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Fugir')
			.setEmoji(bot.badges.fujao_s5)
			.setDisabled(uData.fuga === uData.preso)
			.setCustomId('fugir')

		let btnSubornar = new Discord.MessageButton()
			.setStyle('SECONDARY')
			.setLabel('Subornar')
			.setEmoji(bot.badges.deputado_s5)
			.setCustomId('subornar')

		const row = new Discord.MessageActionRow()
			.addComponents(btnPresos)

		if (uData.preso > currTime)
			row.addComponents(btnFugir)
				.addComponents(btnSubornar)

		let msg = await message.channel.send({
			embeds: [embed],
			components: [row]
		}).catch(() => console.log("Não consegui enviar mensagem `prisao`"))

		const filter = (button) => [
			'presos',
			'fugir',
			'subornar',
		].includes(button.customId) && button.user.id === message.author.id

		const collector = msg.createMessageComponentCollector({
			filter,
			time: 90000,
		})

		collector.on('collect', async b => {
			await b.deferUpdate()
			currTime = Date.now()

			if (b.customId === 'presos') {
				let presos = []
				let ps = []
				// let total = 0
				
				await bot.data.filter(async (user, id) => {
					if (id !== bot.config.adminID) { // && message.guild.members.cache.get(user)
						if (user.preso > currTime) {
							presos.push({
								nick: user.username,
								tempo: user.preso - currTime,
								vezes: user.roubosL,
								fugiu: user.qtFugas,
								tentou: user.fuga === user.preso
							})
							// total += 1
						}
					}
				})

				function getEmbed(start = 0) {
					const current = presos.slice(start, start + 15)
					const prisioneiros = new Discord.MessageEmbed()
						.setTitle(`${bot.config.prisao} Prisioneiros`)
						.setColor(bot.colors.background)
						.setFooter(`${bot.user.username} • Mostrando ${start + 1}-${start + current.length} usuários de ${presos.length.toLocaleString().replace(/,/g, ".")}`, bot.user.avatarURL())

					if (presos.length > 0) {
						ps = presos.sort((a, b) => a.tempo - b.tempo).slice(start, start + 15)
						ps.forEach(preso => prisioneiros.addField(preso.nick, `Livre em ${bot.segToHour((preso.tempo / 1000))}\nPreso ${preso.vezes} vezes\nFugiu ${preso.fugiu} vezes\n${preso.tentou ? `Tentou fugir` : `Não tentou fugir`}`, true))
					}
					else
						prisioneiros.setDescription("Não há prisioneiros")

					return prisioneiros
				}

				let currentIndex = 0

				btnPresos.setDisabled(true)

				msg.edit({
					components: [row]
				}).catch(() => console.log("Não consegui editar mensagem `prisao`"))

				let buttonAnterior = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Anterior')
					.setEmoji('⬅️')
					.setCustomId('prev')

				let buttonProx = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Próximo')
					.setEmoji('➡️')
					.setCustomId('next')

				const rowPresos = new Discord.MessageActionRow()

				let msgPresos = await message.channel.send({
					embeds: [getEmbed()],
					components: presos.length > 0 ? [rowPresos.addComponents(buttonProx)] : []
				}).catch(() => console.log("Não consegui enviar mensagem `prisao`"))

				const filterPresos = (button) => [
					'prev',
					'next',
				].includes(button.customId) && button.user.id === message.author.id

				const collectorPresos = msgPresos.createMessageComponentCollector({
					filter: filterPresos,
					time: 90000,
				})

				collectorPresos.on('collect', async b => {
					await b.deferUpdate()
					if (b.customId === 'prev' || b.customId === 'next') {
						if (b.customId === 'prev')
							currentIndex -= 15
						else if (b.customId === 'next')
							currentIndex += 15

						let rowBtn = new Discord.MessageActionRow()
						if (currentIndex !== 0)
							rowBtn.addComponents(buttonAnterior)
						if (currentIndex + 15 < presos.length)
							rowBtn.addComponents(buttonProx)

						msgPresos.edit({
							embeds: [getEmbed(currentIndex)],
							components: [rowBtn]
						}).catch(() => console.log("Não consegui editar mensagem `presos`"))
					}
				})
				collectorPresos.on('end', () => {
					if (msgPresos)
						msgPresos.edit({
							components: []
						}).catch(() => console.log("Não consegui editar mensagem `presos`"))
				})
			}
			else if (b.customId === 'fugir') {
				btnFugir.setDisabled(true)

				msg.edit({
					components: [row]
				}).catch(() => console.log("Não consegui enviar mensagem `prisao`"))

				bot.commands.get('prisao').run(bot, message, ['fugir'])

			}
			else if (b.customId === 'subornar') {
				btnSubornar.setDisabled(true)

				msg.edit({
					components: [row]
				}).catch(() => console.log("Não consegui enviar mensagem `prisao`"))

				bot.commands.get('prisao').run(bot, message, ['subornar'])
			}
		})
		collector.on('end', () => {
			if (msg)
				msg.edit({
					components: []
				}).catch(() => console.log("Não consegui editar mensagem `prisao`"))
		})
	}
}
exports.config = {
	alias: ['p', 'cadeia', 'prison']
}