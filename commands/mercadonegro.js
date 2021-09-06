const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()
	let dia = new Date().getDay()
	let hora = new Date().getHours()
	let option = args[0]
	const tres_dias = 259200000
	const semana = 604800000

	//if (dia == 0 || dia == 6 || (dia == 5 && hora >= 18) || message.author.id == bot.config.adminID)
	// if (dia != 0 && dia != 6 && !(dia == 5 && hora >= 20) && message.author.id != bot.config.adminID)
	// 	return bot.createEmbed(message, `"Hey, psst... Volta aqui no final de semana que eu terei umas coisinhas bem legais pra te mostrar..." ${bot.config.mercadonegro}`, null, 0)

	if (!option) {
		const embed = new Discord.MessageEmbed()

			.setTitle(`${bot.config.mercadonegro} Mercado Negro`)
			.setDescription("Olhe para essas belezinhas!")
			.setColor(0)
			.setThumbnail("https://media.discordapp.net/attachments/531174573463306240/854876912857120789/MercadoNegro.png")

			.addField(`${bot.config.minigun} ${bot.guns.minigun.desc}`, `R$ ${bot.guns.minigun.preço.toLocaleString().replace(/,/g, ".")}\nATK ${bot.guns.minigun.atk}\nDEF ${bot.guns.minigun.def}\n\`;mercadonegro 1\``, true)
			.addField(`${bot.config.jetpack} Jetpack`, `R$ ${bot.guns.jetpack.preço.toLocaleString().replace(/,/g, ".")}\nFuga +30%\n168h\n\`;mercadonegro 2\``, true)
			.addField(`${bot.config.exoesqueleto} ${bot.guns.exoesqueleto.desc}`, `R$ ${bot.guns.exoesqueleto.preço.toLocaleString().replace(/,/g, ".")}\nDEF ${bot.guns.exoesqueleto.def}\nValor defendido ${bot.guns.exoesqueleto.moneyDef}%\n\`;mercadonegro 3\``, true)
			.addField(`${bot.config.ficha} 1000 fichas`, `R$ 95.000 \n5% de desconto\n\`;mercadonegro 4\``, true)
			.addField(`${bot.config.ovogranada} 2 Granadas`, `R$ 1.500.000 \n+5 ATK em roubos\n\`;mercadonegro 5\``, true)
			.addField(`${bot.config.superWhey} Super Whey`, `R$ 5.000.000\nAumenta o nível do galo em 5\n\`;mercadonegro 6\``, true)
			.addField(`${bot.jobs.et.desc}`, `Duração: ${bot.jobs.et.time/60}h\nSalário: R$ ${bot.jobs.et.pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.config.rpg}${bot.config.katana}${bot.config.goggles}${bot.config.colete}${bot.config.colete_p}\n\`;job 16\``, true)
			.addField(`${bot.jobs.mafia.desc}`, `Duração: ${bot.jobs.mafia.time/60}h\nSalário: R$ ${bot.jobs.mafia.pagamento.toLocaleString().replace(/,/g, ".")}\nNecessário: ${bot.config.minigun}\n\`;job 17\``, true)
			//.addField('\u200b', '\u200b', true)
			.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
			.setTimestamp();
		return message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `mercadonegro`", err))

	} else {
		//uData = bot.data.get(message.author.id)
		let prices = [bot.guns.minigun.preço, bot.guns.jetpack.preço, bot.guns.exoesqueleto.preço, 95000, 1500000, 5000000]

		if (option < 1 || (option % 1 != 0) || option > prices.length)
			return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length} ${bot.config.mercadonegro}`, null, 0)

		if (uData.moni < prices[option - 1])
			return bot.msgSemDinheiro(message)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (uData.emRoubo)
			return bot.msgEmRoubo(message)

		if (uData.galoEmRinha)
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		uData.moni -= prices[option - 1]
		uData.lojaGastos += prices[option - 1]

		switch (parseInt(option)) {
			case 1:
				if (uData._minigun + tres_dias > currTime + 720 * 60 * 60 * 1000)
					return bot.createEmbed(message, `Você não pode possuir mais que 720 horas de uma mesma arma ${bot.config.mercadonegro}`, null, 0)

				uData._minigun = uData._minigun > currTime ? uData._minigun + tres_dias : currTime + tres_dias
				bot.createEmbed(message, `Você comprou 72 horas de ${bot.config.minigun} **${bot.guns.minigun.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)
				break

			case 2:
				if (uData._jetpack + tres_dias > currTime + 2880 * 60 * 60 * 1000)
					return bot.createEmbed(message, `Você não pode possuir mais que 2880 horas da Jetpack ${bot.config.mercadonegro}`, null, 0)

				uData._jetpack = uData._jetpack > currTime ? uData._jetpack + semana : currTime + semana
				bot.createEmbed(message, `Você comprou 168 horas de ${bot.config.jetpack} **${bot.guns.jetpack.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)
				break

			case 3:
				if (uData._exoesqueleto + tres_dias > currTime + 720 * 60 * 60 * 1000)
					return bot.createEmbed(message, `Você não pode possuir mais que 720 horas de uma mesma arma ${bot.config.mercadonegro}`, null, 0)

				uData._exoesqueleto = uData._exoesqueleto > currTime ? uData._exoesqueleto + tres_dias : currTime + tres_dias
				bot.createEmbed(message, `Você comprou 72 horas de ${bot.config.exoesqueleto} **${bot.guns.exoesqueleto.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)
				break

			case 4:
				uData.ficha = uData.ficha + 1000
				bot.createEmbed(message, `Você comprou ${bot.config.ficha} **1000 fichas** ${bot.config.mercadonegro}`, `${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, 0)
				break

			case 5:
				if (uData._ovogranada + 2 > 50)
					return bot.createEmbed(message, `Você não pode possuir mais que 50 unidades de Granada ${bot.config.mercadonegro}`, null, 0)
					
				uData._ovogranada = uData._ovogranada += 2
				bot.createEmbed(message, `Você comprou 2 unidades de ${bot.config.ovogranada} **Granada**!`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)
				break

			case 6:
				//whey
				if (uData.galoPower < 70)
					return bot.createEmbed(message, `Seu galo está muito fraco para tomar ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white);
				if (uData.galoPower >= 75)
					return bot.createEmbed(message, `Seu galo já tomou muito ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white);
				if (uData.galoTrain == 1) {
					if (uData.galoTrainTime > currTime)
						return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uData.galoTrainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, bot.colors.white)
					else
						return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
				}

				uData.galoPower += 5

				if (uData.galoPower > 75)
					uData.galoPower = 75

				bot.createEmbed(message, `Você comprou um ${bot.config.superWhey} **Super Whey** para ${uData.galoNome} e ele subiu para o nível ${uData.galoPower - 30} ${bot.config.galo}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0);
				break
		}
		return bot.data.set(message.author.id, uData)
	}


};
exports.config = {
	alias: ['mn']
};