exports.run = async (bot, message, args) => {
	const Discord = require('discord.js');
	let option = args[0] ? args[0].toString().toLowerCase() : args[0]
	let targetMention = message.mentions.members.first()
	let targetNoMention = []
	let quantidade = args[1]
	let credito = 1000
	let uData = bot.data.get(message.author.id);
	let currTime = new Date().getTime()
	let vip = uData.vipTime > currTime ? true : false

	// if (vip) return message.reply(`Comando em testes ${bot.config.vip}`)

	if (option == 'credito') {
		if (uData._celular < currTime)
			return bot.createEmbed(message, `Você não possui um celular para comprar créditos ${bot.config.cellphone}`)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

		if (quantidade == 'allin' || quantidade == 'all' || quantidade == 'tudo') {
			quantidade = Math.floor(uData.moni / credito)
			if (uData.celularCredito + quantidade > 500)
				quantidade = 500 - uData.celularCredito

		} else if (quantidade < 1 || (quantidade % 1 != 0))
			return bot.createEmbed(message, `O valor inserido é inválido ${bot.config.cellphone}`)

		if (uData.celularCredito + Math.floor(quantidade) > 500)
			return bot.createEmbed(message, `Você pode possuir no máximo 500 créditos ${bot.config.cellphone}`)

		let price = quantidade * credito

		if (uData.moni < price)
			return bot.msgSemDinheiro(message)

		uData.moni -= price

		uData.lojaGastos += price

		bot.banco.set('caixa', bot.banco.get('caixa') + price * bot.imposto)

		uData.celularCredito += (parseInt(quantidade))
		bot.createEmbed(message, `Você comprou **${quantidade.toLocaleString().replace(/,/g, ".")} créditos** por R$ ${price.toLocaleString().replace(/,/g, ".")} ${bot.config.cellphone}`, `Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

		return bot.data.set(message.author.id, uData)

	} else if (option == 'sms') {
		let uData = bot.data.get(message.author.id)

		if (uData._celular < currTime)
			return bot.createEmbed(message, `Você não possui um celular para mandar SMS ${bot.config.cellphone}`)
		if (uData.celularCredito <= 0)
			return bot.createEmbed(message, `Você não possui créditos para mandar SMS ${bot.config.cellphone}`)
		if (uData.celularSmsBlock)
			return bot.createEmbed(message, `Você bloqueou o recebimento e envio de SMS ${bot.config.cellphone}`)

		if (!targetNoMention[0] && args[1] && !targetMention) { // para ver inventário sem pingar (funciona para outros servidores)
			let name = args.join(" ").replace(args[0], "").replace(" ", "").toLowerCase()

			bot.data.forEach((item, id) => {
				if (bot.data.has(id, "username") && item.username.toLowerCase() == name) // verifica se o usuário é um jogador
					targetNoMention.push(id)

				else if (id.toString() == name) {
					targetNoMention.push(id)
				}
			})

			if (!targetNoMention[0])
				return bot.createEmbed(message, "Usuário não encontrado")
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
		//let alvo = (target ? target.user : message.author);

		if (!targetMention && !targetNoMention[0])
			return bot.createEmbed(message, `Você deve inserir um usuário para enviar o SMS ${bot.config.cellphone}`)

		let tData = bot.data.get(alvo)
		if (!targetMention) targetMention = targetNoMention[0]

		if (!tData) return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.cellphone}`)

		if (tData._celular < currTime)
			return bot.createEmbed(message, `Este usuário não possui um celular para receber o SMS ${bot.config.cellphone}`)

		if (tData.celularSmsBlock)
			return bot.createEmbed(message, `Este usuário bloqueou o recebimento e envio de SMS ${bot.config.cellphone}`)

		const descricao_sms = new Discord.MessageEmbed()
			.setTitle(`✉️ SMS para ${tData.username}`)
			.setColor(bot.colors.darkGrey)
			.setDescription('Digite a mensagem e envie')
			.setFooter(`De: ${uData.username}`, message.member.user.avatarURL())
			.setTimestamp();
		message.channel.send({
				embeds: [descricao_sms]
			})
			.then(msg => {
				const filter = response => response.author.id == message.author.id
				const collector = message.channel.createMessageCollector({
					filter,
					time: 90000,
					max: 1,
				})

				collector.on('collect', m => {
					uData = bot.data.get(message.author.id)
					if (uData.celularCredito <= 0)
						return bot.createEmbed(message, `Você não possui créditos para mandar SMS ${bot.config.cellphone}`)
					if (uData.celularSmsBlock)
						return bot.createEmbed(message, `Você bloqueou o recebimento e envio de SMS ${bot.config.cellphone}`)
					tData = bot.data.get(alvo)
					if (tData._celular < currTime)
						return bot.createEmbed(message, `Este usuário não possui um celular para receber o SMS ${bot.config.cellphone}`)
					if (tData.celularSmsBlock)
						return bot.createEmbed(message, `Este usuário bloqueou o recebimento e envio de SMS ${bot.config.cellphone}`)

					let sms = m.content
					sms.replace(/\s/g, " ")

					if (sms.length < 1)
						return bot.createEmbed(message, `Você precisa mandar uma mensagem`)
					if (sms.length > 512)
						return bot.createEmbed(message, `Seu SMS é muito grande. Limite de Caracteres: 512`)

					descricao_sms.setDescription(sms)

					uData.celularCredito -= 1
					bot.data.set(message.author.id, uData)

					const sms_alvo = new Discord.MessageEmbed()
						//.setAuthor(`SMS de ${uData.username}`, message.member.user.avatarURL())
						.setTitle(`📩 Você recebeu um SMS!`)
						.setColor(bot.colors.darkGrey)
						.setDescription(sms)
						.setFooter(`De: ${uData.username}`, message.member.user.avatarURL())
						.setTimestamp();

					const sms_enviando = new Discord.MessageEmbed()
						.setTitle(`📨 Enviando SMS para ${tData.username}...`)
						.setColor(bot.colors.darkGrey)
						.setFooter(`De: ${uData.username}`, message.member.user.avatarURL())

					msg.edit({
						embeds: [sms_enviando]
					}).catch(err => console.log("Não consegui editar mensagem `casar`", err)).then(r => {
						setTimeout(() => {

							bot.users.fetch(alvo).then(user => user.send({
									embeds: [sms_alvo]
								})
								.catch(err => console.log(`Não consegui mandar mensagem privada para ${tData.username} (${alvo})`)))

							const sms_final = new Discord.MessageEmbed()
								.setTitle(`📨 SMS enviado para ${tData.username}!`)
								.setColor(bot.colors.darkGrey)
								.setDescription(sms)
								.setFooter(`De: ${uData.username}`, message.member.user.avatarURL())
								.setTimestamp();

							m.delete()

							bot.log(new Discord.MessageEmbed()
								.setDescription(`**${uData.username} enviou um SMS para ${tData.username}**`)
								.addField("Conteúdo da mensagem", `${sms}`)
								.setColor(message.member.displayColor) // bot.colors.background // 
							)

							return msg.edit({
								embeds: [sms_final]
							})
						}, vip ? 3000 : 10000)
					})
				})
			}).catch(err => console.log("Não consegui enviar mensagem `celular`", err))

	} else if (option == 'bloquear') {
		let uData = bot.data.get(message.author.id);

		if (uData._celular < currTime)
			return bot.createEmbed(message, `Você não possui um celular ${bot.config.cellphone}`)

		uData.celularSmsBlock = !uData.celularSmsBlock

		bot.data.set(message.author.id, uData)

		return bot.createEmbed(message, `Você **${uData.celularSmsBlock ? `bloqueou` : `desbloqueou`}** as mensagens do seu celular ${bot.config.cellphone}`)

	} else {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.cellphone} Celular`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/811388885593751562/cellphoneicon.png')
			.setColor('GREEN')
			.setDescription("Envie mensagens para outros usuários e realize ações na prisão!")
			.addField("SMS", "Mande memes, zoações ou mensagens de amor\n`;celular sms <jogador>`", true)
			.addField("Bloqueio", `Você pode bloquear o recebimento de SMS\n\`;celular bloquear\``, true)
			.addField("Prisão", `Tenha cuidado, pois se você for pego utilizando o celular, os policiais poderão aumentar seu tempo preso`)
			.addField("Adquira créditos", `Cada uso do celular consome um crédito. Cada crédito custa R$ ${credito.toLocaleString().replace(/,/g, ".")}\n\`;celular credito <quantidade>\``, true)
			.addField("Seus créditos", uData.celularCredito.toString(), true)
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp()
		message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `celular`", err))
	}
};

exports.config = {
	alias: ['cell', 'cel', 'fone', 'phone']
};