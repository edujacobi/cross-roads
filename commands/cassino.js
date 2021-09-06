const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	//if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return message.channel.send('Comando em manutenção')
	let option = args[0]
	if (!option) {
		// let horasPassadas = 1
		// let uptime = bot.uptime

		// while (uptime > 1800000) {
		// 	horasPassadas++
		// 	uptime -= 1800000
		// }

		// let proxDeposito = 30 * 60 * horasPassadas - ((bot.uptime) / 1000)

		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.mafiaCasino} Cassino`)
			.setDescription("Antro da perdição! Aposte, ganhe, perca, quebre a banca!\nAqui você pode apostar suas fichas ou seu dinheiro!")
			.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/760256761889423400/radar_mafiaCasino.png")
			.setColor('GREEN')
			.addField("🪙 Cara ou Coroa", `Aposte um valor em fichas. Você tem 50% de chance de vencer! O imposto é triplicado.\n\`;bet [cara|coroa] [valor]\``, true)
			.addField("🎰 Caça-níquel", `Acerte três figuras iguais e ganhe fichas!!\n\`;niquel <multiplicador>\``, true)
			.addField(`🎟️ Bilhete premiado`, `Compre um bilhete e torça para ser o vencedor!\n\`;bilhete\``, true)
			.addField(`Caixa do Cassino`, `R$ ${bot.banco.get('cassino').toLocaleString().replace(/,/g, ".")}`) //\nPróximo depósito de R$ ${bot.carregamentoCassino.toLocaleString().replace(/,/g, ".")} em: ${bot.segToHour(proxDeposito)}
			.addField(`${bot.config.ficha} Fichas`, "Use-as na máquina caça-níquel! Preço por ficha: R$ 100\n`;cassino <quantidade>`", true)
			.addField("Câmbio", `Troque suas fichas por dinheiro! Cada ficha vale R$ 80.\n\`;cambio [quantidade]\``)
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp();
		message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `cassino`", err))

	} else {
		let currTime = new Date().getTime()

		let uData = bot.data.get(message.author.id)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)
		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

		if (option == 'allin' || option == 'all' || option == 'tudo')
			option = Math.floor(uData.moni / 100)

		option = parseInt(option)

		if (option < 1 || (option % 1 != 0))
			return bot.createEmbed(message, `O valor inserido é inválido ${bot.config.mafiaCasino}`)

		// let aux = option
		// let count = 0
		// while (aux >= 100) {
		// 	aux -= 100
		// 	count += 1
		// }

		let price = option * 100

		if (uData.moni < price)
			return bot.msgSemDinheiro(message)

		uData.moni -= price

		// uData.lojaGastos += price

		let imposto = uData.classe == 'mafioso' ? 0 : bot.imposto

		bot.banco.set('caixa', bot.banco.get('caixa') + price * imposto)
		bot.banco.set('cassino', bot.banco.get('cassino') + (price - price * imposto))


		uData.ficha += option
		bot.createEmbed(message, `Você comprou ${bot.config.ficha} **${option.toLocaleString().replace(/,/g, ".")} fichas** por R$ ${price.toLocaleString().replace(/,/g, ".")} ${bot.config.mafiaCasino}`, `Fichas: ${uData.ficha.toLocaleString().replace(/,/g, ".")} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)

		return bot.data.set(message.author.id, uData)
	}
}