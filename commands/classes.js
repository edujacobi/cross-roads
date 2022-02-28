const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let option = args[0] ? args[0].toString().toLowerCase() : null

	if (option === 'alterar') {
		let uData = bot.data.get(message.author.id)
		let currTime = new Date().getTime()
		const custoBase = uData.vipTime > currTime ? 750000 : 1000000
		// const custoBase = 1000

		let custoPlayer = custoBase * 10 ** uData.classeAlterada

		bot.createEmbed(message, `✂️ **${uData.username}**, pronto para uma transformação? Para você é R$ ${custoPlayer.toLocaleString().replace(/,/g, ".")}. Esta ação é irreversível. Após aceitar, você poderá escolher uma nova classe.\n\nClique em <:positive:572134588340633611> para aceitar ou <:negative:572134589863034884> para recusar`, `60 segundos para responder`, bot.colors.white)
			.then(msg => {
				msg.react('572134588340633611') // aceitar
					.then(() => msg.react('572134589863034884')) // negar
					.catch(() => console.log("Não consegui reagir mensagem `classes`"))

				let filter = (reaction, user) => ['572134588340633611', '572134589863034884'].includes(reaction.emoji.id) && user.id === message.author.id

				msg.awaitReactions({
					filter,
					time: 90000,
					max: 1,
					errors: ['time'],

				}).then(reaction => {
					if (msg) msg.reactions.removeAll().then(async () => {
						if (reaction.first()._emoji.id === '572134588340633611') {
							uData = bot.data.get(message.author.id)
							if (uData.moni < 1)
								return bot.msgSemDinheiro(message)

							if (uData.preso > currTime)
								return bot.msgPreso(message, uData)

							if (uData.moni < custoPlayer)
								return bot.msgDinheiroMenorQueAposta(message)

							if (bot.isUserEmRouboOuEspancamento(message, uData))
								return

							uData.moni -= custoPlayer
							uData.classeAlterada += 1
							bot.data.set(message.author.id, uData)

							bot.data.delete(message.author.id, 'classe')

							return msg.edit({
								embeds: [new Discord.MessageEmbed()
									.setColor('GREEN')
									.setDescription(`✂️ Que corte escolheremos hoje? Use um comando qualquer e escolha sua nova classe!`)
									.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
									.setTimestamp()
								]
							}).catch(() => console.log("Não consegui editar mensagem `classes`"))

						}
						else if (reaction.first()._emoji.id === '572134589863034884') {
							return msg.edit({
								embeds: [new Discord.MessageEmbed()
									.setColor('GREEN')
									.setDescription(`✂️ Operação cancelada. Que pena!`)
									.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
									.setTimestamp()
								]
							}).catch(() => console.log("Não consegui editar mensagem `classes`"))
						}
					}).catch(() => console.log("Não consegui remover as reações mensagem `classes`"))

				}).catch(() => {
					if (msg) msg.reactions.removeAll().catch(() => console.log("Não consegui remover as reações mensagem `classes`"))
					return msg.edit({
						embeds: [new Discord.MessageEmbed()
							.setColor('GREEN')
							.setDescription(`✂️ Operação cancelada. Que pena!`)
							.setFooter({text: uData.username, iconURL: message.member.user.avatarURL()})
							.setTimestamp()
						]
					}).catch(() => console.log("Não consegui editar mensagem `classes`"))
				})
			})

	}
	else if (option === 'top') {
		if (!(bot.isAdmin(message.author.id) || bot.isMod(message.author.id) || bot.isAjudante(message.author.id)))
			return

		let classesEscolhidas = {
			ladrão: 0,
			advogado: 0,
			mafioso: 0,
			empresário: 0,
			assassino: 0,
			mendigo: 0
		}
		await bot.data.forEach(user => {
			if (user.classe === 'ladrao')
				classesEscolhidas.ladrão++
			if (user.classe === 'advogado')
				classesEscolhidas.advogado++
			if (user.classe === 'mafioso')
				classesEscolhidas.mafioso++
			if (user.classe === 'empresario')
				classesEscolhidas.empresário++
			if (user.classe === 'assassino')
				classesEscolhidas.assassino++
			if (user.classe === 'mendigo')
				classesEscolhidas.mendigo++
		})

		let total = classesEscolhidas.ladrão + classesEscolhidas.advogado + classesEscolhidas.mafioso +
			classesEscolhidas.empresário + classesEscolhidas.assassino + classesEscolhidas.mendigo

		const embed = new Discord.MessageEmbed()
			.setTitle("TOP Classes Escolhidas")
			.setFooter({
				text: `${bot.user.username} • Total: ${total}`, iconURL: bot.user.avatarURL()
			})
			.setColor('GREEN')
			.setTimestamp()
		
		Object.values(bot.classes).forEach(classe => {
			let emote = bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == classe.emote)
			embed.addField(`${emote} ${classe.desc}`, `${classesEscolhidas[classe.desc.toLowerCase()]}`, true)
		})

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `classes top`"))

	}
	else {
		const embed = new Discord.MessageEmbed()
			.setTitle("Classes")
			.setFooter(`${bot.user.username} • Para trocar sua classe, use ;classe alterar`, bot.user.avatarURL())
			.setColor('GREEN')
			.setTimestamp()

		let pos = '<:small_green_triangle:801611850491363410>'
		let neg = '🔻'

		Object.values(bot.classes).forEach(classe => {
			let emote = bot.guilds.cache.get('798984428248498177').emojis.cache.find(emoji => emoji.id == classe.emote)
			embed.addField(`${emote} ${classe.desc}`, `${pos} **Positivo**\n${classe.buff}\n${neg} **Negativo**\n${classe.debuff}`, true)
		})
		// embed.addField("\u200b", "\u200b", true)

		message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `classes`"))

	}
}

exports.config = {
	alias: ['classe', 'personagem', 'ladrao', 'mafioso', 'empresario', 'advogado', 'assassino', 'mendigo']
}