const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()
	let option = args[0]
	const tres_dias = 259200000
	const semana = 604800000
	const cor = 0x3ab4c1

	if (!option) {
		const embed = new Discord.MessageEmbed()

			.setTitle(`${bot.badges.ovos_dourados} Mercado de Ovos`)
			.setDescription(`Troque seus ${bot.config.ovo} **Ovos** por itens e benefícios!\nO Mercado ficará aberto até 23/04.`)
			.setColor(cor)
			.setThumbnail("https://cdn.discordapp.com/attachments/691019843159326757/829133473784266752/Ovo_Dourado_20210406201815.png")
			.addField(`\`1.\` ${bot.badges.galoelho} Badge para galo "Galoelho"`, `*Afinal, coelho não põe ovos*\n\`25 Ovos\``, true)
			.addField(`\`2.\` ${bot.config.ovogranada} Ovo-Granada (3un)`, `*Faz 'ploc' e depois faz 'bum'*\n\`50 Ovos\`\nATK +5`, true)
			.addField(`\`3.\` ${bot.config.rpg} ${bot.guns.rpg.desc} (72h)`, `*Uma velha amiga para novas aventuras*\n\`100 Ovos\`\nATK ${bot.guns.rpg.atk}\nDEF ${bot.guns.rpg.def}`, true)
			.addField(`\`4.\` ${bot.config.superWhey} Super Whey`, `*Indicado somente para touros*\n\`150 ovos\`\nAumenta o nível do galo em 5`, true)
			.addField(`\`5.\` ${bot.config.vip} VIP (7 dias)`, `*O gostinho doce da burguesia*\n\`300 ovos\``, true)
			.addField(`\`6.\` ${bot.badges.ovos_dourados} Badge "Ovos Dourados"`, `*Para ostentadores de plantão*\n\`500 Ovos\``, true)
			.setFooter(`${uData.username} • Ovos: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
			.setTimestamp();
		return message.channel.send({
			embeds: [embed]
		}).catch(err => console.log("Não consegui enviar mensagem `movo`"))

	} else {
		// if (message.author.id != bot.config.adminID)
		// 	return bot.createEmbed(message, `A compra de itens ainda não está permitida`, null, cor)

		let prices = [25, 50, 100, 150, 300, 500]

		if (option < 1 || (option % 1 != 0) || option > prices.length)
			return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length} ${bot.badges.ovos_dourados}`, null, cor)

		if (uData._ovo < prices[option - 1])
			return bot.createEmbed(message, `Você não tem ovos suficientes para fazer isto`, `Ovos: ${uData._ovo}`, cor)

		if (uData.preso > currTime)
			return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime)
			return bot.msgHospitalizado(message, uData)

		if (bot.isUserEmRouboOuEspancamento(message, uData))
			return

		if (bot.isGaloEmRinha(message.author.id))
			return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		uData._ovo -= prices[option - 1]

		switch (parseInt(option)) {
			case 1:
				if (bot.data.has(message.author.id, 'badgePascoa2020_galo'))
					return bot.createEmbed(message, `${bot.config.ovo} Seu galo já possui esta badge! ${bot.config.galo}`, null, bot.colors.white)

				uData.badgePascoa2020_galo = true
				bot.createEmbed(message, `${bot.config.ovo} Você comprou a badge ${bot.badges.galoelho} **Galoelho** para ${uData.galoNome}!`, `Ovos: ${uData._ovo}`, cor)
				break

			case 2:
				uData._ovogranada = uData._ovogranada += 3
				// return bot.createEmbed(message, `Desativado temporariamente!`, null, cor)
				bot.createEmbed(message, `${bot.config.ovo} Você comprou 3 unidades de ${bot.config.ovogranada} **Ovo-Granada**!`, `Ovos: ${uData._ovo}`, cor)
				break

			case 3:
				uData._rpg = uData._rpg > currTime ? uData._rpg + tres_dias : currTime + tres_dias
				bot.createEmbed(message, `${bot.config.ovo} Você comprou 72 horas de ${bot.config.rpg} **${bot.guns.rpg.desc}**!`, `Ovos: ${uData._ovo}`, cor)
				break

			case 4:
				//whey
				if (uData.galoPower >= 75)
					return bot.createEmbed(message, `Seu galo já tomou muito ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white);
				if (uData.galoTrain == 1) {
					if (tData.galoTrainTime > currTime)
						return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((tData.galoTrainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, null, bot.colors.white)
					else
						return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
				}

				uData.galoPower += 5

				if (uData.galoPower > 75)
					uData.galoPower = 75

				bot.createEmbed(message, `Você comprou um ${bot.config.superWhey} **Super Whey** para ${uData.galoNome} e ele subiu para o nível ${uData.galoPower - 30} ${bot.config.galo}`, null, bot.colors.white);
				break

			case 5:
				let daysToAdd = uData.vipTime > currTime ? uData.vipTime + semana : currTime + semana

				uData.vipTime = daysToAdd
				uData.nickAlterado = false
				bot.createEmbed(message, `${bot.config.ovo} Você adquiriu 7 dias de ${bot.badges.vip} **VIP**!`, `Ovos: ${uData._ovo}`, cor)
				break

			case 6:
				if (bot.data.has(message.author.id, 'badgePascoa2020_dourado'))
					return bot.createEmbed(message, `${bot.config.ovo} Você já possui esta badge! ${bot.badges.ovos_dourados}`, null, cor)

				uData.badgePascoa2020_dourado = true
				bot.createEmbed(message, `${bot.config.ovo} Você comprou a badge ${bot.badges.ovos_dourados} **Ovos Dourados**!`, `Ovos: ${uData._ovo}`, cor)
				break

		}
		return bot.data.set(message.author.id, uData)
	}


};
exports.config = {
	alias: ['mo']
};