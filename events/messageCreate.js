const {
	Permissions
} = require('discord.js');
const Discord = require("discord.js");

module.exports = (bot, message) => {
	// if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id))
	// 	return

	if (message.author.bot)
		return;

	if (message.channel.type == 'dm')
		return;

	if (message.mentions.has(bot.user) && !message.content.startsWith(bot.config.prefix) && !message.mentions.everyone)
		return bot.createEmbed(message, "Olá! Meu prefixo é `;`. Caso não saiba como começar a jogar, use `;ajuda`!")

	if (!message.content.startsWith(bot.config.prefix))
		return;

	const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g);

	const command = args.shift().toLowerCase();

	const cmd = bot.commands.get(command) || bot.commands.find(cmd => cmd.config && cmd.config.alias.includes(command));

	if (!cmd)
		return;

	if (!message || !message.guild || !message.guild.me)
		return

	bot.data.ensure(message.author.id, bot.defaultCarteira);

	if (!message.guild.me.permissions.has([
			Permissions.FLAGS.MANAGE_MESSAGES,
			Permissions.FLAGS.SEND_MESSAGES,
			Permissions.FLAGS.EMBED_LINKS,
			Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
			Permissions.FLAGS.ADD_REACTIONS
		]))
		return bot.createEmbed(message, "<:badge_cata_bug:799043225557008474> **PERA!** Eu não possuo as permissões necessárias para o jogo rolar belezinha. Contate o Administrador deste Servidor.\n\nAs seguintes permissões são necessárias:\n`Gerenciar mensagens`, `Enviar mensagens`, `Inserir links`, `Usar emojis externos` e `Adicionar reações`")

	if (!bot.data.has(message.author.id, "username")) {
		const newUser = new Discord.MessageEmbed()
			.setTitle(`Cadastro`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/856211643742945290/CrossRoadsLogo.png')
			.setDescription(`Olá **${message.author.username}**, bem vindo ao **Cross Roads**!`)
			.addField(`Para continuar jogando, defina seu **nick**`, `Na próxima mensagem, mande o nick escolhido`)
			.setColor('GREEN')
			.setFooter(`Proibido: caracteres especiais, emojis e acentos`)
			.setTimestamp()

		return message.channel.send({
			embeds: [newUser]
		}).then(msg => {

			const filter = response => response.author.id == message.author.id
			const collector = message.channel.createMessageCollector({
				filter,
				time: 180000,
			})

			collector.on('collect', m => {
				let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{3,20}$/ugm
				let nick = m.content
				if (nick.length < 3)
					return bot.createEmbed(message, `Escolha um nick maior`, `Mínimo de caracteres: 3`)
				if (nick.length > 20)
					return bot.createEmbed(message, `Escolha um nick menor`, `Máximo de caracteres: 20`)
				if (nick.indexOf('jacobi') > -1 || nick.indexOf('cross roads') > -1 || nick.toLowerCase() == 'user')
					return bot.createEmbed(message, `Este nick é reservado`, `Escolha outro nick`)
				if (nick.indexOf('@') > -1 || nick.indexOf(':') > -1 || nick.indexOf(';') > -1 || nick.indexOf('`') > -1 || nick.indexOf('_') > -1 || nick.indexOf('*') > -1 || nick.toLowerCase().indexOf('iii') > -1 || nick.toLowerCase().indexOf('lll') > -1 || nick.toLowerCase().indexOf('lilil') > -1 || nick.indexOf('  ') > -1)
					return bot.createEmbed(message, `Este nick é inválido`, `Escolha outro nick`)
				if (!regex.test(nick))
					return bot.createEmbed(message, 'Este nick é inválido', `Escolha outro nick`)

				for (let [id, user] of bot.data) {
					if (user.username != undefined && nick.toLowerCase() == user.username.toLowerCase())
						return bot.createEmbed(message, `Este nick já está em uso`, `Escolha outro nick`)
				}

				nick.replace(/\s/g, " ") // remove espaço bosta do caraios
				collector.stop()

				bot.createEmbed(message, `Deseja confirmar o nick **${nick}**?\n\nVocê não poderá alterá-lo depois!`, `Caso queira outro, utilize outro comando`)
					.then(msg => {
						msg.react('✅').catch(err => console.log("Não consegui reagir mensagem `cadastro`", err)).then(r => {
							const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id
							const confirm = msg.createReactionCollector({
								filter,
								max: 1,
								time: 90000,
								errors: ['time'],
							})

							confirm.on('collect', r => {
								if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `cadastro`", err))
								bot.data.set(message.author.id, nick, "username")
								bot.createEmbed(message, `Seu **nick** foi definido como **${nick}**!\nAgora você deverá escolher uma classe!`, `Use ;classe para continuar`, 'GREEN')
								return bot.log(message, new Discord.MessageEmbed()
									.setTitle("Novo jogador registrado!")
									.setDescription(`**Nick: ${bot.data.get(message.author.id, "username")}**`)
									.setColor(bot.colors.admin))
							})
						})
					})

			})
		}).catch(err => console.log("Não consegui enviar mensagem `cadastro`", err))

	}

	if (!bot.data.has(message.author.id, "classe")) {

		const embed = new Discord.MessageEmbed()
			.setTitle(`Escolha de Classe`)
			.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/856211643742945290/CrossRoadsLogo.png')
			.setColor('GREEN')
			.setTimestamp()
			.setDescription(`Olá **${bot.data.get(message.author.id, "username")}**, bem vindo à Temporada 5 do **Cross Roads**!\n\nAntes de continuar jogando você deve escolher uma **Classe**`)

		message.author.send({
			embeds: [embed]
		})

		Object.values(bot.classes).forEach(classe => {
			message.author.send({
				embeds: [new Discord.MessageEmbed()
					.setTitle(classe.desc)
					.setColor(classe.cor)
					.setThumbnail(classe.imagem)
					.addField("Positivo", classe.buff)
					.addField("Negativo", classe.debuff)
				]
			})
		})

		message.channel.send({
			embeds: [new Discord.MessageEmbed()
				.setColor('GREEN')
				.setDescription(`**${bot.data.get(message.author.id, "username")}** chegou a hora de você escolher uma **Classe**! Te mandei as opções no privado!`)
				.setFooter(bot.user.username, bot.user.avatarURL())
				.setTimestamp()
			]
		}).catch(err => console.log("Não consegui enviar mensagem `classe`", err))

		const escolha = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription(`Clique na classe que você deseja escolher!`)

		return message.author.send({
			embeds: [escolha]
		}).then(msg => {
			msg.react(bot.classes.ladrao.emote)
				.then(() => msg.react(bot.classes.advogado.emote))
				.then(() => msg.react(bot.classes.mafioso.emote))
				.then(() => msg.react(bot.classes.empresario.emote))
				.then(() => msg.react(bot.classes.assassino.emote))
				.catch(err => console.log("Não consegui reagir mensagem `cadastro classe`", err))

			let filter = (reaction, user) => [bot.classes.ladrao.emote, bot.classes.advogado.emote, bot.classes.mafioso.emote, bot.classes.empresario.emote, bot.classes.assassino.emote].includes(reaction.emoji.id) && user.id === message.author.id

			const collector = msg.createReactionCollector({
				filter,
				time: 180000,
				max: 1,
				errors: ['time'],

			})

			collector.on('collect', r => {
				if (bot.data.has(message.author.id, "classe"))
					return message.channel.send({
						embeds: [new Discord.MessageEmbed()
							.setColor('GREEN')
							.setDescription(`Você já escolheu uma classe!`)
							.setFooter(bot.user.username, bot.user.avatarURL())
							.setTimestamp()
						]
					}).catch(err => console.log("Não consegui enviar mensagem `classe`", err))

				let escolha = r.emoji.id
				let classeEscolhida
				if (escolha === bot.classes.ladrao.emote)
					classeEscolhida = 'ladrao'
				if (escolha === bot.classes.advogado.emote)
					classeEscolhida = 'advogado'
				if (escolha === bot.classes.mafioso.emote)
					classeEscolhida = 'mafioso'
				if (escolha === bot.classes.empresario.emote)
					classeEscolhida = 'empresario'
				if (escolha === bot.classes.assassino.emote)
					classeEscolhida = 'assassino'

				const escolhido = new Discord.MessageEmbed()
					.setColor('GREEN')
					.setDescription(`Você escolheu a classe **${bot.classes[classeEscolhida].desc}**!`)
					.setFooter(`Use ;ajuda para começar a jogar Cross Roads!`)

				msg.delete()
				message.author.send({
					embeds: [escolhido]
				})
				bot.data.set(message.author.id, classeEscolhida, "classe")

				return bot.data.get(message.author.id, "classeAlterada") > 0 ?
					bot.log(message, new Discord.MessageEmbed()
						.setTitle(`${bot.data.get(message.author.id, "username")} alterou sua classe`)
						.setDescription(`Classe escolhida: **${classeEscolhida}**`)
						.setColor(bot.colors.admin)) :
					bot.log(message, new Discord.MessageEmbed()
						.setTitle(`${bot.data.get(message.author.id, "username")} definiu a classe`)
						.setDescription(`**Classe escolhida: ${classeEscolhida}**`)
						.setColor(bot.colors.admin))

			})
		}).catch(err => message.reply("Ops... não consigo te mandar mensagens no PV. Verifique suas configurações e use algum comando novamente")
			.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV nem no canal`))
	}

	if (bot.data.get(message.author.id, "morto") > new Date().getTime())
		return

	if (!bot.data.get(message.author.id, "dataInicio") || bot.data.get(message.author.id, "dataInicio") == '') {
		let date = new Date()
		let day = date.getDate()
		let month = date.getMonth() + 1
		let year = date.getFullYear()
		bot.data.set(message.author.id, `${day}/${month}/${year}`, "dataInicio")
	}

	let jogador = message.member.guild.roles.cache.find(role => role.id === "824341916929622017");
	if (message.member.guild.id && message.member.guild.id === '529674666692837378' && jogador)
		message.guild.members.cache.get(message.author.id).roles.add(jogador).catch(err => console.log("Não consegui adicionar o cargo Jogador de " + message.author.id));

	let booster = message.member.guild.roles.cache.find(role => role.id === "758691633544953936"); //cargo booster
	let isBooster = false
	if( message.member.guild.id && message.member.guild.id === '529674666692837378' && booster) // mensagem no server cross e cargo booster
		isBooster = true

	let vip = message.member.guild.roles.cache.find(role => role.id === "529680357591613442");
	let hasVipRole = message.member.guild.roles.cache.has(role => role.id === "529680357591613442");
	let isVipWithoutRole = message.member.guild.id && message.member.guild.id === '529674666692837378' && !hasVipRole && bot.data.get(message.author.id, 'vipTime') > new Date().getTime()
	let isNotVipAnymoreButWithRole = message.member.guild.id && message.member.guild.id === '529674666692837378' && hasVipRole && bot.data.get(message.author.id, 'vipTime') < new Date().getTime()

	if (message.member.guild.id && message.member.guild.id === '529674666692837378' && bot.data.get(message.author.id, "username") != message.member.nickname && message.author.id != bot.config.adminID) {
		if (message.guild.members.cache.get(bot.user.id).permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES) && message.guild.members.cache.get(bot.user.id).permissions.has(Permissions.FLAGS.CHANGE_NICKNAME))
			message.guild.members.cache.get(message.author.id).setNickname(bot.data.get(message.author.id, "username")).catch(err => console.log("Não setar o nickname de " + message.author.id));
	}

	if (message.member.guild.id && message.member.guild.id === '529674666692837378' && isVipWithoutRole)
		message.guild.members.cache.get(message.author.id).roles.add(vip).catch(err => console.log("Não consegui adicionar o cargo VIP de " + message.author.id));

	if (message.member.guild.id && message.member.guild.id === '529674666692837378' && isNotVipAnymoreButWithRole)
		message.guild.members.cache.get(message.author.id).roles.remove(vip).catch(err => console.log("Não consegui remover o cargo VIP de " + message.author.id));

	// const isCambioCommand = command === 'cambio' || command === 'c';
	// if (bot.talkedRecently.has(message.author.id) && (isCambioCommand || bot.data.get(message.author.id, 'vipTime') < new Date().getTime())) {
	if (bot.talkedRecently.has(message.author.id) && bot.data.get(message.author.id, 'vipTime') < new Date().getTime()) { // não vip
		if (bot.moderators.includes(message.author.id))
			message.reply("Moderador, você deve esperar 1 segundo entre cada comando.")
			.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV. \`Mensagem Cooldown\``)
			.then(m => setTimeout(() => m.delete(), 900))
		else
			message.reply("Você deve esperar 3 segundos entre cada comando.")
			.catch(er => `Não consegui responder ${bot.data.get(message.author.id, "username")} nem no PV. \`Mensagem Cooldown\``)
			.then(m => setTimeout(() => m.delete(), 2700))

	} else {
		bot.onlineNow.set(message.author.id, new Date().getTime())

		// console.log(message.author.username, command, args)

		cmd.run(bot, message, args)

		if (message.author.id != bot.config.adminID || bot.data.get(message.author.id, 'vipTime') < new Date().getTime() || !isBooster)
			bot.talkedRecently.add(message.author.id)

		// if (bot.data.get(message.author.id, 'vipTime') < new Date().getTime() && !isBooster) { //não vip
		// 	if (bot.moderators.includes(message.author.id)) //moderador
		// 		setTimeout(() => {
		// 			bot.talkedRecently.delete(message.author.id)
		// 		}, 1000)
		// 	else
		// 		setTimeout(() => {
		// 			bot.talkedRecently.delete(message.author.id)
		// 		}, 3250)
		// } else
		// 	bot.talkedRecently.delete(message.author.id)


		// if (bot.data.get(message.author.id, 'vipTime') > new Date().getTime()) // vip
		// 	bot.talkedRecently.delete(message.author.id)

		// else if (isBooster) // server booster
		// 	bot.talkedRecently.delete(message.author.id)

		if (bot.moderators.includes(message.author.id)) // moderador
			setTimeout(() => bot.talkedRecently.delete(message.author.id), 1000)

		else
			setTimeout(() => bot.talkedRecently.delete(message.author.id), 3250)

		const embed = new Discord.MessageEmbed()
			.setAuthor(bot.data.has(message.author.id, "username") ? `${bot.data.get(message.author.id, "username")} (${message.author.id})` : `${message.author.username} (${message.author.id})`, message.author.avatarURL())
			.setDescription(`${bot.data.has(message.author.id, "username") ? bot.data.get(message.author.id, "username") : message.author.username} **${message.content}**`)
			.setColor(bot.colors.background)
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())
			.setTimestamp();
		bot.channels.cache.get('564988393713303579').send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui fazer log de ", command, args, err))


		//.catch(err => console.error(err))
	}
};