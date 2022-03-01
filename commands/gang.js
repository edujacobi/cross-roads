const Discord = require("discord.js")
// const Piii = require("piii")
// const piiiFilters = require("piii-filters")

exports.run = async (bot, message, args) => {

	function getIcone(index) {
		return index === 0 ? bot.config.gang : bot.config['gang' + index]
	}

	function getLider(gang) {
		return gang.membros.find(user => user.cargo === 'lider')
	}

	function getMembro(gang, userID) {
		return gang.membros.find(user => user.id === userID)
	}

	function getMembroIdx(gang, userID) {
		return gang.membros.findIndex(user => user.id === userID)
	}

	function isLider(gang, userID) {
		return gang.membros.find(user => user.cargo === 'lider').id === userID
	}

	function getVice(gang) {
		return gang.membros.find(user => user.cargo === 'vice')
	}

	function isVice(gang, userID) {
		if (!getVice(gang))
			return false
		return gang.membros.find(user => user.cargo === 'vice').id === userID
	}

	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let target = message.mentions.members.first()
	let currTime = new Date().getTime()
	//
	// if (!bot.isAdmin(message.author.id) && !bot.isMod(message.author.id))
	// 	return message.reply("comando em manutenção")

	//if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return message.channel.send('Comando em manutenção')
	if (option === 'criar') {
		// return bot.createEmbed(message, `A criação de gangues está bloqueada na primeira semana da temporada ${bot.config.gang}`, null, bot.colors.darkGrey)
		let uData = bot.data.get(message.author.id)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.moni < 2500000)
			return bot.msgSemDinheiro(message)

		if (uData.gangID != null)
			return bot.createEmbed(message, `Você já está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!args[1])
			return bot.createEmbed(message, `Insira um nome para a gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		let nome = args.join(" ").replace(option, "")

		if (nome.length < 4)
			return bot.createEmbed(message, `Defina um nome maior. Limite de caracteres: 4 ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (nome.length > 20)
			return bot.createEmbed(message, `Defina um nome menor. Limite de caracteres: 20 ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (['criar', 'info', 'descricao', 'nome', 'cor', 'imagem', 'sair', 'transferir', 'convidar', 'base', 'comunicar', 'vice', 'importar', 'exportar', 'golpe', 'tag', 'icone', 'boneco'].includes(args[1]))
			return bot.createEmbed(message, `Defina outro nome. ${bot.config.gang}`, null, bot.colors.darkGrey)

		let achou = false
		bot.gangs.forEach(gang => {
			if (gang !== '') {
				if (nome.toLowerCase() === " " + gang.nome.toLowerCase())
					achou = true
			}

		})
		if (achou) return bot.createEmbed(message, `Este nome de gangue já está em uso. ${bot.config.gang}`, null, bot.colors.darkGrey)

		let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{4,20}$/ugm
		if (!regex.test(nome))
			return bot.createEmbed(message, 'Escolha outro nome', `Este nome é inválido`, null)


		bot.gangs.ensure((bot.gangs.size).toString(), bot.defautGang)

		uData.gangID = bot.gangs.size - 1

		let uGang = bot.gangs.get(uData.gangID)

		uGang.membros.push({
			id: message.author.id,
			cargo: 'lider',
			depositado: 0
		})

		uGang.nome = nome.substring(1, nome.length)
		uGang.cor = (Math.random() * 0xFFFFFF << 0).toString(16)
		uData.moni -= 2500000
		bot.data.set(message.author.id, uData)
		bot.gangs.set(uData.gangID.toString(), uGang)
		bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(2500000 * bot.imposto))

		return bot.createEmbed(message, `Você criou a gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'descricao') { //lider
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode alterar a descrição da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (!args[1])
			return bot.createEmbed(message, `Insira uma descrição ${getIcone(uGang.boneco)}`, null, uGang.cor)

		option = args[0]
		let desc = args.join(" ").replace(option, "")
		uGang.desc = desc.substring(1, desc.length)

		if (desc.length > 255)
			return bot.createEmbed(message, `Defina uma descrição menor. Limite de caracteres: 255. ${getIcone(uGang.boneco)}`, null, uGang.cor)

		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `Descrição da gangue **${uGang.nome}** alterada! ${getIcone(uGang.boneco)}`, null, uGang.cor)


	}
	else if (option === 'nome') { //lider
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode alterar o nome da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (!args[1])
			return bot.createEmbed(message, `Insira um nome ${getIcone(uGang.boneco)}`, null, uGang.cor)

		option = args[0]
		let nome = args.join(" ").replace(option, "")

		if (['criar', 'info', 'descricao', 'nome', 'cor', 'imagem', 'sair', 'transferir', 'convidar', 'base', 'comunicar', 'vice', 'importar', 'exportar', 'golpe', 'tag', 'icone', 'boneco'].includes(args[1]))
			return bot.createEmbed(message, `Defina outro nome ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let achou = false
		bot.gangs.forEach(gang => {
			if (gang !== '') {
				if (nome.toLowerCase() === " " + gang.nome.toLowerCase())
					achou = true
			}
		})
		if (achou) return bot.createEmbed(message, `Este nome de gangue já está em uso. ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{4,20}$/ugm
		if (!regex.test(nome))
			return bot.createEmbed(message, 'Escolha outro nome', `Este nome é inválido`, null, uGang.cor)

		let old_nome = uGang.nome
		uGang.nome = nome.substring(1, nome.length)

		if (nome.length < 4)
			return bot.createEmbed(message, `Defina um nome maior. Limite de caracteres: 4 ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (nome.length > 20)
			return bot.createEmbed(message, `Defina um nome menor. Limite de caracteres: 20 ${getIcone(uGang.boneco)}`, null, uGang.cor)

		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `A gangue **${old_nome}** agora é **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'cor') { //lider
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode alterar a cor da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (!args[1] || args[1].length !== 6)
			return bot.createEmbed(message, `Insira uma cor em hexadecimal para a gangue **${uGang.nome}** (ex: FFFFFF, sem \`#\`) ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (!Boolean(args[1].match(/^[0-9a-f]+$/i)))
			return bot.createEmbed(message, `Insira uma cor em hexadecimal válida (ex: FFFFFF, sem \`#\`) ${getIcone(uGang.boneco)}`, null, uGang.cor)

		uGang.cor = '0x' + args[1]

		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `Cor da gangue **${uGang.nome}** alterada! ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'imagem') { //lider
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode alterar a imagem da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)
		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)
		if (!args[1])
			return bot.createEmbed(message, `Insira um link de imagem para a gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, uGang.cor)
		if (!(args[1].indexOf("http") > -1))
			return bot.createEmbed(message, `A imagem inserida deve ser um link ${getIcone(uGang.boneco)}`, null, uGang.cor)


		uGang.icone = args[1]

		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `Imagem da gangue **${uGang.nome}** alterada! ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'convidar') { //lider e vice
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)
		let custo_base = 100000

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode convidar jogadores para a gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uGang.membros.length >= uGang.espacoMembro)
			return bot.createEmbed(message, `**${uGang.nome}** já bateu o limite de jogadores ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (!target) return bot.createEmbed(message, `Insira um usuário a ser convidado ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (target.id === message.author.id) return bot.createEmbed(message, `Você já faz parte desta gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let tData = bot.data.get(target.id)
		if (!tData) return bot.createEmbed(message, "Este usuário não possui um inventário", null, uGang.cor)

		if (tData.gangID != null) return bot.createEmbed(message, `Este jogador já está em uma gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (tData.depositoGang > currTime)
			return bot.createEmbed(message, `${tData.username} só poderá entrar em uma nova gangue em ${bot.segToHour((tData.depositoGang - currTime) / 1000)} ${getIcone(uGang.boneco)}`, null, uGang.cor)

		const embedConvite = new Discord.MessageEmbed()
			.setDescription(`**${uData.username}** convidou **${tData.username}** para fazer parte da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}
O custo para entrar nesta gangue é R$ ${(custo_base + (50000 * uGang.baseLevel)).toLocaleString().replace(/,/g, ".")}
Aceitar convite?`)
			.setColor(uGang.cor)
			.setFooter({text: uData.username, iconURL: message?.member?.user?.avatarURL()})
			.setTimestamp()

		message.channel.send({embeds: [embedConvite]})
			.catch(() => console.log("Não consegui enviar mensagem `gang convidar`"))
			.then(msg => {
				msg.react('✅').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {
					const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === target.id

					const confirm = msg.createReactionCollector({
						filter,
						max: 1,
						time: 60000,
						errors: ['time'],
					})

					confirm.on('collect', () => {
						if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
							.then(() => {
								tData = bot.data.get(target.id)
								uGang = bot.gangs.get(uData.gangID)
								if (tData.gangID != null) return bot.createEmbed(message, `Este jogador já está em uma gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)
								if (tData.moni < custo_base + (50000 * uGang.baseLevel))
									return bot.createEmbed(message, `**${tData.username}** não tem dinheiro suficiente para entrar na gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)
								if (bot.isGaloEmRinha(target.id))
									return bot.createEmbed(message, `O galo de **${tData.username}** está em uma rinha e ele não pode fazer isto ${getIcone(uGang.boneco)}`, null, bot.colors.white)

								let currTime = new Date().getTime()
								tData.gangID = uData.gangID // Coloca ID da gangue no usuário
								tData.moni -= custo_base + (50000 * uGang.baseLevel)
								uGang.caixa += custo_base + (50000 * uGang.baseLevel)
								let tempo_deposito = 6 * 60 * 60 * 1000
								tData.depositoGang = currTime + tempo_deposito

								uGang.membros.push({ // Coloca ID do usuário na gangue
									id: target.id,
									cargo: 'membro',
									depositado: 0
								})
								bot.gangs.set(uData.gangID.toString(), uGang) // Salva gangue
								bot.data.set(target.id, tData) // Salva user
								// Manda mensagem
								return msg.edit({
									embeds: [new Discord.MessageEmbed()
										.setDescription(`**${tData.username}** agora faz parte da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`)
										.setColor(uGang.cor)
										.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
										.setTimestamp()
									]
								}).catch(() => console.log("Não consegui editar mensagem `gang`"))
							})
					})

					// .catch(() => {
					// 	return bot.createEmbed(message, `**${tData.nome}** não respondeu. Ele está offline ou negou o convite ${bot.config.gang}`)
					// })
				})
					.catch(() => {
						return msg.edit({
							embeds: [new Discord.MessageEmbed()
								.setDescription(`**${tData.username}** não respondeu. Ele está offline ou recusou o convite. ${getIcone(uGang.boneco)}`)
								.setColor(uGang.cor)
								.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
								.setTimestamp()
							]
						}).catch(() => console.log("Não consegui editar mensagem `gang`"))

					})
			})

	}
	else if (option === 'sair') { // membro
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (uData.gangID == null)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (isLider(uGang, message.author.id)) {
			if (uGang.membros.length > 1) {
				let vice = getVice(uGang)

				if (vice) {
					let id = vice.id

					let newLider = getMembroIdx(uGang, vice.id)

					uGang.membros.splice(getMembroIdx(uGang, message.author.id), 1)
					uGang.membros[newLider].cargo = 'lider'
					bot.gangs.set(uData.gangID.toString(), uGang)
					uData.gangID = null
					bot.data.set(message.author.id, uData)

					uGang.membros.forEach(membro => {
						if (membro.id !== message.author.id)
							bot.users.fetch(membro.id).then(user => user.send(`**${uData.username}** saiu da gangue **${uGang.nome}**. **${bot.data.get(vice.id, "username")}** foi definido como novo líder ${getIcone(uGang.boneco)}`)
								.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`)))
					})

					return bot.createEmbed(message, `Você saiu da gangue **${uGang.nome}**. **${bot.data.get(id, "username")}** foi definido como novo líder. ${getIcone(uGang.boneco)}`, null, uGang.cor)
				}

				uGang.membros.splice(getMembroIdx(uGang, message.author.id), 1)

				// uGang.membros.forEach((user, id) => usersIDs.push(id))
				let newLider = uGang.membros[0].id

				// uGang.membros.set(newLider, 'lider', 'cargo')
				uGang.membros[0].cargo = 'lider'
				bot.gangs.set(uData.gangID.toString(), uGang)
				uData.gangID = null
				bot.data.set(message.author.id, uData)

				bot.users.fetch(newLider).then(user => user.send(`**${uData.username}** saiu da gangue **${uGang.nome}**. Você foi definido como novo líder ${getIcone(uGang.boneco)}`)
					.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${newLider})`)))

				return bot.createEmbed(message, `Você saiu da gangue **${uGang.nome}**. **${bot.data.get(newLider, "username")}** foi definido como novo líder. ${getIcone(uGang.boneco)}`, null, uGang.cor)

			}
			else {
				bot.gangs.set(uData.gangID.toString(), '')
				//bot.gangs.delete(uData.gangID)
				uData.gangID = null
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `Você saiu da gangue **${uGang.nome}**. Você era o último membro e ela foi encerrada. ${getIcone(uGang.boneco)}`, null, uGang.cor)
			}

		}
		else {
			uGang.membros.splice(getMembroIdx(uGang, message.author.id), 1)

			bot.gangs.set(uData.gangID.toString(), uGang)

			uData.gangID = null
			bot.data.set(message.author.id, uData)

			uGang.membros.forEach(membro => {
				if (membro.id !== message.author.id)
					bot.users.fetch(membro.id).then(user =>
						user.send(`**${uData.username}** saiu da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`)
							.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`))
					)
			})

			return bot.createEmbed(message, `Você saiu da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, uGang.cor)
		}

	}
	else if (option === 'expulsar') { //lider e vice
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (uData.gangID == null)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode expulsar jogadores da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (!target && args[1] && args[1] % 1 === 0) {
			target = {
				id: args[1]
			}
		}

		if (!target)
			return bot.createEmbed(message, `Insira um usuário a ser expulso ${getIcone(uGang.boneco)}`, "Menção ou ID", uGang.cor)

		if (target.id === message.author.id)
			return bot.createEmbed(message, `Você não pode expulsar você mesmo. Use \`;gangue sair\` para sair da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let tData = bot.data.get(target.id)

		if (!tData)
			return bot.createEmbed(message, "O jogador não existe")

		if (tData.gangID !== uData.gangID)
			return bot.createEmbed(message, `**${tData.username}** não faz parte da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (isLider(uGang, target.id))
			return bot.createEmbed(message, `Você não pode expulsar o líder da gangue! ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let motivo = args.join(" ").replace(option, "").replace(args[1], "")

		// let membro_remover = uGang.membros.indexOf(target.id)
		// if (membro_remover > -1)
		// 	uGang.membros.splice(membro_remover, 1)
		uGang.membros.splice(getMembroIdx(uGang, target.id), 1)
		bot.gangs.set(uData.gangID.toString(), uGang)

		tData.gangID = null
		bot.data.set(target.id, tData)

		bot.users.fetch(target.id).then(user => {
			user.send(`**${uData.username}** lhe expulsou da gangue **${uGang.nome}** ${motivo !== `` ? `| Motivo: ${motivo} ` : ""}${getIcone(uGang.boneco)}`)
				.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${target.id})`))
		})

		return bot.createEmbed(message, `Você expulsou **${tData.username}** da gangue **${uGang.nome}** ${motivo !== `` ? `| Motivo: ${motivo} ` : ""}${getIcone(uGang.boneco)}`, null, uGang.cor)


	}
	else if (option === 'transferir') { //lider
		let uData = bot.data.get(message.author.id)

		if (uData.gangID == null)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null)

		let uGang = bot.gangs.get(uData.gangID)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode transferir a posse da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return

		if (!target)
			return bot.createEmbed(message, `Insira um usuário para transferir a posse ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let tData = bot.data.get(target.id)

		if (!tData)
			return bot.createEmbed(message, `Este usuário não possui um inventário ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (target.id === message.author.id)
			return bot.createEmbed(message, `Você já é o líder ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (tData.gangID !== uData.gangID)
			return bot.createEmbed(message, `**${tData.username}** não faz parte da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (tData.preso > currTime)
			return bot.msgPreso(message, tData, tData.username)

		if (bot.isAlvoEmRouboOuEspancamento(message, tData))
			return

		//return bot.createEmbed(message, `Você transferiu a posse da gangue **${uGang.nome}** para **${tData.username}**! ${bot.config.gang}`)
		bot.createEmbed(message, `Transferir a posse da gangue **${uGang.nome}** para **${tData.username}**? ${getIcone(uGang.boneco)}`, null, uGang.cor)
			.then(msg => {
				msg.react('✅').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {
					const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id

					const confirm = msg.createReactionCollector({
						filter,
						max: 1,
						time: 60000,
						errors: ['time'],
					})

					confirm.on('collect', () => {
						if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
							.then(() => {
								let uData = bot.data.get(message.author.id)
								let uGang = bot.gangs.get(uData.gangID)
								let tData = bot.data.get(target.id)
								if (uData.preso > currTime)
									return bot.msgPreso(message, uData)

								if (bot.isUserEmRouboOuEspancamento(message, uData))
									return

								if (tData.preso > currTime)
									return bot.msgPreso(message, tData)

								if (bot.isAlvoEmRouboOuEspancamento(message, tData))
									return

								if (tData.gangID !== uData.gangID)
									return bot.createEmbed(message, `**${tData.username}** não faz parte da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`)

								uGang.membros[getMembroIdx(uGang, target.id)].cargo = 'lider'
								uGang.membros[getMembroIdx(uGang, message.author.id)].cargo = 'membro'

								bot.gangs.set(uData.gangID.toString(), uGang)

								uGang.membros.forEach(membro => {
									if (membro.id !== message.author.id)
										bot.users.fetch(membro.id).then(user =>
											user.send(`**${uData.username}** transferiu a posse da gangue **${uGang.nome}** para **${tData.username}** ${getIcone(uGang.boneco)}`)
												.catch()
										)
								})

								return msg.edit({
									embeds: [new Discord.MessageEmbed()
										.setDescription(`Você transferiu a posse da gangue **${uGang.nome}** para **${tData.username}**! ${getIcone(uGang.boneco)}`)
										.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
										.setColor(uGang.cor)
										.setTimestamp()
									]
								}).catch(() => console.log("Não consegui editar mensagem `gang`"))
							})
					})
				})
			})

	}
	else if (option === 'vice') { //lider
		let uData = bot.data.get(message.author.id)

		if (uData.gangID == null)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		let uGang = bot.gangs.get(uData.gangID)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode definir o vice-líder da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (args[1] && args[1] === 'remover') {
			let vice = getVice(uGang)

			if (vice) {
				vice.cargo = 'membro'
				bot.gangs.set(uData.gangID.toString(), uGang)
				return bot.createEmbed(message, `**${bot.data.get(vice.id, "username")}** foi destituído do cargo de vice-líder da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, uGang.cor)
			}

			return bot.createEmbed(message, `**${uGang.nome}** não possui um vice-líder para ser removido ${getIcone(uGang.boneco)}`, null, uGang.cor)
		}

		if (!target)
			return bot.createEmbed(message, `Insira um usuário para definir como vice-líder ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (target.id === message.author.id)
			return bot.createEmbed(message, `Você não pode ser o líder e o vice-líder. Use \`;gangue transferir\` para tranferir a posse ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (isVice(uGang, target.id))
			return bot.createEmbed(message, `Este usuário já é o vice-líder da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let tData = bot.data.get(target.id)

		if (tData.preso > currTime)
			return bot.msgPreso(message, tData, tData.username)

		if (uData.gangID !== tData.gangID)
			return bot.createEmbed(message, `**${tData.username}** não faz parte da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

		// for (let i = 0; i < uGang.membros.length; i++) {
		// 	if (uGang.membros[i].cargo == 'vice')
		// 		uGang.membros[i].cargo = 'membro'
		// }
		let currentVice = getVice(uGang)
		if (currentVice)
			currentVice.cargo = 'membro'

		let newVice = getMembro(uGang, target.id)
		newVice.cargo = 'vice'

		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `Você definiu **${tData.username}** como vice-líder da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)


	}
	else if (option === 'depositar' || option === 'd' || option === 'dep') { //membro
		let uData = bot.data.get(message.author.id)
		let currTime = new Date().getTime()
		let valor = args[1]

		if (uData.gangID == null)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		let uGang = bot.gangs.get(uData.gangID)

		if (uData.depositoGang > currTime)
			return bot.createEmbed(message, `Você poderá depositar novamente em ${bot.segToHour((uData.depositoGang - currTime) / 1000)} ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return

		if (bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${getIcone(uGang.boneco)}`, null, bot.colors.white)

		if (!args[1])
			return bot.createEmbed(message, `Insira um valor a ser depositado ${getIcone(uGang.boneco)}`, null, uGang.cor)

		const valor_max_gang = 500000 + 350000 * uGang.baseLevel

		if (valor === 'allin' || valor === 'all' || valor === 'tudo') {
			valor = parseInt(uData.moni)
			if (valor > valor_max_gang)
				valor = valor_max_gang
		}

		if (uData.moni < 1)
			return bot.msgSemDinheiro(message)

		else if (parseInt(valor) <= 0 || (parseInt(valor) % 1 !== 0))
			return bot.msgValorInvalido(message)

		if (uData.moni < parseInt(valor))
			return bot.msgDinheiroMenorQueAposta(message)

		if (valor > valor_max_gang)
			return bot.createEmbed(message, `O valor máximo diário para depositar na gangue **${uGang.nome}** é de R$ ${valor_max_gang.toLocaleString().replace(/,/g, ".")} ${getIcone(uGang.boneco)}`, null, uGang.cor)

		bot.createEmbed(message, `Depositar **R$ ${parseInt(valor).toLocaleString().replace(/,/g, ".")}** no caixa da gangue **${uGang.nome}**?\nVocê pode depositar no máximo R$ ${valor_max_gang.toLocaleString().replace(/,/g, ".")} por dia`, null, uGang.cor)
			.then(msg => {
				msg.react('✅').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {
					const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id

					const confirm = msg.createReactionCollector({
						filter,
						max: 1,
						time: 60000,
						errors: ['time'],
					})

					confirm.on('collect', () => {
						if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
							.then(() => {
								let uData = bot.data.get(message.author.id)
								let uGang = bot.gangs.get(uData.gangID)
								let currTime = new Date().getTime()
								if (uData.depositoGang > currTime)
									return bot.createEmbed(message, `Você poderá depositar novamente em ${bot.segToHour((uData.depositoGang - currTime) / 1000)} ${getIcone(uGang.boneco)}`, null, uGang.cor)
								if (uData.moni < 1)
									return bot.msgSemDinheiro(message)
								if (uData.moni < parseInt(valor))
									return bot.msgDinheiroMenorQueAposta(message)
								if (bot.isUserEmRouboOuEspancamento(message, uData))
									return
								if (bot.isGaloEmRinha(message.author.id))
									return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

								let tempo_deposito = (22 - 1 * uGang.baseLevel) * 60 * 60 * 1000
								uData.depositoGang = currTime + tempo_deposito
								uData.moni -= parseInt(valor)
								uGang.caixa += parseInt(valor)
								bot.data.set(message.author.id, uData)

								// uGang.membros.set(message.author.id, uGang.membros.get(message.author.id, 'depositado') + parseInt(valor), 'depositado')
								uGang.membros[getMembroIdx(uGang, message.author.id)].depositado += parseInt(valor)
								bot.gangs.set(uData.gangID.toString(), uGang)
								setTimeout(() => {
									bot.users.fetch(message.author.id).then(user =>
										user.send(`Você pode depositar novamente na sua gangue ${getIcone(uGang.boneco)}`)
											.catch(() => message.reply(`você pode depositar novamente na sua gangue ${getIcone(uGang.boneco)}`)
												.catch(() => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal. \`Gang\``))
									)
								}, tempo_deposito)

								uGang.membros.forEach(membro => {
									if (membro.id !== message.author.id)
										bot.users.fetch(membro.id).then(user =>
											user.send(`**${uData.username}** depositou R$ ${parseInt(valor).toLocaleString().replace(/,/g, ".")} no caixa da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`)
												.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`))
										)
								})

								return msg.edit({
									embeds: [new Discord.MessageEmbed()
										.setDescription(`Você depositou R$ ${parseInt(valor).toLocaleString().replace(/,/g, ".")} no caixa da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`)
										.setColor(uGang.cor)
										.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
										.setTimestamp()
									]
								}).catch(() => console.log("Não consegui editar mensagem `gang`"))
							})
					})
				})
			})

	}
	else if (option === 'base' || option === 'b') { // comprar e upgrade: lider e vice // resto: membro
		let uData = bot.data.get(message.author.id)
		let uGang
		let uID

		if (!args[1] || args[1] === 'info' || args[1] === 'comprar' || args[1] === 'upgrade')
			uGang = bot.gangs.get(uData.gangID)

		if (args[1] && args[1] !== 'info' && args[1] !== 'comprar' && args[1] !== 'upgrade') {
			if (target) {
				let targetD = bot.data.get(target.id)
				if (!targetD)
					return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.gang}`, null, bot.colors.darkGrey)

				if (!targetD.gangID)
					return bot.createEmbed(message, `Este usuário não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

				uGang = bot.gangs.get(targetD.gangID)

			}
			else {
				let name = args.join(" ").replace(option, "")
				name = name.substring(1, name.length)
				bot.gangs.forEach((gang, id) => {
					if (gang !== '') {
						if (name.toLowerCase() === gang.nome.toLowerCase() || name.toLowerCase() === gang.tag.toLowerCase()) {
							uGang = bot.gangs.get(id)
							uID = id
						}
					}
				})
			}
		}

		if ((!args[1] && !uGang) || (!args[1] && uGang.base == null) || args[1] === 'info') {
			let bases_disponiveis = ''
			Object.values(bot.bases).forEach(base => {
				bases_disponiveis += `**${base.id}: ${base.desc}**\n${base.beneficio}\n\n`
			})
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.gang} Bases de gangue`)
				//.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/754773460873510963/radar_gangP.png')
				.setImage('https://media.discordapp.net/attachments/531174573463306240/757413324353699910/bases.png')
				.setColor('GREEN')
				.setDescription("Gangues precisam de um local seguro para descansar, organizar seus ataques e guardar seus bens. Há 3 opções de bases, cada uma com um bônus específico.\nBases possuem inicialmente 20 DEF e comportam 10 membros. Os líderes podem usar o valor em caixa da gangue para melhorar a base, aumentando sua defesa e espaço para membros e reduzindo o tempo e a chance de perder carregamentos.\nAtenção: Bases não podem ser alteradas depois de compradas.\n\n**Custo para comprar uma base: R$ 2.000.000**")
				.addField("Bases disponíveis", bases_disponiveis, true)
				.addField("Comandos",
					`\`;gangue base (gangue)\` Mostra a base de uma gangue
\`;gangue base comprar [id]\` Compra uma base para a gangue
\`;gangue base upgrade\` Compra melhorias para a base
\`;gangue base info\` Mostra este menu`, true)
				.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
				.setTimestamp()

			message.channel.send({embeds: [embed]})
				.catch(() => console.log("Não consegui enviar mensagem `gg base`"))

		}
		else if ((!args[1] && uGang != null) || args[1] && args[1] !== 'info' && args[1] !== 'comprar' && args[1] !== 'upgrade') {

			if (!uGang)
				return bot.createEmbed(message, `Gangue não encontrada ${bot.config.gang}`, null, bot.colors.darkGrey)

			if (uGang.base == null)
				return bot.createEmbed(message, `A gangue **${uGang.nome}** não possui uma base ${getIcone(uGang.boneco)}`, null, uGang.cor)

			let currTime = new Date().getTime()

			let esquema = `${getIcone(uGang.boneco)} - - - - - - - - - ${bot.config.carregamento} :white_circle:`
			let hora_inicio = -(uGang.carregamento - (((uGang.base === 'aeroporto' ? 23 : 26) - uGang.baseLevel * 2) * 1000 * 60 * 60) - currTime)
			let hora_fim = uGang.carregamento - currTime

			if (hora_fim / (hora_fim + hora_inicio) < 0.90)
				esquema = `${getIcone(uGang.boneco)} - - - - - - - - ${bot.config.carregamento} - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.80)
				esquema = `${getIcone(uGang.boneco)} - - - - - - - ${bot.config.carregamento} - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.70)
				esquema = `${getIcone(uGang.boneco)} - - - - - - ${bot.config.carregamento} - - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.60)
				esquema = `${getIcone(uGang.boneco)} - - - - - ${bot.config.carregamento} - - - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.50)
				esquema = `${getIcone(uGang.boneco)} - - - - ${bot.config.carregamento} - - - - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.40)
				esquema = `${getIcone(uGang.boneco)} - - - ${bot.config.carregamento} - - - - - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.30)
				esquema = `${getIcone(uGang.boneco)} - - ${bot.config.carregamento} - - - - - - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.20)
				esquema = `${getIcone(uGang.boneco)} - ${bot.config.carregamento} - - - - - - - - :white_circle:`
			if (hora_fim / (hora_fim + hora_inicio) < 0.10)
				esquema = `${getIcone(uGang.boneco)} ${bot.config.carregamento} - - - - - - - - - :white_circle:`

			let deposito = ''
			if (uGang.estoque === 0)
				deposito = ":black_medium_square: :black_medium_square: :black_medium_square: :black_medium_square: :black_medium_square:"
			else if (uGang.estoque === 1)
				deposito = ":white_medium_square: :black_medium_square: :black_medium_square: :black_medium_square: :black_medium_square:"
			else if (uGang.estoque === 2)
				deposito = ":white_medium_square: :white_medium_square: :black_medium_square: :black_medium_square: :black_medium_square:"
			else if (uGang.estoque === 3)
				deposito = ":white_medium_square: :white_medium_square: :white_medium_square: :black_medium_square: :black_medium_square:"
			else if (uGang.estoque === 4)
				deposito = ":white_medium_square: :white_medium_square: :white_medium_square: :white_medium_square: :black_medium_square:"
			else if (uGang.estoque === 5)
				deposito = ":white_medium_square: :white_medium_square: :white_medium_square: :white_medium_square: :white_medium_square:"

			let imagemBase = bot.bases[uGang.base].imagem

			let bonus = 0
			if (uGang.golpeMissao1.concluido)
				bonus += 4
			if (uGang.golpeMissao2.concluido)
				bonus += 2
			if (uGang.golpeMissao3.concluido)
				bonus += 5

			const embed = new Discord.MessageEmbed()
				.setTitle(`${getIcone(uGang.boneco)} ${bot.bases[uGang.base].desc} de ${uGang.nome}`)
				.setColor(uGang.cor)
				.setThumbnail(uGang.icone)
				.addField("Level", uGang.baseLevel.toString(), true)
				.addField("DEF", uGang.base === 'bunker' ? (uGang.baseLevel * 5 + 15 + 15).toString() : (uGang.baseLevel * 5 + 15).toString(), true)
				.addField("Depósito máximo", `R$ ${(500000 + (350000 * uGang.baseLevel)).toLocaleString().replace(/,/g, ".")}`, true)
				.addField("Estoque", deposito)
				.addField("Golpe ao Banco", `Bônus atual: ${bonus}%`, true)
				.addField("Valor roubado", `R$ ${uGang.valorRoubadoBanco.toLocaleString().replace(/,/g, ".")}`, true)
				.addField("Sucessos/Falhas", `${uGang.golpeW}/${uGang.golpeL}`, true)
				.addField("Carregamentos", `\`${(uGang.base === 'aeroporto' ? 23 : 26) - uGang.baseLevel * 2}h\` tempo de espera\n\`${uGang.base === 'aeroporto' ? `${35 + uGang.baseLevel * 3}` : 35 + uGang.baseLevel * 2}%\` chance de sucesso`, true)
				.setImage(imagemBase)
				.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
				.setTimestamp()

			if (uGang.carregamentoAtivo)
				embed.addField("Carregamento atual", uGang.carregamento > currTime ? `${bot.segToHour((uGang.carregamento - currTime) / 1000)}\n${esquema}` : `Chegou ${bot.config.carregamento}`, true)


			function getRowBase() {
				let btnImportar = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Importar')
					.setEmoji(bot.config.carregamento)
					.setDisabled(uGang.estoque === 5)
					.setCustomId(message.id + message.author.id + 'importar')

				let btnExportar = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Exportar')
					.setEmoji(bot.config.carregamento)
					.setDisabled(uGang.estoque === 0)
					.setCustomId(message.id + message.author.id + 'exportar')

				let btnUpgrade = new Discord.MessageButton()
					.setStyle('SUCCESS')
					.setLabel('Upgrade')
					.setDisabled(uGang.baseLevel >= 10)
					.setCustomId(message.id + message.author.id + 'upgrade')

				let btnMembros = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Membros')
					.setCustomId(message.id + message.author.id + 'membros')

				let row = new Discord.MessageActionRow()

				if (isLider(uGang, message.author.id) || isVice(uGang, message.author.id))
					row.addComponents(btnImportar).addComponents(btnExportar).addComponents(btnUpgrade)

				row.addComponents(btnMembros)

				return row
			}


			let msg = await message.channel.send({embeds: [embed], components: [getRowBase()]})
				.catch(() => console.log("Não consegui enviar mensagem `gg base`"))

			const filter = (button) => [
				message.id + message.author.id + 'importar',
				message.id + message.author.id + 'exportar',
				message.id + message.author.id + 'upgrade',
				message.id + message.author.id + 'membros',
			].includes(button.customId) && button.user.id === message.author.id

			const collector = message.channel.createMessageComponentCollector({
				filter,
				time: 90000,
			})

			collector.on('collect', async b => {
				await b.deferUpdate()
				if (b.customId === message.id + message.author.id + 'importar')
					bot.commands.get('gang').run(bot, message)
				else if (b.customId === message.id + message.author.id + 'exportar')
					bot.commands.get('gang').run(bot, message)
				else if (b.customId === message.id + message.author.id + 'upgrade')
					bot.commands.get('gang').run(bot, message)
				else if (b.customId === message.id + message.author.id + 'membros')
					bot.commands.get('gang').run(bot, message)
			})

			collector.on('end', async () => {
				msg.edit({components: []})
			})

		}
		else {
			if (args[1] === 'comprar') {
				if (!uGang)
					return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

				if (!isLider(uGang, message.author.id))
					return bot.createEmbed(message, `Somente o líder pode administrar a base da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

				if (uData.preso > currTime)
					return bot.msgPreso(message, uData)

				if (uGang.base != null)
					return bot.createEmbed(message, `Sua gangue **${uGang.nome}** já possui uma base ${getIcone(uGang.boneco)}`, null, uGang.cor)

				if (!args[2] || args[2] < 1 || (args[2] % 1 !== 0) || args[2] > 3)
					return bot.createEmbed(message, `O ID deve ser entre 1 e 3 ${getIcone(uGang.boneco)}`, null, uGang.cor)

				if (uGang.caixa < 2000000)
					return bot.createEmbed(message, `Sua gangue **${uGang.nome}** não possui dinheiro suficiente em caixa para fazer isto ${getIcone(uGang.boneco)}`, null, uGang.cor)

				Object.entries(bot.bases).forEach(([key, value]) => {
					if (value.id == args[2])
						uGang.base = key
				})

				uGang.baseLevel = 1
				uGang.espacoMembro += 1
				// uGang.tempoCarregamento = 24
				// uGang.chanceCarregamento = 35
				uGang.caixa -= 2000000
				bot.gangs.set(uData.gangID.toString(), uGang)

				return bot.createEmbed(message, `Você comprou a base **${bot.bases[uGang.base].desc}** para a gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, uGang.cor)

			}
			else if (args[1] === 'upgrade') {
				if (!uGang)
					return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

				if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
					return bot.createEmbed(message, `Somente o líder e vice-líder pode administrar a base da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

				if (uData.preso > currTime)
					return bot.msgPreso(message, uData)

				if (uGang.base == null)
					return bot.createEmbed(message, `Sua gangue **${uGang.nome}** ainda não possui uma base ${getIcone(uGang.boneco)}`, null, uGang.cor)

				if (uGang.baseLevel >= 10)
					return bot.createEmbed(message, `Sua gangue **${uGang.nome}** está no nível máximo ${getIcone(uGang.boneco)}`, null, uGang.cor)

				const prox_valor_max_gang = 500000 + (350000 * (uGang.baseLevel + 1))
				let custo = Math.floor(500000 + ((1250000 * uGang.baseLevel) ** 1.12))
				let prox_beneficios = `Espaço para membro: +1\nDEF da base: +5\nValor máximo diário de depósito: R$ ${prox_valor_max_gang.toLocaleString().replace(/,/g, ".")}\nTempo de carregamentos: -2 horas\nChance de sucesso em carregamentos: +2%\nTempo até depositar novamente: -1 hora\n`
				message.channel.send({
					embeds:
						[new Discord.MessageEmbed()
							.setDescription(`${getIcone(uGang.boneco)} **${bot.bases[uGang.base].desc}** de **${uGang.nome}**\n\nBenefícios do próximo nível (${uGang.baseLevel + 1}):\n${prox_beneficios}\nCusto para fazer upgrade: R$ ${custo.toLocaleString().replace(/,/g, ".")}\nConfirmar?`)
							.setColor(uGang.cor)
							.setFooter(`${uGang.nome} • Caixa: R$ ${uGang.caixa.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
							.setTimestamp()]
				})
					.then(msg => {
						msg.react('✅').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {
							const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id

							const confirm = msg.createReactionCollector({
								filter,
								max: 1,
								time: 60000,
								errors: ['time'],
							})

							confirm.on('collect', () => {
								if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
									.then(() => {
										uGang = bot.gangs.get(uData.gangID)
										if (uGang.carregamentoAtivo)
											return bot.createEmbed(message, `Você não pode dar upgrade na base enquanto um carregamento está ativo ${getIcone(uGang.boneco)}`, null, uGang.cor)
										if (uGang.baseLevel === 10)
											return bot.createEmbed(message, `Sua gangue **${uGang.nome}** está no nível máximo ${getIcone(uGang.boneco)}`, null, uGang.cor)
										if (uGang.caixa < custo)
											return bot.createEmbed(message, `Sua gangue **${uGang.nome}** não possui dinheiro suficiente em caixa para fazer isto ${getIcone(uGang.boneco)}`, null, uGang.cor)

										uGang.caixa -= custo
										// if ((uGang.baseLevel + 1) % 2 == 0)
										uGang.espacoMembro += 1
										uGang.baseLevel += 1
										// uGang.baseDEF += 5
										// uGang.tempoCarregamento -= 1
										// uGang.chanceCarregamento += 1
										bot.gangs.set(uData.gangID.toString(), uGang)
										msg.edit({
											embeds: [new Discord.MessageEmbed()
												.setDescription(`A base **${bot.bases[uGang.base].desc}** de **${uGang.nome}** foi melhorada! ${getIcone(uGang.boneco)}\n${prox_beneficios}`)
												.setColor(uGang.cor)
												.setFooter(`${uGang.nome} • Caixa: R$ ${uGang.caixa.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
												.setTimestamp()
											]
										}).catch(() => console.log("Não consegui editar mensagem `gang`"))
									})
							})
						})
					}).catch(() => console.log("Não consegui enviar mensagem `gg base`"))
			}
		}

	}
	else if (option === 'comunicar') { //lider e vice
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder e více-lider podem enviar comunicados para a gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (!args[1])
			return bot.createEmbed(message, `Insira uma mensagem para ser enviada a todos os membros da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, uGang.cor)

		option = args[0]
		let comunicado = args.join(" ").replace(option, "")

		if (comunicado.length > 1024)
			return bot.createEmbed(message, `A mensagem não pode ultrapassar 1024 caracteres ${getIcone(uGang.boneco)}`, null, uGang.cor)

		const comunicado_embed = new Discord.MessageEmbed()
			.setAuthor(`Comunicado da gangue ${uGang.nome}`, uGang.icone)
			.setColor(uGang.cor)
			.setDescription(comunicado)
			.setFooter(isLider(uGang, message.author.id) ? `Líder ${uData.username}` : `Vice-líder ${uData.username}`, message.member.user.avatarURL())
			.setTimestamp()

		uGang.membros.forEach(membro => {
			bot.users.fetch(membro.id).then(user =>
				user.send({embeds: [comunicado_embed]})
					.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`))
			)
		})

		return bot.createEmbed(message, `Comunicado enviado! ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'importar' || option === 'i' || option === 'imp') { //lider e vice
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)
		let currTime = new Date().getTime()

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode gerenciar carregamentos para a gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uGang.baseLevel === 0)
			return bot.createEmbed(message, `Sua gangue não pode importar sem uma base`, null, uGang.cor)

		if (uGang.estoque >= 5)
			return bot.createEmbed(message, `O depósito da gang **${uGang.nome}** está cheio! Exporte ou utilize alguns itens ${getIcone(uGang.boneco)}`, null, uGang.cor)

		let custo = 150000 + (350000 * uGang.baseLevel)

		if (args[1] === "parar") {
			uGang.caixa += Math.floor(custo / 3 * 2)
			uGang.carregamento = currTime
			uGang.carregamentoAtivo = false

			bot.gangs.set(uData.gangID.toString(), uGang)

			return bot.createEmbed(message, `Você parou o carregamento da gangue **${uGang.nome}**. R$ ${(Math.floor(custo / 3 * 2)).toLocaleString().replace(/,/g, ".")} foram devolvidos ao caixa da gangue. ${getIcone(uGang.boneco)}`, null, uGang.cor)
		}

		if (uGang.carregamento > currTime && uGang.carregamentoAtivo)
			return bot.createEmbed(message, `Faltam ${bot.segToHour((uGang.carregamento - currTime) / 1000)} até o carregamento chegar ${bot.config.carregamento}`, null, uGang.cor)

		if (uGang.carregamento < currTime && uGang.carregamentoAtivo) {

			if (uData.preso > currTime)
				return bot.msgPreso(message, uData)
			if (uData.hospitalizado > currTime)
				return bot.msgHospitalizado(message, uData)

			let chance = bot.getRandom(0, 100)

			let chanceCarregamento = 35 + uGang.baseLevel * 2
			if (uGang.base === 'motoclube')
				chanceCarregamento = 35 + uGang.baseLevel * 3

			if (chance < chanceCarregamento) {
				uGang.estoque += 1
				uGang.carregamentoAtivo = false
				bot.gangs.set(uData.gangID.toString(), uGang)

				uGang.membros.forEach(membro => {
					bot.users.fetch(membro.id).then(user => {
						user.send(`O carregamento chegou em segurança no **${bot.bases[uGang.base].desc}** da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`)
							.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`))
					})
				})

				return bot.createEmbed(message, `O carregamento chegou em segurança no **${bot.bases[uGang.base].desc}** da gangue **${uGang.nome}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

			}
			else {
				uGang.carregamentoAtivo = false
				bot.gangs.set(uData.gangID.toString(), uGang)

				let textos = [
					'Seu carregamento foi roubado!',
					'O motorista parou na estrada para comer um travesti e foi sequestrado. Sua carga foi perdida.',
					'Cadê o caminhão? O motorista deve ter se perdido no caminho das curvas da sua mãe.',
					'O caminhão chegou, mas carregado de frutas? Alguém sabotou o carregamento!',
					'O motorista foi atacado por uma gangue de palhaços em fuscas rosas que levaram sua carga para a Terra do Nunca.',
					'O caminhão ficou parado em Curitiba e a Polícia Federal apreendeu o carregamento.',
					'O caminhão não está aqui. O motorista ligou e disse que já está em outro país.'
				]
				let texto = bot.shuffle(textos)[0]

				uGang.membros.forEach(membro => {
					bot.users.fetch(membro.id).then(user => {
						user.send(`${texto} Tenha mais sorte da próxima vez ${getIcone(uGang.boneco)}`)
							.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`))
					})
				})

				return bot.createEmbed(message, `${texto} Tenha mais sorte da próxima vez ${getIcone(uGang.boneco)}`, null, uGang.cor)
			}
		}

		// let custo = 250000 + (500000 * uGang.baseLevel)
		message.channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setDescription(`Importar carregamentos para a base **${bot.bases[uGang.base].desc}** de **${uGang.nome}** ${getIcone(uGang.boneco)}\n\nCusto de importação: R$ ${custo.toLocaleString().replace(/,/g, ".")}\nTempo de espera: ${(uGang.base === 'aeroporto' ? 23 : 26) - uGang.baseLevel * 2} horas\nConfirmar?`)
					.setColor(uGang.cor)
					.setFooter(`${uGang.nome} • Caixa: R$ ${uGang.caixa.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
					.setTimestamp()
			]
		})
			.then(msg => {
				msg.react('✅').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {
					const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id

					const confirm = msg.createReactionCollector({
						filter,
						max: 1,
						time: 60000,
						errors: ['time'],
					})

					confirm.on('collect', () => {
						if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
							.then(() => {
								uGang = bot.gangs.get(uData.gangID)
								if (uData.preso > currTime)
									return bot.msgPreso(message, uData)
								if (uData.hospitalizado > currTime)
									return bot.msgHospitalizado(message, uData)
								if (uGang.carregamento > currTime && uGang.carregamentoAtivo)
									return bot.createEmbed(message, `Sua gangue **${uGang.nome}** já possui um carregamento em transporte ${getIcone(uGang.boneco)}`, null, uGang.cor)
								if (uGang.caixa < custo)
									return bot.createEmbed(message, `Sua gangue **${uGang.nome}** não possui dinheiro suficiente em caixa para fazer isto ${getIcone(uGang.boneco)}`, null, uGang.cor)

								let multiplicadorEventoCarregamento = 1
								uGang.caixa -= custo
								uGang.carregamento = currTime + (((uGang.base === 'aeroporto' ? 23 : 26) - uGang.baseLevel * 2) * 60 * 60 * 1000 * multiplicadorEventoCarregamento) //currTime + (((uGang.base == 'aeroporto' ? 23 : 26) - uGang.baseLevel * 2) * 60 * 60 * 1000)
								uGang.carregamentoAtivo = true

								bot.gangs.set(uData.gangID.toString(), uGang)

								setTimeout(() => {
									bot.users.fetch(message.author.id).then(user =>
										user.send(`O carregamento da gangue chegou? Venha conferir! ${bot.config.carregamento}`).catch()
									)
								}, uGang.carregamento - currTime)

								return msg.edit({
									embeds: [new Discord.MessageEmbed()
										.setDescription(`Sua gangue **${uGang.nome}** começou a importar! ${bot.config.carregamento}`)
										.setColor(uGang.cor)
										.setFooter(`${uGang.nome} • Caixa: R$ ${uGang.caixa.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
										.setTimestamp()
									]
								}).catch(() => console.log("Não consegui editar mensagem `gang`"))
							})
					})

				})
			}).catch(() => console.log("Não consegui enviar mensagem `gg importar`"))

	}
	else if (option === 'exportar' || option === 'e' || option === 'exp') { //lider e vice
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode gerenciar carregamentos para a gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uGang.baseLevel === 0)
			return bot.createEmbed(message, `Sua gangue não pode exportar sem uma base`, null, uGang.cor)

		if (uGang.estoque <= 0)
			return bot.createEmbed(message, `O depósito da gang **${uGang.nome}** está vazio! Importe carregamentos para depois vendê-los ${getIcone(uGang.boneco)}`, null, uGang.cor)

		uGang.estoque -= 1

		let multiplicador_evento_carregamento = 1

		let venda = bot.getRandom(2000000 * uGang.baseLevel * multiplicador_evento_carregamento, 3000000 * uGang.baseLevel * multiplicador_evento_carregamento)

		let adicionalCaixa = 1

		let parte = Math.floor(venda / (uGang.membros.length + adicionalCaixa))

		uGang.membros.forEach(membro => {
			let userD = bot.data.get(membro.id)
			userD.moni += parte
			bot.data.set(membro.id, userD)
			bot.users.fetch(membro.id).then(user => {
				user.send(`Sua gangue **${uGang.nome}** exportou um carregamento no valor de R$ ${venda.toLocaleString().replace(/,/g, ".")}.\nCada membro recebeu R$ ${parte.toLocaleString().replace(/,/g, ".")}. Foram depositados R$ ${parte.toLocaleString().replace(/,/g, ".")} no caixa da gangue. ${getIcone(uGang.boneco)}`)
					.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${membro.id})`))
			})
		})

		uGang.caixa += parte
		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `Sua gangue **${uGang.nome}** exportou um carregamento no valor de R$ ${venda.toLocaleString().replace(/,/g, ".")}.\nCada membro recebeu R$ ${parte.toLocaleString().replace(/,/g, ".")}. Foram depositados R$ ${parte.toLocaleString().replace(/,/g, ".")} no caixa da gangue. ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'golpe') { //lider e vice
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)
		let currTime = new Date().getTime()
		let day = new Date().getDay()

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
			return bot.createEmbed(message, `Somente os líderes podem orquestrar um golpe para a gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)
		// return bot.createEmbed(message, `"Seguinte, **${uGang.nome}**, o prefeito aumentou a segurança do ${bot.config.cash} Banco devido aos recentes ataques. Vamos esperar a poeira baixar para atacar." ${bot.config.thetruth}`, null, uGang.cor)
		if ((day !== 1 && day !== 3 && day !== 5) && (message.author.id !== bot.config.adminID))
			return bot.createEmbed(message, `"**${uGang.nome}**, hein? Vamos fazer uma baguncinha? Venha me ver Segunda, Quarta ou Sexta." ${bot.config.thetruth}`, null, uGang.cor)
		if (uGang.baseLevel === 0)
			return bot.createEmbed(message, `Sua gangue não pode realizar um golpe sem uma base`, null, uGang.cor)

		let bonus = 0
		if (uGang.golpeMissao1.concluido)
			bonus += 4
		if (uGang.golpeMissao2.concluido)
			bonus += 2
		if (uGang.golpeMissao3.concluido)
			bonus += 5
		let texto = ''

		const embed = new Discord.MessageEmbed()
			.setTitle(`${getIcone(uGang.boneco)} Golpes`)
			.setColor(uGang.cor)
			.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/767514405759090708/radar_THETRUTH.png')
			.setDescription(`"Vocês querem causar confusão e ganhar muito dinheiro? Entre, vamos conversar!"\n\nVocê e sua gangue podem partir direto para o roubo principal, ou realizar outras missões antes, para aumentar a chance de sucesso do principal.\n\n**Missões:**`)
			.addField(":file_folder: Roubar planta do Banco", "**Chance:** 10% + 2% por membro participante\n**Bônus:** +4% de sucesso")
			.addField(":red_car: Comprar carros de fuga", "**Custo:** R$ 8.000.000\n**Bônus:** +2% de sucesso")
			.addField(":computer: Hackear sistema de câmeras", "**Chance:** 15% + 1% por membro participante\n**Bônus:** +5% de sucesso")
			.addField("Alvo atual", `${bot.config.cash} **Banco**`, true)
			.addField(`Bônus atual`, `${bonus}%`, true)
			.setFooter(`${uData.username} • ${uGang.nome}`, message.member.user.avatarURL())
			.setTimestamp()

		let bancoEmoji = '539497634826551307'

		message.channel.send({embeds: [embed]}).then(msg => {
			msg.react('📁')
				.then(() => msg.react('🚗'))
				.then(() => msg.react('💻'))
				.then(() => msg.react(bancoEmoji))
				.catch(() => console.log("Não consegui reagir mensagem `gang`"))
				.then(() => {
					const filter = (reaction, user) => (['📁', '🚗', '💻'].includes(reaction.emoji.name) || reaction.emoji.id === bancoEmoji) && user.id === message.author.id

					const collector = msg.createReactionCollector({
						filter,
						max: 1,
						time: 60000,
						errors: ['time'],
					})

					collector.on('collect', r => {
						if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
						uData = bot.data.get(message.author.id)
						uGang = bot.gangs.get(uData.gangID)
						currTime = new Date().getTime()

						if (uData.preso > currTime)
							return bot.msgPreso(message, uData)

						if (uData.hospitalizado > currTime)
							return bot.msgHospitalizado(message, uData)

						if (uData.roubo > currTime)
							return bot.createEmbed(message, `Você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((uData.roubo - currTime) / 1000))} ${bot.config.police}`, null, bot.colors.policia)

						if (bot.isUserEmRouboOuEspancamento(message, uData))
							return

						if (bot.isGaloEmRinha(message.author.id))
							return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

						if (uData.job != null)
							return bot.msgTrabalhando(message, uData)

						if (!uGang)
							return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

						if (!isLider(uGang, message.author.id) && !isVice(uGang, message.author.id))
							return bot.createEmbed(message, `Somente o líder pode orquestrar um golpe para a gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

						if (r.emoji.name === '📁') {
							if (uGang.golpeMissao1.concluido)
								return bot.createEmbed(message, `Sua gangue já roubou a 📁 **Planta do Banco** ${getIcone(uGang.boneco)}`, null, uGang.cor)

							if (uGang.golpeMissao1.time > currTime)
								return bot.createEmbed(message, `Sua gangue deve esperar mais ${bot.segToHour((uGang.golpeMissao1.time - currTime) / 1000)} para tentar roubar novamente a 📁 **Planta do Banco** ${getIcone(uGang.boneco)}`, null, uGang.cor)

							let chance = 10
							let players = []

							uData.emRoubo = {
								tempo: currTime + 91000,
								user: '📁 Planta do Banco',
								isAlvo: false
							}

							bot.data.set(message.author.id, uData)
							//let players_negados = []
							players.push(message.author.id)

							texto = uData.username + "\n"

							const embed_robb = new Discord.MessageEmbed()
								.setTitle(`${getIcone(uGang.boneco)} Roubar Planta do Banco`)
								.setDescription(`Chance atual: ${chance}%`)
								.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/770082883578495087/file-folder_1f4c1.png')
								.addField(`Membros [${players.length}/${uGang.espacoMembro}]`, texto)
								.setFooter(`${uGang.nome} • Clique na reação para participar!`, uGang.icone)
								.setColor(uGang.cor)

							message.channel.send({embeds: [embed_robb]}).then(msg => {
								msg.react('📁').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {

									const filter = (reaction, user) => reaction.emoji.name === '📁' && user.id !== bot.user.id && !players.includes(user.id)

									const collector = msg.createReactionCollector({
										filter,
										time: 60000,
										errors: ['time']
									})

									collector.on('collect', r => {
										let newplayer = r.users.cache.last()
										let jogador = bot.data.get(newplayer.id)
										currTime = new Date().getTime()

										if (players.length <= uGang.espacoMembro && !players.includes(newplayer.id)) { // !players_negados.includes(newplayer.id)
											if (jogador.preso > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está preso por mais ${bot.segToHour(Math.floor((jogador.preso - currTime) / 1000))} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
											else if (jogador.hospitalizado > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está hospitalizado por mais ${bot.segToHour(Math.floor((jogador.hospitalizado - currTime) / 1000))} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.background)
											else if (jogador.gangID !== uData.gangID)
												bot.createEmbed(message, `**${jogador.username}**, você não faz parte da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, bot.colors.background)
											else if (jogador.roubo > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((jogador.roubo - currTime) / 1000))} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
											else if (jogador.job != null)
												bot.createEmbed(message, `**${jogador.username}**, você está trabalhando e não pode fazer isto ${bot.config.trabalhando}`, bot.jobs[jogador.job].desc, bot.colors.background)
											else if (jogador.emRoubo.tempo > currTime || jogador.emEspancamento.tempo > currTime)
												bot.isUserEmRouboOuEspancamento(message, jogador)
											else if (bot.isPlayerViajando(jogador))
												bot.msgPlayerViajando(message, jogador, jogador.username)
											else if (bot.isGaloEmRinha(newplayer.id))
												bot.createEmbed(message, `**${jogador.username}**, seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.background)
											else {
												jogador.emRoubo = {
													tempo: currTime + 91000,
													user: '📁 Planta do Banco',
													isAlvo: false
												}
												bot.data.set(newplayer.id, jogador)
												players.push(newplayer.id)
												if (players.length === uGang.espacoMembro)
													collector.stop()
												// copia o campo do embed pra um novo objeto
												let embedField = Object.assign({}, embed_robb.fields[0])

												texto += `${jogador.username}\n`
												embedField.name = `Membros [${players.length}/${uGang.espacoMembro}]`
												embedField.value = texto
												chance += uGang.base === 'motoclube' ? 2.5 : 2

												const newEmbed = new Discord.MessageEmbed({
													title: embed_robb.title,
													description: `Chance atual: ${chance.toFixed(2)}%`,
													thumbnail: embed_robb.thumbnail,
													color: embed_robb.color,
													footer: embed_robb.footer,
													fields: [embedField]
												})

												r.message.edit({embeds: [newEmbed]})
													.catch(() => console.log("Não consegui editar mensagem `gang`"))
											}
										}
									})

									collector.on('end', async () => {
										let robbing = bot.getRandom(0, 100)

										const embed_robb_inicio = new Discord.MessageEmbed()
											//.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770082883578495087/file-folder_1f4c1.png`)
											.setDescription(`📁 Roubo em andamento...`)
											.setFooter(uGang.nome, uGang.icone)
											.setColor(uGang.cor)

										message.channel.send({embeds: [embed_robb_inicio]}).then(message_robb => {
											setTimeout(() => {
												if (robbing < chance) {
													uGang.golpeMissao1.concluido = true
													uGang.golpeMissao1.time = currTime + 21600000 // 6h
													players.forEach(membro => {
														let userD = bot.data.get(membro)
														userD.roubo = currTime + ((userD.classe === 'ladrao' ? Math.round(1.15 * 2700000) : (userD.classe === 'advogado' ? Math.round(0.85 * 2700000) : 2700000))) //+45m
														userD.roubosW++
														userD.emRoubo.tempo = 0
														setTimeout(() => {
															bot.users.fetch(membro).then(user => {
																user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
																	.catch(() => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
																		.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															})
														}, 2700000)
														bot.data.set(membro, userD)
													})
													bot.gangs.set(uData.gangID.toString(), uGang)
													const embed_robb_final = new Discord.MessageEmbed()
														.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770082883578495087/file-folder_1f4c1.png`)
														.setDescription(`Sua gangue **${uGang.nome}** conseguiu com sucesso 📁 **Roubar a Planta do Banco**! ${getIcone(uGang.boneco)}`)
														.setFooter(uGang.nome, uGang.icone)
														.setColor(uGang.cor)
													return message_robb.edit({
														embeds: [embed_robb_final]
													}).catch(() => console.log("Não consegui editar mensagem `gang`"))

												}
												else {
													let tempo_preso = bot.getRandom(14400000, 18000000) //4h a 5h
													uGang.golpeMissao1.concluido = false
													uGang.golpeMissao1.time = currTime + 21600000 // 6h
													players.forEach(membro => {
														let userD = bot.data.get(membro)
														userD.preso = currTime + (userD.classe === 'ladrao' ? Math.floor(tempo_preso * 1.15) : tempo_preso)
														userD.roubosL++
														userD.emRoubo.tempo = 0
														bot.data.set(membro, userD)
														setTimeout(() => {
															bot.users.fetch(membro).then(user => {
																user.send(`Você está livre! ${bot.config.police}`)
																	.catch(() => message.reply(`você está livre! ${bot.config.police}`)
																		.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															})
														}, tempo_preso)

														setTimeout(() => {
															bot.users.fetch(membro).then(user => {
																user.send(`Sua gangue **${uGang.nome}** já pode tentar 📁 **Roubar a Planta do Banco** novamente! ${bot.config.police}`)
																	.catch(() => message.reply(`sua gangue **${uGang.nome}** já pode tentar 📁 **Roubar a Planta do Banco** novamente! ${bot.config.police}`)
																		.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															})
														}, 21600000)
													})
													bot.gangs.set(uData.gangID.toString(), uGang)
													const embed_robb_final = new Discord.MessageEmbed()
														.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770082883578495087/file-folder_1f4c1.png`)
														.setDescription(`Deu ruim! Vocês foram pegos enquanto tentavam escapar!\nSua gangue **${uGang.nome}** falhou em 📁 **Roubar a Planta do Banco**, e todos os membros presentes ficarão presos por ${bot.segToHour(tempo_preso / 1000)} ${bot.config.police}`)
														.setFooter(uGang.nome, uGang.icone)
														.setColor(uGang.cor)

													return message_robb.edit({embeds: [embed_robb_final]}).catch(() => console.log("Não consegui editar mensagem `gang`"))
												}
											}, 30000)
										}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))
									})
								})
							}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))

						}
						else if (r.emoji.name === '🚗') {
							if (uGang.golpeMissao2.concluido)
								return bot.createEmbed(message, `Sua gangue já comprou 🚗 **Carros de Fuga** ${getIcone(uGang.boneco)}`, null, uGang.cor)
							if (uGang.golpeMissao2.time > currTime)
								return bot.createEmbed(message, `Sua gangue deve esperar mais ${bot.segToHour((uGang.golpeMissao2.time - currTime) / 1000)} para comprar novos 🚗 **Carros de Fuga** ${getIcone(uGang.boneco)}`, null, uGang.cor)
							if (uGang.caixa < 8000000)
								return bot.createEmbed(message, `Sua gangue não tem dinheiro suficiente em caixa ${getIcone(uGang.boneco)}`, null, uGang.cor)

							uGang.caixa -= 8000000
							uGang.golpeMissao2.concluido = true
							uGang.golpeMissao2.time = currTime + 21600000 // 6h

							bot.gangs.set(uData.gangID.toString(), uGang)
							return bot.createEmbed(message, `Sua gangue comprou 🚗 **Carros de Fuga** para o golpe! ${getIcone(uGang.boneco)}`, null, uGang.cor)

						}
						else if (r.emoji.name === '💻') {
							if (uGang.golpeMissao3.concluido)
								return bot.createEmbed(message, `Sua gangue já hackeou o 💻 **Sistema de Câmeras** ${getIcone(uGang.boneco)}`, null, uGang.cor)
							if (uGang.golpeMissao3.time > currTime)
								return bot.createEmbed(message, `Sua gangue deve esperar mais ${bot.segToHour((uGang.golpeMissao3.time - currTime) / 1000)} para tentar hackear novamente o 💻 **Sistema de Câmeras** ${getIcone(uGang.boneco)}`, null, uGang.cor)

							let chance = 15
							let players = []

							uData.emRoubo = {
								tempo: currTime + 90000,
								user: '💻 Sistema de Câmeras',
								isAlvo: false
							}
							bot.data.set(message.author.id, uData)
							//let players_negados = []
							players.push(message.author.id)

							texto = uData.username + "\n"

							const embed_hack = new Discord.MessageEmbed()
								.setTitle(`${getIcone(uGang.boneco)} Hackear Sistema de Câmeras`)
								.setDescription(`Chance atual: ${chance}%`)
								.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/770082999072587846/laptop_1f4bb.png')
								.addField(`Membros [${players.length}/${uGang.espacoMembro}]`, texto)
								.setFooter(`${uGang.nome} • Clique na reação para participar!`, uGang.icone)
								.setColor(uGang.cor)

							message.channel.send({embeds: [embed_hack]}).then(msg => {
								msg.react('💻').catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {

									const filter = (reaction, user) => reaction.emoji.name === '💻' && user.id !== bot.user.id && !players.includes(user.id)

									const collector = msg.createReactionCollector({
										filter,
										time: 60000,
										errors: ['time']
									})

									collector.on('collect', r => {
										let newplayer = r.users.cache.last()
										let jogador = bot.data.get(newplayer.id)
										currTime = new Date().getTime()

										if (players.length <= uGang.espacoMembro && !players.includes(newplayer.id)) {
											if (jogador.preso > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está preso por mais ${bot.segToHour(Math.floor((jogador.preso - currTime) / 1000))} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
											else if (jogador.hospitalizado > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está hospitalizado por mais ${bot.segToHour(Math.floor((jogador.hospitalizado - currTime) / 1000))} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.background)
											else if (jogador.gangID !== uData.gangID)
												bot.createEmbed(message, `**${jogador.username}**, você não faz parte da gangue **${uGang.nome}** ${bot.config.gang}`, null, bot.colors.background)
											else if (jogador.roubo > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((jogador.roubo - currTime) / 1000))} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
											else if (jogador.job != null)
												bot.createEmbed(message, `**${jogador.username}**, você está trabalhando e não pode fazer isto ${bot.config.trabalhando}`, bot.jobs[jogador.job].desc, bot.colors.background)
											else if (jogador.emRoubo.tempo > currTime || jogador.emEspancamento.tempo > currTime)
												bot.isUserEmRouboOuEspancamento(message, jogador)
											else if (bot.isPlayerViajando(jogador))
												bot.msgPlayerViajando(message, jogador, jogador.username)
											else if (bot.isGaloEmRinha(newplayer.id))
												bot.createEmbed(message, `**${jogador.username}**, seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.background)
											else {
												jogador.emRoubo = {
													tempo: currTime + 91000,
													user: '💻 Sistema de Câmeras',
													isAlvo: false
												}
												bot.data.set(newplayer.id, jogador)
												players.push(newplayer.id)
												if (players.length === uGang.espacoMembro)
													collector.stop()
												// copia o campo do embed pra um novo objeto
												let embedField = Object.assign({}, embed_hack.fields[0])

												texto += `${jogador.username}\n`
												embedField.name = `Membros [${players.length}/${uGang.espacoMembro}]`
												embedField.value = texto
												chance += uGang.base === 'motoclube' ? 1.5 : 1

												const newEmbed = new Discord.MessageEmbed({
													title: embed_hack.title,
													description: `Chance atual: ${chance.toFixed(2)}%`,
													thumbnail: embed_hack.thumbnail,
													color: embed_hack.color,
													footer: embed_hack.footer,
													fields: [embedField]
												})

												r.message.edit({embeds: [newEmbed]})
													.catch(() => console.log("Não consegui editar mensagem `gang`"))
											}
										}
									})

									collector.on('end', async () => {
										let hacking = bot.getRandom(0, 100)

										const embed_hack_inicio = new Discord.MessageEmbed()
											//.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770082999072587846/laptop_1f4bb.png`)
											.setDescription(`💻 Hack em andamento...`)
											.setFooter(uGang.nome, uGang.icone)
											.setColor(uGang.cor)

										message.channel.send({
											embeds: [embed_hack_inicio]
										}).then(message_hack => {
											setTimeout(() => {
												if (hacking < chance) {
													uGang.golpeMissao3.concluido = true
													uGang.golpeMissao3.time = currTime + 21600000 // 6h
													players.forEach(membro => {
														let userD = bot.data.get(membro)
														userD.roubo = currTime + ((userD.classe === 'ladrao' ? Math.round(1.15 * 2700000) : (userD.classe === 'advogado' ? Math.round(0.85 * 2700000) : 2700000))) //+45m
														userD.emRoubo.tempo = 0
														setTimeout(() => {
															bot.users.fetch(membro).then(user =>
																user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
																	.catch(() => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
																		.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															)
														}, 2700000)
														setTimeout(() => {
															bot.users.fetch(membro).then(user =>
																user.send(`Sua gangue **${uGang.nome}** já pode tentar 💻 **Hackear o Sistema de Câmeras** novamente! ${getIcone(uGang.boneco)}`)
																	.catch(() => message.reply(`sua gangue **${uGang.nome}** já pode tentar 💻 **Hackear o Sistema de Câmeras** novamente! ${getIcone(uGang.boneco)}`)
																		.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															)
														}, 21600000)
														bot.data.set(membro, userD)
													})
													bot.gangs.set(uData.gangID.toString(), uGang)
													const embed_hack_final = new Discord.MessageEmbed()
														.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770082999072587846/laptop_1f4bb.png`)
														.setDescription(`Sua gangue **${uGang.nome}** conseguiu com sucesso 💻 **Hackear o Sistema de Câmeras**! ${getIcone(uGang.boneco)}`)
														.setFooter(uGang.nome, uGang.icone)
														.setColor(uGang.cor)

													return message_hack.edit({embeds: [embed_hack_final]})
														.catch(() => console.log("Não consegui editar mensagem `gang`"))

												}
												else {
													let tempo_preso = bot.getRandom(14400000, 18000000) //4h a 5h
													uGang.golpeMissao3.concluido = false
													uGang.golpeMissao3.time = currTime + 21600000 // 6h
													players.forEach(membro => {
														let userD = bot.data.get(membro)
														userD.preso = currTime + (userD.classe === 'ladrao' ? Math.floor(tempo_preso * 1.15) : tempo_preso)
														userD.roubosW++
														userD.emRoubo.tempo = 0
														bot.data.set(membro, userD)
														setTimeout(() => {
															bot.users.fetch(membro).then(user => {
																user.send(`Você está livre! ${bot.config.police}`)
																	.catch(() => message.reply(`você está livre! ${bot.config.police}`)
																		.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															})
														}, tempo_preso)
													})

													bot.gangs.set(uData.gangID.toString(), uGang)
													const embed_hack_final = new Discord.MessageEmbed()
														.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770082999072587846/laptop_1f4bb.png`)
														.setDescription(`Deu merda! A Polícia Federal rastreou o seu IP!\nSua gangue **${uGang.nome}** falhou em 💻 **Hackear o Sistema de Câmeras**, e todos os membros presentes ficarão presos por ${bot.segToHour(tempo_preso / 1000)} ${bot.config.police}`)
														.setFooter(uGang.nome, uGang.icone)
														.setColor(uGang.cor)

													return message_hack.edit({embeds: [embed_hack_final]})
														.catch(() => console.log("Não consegui editar mensagem `gang`"))
												}
											}, 30000)
										}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))
									})
								})
							}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))

						}
						else if (r.emoji.id === bancoEmoji) {
							if (uGang.golpeTime > currTime)
								return bot.createEmbed(message, `Sua gangue deve esperar mais ${bot.segToHour((uGang.golpeTime - currTime) / 1000)} para tentar roubar novamente o ${bot.config.cash} **Banco** ${getIcone(uGang.boneco)}`, null, uGang.cor)

							let atkPower = 0
							Object.entries(uData.arma).forEach(([key, value]) => {
								Object.values(bot.guns).forEach(arma => {
									if (value.tempo > currTime && arma.atk > atkPower && key === arma.data)
										atkPower = arma.atk
								})
							})
							if (uData.classe === 'mendigo')
								atkPower *= 0.9
							else if (uData.classe === 'assassino')
								atkPower *= 1.1
							let chance = uGang.base === 'motoclube' ? atkPower / 40 : atkPower / 50
							if (uGang.golpeMissao1.concluido)
								chance += 4
							if (uGang.golpeMissao2.concluido)
								chance += 2
							if (uGang.golpeMissao3.concluido)
								chance += 5

							let players = []

							uData.emRoubo = {
								tempo: currTime + 136000,
								user: `${bot.config.cash} BANCO`,
								isAlvo: false
							}
							bot.data.set(message.author.id, uData)
							//let players_negados = []
							players.push(message.author.id)

							texto = uData.username + "\n"

							const embed_bank = new Discord.MessageEmbed()
								.setTitle(`${getIcone(uGang.boneco)} ROUBAR BANCO`)
								.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770078593975320596/radar_cash.png`)
								.setDescription(`Chance atual: ${chance.toFixed(2)}%`)
								.addField(`Membros [${players.length}/${uGang.espacoMembro}]`, texto)
								.setFooter(`${uGang.nome} • Clique na reação para participar!`, uGang.icone)
								.setColor(uGang.cor)

							message.channel.send({embeds: [embed_bank]}).then(msg => {
								msg.react(bancoEmoji).catch(() => console.log("Não consegui reagir mensagem `gang`")).then(() => {

									const filter = (reaction, user) => reaction.emoji.id === bancoEmoji && user.id !== bot.user.id && !players.includes(user.id)

									const collector = msg.createReactionCollector({
										filter,
										time: 90000,
										errors: ['time']
									})

									collector.on('collect', r => {
										let newplayer = r.users.cache.last()
										let jogador = bot.data.get(newplayer.id)
										currTime = new Date().getTime()

										if (players.length <= uGang.espacoMembro && !players.includes(newplayer.id)) {
											if (jogador.preso > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está preso por mais ${bot.segToHour(Math.floor((jogador.preso - currTime) / 1000))} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
											else if (jogador.hospitalizado > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está hospitalizado por mais ${bot.segToHour(Math.floor((jogador.hospitalizado - currTime) / 1000))} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.background)
											else if (jogador.gangID !== uData.gangID)
												bot.createEmbed(message, `**${jogador.username}**, você não faz parte da gangue **${uGang.nome}** ${getIcone(uGang.boneco)}`, null, bot.colors.background)
											else if (jogador.roubo > currTime)
												bot.createEmbed(message, `**${jogador.username}**, você está sendo procurado pela polícia por mais ${bot.segToHour(Math.floor((jogador.roubo - currTime) / 1000))} e não pode fazer isto ${bot.config.police}`, null, bot.colors.background)
											else if (jogador.job != null)
												bot.createEmbed(message, `**${jogador.username}**, você está trabalhando e não pode fazer isto ${bot.config.trabalhando}`, bot.jobs[jogador.job].desc, bot.colors.background)
											else if (jogador.emRoubo.tempo > currTime || jogador.emEspancamento.tempo > currTime)
												bot.isUserEmRouboOuEspancamento(message, jogador)
											else if (bot.isPlayerViajando(jogador))
												bot.msgPlayerViajando(message, jogador, jogador.username)
											else if (bot.isGaloEmRinha(newplayer.id))
												bot.createEmbed(message, `**${jogador.username}**, seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.background)
											else {
												jogador.emRoubo = {
													tempo: currTime + 136000,
													user: `${bot.config.cash} BANCO`,
													isAlvo: false
												}
												bot.data.set(newplayer.id, jogador)
												players.push(newplayer.id)
												if (players.length === uGang.espacoMembro)
													collector.stop()
												// copia o campo do embed pra um novo objeto
												let embedField = Object.assign({}, embed_bank.fields[0])

												texto += `${jogador.username}\n`
												embedField.name = `Membros [${players.length}/${uGang.espacoMembro}]`
												embedField.value = texto
												let atkPower = 0
												Object.entries(jogador.arma).forEach(([key, value]) => {
													Object.values(bot.guns).forEach(arma => {
														if (value.tempo > currTime && arma.atk > atkPower && key === arma.data) {
															atkPower = arma.atk
														}
													})
												})
												if (jogador.classe === 'mendigo')
													atkPower *= 0.9
												else if (jogador.classe === 'assassino')
													atkPower *= 1.1
												chance += uGang.base === 'motoclube' ? atkPower / 40 : atkPower / 50

												const newEmbed = new Discord.MessageEmbed({
													title: embed_bank.title,
													description: `Chance atual: ${chance.toFixed(2)}%`,
													thumbnail: embed_bank.thumbnail,
													color: embed_bank.color,
													footer: embed_bank.footer,
													fields: [embedField]
												})

												r.message.edit({embeds: [newEmbed]})
													.catch(() => console.log("Não consegui editar mensagem `gang`"))
											}
										}
									})

									collector.on('end', async () => {
										let golpe = bot.getRandom(0, 100)
										uGang.golpeMissao1.concluido = false
										uGang.golpeMissao2.concluido = false
										uGang.golpeMissao3.concluido = false
										uGang.golpeTime = currTime + 86400000 // 24h

										const embed_bank_inicio = new Discord.MessageEmbed()
											//.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770078593975320596/radar_cash.png`)
											.setDescription(`${bot.config.cash} Roubo em andamento...`)
											.setFooter(uGang.nome, uGang.icone)
											.setColor(uGang.cor)

										message.channel.send({embeds: [embed_bank_inicio]}).then(message_bank => {
											setTimeout(() => {
												if (golpe < chance) {
													let porcentagem_roubada = uGang.base === "motoclube" ? bot.getRandom(10 + uGang.baseLevel, 20 + uGang.baseLevel) : bot.getRandom(10, 20)
													let valor_roubado = Math.floor(bot.banco.get('caixa') * porcentagem_roubada / 100)
													let adicional = 1 // caixa ganha 1
													let parte = Math.floor(valor_roubado / (players.length + adicional))

													players.forEach(membro => {
														let userD = bot.data.get(membro)
														userD.roubo = currTime + ((userD.classe === 'ladrao' ? Math.round(1.15 * 2700000) : (userD.classe === 'advogado' ? Math.round(0.85 * 2700000) : 2700000))) //+45m
														userD.moni += userD.classe === 'ladrao' ? Math.floor(parte * 1.1) : parte
														userD.emRoubo.tempo = 0
														setTimeout(() => {
															bot.users.fetch(membro).then(user => user.send(`Você já pode roubar novamente! ${bot.config.roubar}`)
																.catch(() => message.reply(`você já pode roubar novamente! ${bot.config.roubar}`)
																	.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															)
														}, 2700000)
														setTimeout(() => {
															bot.users.fetch(membro).then(user => user.send(`Sua gangue **${uGang.nome}** já pode tentar roubar o ${bot.config.cash} **Banco** novamente! ${getIcone(uGang.boneco)}`)
																.catch(() => message.reply(`sua gangue **${uGang.nome}** já pode tentar roubar o ${bot.config.cash} **Banco** novamente! ${getIcone(uGang.boneco)}`)
																	.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															)
														}, 86400000)
														bot.data.set(membro, userD)
													})
													bot.banco.set('caixa', bot.banco.get('caixa') - valor_roubado)
													uGang.valorRoubadoBanco += valor_roubado
													uGang.caixa += parte
													uGang.golpeW++
													bot.gangs.set(uData.gangID.toString(), uGang)

													const embed_bank_final = new Discord.MessageEmbed()
														//.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770078593975320596/radar_cash.png`)
														.setDescription(`BOA CARALHOOOOO!!!!\n\nSua gangue **${uGang.nome}** conseguiu com sucesso roubar R$ ${valor_roubado.toLocaleString().replace(/,/g, ".")} do ${bot.config.cash} **Banco**! ${getIcone(uGang.boneco)}\nCada membro recebeu R$ ${parte.toLocaleString().replace(/,/g, ".")}. Foram depositados R$ ${parte.toLocaleString().replace(/,/g, ".")} no caixa da gangue.`)
														.setFooter(uGang.nome, uGang.icone)
														.setColor(uGang.cor)

													return message_bank.edit({embeds: [embed_bank_final]})
														.catch(() => console.log("Não consegui editar mensagem `gang`"))

												}
												else {
													let tempo_preso = bot.getRandom(28800000, 36000000) //8h a 10h
													players.forEach(membro => {
														let userD = bot.data.get(membro)
														userD.preso = currTime + (userD.classe === 'ladrao' ? Math.floor(tempo_preso * 1.15) : tempo_preso)
														userD.roubosL++
														userD.emRoubo.tempo = 0
														bot.data.set(membro, userD)
														setTimeout(() => {
															bot.users.fetch(membro).then(user => user.send(`Você está livre! ${bot.config.police}`)
																.catch(() => message.reply(`você está livre! ${bot.config.police}`)
																	.catch(() => `Não consegui responder ${bot.data.get(membro, "username")} nem no PV nem no canal. \`Gang\``))
															)
														}, tempo_preso)
													})
													uGang.golpeL++
													bot.gangs.set(uData.gangID.toString(), uGang)

													const embed_bank_final = new Discord.MessageEmbed()
														//.setThumbnail(`https://media.discordapp.net/attachments/531174573463306240/770078593975320596/radar_cash.png`)
														.setDescription(`INÚTEIS!\n\nSua gangue **${uGang.nome}** falhou em roubar o ${bot.config.cash} **Banco**, e todos os membros presentes ficarão presos por ${bot.segToHour(tempo_preso / 1000)} ${bot.config.police}`)
														.setFooter(uGang.nome, uGang.icone)
														.setColor(uGang.cor)

													return message_bank.edit({embeds: [embed_bank_final]})
														.catch(() => console.log("Não consegui editar mensagem `gang`"))
												}
											}, 45000)
										}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))
									})
								})
							}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))
						}
					})
				})
		}).catch(() => console.log("Não consegui enviar mensagem `gg golpe`"))

	}
	else if (option === 'tag') { //lider
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode alterar a TAG da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (!args[1])
			return bot.createEmbed(message, `Insira uma TAG ${getIcone(uGang.boneco)}`, null, uGang.cor)

		option = args[0]
		let tag = args.join(" ").replace(option, "").replace(" ", "").toUpperCase()

		if (["criar", "info", "descricao", "nome", "cor", "imagem", "sair", "transferir", "convidar", "base", "comunicar", 'vice', 'importar', 'exportar', 'golpe', 'tag'].includes(args[1]))
			return bot.createEmbed(message, `Defina outra TAG ${getIcone(uGang.boneco)}`, `Esta TAG é inválida`, uGang.cor)

		let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{2,32}$/ugm
		if (!regex.test(tag))
			return bot.createEmbed(message, `Defina outra TAG ${getIcone(uGang.boneco)}`, `Esta TAG é inválida`, uGang.cor)

		let achou = false
		bot.gangs.forEach(gang => {
			if (gang !== '') {
				if (tag.toLowerCase() === gang.tag.toLowerCase())
					achou = true
			}

		})
		if (achou) return bot.createEmbed(message, `Esta TAG de gangue já está em uso ${getIcone(uGang.boneco)}`, null, uGang.cor)

		uGang.tag = tag.substring(0, tag.length)

		if (tag.length < 2 || tag.length > 3)
			return bot.createEmbed(message, `A TAG deve ter 2 ou 3 caracteres ${getIcone(uGang.boneco)}`, null, uGang.cor)

		bot.gangs.set(uData.gangID.toString(), uGang)

		return bot.createEmbed(message, `A TAG da gangue gangue **${uGang.nome}** foi definida como **${uGang.tag}**! ${getIcone(uGang.boneco)}`, null, uGang.cor)

	}
	else if (option === 'boneco' || option === 'icone') { //lider 
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if (!uGang)
			return bot.createEmbed(message, `Você não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

		if (!isLider(uGang, message.author.id))
			return bot.createEmbed(message, `Somente o líder pode alterar o ícone da gangue ${getIcone(uGang.boneco)}`, null, uGang.cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		const embed = new Discord.MessageEmbed()
			.setTitle(`${getIcone(uGang.boneco)} Ícone`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/754773460873510963/radar_gangP.png')
			.setDescription(`Escolha o ícone clicando na reação`)
			.setColor(uGang.cor)
			.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
			.setTimestamp()

		message.channel.send({embeds: [embed]}).then(msg => {

			let bonecos = ['754773626141540423', '758817092341334017', '758817092119035935', '758817092023091243',
				'890729902402318416', '890729902150664242', '890729902331006977', '890729901722845215', '890729902159044619', '890733727284625409'
			]
			bonecos.forEach(emoji => msg.react(emoji).catch(() => console.log("Não consegui reagir mensagem `gang` reação " + emoji)))

			const filter = (reaction, user) => bonecos.includes(reaction.emoji.id) && user.id === message.author.id

			const collector = msg.createReactionCollector({
				filter,
				idle: 60000
			})

			collector.on('collect', reaction => {
				if (msg) msg.reactions.removeAll().then(async () => {

					if (bonecos.includes(reaction.emoji.id))
						uGang.boneco = bonecos.indexOf(reaction.emoji.id)

					bot.gangs.set(uData.gangID.toString(), uGang)

					const embedEd = new Discord.MessageEmbed()
						.setTitle(`${getIcone(uGang.boneco)} Ícone`)
						.setDescription(`**Ícone alterado**`)
						.setColor(uGang.cor)
						.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
						.setTimestamp()

					return msg.edit({embeds: [embedEd]})
						.catch(() => console.log("Não consegui editar mensagem `gang`"))
				}).catch(() => console.log("Não consegui remover as reações mensagem `gang`"))

			})
			collector.on('end', () => {
				if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `gang`"))
			})

		}).catch(() => console.log("Não consegui enviar mensagem `gg icone`"))

	}
	else {
		let uData = bot.data.get(message.author.id)
		let uGang = bot.gangs.get(uData.gangID)

		if ((uData.gangID == null && !option) || option === 'info') {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.badges.topGangue_s6} Gangues`)
				.setColor('GREEN')
				.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/942895894628536420/TopGangue.png')
				.setDescription("Crie sua gangue e trabalhe em equipe! Participe de assaltos em grupo e lutas generalizadas [em breve]!\n\n**Custo para criar uma gangue: R$ 2.500.000**")
				.addField("Comandos Geral",
					`\`;gangue (gangue)/(@user)\` Exibe informações de uma gangue
\`;gangue criar <nome-da-gangue>\` Cria uma nova gangue
\`;gangue sair\` Abandona a gangue
\`;gangue info\` Mostra este menu
\`;gangue base info\` Informações sobre bases
\`;gangue base [gangue]\` Mostra a base de uma gangue
\`;gangue depositar <valor>\` Guarda dinheiro no caixa da gangue
\`;topgangue\` Exibe as gangues mais fortes`)

			if (uGang && isLider(uGang, message.author.id))
				embed.addField("Comandos Líder",
					`\`;gangue nome <novo-nome>\` Define um novo nome
\`;gangue descricao <nova-descrição>\` Define uma descrição
\`;gangue cor <nova-cor>\` Define uma cor
\`;gangue imagem <link-da-imagem>\` Define uma imagem
\`;gangue icone\` Define um ícone/boneco
\`;gangue tag <nova-tag>\` Define uma TAG
\`;gangue comunicar <mensagem>\` Envia uma mensagem a todos os membros
\`;gangue importar/exportar\` Compra e vende carregamentos
\`;gangue golpe\` Realiza golpes/heists
\`;gangue convidar <jogador>\` Convida um jogador 
\`;gangue expulsar <jogador> <motivo>\` Expulsar um jogador 
\`;gangue transferir <jogador>\` Transfere a liderança
\`;gangue vice <jogador>/remover\` Indica ou remove um Vice-Líder`)

			if (uGang && isVice(uGang, message.author.id))
				embed.addField("Comandos Vice-líder",
					`\`;gangue comunicar <mensagem>\` Envia uma mensagem a todos os membros
\`;gangue importar/exportar\` Compra e vende carregamentos
\`;gangue golpe\` Realiza golpes/heists
\`;gangue convidar <jogador>\` Convida um jogador 
\`;gangue expulsar <jogador> <motivo>\` Expulsar um jogador`)
					.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
					.setTimestamp()

			message.channel.send({embeds: [embed]})
				.catch(() => console.log("Não consegui enviar mensagem `gg info`"))

		}
		else {
			let uGang
			let uID

			if (!option)
				uGang = bot.gangs.get(uData.gangID)

			uID = uData.gangID

			if (option) {
				if (target) {
					let targetD = bot.data.get(target.id)
					if (!targetD)
						return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.gang}`, null, bot.colors.darkGrey)

					if (targetD.gangID == null)
						return bot.createEmbed(message, `Este usuário não está em uma gangue ${bot.config.gang}`, null, bot.colors.darkGrey)

					uGang = bot.gangs.get(targetD.gangID)
					uID = targetD.gangID

				}
				else {
					let name = args.join(" ").toLowerCase()
					bot.gangs.forEach((gang, id) => {
						if (gang !== '') {
							if (name === gang.nome.toLowerCase() || name === gang.tag.toLowerCase()) {
								uGang = bot.gangs.get(id)
								uID = id
							}
						}
					})
				}
			}

			if (!uGang)
				return bot.createEmbed(message, `Gangue não encontrada ${bot.config.gang}`, null, bot.colors.darkGrey)

			// let top = []
			// let topDeposito = []
			// uGang.membros.forEach((user, id) => {
			// 	top.push({
			// 		nick: bot.data.get(id, 'username'),
			// 		id: id,
			// 		deposito: user.depositado
			// 	})
			// })
			// topDeposito = top.sort((a, b) => b.deposito - a.deposito)

			let lider
			let vices = []
			let membros = []
			uGang.membros.forEach(membro => {
				if (membro.cargo === 'lider')
					lider = {
						id: membro.id,
						depositado: membro.depositado
					}
				else if (membro.cargo === 'vice')
					vices.push({
						id: membro.id,
						depositado: membro.depositado
					})
				else
					membros.push({
						id: membro.id,
						depositado: membro.depositado
					})
			})

			let lista_membros = `♦️ **${bot.data.get(lider.id, "username")}**\n`
			let lista_membros_ID = `♦️ **${lider.id}**\n`
			let lista_membros_deposits = `♦️ **${bot.data.get(lider.id, "username")}** R$ ${lider.depositado.toLocaleString().replace(/,/g, ".")}\n`
			let lista_membros_deposits2 = ''

			for (let vice of vices) {
				lista_membros += `:small_orange_diamond: ${bot.data.get(vice.id, "username")}\n`
				lista_membros_ID += `:small_orange_diamond: ${vice.id}\n`
				lista_membros_deposits += `:small_orange_diamond: **${bot.data.get(vice.id, "username")}** R$ ${vice.depositado.toLocaleString().replace(/,/g, ".")}\n`
			}
			for (let membro of membros) {
				lista_membros += `:white_small_square: ${bot.data.get(membro.id, "username")}\n`
				lista_membros_ID += `:white_small_square: ${membro.id}\n`
				if (lista_membros_deposits.length < 512)
					lista_membros_deposits += `:white_small_square: **${bot.data.get(membro.id, "username")}** R$ ${membro.depositado.toLocaleString().replace(/,/g, ".")}\n`
				else
					lista_membros_deposits2 += `:white_small_square: **${bot.data.get(membro.id, "username")}** R$ ${membro.depositado.toLocaleString().replace(/,/g, ".")}\n`
			}

			let nome_base = uGang.base == null ? "Não possui" : bot.bases[uGang.base].desc

			const embedWithoutID = new Discord.MessageEmbed()
				.setTitle(`${getIcone(uGang.boneco)} Gangue ${uGang.tag !== '' ? `[${uGang.tag}] ` : ``}${uGang.nome} ${uID === '100' ? bot.badges.topGangue_s4 : ''}`)
				.setColor(uGang.cor)
				.setDescription(uGang.desc)
				.setThumbnail(uGang.icone)
				.addField(`Membros [${uGang.membros.length}/${uGang.espacoMembro}]`, lista_membros, true)
				.addField("Base", `${nome_base} ${uGang.baseLevel > 0 ? uGang.baseLevel : ""}`, true)
				.addField("Total em caixa", `R$ ${uGang.caixa.toLocaleString().replace(/,/g, ".")}`, true)
				.setFooter(`${uData.username}${message.author.id === bot.config.adminID ? ` • ID: ${uID}` : ''}`, message.member.user.avatarURL())
				.setTimestamp()

			const embedWithID = new Discord.MessageEmbed()
				.setTitle(`${getIcone(uGang.boneco)} Gangue ${uGang.tag !== '' ? `[${uGang.tag}] ` : ``}${uGang.nome} ${uID === '100' ? bot.badges.topGangue_s4 : ''}`)
				.setColor(uGang.cor)
				.setDescription(uGang.desc)
				.setThumbnail(uGang.icone)
				.addField(`Membros [${uGang.membros.length}/${uGang.espacoMembro}]`, lista_membros_ID, true)
				.addField("Base", `${nome_base} ${uGang.baseLevel > 0 ? uGang.baseLevel : ""}`, true)
				.addField("Total em caixa", `R$ ${uGang.caixa.toLocaleString().replace(/,/g, ".")}`, true)
				.setFooter(`${uData.username}${message.author.id === bot.config.adminID ? ` • ID: ${uID}` : ''}`, message.member.user.avatarURL())
				.setTimestamp()

			const embedWithDeposits = new Discord.MessageEmbed()
				.setTitle(`${getIcone(uGang.boneco)} Gangue ${uGang.tag !== '' ? `[${uGang.tag}] ` : ``}${uGang.nome} ${uID === '100' ? bot.badges.topGangue_s4 : ''}`)
				.setColor(uGang.cor)
				.setDescription(uGang.desc)
				.setThumbnail(uGang.icone)
				.addField(`Depósito dos Membros`, lista_membros_deposits, true)
				.setFooter(`${uData.username}${message.author.id === bot.config.adminID ? ` • ID: ${uID}` : ''}`, message.member.user.avatarURL())
				.setTimestamp()

			if (lista_membros_deposits2 !== '')
				embedWithDeposits.addField(`Depósito dos Membros`, lista_membros_deposits2, true)

			function getRow({type = 'nomes'}) {

				let gang = bot.gangs.get(uID)
				let btnIDs = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Ver IDs')
					.setEmoji('🆔')
					.setCustomId(message.id + message.author.id + 'ids')

				let btnDeps = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Depósitos')
					.setEmoji('539572031436619777')
					.setCustomId(message.id + message.author.id + 'deps')

				let btnNomes = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Ver nomes')
					.setEmoji('🔡')
					.setCustomId(message.id + message.author.id + 'nomes')

				let btnBase = new Discord.MessageButton()
					.setStyle('SECONDARY')
					.setLabel('Base')
					.setDisabled(gang.base == null)
					.setCustomId(message.id + message.author.id + 'base')

				let row = new Discord.MessageActionRow()

				if (type === 'nomes') {
					if (uData.gangID === uID)
						row.addComponents(btnIDs).addComponents(btnDeps).addComponents(btnBase)
					else
						row.addComponents(btnIDs).addComponents(btnBase)

				}
				else if (type === 'ids') {
					if (uData.gangID === uID)
						row.addComponents(btnNomes).addComponents(btnDeps).addComponents(btnBase)
					else
						row.addComponents(btnNomes).addComponents(btnBase)

				}
				else if (type === 'deps') {
					if (uData.gangID === uID)
						row.addComponents(btnNomes).addComponents(btnIDs).addComponents(btnBase)
					else
						row.addComponents(btnNomes).addComponents(btnIDs)
				}

				return row
			}

			let msg = await message.channel.send({
				embeds: [embedWithoutID],
				components: [getRow({type: 'nomes'})]
			})

			const filter = (button) => [
				message.id + message.author.id + 'ids',
				message.id + message.author.id + 'deps',
				message.id + message.author.id + 'nomes',
				message.id + message.author.id + 'base',
			].includes(button.customId) && button.user.id === message.author.id

			const collector = message.channel.createMessageComponentCollector({
				filter,
				time: 90000,
			})

			collector.on('collect', async b => {
				await b.deferUpdate()

				if (b.customId === message.id + message.author.id + 'nomes') {
					msg.edit({
						embeds: [embedWithoutID],
						components: [getRow({type: 'nomes'})]
					}).catch(() => console.log("Não consegui editar mensagem `gang`"))

				}
				else if (b.customId === message.id + message.author.id + 'ids') {
					msg.edit({
						embeds: [embedWithID],
						components: [getRow({type: 'ids'})]
					}).catch(() => console.log("Não consegui editar mensagem `gang`"))

				}
				else if (b.customId === message.id + message.author.id + 'deps') {
					msg.edit({
						embeds: [embedWithDeposits],
						components: [getRow({type: 'deps'})]
					}).catch(() => console.log("Não consegui editar mensagem `gang`"))

				}
				else if (b.customId === message.id + message.author.id + 'base')
					bot.commands.get('gang').run(bot, message)

			})

			collector.on('end', async () => {
				msg.edit({components: []})
			})
		}
	}
}
exports.config = {
	alias: ['gg', 'gangue', 'mafia']
}