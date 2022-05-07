const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()
	let total = 0

	const embed = new Discord.MessageEmbed()
		.setTitle(`:headstone: Cemitério`)
		.setDescription("_50% de chance de estarem em um lugar melhor._")
		.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/259/headstone_1faa6.png")
		.setColor(0x7e7e7e)
		.addField("Morte", `Ao morrer, o jogador perde todo o dinheiro e seu trabalho, caso estiver em um. Enquanto morto, ele não recebe dinheiro de investimentos.`, true)
		.addField("Banidos", `Jogadores mortos foram banidos do jogo e não podem usar comando algum. Você não quer estar aqui.`, true)
		.setFooter(`${bot.user.username} • Clique na reação para abrir a lista de mortos`, bot.user.avatarURL())
		.setTimestamp()

	message.channel.send({
		embeds: [embed]
	}).then(msg => {
		msg.react('🪦').catch(err => console.log("Não consegui reagir mensagem `cemiterio`"))
			.then(async () => {
				const filter = (reaction, user) => reaction.emoji.name === '🪦' && user.id == message.author.id
				const mortos_ = msg.createReactionCollector({
					filter,
					time: 90000,
				})
				let mortos = []

				await bot.data.filter(user => {
					if (user.morto > currTime) {
						mortos.push({
							nick: user.username,
							tempo: user.morto - currTime,
						})
						total += 1
					}
				})

				mortos.sort(function (a, b) {
					return b.tempo - a.tempo
				})

				const Mortos = new Discord.MessageEmbed()
					.setTitle(`:headstone: Aqui jazem...`)
					.setColor(bot.colors.background)

				if (mortos.length > 0) {
					mortos.forEach(morto => Mortos.addField(morto.nick, `Ressuscita em ${bot.segToHour((morto.tempo / 1000))}`, true))
				}
				else
					Mortos.setDescription("Não há mortos")

				// if (total == 1 || total == 4 || total == 7 || total == 10 || total == 13 || total == 16) {
				//     Mortos.addField('\u200b', '\u200b', true)
				//     Mortos.addField('\u200b', '\u200b', true)
				// } else if (total == 2 || total == 5 || total == 8 || total == 11 || total == 14 || total == 17) {
				//     Mortos.addField('\u200b', '\u200b', true)
				// }
				mortos_.on('collect', r => {
					message.channel.send({
						embeds: [Mortos]
					}).then(m => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `cemiterio`"))
					}).catch(err => console.log("Não consegui enviar mensagem `mortos`"))
				})
			})
	}).catch(err => console.log("Não consegui enviar mensagem `cemiterio`"))
}