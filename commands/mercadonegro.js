const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()
	let dia = new Date().getDay()
	let hora = new Date().getHours()
	let option = args[0]
	let multiplicador = args[1] ? args[1] : 1
	const tres_dias = 259200000
	const um_dia = 86400000
	const semana = 604800000

	let prices = [bot.guns.minigun.preço, bot.guns.jetpack.preço, bot.guns.exoesqueleto.preço, 95000, 1500000, 5000000]

	//if (dia == 0 || dia == 6 || (dia == 5 && hora >= 18) || message.author.id == bot.config.adminID)
	if (dia != 0 && dia != 6 && !(dia == 5 && hora >= 20) && message.author.id != bot.config.adminID)
		return bot.createEmbed(message, `"Hey, psst... Volta aqui no final de semana que eu terei umas coisinhas bem legais pra te mostrar..." ${bot.config.mercadonegro}`, null, 0)

	if (!option) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.mercadonegro} Mercado Negro`)
			.setDescription("Olhe para essas belezinhas!")
			.setColor(0)
			.setThumbnail("https://media.discordapp.net/attachments/531174573463306240/854876912857120789/MercadoNegro.png")
			.addField(`${bot.config.minigun} ${bot.guns.minigun.desc}`,
				`R$ ${uData.classe == 'mafioso' ? bot.guns.minigun.preço.toLocaleString().replace(/,/g, ".") : (bot.guns.minigun.preço * (1 + bot.imposto)).toLocaleString().replace(/,/g, ".")}
