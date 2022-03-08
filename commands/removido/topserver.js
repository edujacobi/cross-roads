const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return
	let listaMoney = [] // total
	let listaCapita = [] // per capita
	let listaMembros = [] // membros
	let listaFichas = [] // fichas

	const embed = new Discord.MessageEmbed()
		.setTitle("Top Servidores")
		.setColor('GREEN')
		.setDescription("Coletando informações...")
		.setFooter(`${bot.data.get(message.author.id, "username")} • Necessário 10 membros no servidor e 3 jogadores`, message.member.user.avatarURL())
		.setTimestamp()

	message.channel.send({
		embeds: [embed]
	}).then(m => {

		bot.guilds.cache.forEach(server => {
			let moneyServer = 0
			let fichaServer = 0
			let users = 0

			//remove da contagem o Jacobi, e só contabiliza servers com +10 users
			if (server.memberCount >= 10) {
				server.members.cache.forEach(member => {
					if (bot.data.indexes.includes(member.user.id) && bot.data.has(member.user.id, "classe") && bot.data.has(member.user.id, "username")) { // se é jogador e não é o Jacobi  && member.user.id != bot.config.adminID
						// let alvo = member.user.id
						// bot.users.fetch(alvo).then(user => alvo = user.id)
						moneyServer += bot.data.get(member.user.id, "moni")
						fichaServer += bot.data.get(member.user.id, "ficha")
						users++
					}
				})

				if (users > 3) {
					listaMoney.push({
						nome: server.name,
						money: parseInt(moneyServer)
					})

					listaCapita.push({
						nome: server.name,
						money: Math.round(moneyServer / users)
					})

					listaMembros.push({
						nome: server.name,
						membros: users
					})

					listaFichas.push({
						nome: server.name,
						fichas: fichaServer
					})
				}

			}
		})

		// organiza em ordem decrescente
		listaMoney = listaMoney.sort((a, b) => {
			return b.money - a.money
		}).slice(0, 10)

		listaCapita = listaCapita.sort((a, b) => {
			return b.money - a.money
		}).slice(0, 10)

		listaMembros = listaMembros.sort((a, b) => {
			return b.membros - a.membros
		}).slice(0, 10)

		listaFichas = listaFichas.sort((a, b) => {
			return b.fichas - a.fichas
		}).slice(0, 10)

		let topMoney = ""
		let topCapita = ""
		let topMembros = ""
		let topFichas = ""

		listaMoney.forEach((server, i) => topMoney += `\`${i+1}.\` **${server.nome}** R$ ${server.money.toLocaleString().replace(/,/g, ".")}\n`)
		listaCapita.forEach((server, i) => topCapita += `\`${i+1}.\` **${server.nome}** R$ ${server.money.toLocaleString().replace(/,/g, ".")}\n`)
		listaMembros.forEach((server, i) => topMembros += `\`${i+1}.\` **${server.nome}** ${server.membros.toLocaleString().replace(/,/g, ".")}\n`)
		listaFichas.forEach((server, i) => topFichas += `\`${i+1}.\` **${server.nome}** ${server.fichas.toLocaleString().replace(/,/g, ".")}\n`)

		const embed2 = new Discord.MessageEmbed()
			.setTitle("Top Servidores")
			.setColor('GREEN')
			.addField("Valor per capita 👤", topCapita)
			.addField("Valor total 👥", topMoney)
			.addField("Jogadores 👨‍👩‍👧‍👦", topMembros)
			.addField(`Fichas ${bot.config.ficha}`, topFichas)
			.setFooter(`${bot.data.get(message.author.id, "username")} • Necessário 10 membros no servidor e 3 jogadores`, message.member.user.avatarURL())
			.setTimestamp()

		m.edit({
			embeds: [embed2]
		}).catch(err => console.log("Não consegui editar mensagem `topserver`"))
	}).catch(err => console.log("Não consegui enviar mensagem `topserver`"))
}