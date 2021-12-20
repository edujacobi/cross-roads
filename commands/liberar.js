const Discord = require("discord.js")
exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime()

	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	let option = args[0]
	let id = args[1]

	if (!id && !option)
		return bot.createEmbed(message, `\`;liberar <opcao> <id>\``)

	if (option == 'opcoes')
		return bot.createEmbed(message, `Olha, ${bot.data.get(message.author.id, "username")}, suas opções são:\n\`prisao\`, \`hospital\`, \`roubar\`, \`emroubo\`, \`emespancamento\`, \`espancar\`, \`galorinha\`, \`galocansado\``)

	if (!id)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}, escolha um ID de usuário`)

	if (id < 0 || (id % 1 != 0) || id.toString().length != 18)
		return bot.createEmbed(message, `Caralho, ${bot.data.get(message.author.id, "username")}, o ID é inválido`)

	let uData = bot.data.get(id)

	if (!uData || uData.username == undefined) return bot.createEmbed(message, `Este usuário não possui um inventário`)

	if (option == 'prisao') {
		uData.preso = currTime
		bot.createEmbed(message, `${uData.username} foi solto da prisão ${bot.config.police}`)

	} else if (option == 'hospital') {
		uData.hospitalizado = currTime
		bot.createEmbed(message, `${uData.username} foi curado ${bot.config.hospital}`)

	} else if (option == 'roubar') {
		uData.roubo = currTime
		bot.createEmbed(message, `${uData.username} pode roubar novamente ${bot.config.roubar}`)

	} else if (option == 'emroubo') {
		uData.emRoubo.tempo = 0
		bot.createEmbed(message, `${uData.username} não está mais em um roubo ${bot.config.roubar}`)

	} else if (option == 'emespancamento') {
		uData.emEspancamento.tempo = 0
		bot.createEmbed(message, `${uData.username} não está mais em um espancamento ${bot.config.espancar}`)

	} else if (option == 'espancar') {
		uData.espancar = currTime
		bot.createEmbed(message, `${uData.username} pode espancar novamente ${bot.config.espancar}`)

	} else if (option == 'galorinha') {
		let uGalo = bot.galos.get(id)
		uGalo.emRinha = false
		bot.galos.set(id, uGalo)
		bot.createEmbed(message, `${uGalo.nome} não está mais em uma rinha ${bot.config.galo}`)

	} else if (option == 'galocansado') {
		let uGalo = bot.galos.get(id)
		uGalo.descansar = currTime
		bot.galos.set(id, uGalo)
		bot.createEmbed(message, `${uGalo.nome} pode rinhar novamente ${bot.config.galo}`)
	} else
		return bot.createEmbed(message, `Bah, ${bot.data.get(message.author.id, "username")}, escolha uma opção:\n\`prisao\`, \`hospital\`, \`roubar\`, \`emroubo\`, \`emespancamento\`, \`espancar\`, \`galorinha\`, \`galocansado\``)

	bot.data.set(id, uData)

	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**${bot.data.get(message.author.id, "username")} liberou "\`${option}\`" de ${uData.username}**`)
		.setColor(bot.colors.admin))

};