ATK ${bot.guns.minigun.atk}
DEF ${bot.guns.minigun.def}
\`;mercadonegro 1\``, true)
			.addField(`${bot.config.jetpack} ${bot.guns.jetpack.desc}`,
			`R$ ${uData.classe == 'mafioso' ? bot.guns.jetpack.preço.toLocaleString().replace(/,/g, ".") : (bot.guns.jetpack.preço * (1 + bot.imposto)).toLocaleString().replace(/,/g, ".")}
Fuga +30%
168h
\`;mercadonegro 2\``, true)
			.addField(`${bot.config.exoesqueleto} ${bot.guns.exoesqueleto.desc}`,
			`R$ ${uData.classe == 'mafioso' ? bot.guns.exoesqueleto.preço.toLocaleString().replace(/,/g, ".") : (bot.guns.exoesqueleto.preço * (1 + bot.imposto)).toLocaleString().replace(/,/g, ".")}
DEF ${bot.guns.exoesqueleto.def}
Valor defendido ${bot.guns.exoesqueleto.moneyDef}%
\`;mercadonegro 3\``, true)
			.addField(`${bot.config.ficha} 1000 fichas`,
			`R$ ${prices[3].toLocaleString().replace(/,/g, ".")}
5% de desconto
\`;mercadonegro 4\``, true)
			.addField(`${bot.config.ovogranada} 2 Granadas`,
			`R$ ${uData.classe == 'mafioso' ? prices[4].toLocaleString().replace(/,/g, ".") : (prices[4] * (1 + bot.imposto)).toLocaleString().replace(/,/g, ".")}
+5 ATK em roubos e espancamentos
\`;mercadonegro 5\``, true)
			.addField(`${bot.config.superWhey} Super Whey`,
			`R$ ${uData.classe == 'mafioso' ? prices[5].toLocaleString().replace(/,/g, ".") : (prices[5] * (1 + bot.imposto)).toLocaleString().replace(/,/g, ".")}
Aumenta o nível do galo em 5
\`;mercadonegro 6\``, true)
			// 			.addField(`${bot.config.bazuca} ${bot.guns.bazuca.desc}`,
			// 				`Duração: 24h
			// R$ 50.000.000
			// ATK ${bot.guns.bazuca.atk}
			// DEF ${bot.guns.bazuca.def}
			// \`;mercadonegro 7\``, true)
			.addField(`${bot.jobs.et.desc}`,
				`Duração: ${bot.jobs.et.time/60}h
Salário: R$ ${bot.jobs.et.pagamento.toLocaleString().replace(/,/g, ".")}
Necessário: ${bot.config.rpg}${bot.config.katana}${bot.config.goggles}${bot.config.colete}${bot.config.colete_p}
\`;job 16\``, true)
			.addField(`${bot.jobs.mafia.desc}`,
				`Duração: ${bot.jobs.mafia.time/60}h
Salário: R$ ${bot.jobs.mafia.pagamento.toLocaleString().replace(/,/g, ".")}
Necessário: ${bot.config.minigun}
\`;job 17\``, true)
			.addField(`${bot.jobs.conquistador.desc}`,
				`Duração: ${bot.jobs.conquistador.time/60}h
Salário: R$ ${bot.jobs.conquistador.pagamento.toLocaleString().replace(/,/g, ".")}
Necessário: ${bot.config.bazuca}${bot.config.minigun}${bot.config.exoesqueleto}${bot.config.jetpack}
\`;job 18\``, true)
			.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
			.setTimestamp();

		return message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `mercadonegro`"))

	}

	//uData = bot.data.get(message.author.id)

	if (option < 1 || (option % 1 != 0) || option > prices.length)
		return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length} ${bot.config.mercadonegro}`, null, 0)

	if (multiplicador < 1 || (multiplicador % 1 != 0))
		return bot.createEmbed(message, `O multiplicador informado é inválido ${bot.config.mercadonegro}`, null, 0)

	let preço = uData.classe == 'mafioso' ? prices[option - 1] * multiplicador : prices[option - 1] * multiplicador * (1 + bot.imposto)
	if (option == 4)
		preço = prices[option - 1] * multiplicador // ignora imposto para todos na compra de fichas

	if (uData.moni < preço)
		return bot.msgSemDinheiro(message)

	if (uData.preso > currTime)
		return bot.msgPreso(message, uData)

	if (uData.hospitalizado > currTime)
		return bot.msgHospitalizado(message, uData)

	if (bot.isUserEmRouboOuEspancamento(message, uData))
		return

	if (bot.isGaloEmRinha(message.author.id))
		return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

	uData.moni -= preço
	uData.lojaGastos += preço

	switch (parseInt(option)) {
		case 1:
			if ((uData._minigun + (tres_dias * multiplicador) > currTime + 720 * 60 * 60 * 1000) || (uData._minigun < currTime && currTime + (tres_dias * multiplicador) > currTime + 720 * 60 * 60 * 1000))
				return bot.createEmbed(message, `Você não pode possuir mais que 720 horas de uma mesma arma ${bot.config.mercadonegro}`, null, 0)

			uData._minigun = uData._minigun > currTime ? uData._minigun + (tres_dias * multiplicador) : currTime + (tres_dias * multiplicador)
			bot.createEmbed(message, `Você comprou ${bot.segToHour(72 * 60 * 60 * multiplicador)} de ${bot.config.minigun} **${bot.guns.minigun.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`${bot.config.mercadonegro} **${uData.username} comprou ${bot.segToHour(72 * multiplicador * 60 * 60)} de ${bot.config.minigun} ${bot.guns.minigun.desc}**`)
				.addField("Preço", "R$" + preço.toLocaleString().replace(/,/g, "."), true)
				.addField("Tempo restante", bot.segToHour((uData._minigun - currTime) / 1000), true)
				.setColor(0))

			break

		case 2:
			if ((uData._jetpack + (semana * multiplicador) > currTime + 2880 * 60 * 60 * 1000) || (uData._jetpack < currTime && currTime + (semana * multiplicador) > currTime + 2880 * 60 * 60 * 1000))
				return bot.createEmbed(message, `Você não pode possuir mais que 2880 horas da Jetpack ${bot.config.mercadonegro}`, null, 0)

			uData._jetpack = uData._jetpack > currTime ? uData._jetpack + (semana * multiplicador) : currTime + (semana * multiplicador)
			bot.createEmbed(message, `Você comprou ${bot.segToHour(168 * 60 * 60 * multiplicador)} de ${bot.config.jetpack} **${bot.guns.jetpack.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`${bot.config.mercadonegro} **${uData.username} comprou ${bot.segToHour(168 * 60 * 60)} de ${bot.config.jetpack} ${bot.guns.jetpack.desc}**`)
				.addField("Preço", "R$" + preço.toLocaleString().replace(/,/g, "."), true)
				.addField("Tempo restante", bot.segToHour((uData._jetpack - currTime) / 1000), true)
				.setColor(0))

			break

		case 3:
			if ((uData._exoesqueleto + (tres_dias * multiplicador) > currTime + 720 * 60 * 60 * 1000) || (uData._exoesqueleto < currTime && currTime + (tres_dias * multiplicador) > currTime + 720 * 60 * 60 * 1000))
				return bot.createEmbed(message, `Você não pode possuir mais que 720 horas de uma mesma arma ${bot.config.mercadonegro}`, null, 0)

			uData._exoesqueleto = uData._exoesqueleto > currTime ? uData._exoesqueleto + (tres_dias + multiplicador) : currTime + (tres_dias + multiplicador)
			bot.createEmbed(message, `Você comprou ${bot.segToHour(168 * 60 * 60 * multiplicador)} de ${bot.config.exoesqueleto} **${bot.guns.exoesqueleto.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`${bot.config.mercadonegro} **${uData.username} comprou ${bot.segToHour(72 * 60 * 60)} de ${bot.config.exoesqueleto} ${bot.guns.exoesqueleto.desc}**`)
				.addField("Preço", "R$" + preço.toLocaleString().replace(/,/g, "."), true)
				.addField("Tempo restante", bot.segToHour((uData._exoesqueleto - currTime) / 1000), true)
				.setColor(0))

			break

		case 4:
			let quantidadeFicha = 1000 * multiplicador
			uData.ficha += quantidadeFicha
			bot.createEmbed(message, `Você comprou ${bot.config.ficha} **${quantidadeFicha} fichas** ${bot.config.mercadonegro}`, `${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, 0)

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`${bot.config.mercadonegro} **${uData.username} comprou ${bot.config.ficha} ${quantidadeFicha} fichas**`)
				.addField("Preço", "R$" + preço.toLocaleString().replace(/,/g, "."), true)
				.addField("Fichas totais", uData.ficha.toString(), true)
				.setColor(0))

			break

		case 5:
			let quantidadeGranada = 2 * multiplicador
			if (uData._ovogranada + multiplicador > 50)
				return bot.createEmbed(message, `Você não pode possuir mais que 50 unidades de Granada ${bot.config.mercadonegro}`, null, 0)

			uData._ovogranada += quantidadeGranada
			bot.createEmbed(message, `Você comprou ${quantidadeGranada} unidades de ${bot.config.ovogranada} **Granada**!`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`${bot.config.mercadonegro} **${uData.username} comprou ${quantidadeGranada} ${bot.config.ovogranada} Granadas**`)
				.addField("Preço", "R$" + preço.toLocaleString().replace(/,/g, "."), true)
				.addField("Granadas totais", uData._ovogranada.toString(), true)
				.setColor(0))

			break

		case 6:
			//whey
			let uGalo = bot.galos.get(message.author.id)

			if (multiplicador > 1)
				return bot.createEmbed(message, `Não é possível comprar ${bot.config.superWhey} **Super Whey** em quantidade ${bot.config.mercadonegro}`, null, 0);
			if (uGalo.power < 70)
				return bot.createEmbed(message, `Seu galo está muito fraco para tomar ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white);
			if (uGalo.power >= 75)
				return bot.createEmbed(message, `Seu galo já tomou muito ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white);
			if (uGalo.train == 1) {
				if (uGalo.trainTime > currTime)
					return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, bot.colors.white)
				else
					return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
			}

			uGalo.power += 5

			if (uGalo.power > 75)
				uGalo.power = 75

			bot.createEmbed(message, `Você comprou um ${bot.config.superWhey} **Super Whey** para ${uGalo.nome} e ele subiu para o nível ${uGalo.power - 30} ${bot.config.galo}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0);

			bot.log(message, new Discord.MessageEmbed()
				.setDescription(`${bot.config.mercadonegro} **${uData.username} comprou ${bot.config.superWhey} Super Whey para ${uGalo.nome}**`)
				.addField("Preço", "R$" + prices[option - 1].toLocaleString().replace(/,/g, "."), true)
				.addField("Nível do galo", (uGalo.power - 30).toString(), true)
				.setColor(0))

			bot.galos.set(message.author.id, uGalo)

			break

			// case 7:
			// 	if (uData._bazuca + um_dia > currTime + 720 * 60 * 60 * 1000)
			// 		return bot.createEmbed(message, `Você não pode possuir mais que 720 horas de uma mesma arma ${bot.config.mercadonegro}`, null, 0)

			// 	uData._bazuca = uData._bazuca > currTime ? uData._bazuca + um_dia : currTime + um_dia
			// 	bot.createEmbed(message, `Você comprou 24 horas de ${bot.config.bazuca} **${bot.guns.bazuca.desc}** ${bot.config.mercadonegro}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, 0)

			// 	bot.log(message, new Discord.MessageEmbed()
			// 		.setDescription(`**${uData.username} comprou ${bot.segToHour(24 * 60 * 60)} de ${bot.config.bazuca} ${bot.guns.bazuca.desc}**`)
			// 		.addField("Preço", "R$" + prices[option - 1].toLocaleString().replace(/,/g, "."), true)
			// 		.addField("Tempo restante", bot.segToHour((uData._bazuca - currTime) / 1000), true)
			// 		.setColor(0))

			// 	break

	}
	bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(preço * bot.imposto))
	return bot.data.set(message.author.id, uData)

};
exports.config = {
	alias: ['mn']
};