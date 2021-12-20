exports.run = async (bot, message, args) => {
	const Piii = require("piii")
	const piiiFilters = require("piii-filters")
	let uData = bot.data.get(message.author.id)
	let custo = 50000

	if (uData.nickAlterado)
		return bot.createEmbed(message, "Você não tem trocas de nick disponíveis")

	bot.createEmbed(message, `Olá **${uData.username}**, defina seu novo **nick**\nPreço para troca: R$ ${custo.toLocaleString().replace(/,/g, ".")}`, `Na próxima mensagem, mande o nick escolhido`)
		.then(msg => {
			const filter = response => response.author.id == message.author.id
			const collector = message.channel.createMessageCollector({
				filter,
				time: 90000,
				max: 1,
			})

			collector.on('collect', m => {
				if (uData.moni < custo)
					return bot.msgSemDinheiro(message)
				if (uData.nickAlterado)
					return bot.createEmbed(message, "Você não tem trocas de nick disponíveis", null, bot.colors.admin)

				let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{3,18}$/ugm

				const piii = new Piii({
					filters: [
						...Object.values(piiiFilters),
						bot.palavrasBanidas
					],
				})

				let nick = m.content
				nick.replace(/\s/g, " ")  // remove espaço bosta do caraios

				if (nick.length < 3)
					return bot.createEmbed(message, `Escolha um nick maior`, `Mínimo de caracteres: 3`)
				if (nick.length > 18)
					return bot.createEmbed(message, `Escolha um nick menor`, `Máximo de caracteres: 18`)
				if (nick.toLowerCase() == 'jacobi' || nick.toLowerCase() == 'cross roads' || nick.toLowerCase() == 'user')
					return bot.createEmbed(message, `Este nick é reservado`, `Escolha outro nick`)
				if (nick.indexOf('@') > -1 || nick.indexOf(':') > -1 || nick.indexOf(';') > -1 || nick.indexOf('`') > -1 || nick.indexOf('_') > -1 || nick.indexOf('*') > -1 || nick.toLowerCase().indexOf('iii') > -1 || nick.toLowerCase().indexOf('lll') > -1 || nick.toLowerCase().indexOf('lilil') > -1 || nick.indexOf('  ') > -1 || nick.toLowerCase().indexOf('granada') > -1 || nick.toLowerCase().indexOf('semgranada') > -1) return bot.createEmbed(message, `Este nick é inválido`, `Escolha outro nick`)
				if (!regex.test(nick))
					return bot.createEmbed(message, 'Este nick é inválido', `Escolha outro nick`)
				if (piii.has(nick))
					return bot.createEmbed(message, `Escolha um nick maior`, `Palaras ofensivas não são aceitas`)

				for (let [id, user] of bot.data) {
					if (user.username != undefined && nick.toLowerCase() == user.username.toLowerCase())
						return bot.createEmbed(message, `Este nick já está em uso`, `Escolha outro nick`)
				}

				bot.createEmbed(message, `Confirmar o nick **${nick}**?`, null, bot.colors.admin)
					.then(msg => {
						msg.react('✅').catch(err => console.log("Não consegui reagir mensagem `nick`")).then(r => {
							const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id

							const confirm = msg.createReactionCollector({
								filter,
								max: 1,
								time: 90000,
								errors: ['time'],
							})

							confirm.on('collect', r => {
								uData = bot.data.get(message.author.id)
								if (uData.moni < custo)
									return bot.msgSemDinheiro(message)
								if (uData.nickAlterado)
									return bot.createEmbed(message, "Você não tem trocas de nick disponíveis")

								uData.username = nick
								uData.moni -= custo
								uData.nickAlterado = true
								bot.data.set(message.author.id, uData)
								return bot.createEmbed(message, `Seu **nick** foi definido como **${nick}**!`)
							})
						})
					})


			})
		})

};

exports.help = {
	name: "base",
	category: "Code",
	description: "base",
	usage: "base",
	example: "base"
};