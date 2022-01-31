const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
	let option = args[0]
	let multiplicador = args[1] ? args[1] : 1
	const tres_dias = 259200000
	let uData = bot.data.get(message.author.id)
	// const desconto = uData.classe == 'mafioso' ? 0.95 : 1 // 1 = 0%, 0.7 = 30%

	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.loja} Loja`)
			.setThumbnail("https://media.discordapp.net/attachments/531174573463306240/854876910885797909/Loja.png")
			.setDescription("Todos os itens tem duração de 72 horas!\nVocê pode multiplicar a duração usando `;loja <id> <multiplicador>`")
			.setColor('GREEN')
			.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
			.setTimestamp()

		Object.entries(bot.guns).forEach(([key, value]) => {
			if (!['minigun', 'jetpack', 'bazuca', 'exoesqueleto', 'granada', 'celular'].includes(key)) {
				let ATK = value.atk
				let DEF = value.def
				let emote = value.skins[uData.arma[value.data].skinAtual].emote
				if (ATK && ATK.toString().indexOf('noite') === -1) {
					if (uData.classe === 'assassino') {
						if (ATK * 1.1 === Math.floor(ATK * 1.1))
							ATK = ATK * 1.1
						else
							ATK = (ATK * 1.1).toFixed(1)

					}
					else if (uData.classe === 'mendigo') {
						if (ATK * 0.9 === Math.floor(ATK * 0.9))
							ATK = ATK * 0.9
						else
							ATK = (ATK * 0.9).toFixed(1)
					}
				}
				if (DEF && DEF.toString().indexOf('noite') === -1) {
					if (uData.classe === 'assassino' || uData.classe === 'empresario') {
						if (DEF * 0.9 === Math.floor(DEF * 0.9))
							DEF = DEF * 0.9
						else
							DEF = (DEF * 0.9).toFixed(1)
						if (value.def.toString().indexOf('+') > -1)
							DEF = "+" + DEF
					}

				}
				embed.addField(`${value.id}: ${emote} ${value.desc}`, `R$ ${(uData.classe === 'mafioso' ? value.preço : value.preço * (1 + bot.imposto)).toLocaleString().replace(/,/g, ".")}\n${value.atk != null ? `ATK ${ATK}\n` : ''}${value.def != null ? `DEF ${DEF}\n` : ''}`, true)
			}
		})
		return message.channel.send({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `loja`"))
	}

	if (option < 1 || (option % 1 !== 0) || option > 14) // 16 = jetpack / 17 = minigun / 18 = bazuca ...
		return bot.createEmbed(message, `O ID deve ser entre 1 e 14 ${bot.config.loja}`, null, 'GREEN')

	let currTime = new Date().getTime()

	if (multiplicador < 1 || (multiplicador % 1 !== 0))
		return bot.createEmbed(message, `O multiplicador informado é inválido ${bot.config.loja}`, null, 'GREEN')

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`)

	Object.values(bot.guns).forEach(gun => {
		if (parseInt(option) === gun.id) {
			let preço = uData.classe === 'mafioso' ? gun.preço * multiplicador : gun.preço * multiplicador * (1 + bot.imposto)
			if (uData.moni < preço)
				return bot.msgSemDinheiro(message)

			if ((uData.arma[gun.data].tempo + (tres_dias * multiplicador) > currTime + 720 * 60 * 60 * 1000) || (uData.arma[gun.data].tempo < currTime && currTime + (tres_dias * multiplicador) > currTime + 720 * 60 * 60 * 1000))
				return bot.createEmbed(message, `Você não pode possuir mais que 720 horas de uma mesma arma ${bot.config.loja}`, null, 'GREEN')

			uData.moni -= preço
			uData.lojaGastos += preço

			let emote = gun.skins[uData.arma[gun.data].skinAtual].emote

			bot.createEmbed(message, `Você comprou ${bot.segToHour(72 * 60 * 60 * multiplicador)} de ${emote} **${gun.desc}**`, `Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 'GREEN')

			bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(preço * bot.imposto))

			Object.entries(uData.arma).forEach(([key, value]) => {
				if (key === gun.data && gun.data !== 'minigun')
					uData.arma[key].tempo = value.tempo > currTime ? value.tempo + (tres_dias * multiplicador) : currTime + (tres_dias * multiplicador)
				
			})

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`**${bot.config.loja} ${uData.username} comprou ${bot.segToHour(72 * 60 * 60 * multiplicador)} de ${emote} ${gun.desc}**`)
				.addField("Preço", "R$" + preço.toLocaleString().replace(/,/g, "."), true)
				// .addField("Imposto", `R$ ${valor_imposto.toLocaleString().replace(/,/g, ".")}`, true)
				.addField("Tempo restante", bot.segToHour((uData.arma[gun.data].tempo - currTime) / 1000), true)
				.setColor('GREEN'))
		}
	})
	return bot.data.set(message.author.id, uData)


}
exports.config = {
	alias: ['l', 'shop', 'comprar', 'buy', 'mercado']
}