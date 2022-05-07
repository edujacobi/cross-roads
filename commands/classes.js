const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let option = args[0] ? args[0].toString().toLowerCase() : null

	if (option === 'alterar') {
		let uData = await bot.data.get(message.author.id)
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
							uData = await bot.data.get(message.author.id)
							if (uData.moni < 1)
								return bot.msgSemDinheiro(message)

							if (uData.preso > currTime)
								return bot.msgPreso(message, uData)

							if (uData.moni < custoPlayer)
								return bot.msgDinheiroMenorQueAposta(message)

							if (await bot.isUserEmRouboOuEspancamento(message, uData))
								return

							uData.moni -= custoPlayer
							uData.classeAlterada += 1
							await bot.data.set(message.author.id, uData)

							await bot.data.delete(`${message.author.id}.classe`)

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

		const embed = new Discord.MessageEmbed()
			.setTitle("TOP Classes Escolhidas")
			.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
			.setDescription('**Carregando...**')
			.setColor('GREEN')
			.setTimestamp()

		let msg = await message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `classes top`"))

		let classesEscolhidas = {
			ladrão: await bot.data.filter("classe", 'ladrao'),
			advogado: await bot.data.filter("classe", 'advogado'),
			mafioso: await bot.data.filter("classe", 'mafioso'),
			empresário: await bot.data.filter("classe", 'empresario'),
			assassino: await bot.data.filter("classe", 'assassino'),
			mendigo: await bot.data.filter("classe", 'mendigo')
		}

		classesEscolhidas.ladrão = Object.entries(classesEscolhidas.ladrão).length
		classesEscolhidas.advogado = Object.entries(classesEscolhidas.advogado).length
		classesEscolhidas.mafioso = Object.entries(classesEscolhidas.mafioso).length
		classesEscolhidas.empresário = Object.entries(classesEscolhidas.empresário).length
		classesEscolhidas.assassino = Object.entries(classesEscolhidas.assassino).length
		classesEscolhidas.mendigo = Object.entries(classesEscolhidas.mendigo).length

		let total = classesEscolhidas.ladrão + classesEscolhidas.advogado + classesEscolhidas.mafioso +
			classesEscolhidas.empresário + classesEscolhidas.assassino + classesEscolhidas.mendigo

		embed.setFooter({text: `${bot.user.username} • Total: ${total}`, iconURL: bot.user.avatarURL()})
			.setDescription("")

		Object.values(bot.classes).forEach(classe => {
			embed.addField(`${classe.emote} ${classe.desc}`, `${classesEscolhidas[classe.desc.toLowerCase()]}`, true)
		})

		return msg.edit({embeds: [embed]})
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
			embed.addField(`${classe.emote} ${classe.desc}`, `${pos} **Positivo**\n${classe.buff}\n${neg} **Negativo**\n${classe.debuff}`, true)
		})
		// embed.addField("\u200b", "\u200b", true)

		message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `classes`"))

	}
}

exports.config = {
	alias: ['classe', 'personagem', 'ladrao', 'mafioso', 'empresario', 'advogado', 'assassino', 'mendigo']
}