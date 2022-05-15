const {Permissions} = require('discord.js')
const Discord = require('discord.js')
const Piii = require('piii')
const piiiFilters = require('piii-filters')

module.exports = async (bot, message) => {
	if ((!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id) || bot.isAjudante(message.author.id))) && process.env.NODE_ENV === "test")
		return

	// if (message.author.id !== bot.config.adminID)
	// 	return

	// if (!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id) || bot.isAjudante(message.author.id) || await bot.data.get(message.author.id + ".vipTime") > Date.now()))
	// 	return

	if (message.author.bot) return

	if (message.channel.type === 'DM') return

	if (message.mentions.has(bot.user) && !message.content.startsWith(bot.config.prefix) && !message.mentions.everyone) return bot.createEmbed(message, `Olá! Meu prefixo é \`${bot.config.prefix}\`. Caso não saiba como começar a jogar, use \`/ajuda\`!`, null, 'GREEN')

	if (!message.content.startsWith(bot.config.prefix)) return

	const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g)

	const command = args.shift().toLowerCase()

	const cmd = bot.commands.get(command) || bot.commands.find(cmd => cmd.config && cmd.config.alias.includes(command))

	if (!cmd) return

	if (!message?.guild?.me) return

	await bot.data.ensure(message.author.id, bot.defaultCarteira)
	await bot.galos.ensure(message.author.id, bot.defaultGalo)

	if (!message.guild.me.permissions.has([Permissions.FLAGS.SEND_MESSAGES]))
		return message.author.send('<:badge_cata_bug:799043225557008474> **PERA!** Eu não possuo as permissões necessárias para o jogo rolar belezinha. Contate o Administrador deste Servidor.\n\nAs seguintes permissões são necessárias:\n`Gerenciar mensagens`, `Enviar mensagens`, `Inserir links`, `Usar emojis externos` e `Adicionar reações`')
			.catch(() => console.log('Não consegui enviar mensagem pv `cadastro` (falta permissão enviar mensagens servidor'))

	if (!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.USE_EXTERNAL_EMOJIS, Permissions.FLAGS.ADD_REACTIONS]))
		return bot.createEmbed(message, '<:badge_cata_bug:799043225557008474> **PERA!** Eu não possuo as permissões necessárias para o jogo rolar belezinha. Contate o Administrador deste Servidor.\n\nAs seguintes permissões são necessárias:\n`Gerenciar mensagens`, `Enviar mensagens`, `Inserir links`, `Usar emojis externos` e `Adicionar reações`')

	let uData = await bot.data.get(message.author.id)

	// Se tá no cooldown
	if (bot.talkedRecently.has(message.author.id)) {
		return message.reply('Você deve esperar 3 segundos entre cada comando.')
			.then(m => setTimeout(() => m.delete(), 3200))
			.catch(() => `Não consegui responder ${uData?.username}. \`Mensagem Cooldown\``)
	}

	if (uData.username === undefined) {
		const newUser = new Discord.MessageEmbed()
			.setTitle(`Cadastro`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/856211643742945290/CrossRoadsLogo.png')
			.setDescription(`Olá **${message.author.username}**, bem vindo ao **Cross Roads**!`)
			.addField(`Para continuar jogando, defina seu **nick**`, `Na próxima mensagem, mande o nick escolhido`)
			.setColor('GREEN')
			.setFooter(`Proibido: caracteres especiais, emojis, acentos e palavras ofensivas`)
			.setTimestamp()

		return message.channel.send({embeds: [newUser]}).then(() => {
			const filter = response => response.author.id === message.author.id
			const collector = message.channel.createMessageCollector({
				filter,
				time: 180000,
				max: 1,
			})

			collector.on('collect', async m => {
				let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{3,18}$/gmu

				const piii = new Piii({
					filters: [...Object.values(piiiFilters), bot.palavrasBanidas],
				})

				let nick = m.content
				nick.replace(/\s/g, ' ') // remove espaço bosta do caraios

				let msgCadastro = `• Use outro comando para reiniciar o cadastro.`

				if (nick.length < 3) return bot.createEmbed(message, `Escolha um nick maior`, `Mínimo de caracteres: 3 ${msgCadastro}`)
				if (nick.length > 18) return bot.createEmbed(message, `Escolha um nick menor`, `Máximo de caracteres: 18 ${msgCadastro}`)
				if (nick.toLowerCase().indexOf('jacobi') > -1 || nick.toLowerCase().indexOf('cross roads') > -1 || nick.toLowerCase() === 'user') return bot.createEmbed(message, `Este nick é reservado`, `Escolha outro nick ${msgCadastro}`)
				if (nick.indexOf('@') > -1 || nick.indexOf(':') > -1 || nick.indexOf(';') > -1 || nick.indexOf('`') > -1 || nick.indexOf('_') > -1 || nick.indexOf('*') > -1 ||
					nick.toLowerCase().indexOf('iii') > -1 || nick.toLowerCase().indexOf('lll') > -1 || nick.toLowerCase().indexOf('lilil') > -1 || nick.indexOf('  ') > -1 ||
					nick.toLowerCase().indexOf('granada') > -1 || nick.toLowerCase().indexOf('semgranada') > -1 || nick.indexOf('\\') > -1 || nick.indexOf('\n') > -1 ||
					nick.toLowerCase().indexOf('boss desafiar') > -1 || nick.toLowerCase().indexOf('nome') > -1 || nick.toLowerCase().indexOf('titulo') > -1 ||
					nick.toLowerCase().indexOf('título') > -1 || nick.toLowerCase().indexOf('info') > -1 || nick.toLowerCase().indexOf('treinar') > -1 ||
					nick.toLowerCase().indexOf('avatar') > -1)
					return bot.createEmbed(message, `Este nick é inválido`, `Escolha outro nick ${msgCadastro}`)

				if (!regex.test(nick))
					return bot.createEmbed(message, 'Este nick é inválido', `Escolha outro nick ${msgCadastro}`)

				if (await bot.data.find("username", nick) || await bot.data.find(user => user.username?.toLowerCase() === nick.toLowerCase()))
					return bot.createEmbed(message, `Este nick já está em uso`, `Escolha outro nick`)

				if (piii.has(nick)) return bot.createEmbed(message, `Escolha outro nick`, `Palaras ofensivas não são aceitas ${msgCadastro}`)

				collector.stop()

				const embed = new Discord.MessageEmbed()
					.setTitle(`Cadastro`)
					.setColor(bot.colors.background)
					.setDescription(`Confirmar o nick **${nick}**?
Você só poderá alterá-lo uma vez depois, por R$ 50.000.`)
					.setFooter(`${nick} • Caso queira outro, utilize outro comando`, message.member.user.avatarURL())
					.setTimestamp()

				let row = new Discord.MessageActionRow()
					.addComponents(new Discord.MessageButton()
						.setStyle('SUCCESS')
						.setLabel('Confirmar')
						.setCustomId('confirmar'))
					.addComponents(new Discord.MessageButton()
						.setStyle('DANGER')
						.setLabel('Cancelar')
						.setCustomId('cancelar'))

				let msg = await message.channel.send({
					embeds: [embed],
					components: [row]
				}).catch(() => console.log("Não consegui enviar mensagem `cadastro`"))

				const filter = (button) => [
					'confirmar',
					'cancelar',
				].includes(button.customId) && button.user.id === message.author.id

				const collectorConf = msg.createMessageComponentCollector({
					filter,
					time: 90000,
					max: 1
				})

				collectorConf.on('collect', async b => {
					await b.deferUpdate()
					if (b.customId === 'confirmar') {

						await bot.data.set(`${message.author.id}.username`, nick)

						msg.edit({
							embeds: [embed
								.setDescription(`Seu **nick** foi definido como **${nick}**!\nAgora você deverá escolher uma classe utilizando \`;classe\`.!`)
								.setColor('GREEN')
								.setFooter({text: nick, iconURL: message.member.user.avatarURL()})],
							components: []
						}).catch(() => console.log("Não consegui editar mensagem `cadastro`"))

						return bot.log(message, new Discord.MessageEmbed()
							.setTitle('Novo jogador registrado!')
							.setDescription(`**Nick: ${await bot.data.get(`${message.author.id}.username`)}**`)
							.setColor(bot.colors.admin)
						)

					}
					else if (b.customId === 'cancelar') {
						return msg.edit({
							embeds: [embed.setDescription(`Cadastro cancelado. Para começar novamente, use qualquer comando (como \`;loja\`, por exemplo)!`).setColor('RED')],
							components: []
						}).catch(() => console.log("Não consegui editar mensagem `cadastro`"))
					}
				})
			})
		})
	}

	if (!uData.classe) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`Escolha de Classe`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/856211643742945290/CrossRoadsLogo.png')
			.setColor('GREEN')
			.setTimestamp()
			.setDescription(`Olá **${uData.username}**, bem vindo à Temporada 7 do **Cross Roads**!\n\nAntes de continuar jogando você deve escolher uma **Classe**`)

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setLabel(bot.classes.ladrao.desc)
				.setEmoji(bot.classes.ladrao.emote)
				.setCustomId(bot.classes.ladrao.desc)
				.setStyle('SECONDARY'))
			.addComponents(new Discord.MessageButton()
				.setLabel(bot.classes.advogado.desc)
				.setEmoji(bot.classes.advogado.emote)
				.setCustomId(bot.classes.advogado.desc)
				.setStyle('SECONDARY'))
			.addComponents(new Discord.MessageButton()
				.setLabel(bot.classes.mafioso.desc)
				.setEmoji(bot.classes.mafioso.emote)
				.setCustomId(bot.classes.mafioso.desc)
				.setStyle('SECONDARY'))
			.addComponents(new Discord.MessageButton()
				.setLabel(bot.classes.empresario.desc)
				.setEmoji(bot.classes.empresario.emote)
				.setCustomId(bot.classes.empresario.desc)
				.setStyle('SECONDARY'))
			.addComponents(new Discord.MessageButton()
				.setLabel(bot.classes.assassino.desc)
				.setEmoji(bot.classes.assassino.emote)
				.setCustomId(bot.classes.assassino.desc)
				.setStyle('SECONDARY'))

		const row2 = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setLabel(bot.classes.mendigo.desc)
				.setEmoji(bot.classes.mendigo.emote)
				.setCustomId(bot.classes.mendigo.desc)
				.setStyle('SECONDARY'))

		let msgInicial = await message.channel.send({embeds: [embed]})
			// .catch(() => message.reply('Ops... não consigo te mandar mensagens no PV. Verifique suas configurações e use algum comando novamente')
			.catch(() => console.log('Não consegui enviar mensagem `classe`'))

		let classes = []
		for (const classe of Object.values(bot.classes)) {
			classes.push(new Discord.MessageEmbed()
				.setTitle(classe.desc)
				.setColor(classe.cor)
				.setThumbnail(classe.imagem)
				.addField('Positivo', classe.buff)
				.addField('Negativo', classe.debuff))
		}

		let msg = await message.channel.send({embeds: classes, components: [row, row2]})
		// .catch(() => console.log('Não consegui enviar mensagem `classe`'))

		const filter = (button) => [
			bot.classes.ladrao.desc,
			bot.classes.advogado.desc,
			bot.classes.mafioso.desc,
			bot.classes.empresario.desc,
			bot.classes.assassino.desc,
			bot.classes.mendigo.desc
		].includes(button.customId) && button.user.id === message.author.id

		const collector = msg.createMessageComponentCollector({
			filter,
			time: 180000,
		})


		collector.on('collect', async b => {
			await b.deferUpdate()
			uData = await bot.data.get(message.author.id)
			if (uData.classe)
				return message.channel.send({
					embeds: [new Discord.MessageEmbed()
						.setColor('GREEN')
						.setDescription(`Você já escolheu uma classe!`)
						.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
						.setTimestamp()],
				})
					.catch(() => console.log('Não consegui enviar mensagem `classe`'))

			let escolha = b.customId
			let classeEscolhida
			if (escolha === bot.classes.ladrao.desc) classeEscolhida = 'ladrao'
			if (escolha === bot.classes.advogado.desc) classeEscolhida = 'advogado'
			if (escolha === bot.classes.mafioso.desc) classeEscolhida = 'mafioso'
			if (escolha === bot.classes.empresario.desc) classeEscolhida = 'empresario'
			if (escolha === bot.classes.assassino.desc) classeEscolhida = 'assassino'
			if (escolha === bot.classes.mendigo.desc) classeEscolhida = 'mendigo'

			const escolhido = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setThumbnail(bot.classes[classeEscolhida].imagem)
				.setDescription(`Você escolheu a classe **${bot.classes[classeEscolhida].desc}**!`)
				.setFooter(`Use /ajuda para começar a jogar Cross Roads!`)

			msgInicial.delete()
			msg.delete()
			message.channel.send({embeds: [escolhido]})
			await bot.data.set(`${message.author.id}.classe`, classeEscolhida)

			return await bot.data.get(`${message.author.id}.classeAlterada`) > 0
				? bot.log(message, new Discord.MessageEmbed()
					.setTitle(`${uData.username} alterou sua classe`)
					.setDescription(`Classe escolhida: **${classeEscolhida}**`)
					.setColor(bot.colors.admin))
				: bot.log(message, new Discord.MessageEmbed()
					.setTitle(`${uData.username} definiu a classe`)
					.setDescription(`**Classe escolhida: ${classeEscolhida}**`)
					.setColor(bot.colors.admin))
		})


	}

	if (await bot.isPlayerMorto(uData)) return

	if (!bot.isComandoUsavelViagem(message))
		return await bot.isPlayerViajando(uData)

	if (!uData.dataInicio || uData.dataInicio === '') {
		let date = new Date()
		let day = date.getDate()
		let month = date.getMonth() + 1
		let year = date.getFullYear()
		await bot.data.set(`${message.author.id}.dataInicio`, `${day}/${month}/${year}`,)
	}

	let isServerCrossRoads = message.member?.guild?.id === '529674666692837378'
	let isServerCrossRoadsBanidos = message.member?.guild?.id === '943677762537926746'

	if (!uData.registrado && uData.arma.rpg.tempo > 0) {
		if (!isServerCrossRoads && !isServerCrossRoadsBanidos) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
				.setDescription(`${uData.username}, parabéns por conseguir sua ${bot.guns.rpg.skins.default.emote} RPG! Prossiga para o servidor oficial para completar seu cadastro anti-fake.\nVocê precisará utilizar um comando em qualquer canal da categoria GAMEPLAY.`)
				.setColor(bot.colors.admin)
				.setTimestamp()
				.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})

			const row = new Discord.MessageActionRow()
				.addComponents(new Discord.MessageButton()
					.setStyle('LINK')
					.setLabel('Entrar no servidor oficial')
					.setURL('https://discord.gg/sNf8avn'))

			return message.reply({embeds: [embed], components: [row]})
				.catch(() => console.log("Não consegui enviar mensagem `cadastrar no servidor`"))
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
			.setDescription(`${uData.username}, você batalhou bastante e finalmente pôde comprar sua primeira ${bot.guns.rpg.skins.default.emote} RPG.
Você bateu em muitas velhinhas para chegar até aqui, mas ainda preciso que você me prove que você não é simplesmente um clone de algum experimento alienígena, entende?

Confirmando, você concorda com todas as regras da <#529676890454360074> e que esta é sua única conta.`)
			.setColor(bot.colors.admin)
			.setTimestamp()
			.setFooter(`${bot.user.username} • KKK eae fake!`, bot.user.avatarURL())

		let msg = await message.reply({embeds: [embed], ephemeral: true})
			.catch(() => console.log("Não consegui enviar mensagem `cadastro`"))

		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirmar, não sou um clone')
				.setCustomId('confirm'))
			.addComponents(new Discord.MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancelar')
				.setCustomId('cancel'))

		await msg.edit({components: [row]})
			.catch(() => console.log("Não consegui editar mensagem `cadastro`"))

		const filter = (button) => button.user.id === message.author.id

		const collector = msg.createMessageComponentCollector({
			filter,
			idle: 60000,
		})

		collector.on('collect', async c => {
			await c.deferUpdate()
			let uData = await bot.data.get(message.author.id)
			if (c.user.id !== message.author.id) return

			if (c.customId.includes('confirm')) {
				const embed = new Discord.MessageEmbed()
					.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
					.setDescription(`${uData.username}, obrigado pela confirmação!`)
					.setColor(bot.colors.admin)
					.setTimestamp()
					.setFooter({text: `${bot.user.username} • Circulando, circulando!`, iconURL: bot.user.avatarURL()})

				uData.registrado = true

				await bot.data.set(message.author.id, uData)

				return await msg.edit({embeds: [embed], components: []})
					.catch(() => console.log("Não consegui editar mensagem `cadastro`"))
			}

			else if (c.customId.includes('cancel')) {
				collector.stop()
				const embed = new Discord.MessageEmbed()
					.setTitle(`<:CrossRoadsLogo:757021182020157571> Cadastro anti-fake`)
					.setDescription(`${uData.username}, não posso deixar você continuar se você é um clone!`)
					.setColor('RED')
					.setTimestamp()
					.setFooter({text: `${bot.user.username} • Xispa!`, iconURL: bot.user.avatarURL()})

				bot.users.fetch(bot.config.adminID).then(user => {
					user.send(`Cancelou cadastro anti-fake: ${uData.username} (${c.user.id})`)
				})

				return await msg.edit({embeds: [embed], components: []})
					.catch(() => console.log("Não consegui editar mensagem `cadastro`"))
			}

		})
		collector.on('end', () => {
			if (msg)
				msg.edit({components: []})
					.catch(() => console.log("Não consegui editar mensagem `cadastro`"))
		})
		return
	}

	let jogador = message.member?.guild?.roles?.cache?.find(role => role.id === '824341916929622017')
	if (isServerCrossRoads && jogador) {
		message.guild?.members?.cache?.get(message.author.id).roles.add(jogador)
			.catch(() => console.log('Não consegui adicionar o cargo Jogador de ' + message.author.id))
	}

	let booster = message.member?.guild?.roles?.cache?.find(role => role.id === '758691633544953936') //cargo booster
	let hasBoosterRole = message.member?.roles?.cache?.has('758691633544953936') //cargo booster
	let isBooster = isServerCrossRoads && booster && hasBoosterRole

	let isVip = uData.vipTime > new Date().getTime()
	let vip = message.member?.guild?.roles?.cache?.find(role => role.id === '529680357591613442')
	let hasVipRole = message.member?.roles?.cache?.has('529680357591613442')
	let isVipWithoutRole = isServerCrossRoads && !hasVipRole && isVip
	let isNotVipAnymoreButWithRole = isServerCrossRoads && hasVipRole && !isVip

	if (isServerCrossRoads && uData.username !== message.member.nickname && message.author.id !== bot.config.adminID) {
		if (message.guild?.me?.permissions?.has([Permissions.FLAGS.MANAGE_NICKNAMES, Permissions.FLAGS.CHANGE_NICKNAME])) {
			message.guild?.members?.cache?.get(message.author.id).setNickname(uData.username)
				.catch(() => console.log('Não consegui setar o nickname de ' + message.author.id))
		}
	}

	if (isServerCrossRoads && isVipWithoutRole) {
		message.guild?.members?.cache?.get(message.author.id).roles?.add(vip)
			.catch(() => console.log('Não consegui adicionar o cargo VIP de ' + message.author.id))
	}

	if (isServerCrossRoads && isNotVipAnymoreButWithRole) {
		message.guild?.members?.cache?.get(message.author.id).roles?.remove(vip)
			.catch(() => console.log('Não consegui remover o cargo VIP de ' + message.author.id))
	}

	bot.onlineNow.set(message.author.id, new Date().getTime())

	if (!(isVip || isBooster || bot.isAdmin(message.author.id) || bot.isMod(message.author.id))) {
		bot.talkedRecently.add(message.author.id)
		setTimeout(() => bot.talkedRecently.delete(message.author.id), 3350)
	}
	// console.log(message.author.username, command, args)

	cmd.run(bot, message, args)

	await bot.data.set(message.author.id + ".lastCommandChannelId", message.channel.id)


	// bot.channels.cache.get('564988393713303579')?.send({embeds: [embed],})
	// 	.catch(() => console.log('Não consegui fazer log de ', command, args))

	const LOG_CHANNEL_ID = '564988393713303579'

	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: uData.username ? `${uData.username} (${message.author.id})` : `${message.author.username} (${message.author.id})`,
			iconURL: message.author.avatarURL()
		})
		.setDescription(`${uData.username ? uData.username : message.author.username} **${message.content}**`)
		.setColor(bot.colors.background)
		.setFooter({
			text: `Servidor ${message.guild.name}. Canal #${message.channel.name}`,
			iconURL: message.guild.iconURL()
		})
		.setTimestamp()

	bot.shard.broadcastEval(async (c, {channelId, embed}) => {
		const channel = c.channels.cache.get(channelId)
		if (!channel)
			return false

		await channel.send({embeds: [embed]})

		return true

	}, {context: {channelId: LOG_CHANNEL_ID, embed}})
		.then(sentArray => {
			if (!sentArray.includes(true))
				return console.warn('Não encontrei o canal de log.')

		})
}
