const Discord = require("discord.js")
exports.run = async (bot, message, args) => {

	// if (message.author.id != bot.config.adminID)
	// 	return

	let time = new Date().getTime()
	let uData = bot.data.get(message.author.id)
	let option1 = args[0]
	const MAX = 10000
	const MIN = 10
	// let option2 = args[1]

	// return bot.createEmbed(message, `${bot.config.mafiaCasino} As apostas de Cara ou Coroa estão desativadas durante a primeira semana de temporada`)

	if (uData.job != null)
		return bot.msgTrabalhando(message, uData)

	if (uData.preso > time)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > time)
		return bot.msgHospitalizado(message, uData)

	if (bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

	if (args[1] === 'allin') {
		args[1] = uData.ficha
		if (args[1] > MAX)
			args[1] = MAX
	}

	let valor = parseInt(args[1])

	if (uData.ficha < 1)
		return bot.createEmbed(message, `Você não possui ${bot.config.ficha} fichas para apostar ${bot.config.mafiaCasino}`)

	if (valor <= 0 || (valor % 1 !== 0))
		return bot.msgValorInvalido(message)

	if (valor > MAX)
		return bot.createEmbed(message, `O valor máximo de aposta é ${bot.config.ficha} ${MAX.toLocaleString().replace(/,/g, ".")} fichas ${bot.config.mafiaCasino}`)

	if (valor < MIN)
		return bot.createEmbed(message, `O valor mínimo de aposta é ${bot.config.ficha} ${MIN.toLocaleString().replace(/,/g, ".")} fichas ${bot.config.mafiaCasino}`)

	// if (option1 != 'cara' && option2 != 'cara' && option1 != 'coroa' && option1 != 'coroa')
	// 	return bot.createEmbed(message, `Você deve escolher 2 moedas e apostar em Cara ou Coroa ${bot.config.mafiaCasino}`, ";bet <cara|coroa> <cara|coroa> <valor>")

	if (option1 !== 'cara' && option1 !== 'coroa')
		return bot.createEmbed(message, `Você deve apostar em Cara ou Coroa ${bot.config.mafiaCasino}`, ";bet <cara|coroa> <valor>")

	if (uData.ficha < valor)
		return bot.createEmbed(message, `Você não possui esta quantidade de ${bot.config.ficha} fichas para apostar ${bot.config.mafiaCasino}`)

	if (valor * 100 > bot.banco.get('cassino'))
		return bot.createEmbed(message, `O Cassino não tem caixa suficiente para apostar com você`, `Caixa: R$ ${bot.banco.get('cassino').toLocaleString().replace(/,/g, ".")}`)

	let face1 = (Math.random() < 0.50 ? "cara" : "coroa")
	// let face2 = (Math.random() < 0.50 ? "cara" : "coroa")

	let valor_imposto = uData.classe === 'mafioso' ? 0 : Math.floor(valor * bot.imposto * 2)

	if (valor >= 10) {
		valor -= valor_imposto
		if (message.author.id !== bot.config.adminID)
			bot.banco.set('caixa', bot.banco.get('caixa') + valor_imposto * 80)
	}

	if (face1 === option1) {
		uData.ficha += parseInt(valor)
		uData.cassinoGanhos += parseInt(valor) * 80
		uData.betW++
		bot.createEmbed(message, `Caiu **${face1}** \nVocê **ganhou** ${bot.config.ficha} ${parseInt(valor).toLocaleString().replace(/,/g, ".")} fichas ${bot.config.mafiaCasino}`, `${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, 'GREEN')
		bot.banco.set('cassino', bot.banco.get('cassino') - valor * 80)

		bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${uData.username} apostou em ${option1} ganhou ${parseInt(valor).toLocaleString().replace(/,/g, ".")} fichas**`)
			.addField("Caiu", `${face1} `, true)
			.addField("Imposto", `${valor_imposto.toLocaleString().replace(/,/g, ".")} fichas → R$ ${(valor_imposto * 80).toLocaleString().replace(/,/g, ".")}`, true)
			.setColor('GREEN'))

	} else {
		// uData.moni -= (valor + valor_imposto)
		uData.ficha -= parseInt(valor + valor_imposto)
		uData.cassinoPerdidos += parseInt(valor + valor_imposto) * 80
		uData.betL++
		bot.createEmbed(message, `Caiu **${face1}** \nVocê **perdeu** ${bot.config.ficha} ${parseInt(valor + valor_imposto).toLocaleString().replace(/,/g, ".")} fichas ${bot.config.mafiaCasino}`, `${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, 'RED')
		bot.banco.set('cassino', bot.banco.get('cassino') + valor * 80)

		bot.log(message, new Discord.MessageEmbed()
			.setDescription(`**${uData.username} apostou em ${option1} e perdeu ${parseInt(valor + valor_imposto).toLocaleString().replace(/,/g, ".")} fichas**`)
			.addField("Caiu", `${face1}`, true)
			.addField("Imposto", `${valor_imposto.toLocaleString().replace(/,/g, ".")} fichas → R$ ${(valor_imposto * 80).toLocaleString().replace(/,/g, ".")}`, true)
			.setColor('RED'))
	}

	uData.betJ++
	bot.data.set(message.author.id, uData)

}
exports.config = {
	alias: ['flip', 'b']
}