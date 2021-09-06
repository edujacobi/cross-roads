const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	let user1 = args[0]
	let user2 = args[1]

	if (!user1 && !user2)
		return bot.createEmbed(message, `\`;trocarconta <ID1> <ID2>\``)

	if (!user1)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}, escolha o ID do primeiro usuário`)

	if (user1 < 0 || (user1 % 1 != 0) || user1.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}, o ID 1 é inválido`)

	if (!user2)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}, escolha o ID do segundo usuário`)

	if (user2 < 0 || (user2 % 1 != 0) || user2.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}, o ID 2 é inválido`)

	if (user1 === user2)
		return bot.createEmbed(message, `Porra, ${bot.data.get(message.author.id, "username")}, os IDs devem ser diferentes`)

	let uData1 = bot.data.get(user1)
	let uData2 = bot.data.get(user2)
	let uGang1 = bot.gangs.get(uData1.gangID)
	let uGang2 = bot.gangs.get(uData2.gangID)

	if (!uData1 || uData1.username == undefined) return bot.createEmbed(message, `Usuário 1 não possui um inventário`)
	if (!uData2 || uData2.username == undefined) return bot.createEmbed(message, `Usuário 2 não possui um inventário`)

	bot.createEmbed(message, `Confirmar troca das contas ${uData1.username} e ${uData2.username}?`, null, bot.colors.admin)
		.then(msg => {
			msg.react('✅').catch(err => console.log("Não consegui reagir mensagem `trocarconta`", err)).then(r => {
				const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id 
				const confirm = msg.createReactionCollector({
					filter,
					max: 1,
					time: 90000,
					errors: ['time'],
				})

				confirm.on('collect', r => {
					bot.data.set(user1, uData2)
					bot.data.set(user2, uData1)

					if (uGang1) {
						uGang1.membros[uGang1.membros.findIndex(user => user.id == user1)].id = user2
						bot.gangs.set(uData2.gangID, uGang1)
					}
					if (uGang2) {
						uGang2.membros[uGang2.membros.findIndex(user => user.id == user2)].id = user1
						bot.gangs.set(uData1.gangID, uGang2)
					}

					bot.createEmbed(message, `Troca realizada!`, null, bot.colors.admin)

					return bot.log(message, new Discord.MessageEmbed()
						.setDescription(`**${bot.data.get(message.author.id, "username")} trocou as contas "${uData1.username}" e "${uData2.username}"`)
						.setColor(bot.colors.admin))
				})
			})
		})



};