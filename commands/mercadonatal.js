const Discord = require('discord.js')

exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()
	let option = args[0]
	const tres_dias = 259200000
	const semana = 604800000
	const cor = 'YELLOW' //0x3ab4c1

	// if (!bot.isAdmin(message.author.id)) return

	if (!option) {
		const embed = new Discord.MessageEmbed()

			.setTitle(`${bot.config.ovo} Mercado do Natal`)
			.setDescription(`Troque seus ${bot.config.ovo} **Presentes** por itens e benefícios!\nO Mercado ficará aberto até 9/01.`)
			.setColor(cor)
			.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/921754359656771634/Presente.png')
			.addField(`\`1.\` ▫️ Badge para galo "Galoel"`, `*Ho ho ho, chegou o galoel*\n\`25 presentes\``, true)
			.addField(`\`2.\` ${bot.config.ovogranada} Granada (3un)`, `*Faz 'ploc' e depois faz 'bum'*\n\`50 presentes\`\nATK +5`, true)
			.addField(`\`3.\` ${bot.config.rpg} ${bot.guns.rpg.desc} (72h)`, `*Uma velha amiga para novas aventuras*\n\`100 presentes\`\nATK ${bot.guns.rpg.atk}\nDEF ${bot.guns.rpg.def}`, true)
			.addField(`\`4.\` ${bot.config.superWhey} Super Whey`, `*Indicado somente para touros*\n\`150 presentes\`\nAumenta o nível do galo em 5`, true)
			.addField(`\`5.\` <:Jacas:921840598808428575> Recarga na troca de nick`, `*Quando você cansa de ser você*\n\`200 presentes\``, true)
			.addField(`\`6.\` ▫️ Badge "---"`, `*Para ostentadores de plantão*\n\`500 presentes\``, true)
			.setFooter(`${uData.username} • Presentes: ${uData._ovo.toLocaleString().replace(/,/g, '.')}`, message.member.user.avatarURL())
			.setTimestamp()

		return message.channel
			.send({
				embeds: [embed],
			})
			.catch((err) => console.log('Não consegui enviar mensagem `movo`'))

	} else {
		if (!bot.isAdmin(message.author.id))
			return bot.createEmbed(message, `${bot.config.ovo} A compra de itens ainda não está permitida`, null, cor)

		let prices = [25, 50, 100, 150, 200, 500]

		if (option < 1 || option % 1 != 0 || option > prices.length) return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length} ${bot.badges.ovos_dourados}`, null, cor)

		if (uData._ovo < prices[option - 1]) return bot.createEmbed(message, `Você não tem presentes suficientes para fazer isto`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

		if (uData.preso > currTime) return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime) return bot.msgHospitalizado(message, uData)

		if (bot.isUserEmRouboOuEspancamento(message, uData)) return

		if (bot.isGaloEmRinha(message.author.id)) return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		uData._ovo -= prices[option - 1]

		switch (parseInt(option)) {
			case 1:
				if (bot.data.has(message.author.id, 'badgePascoa2020_galo'))
					return bot.createEmbed(message, `${bot.config.ovo} Seu galo já possui esta badge! ${bot.config.galo}`, null, bot.colors.white)

				uData.badgePascoa2020_galo = true
				bot.createEmbed(message, `${bot.config.ovo} Você comprou a badge ${bot.badges.galoelho} **Galoelho** para ${uData.galoNome}!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)
				break

			case 2:
				uData._ovogranada = uData._ovogranada += 3
				// return bot.createEmbed(message, `Desativado temporariamente!`, null, cor)
				bot.createEmbed(message, `${bot.config.ovo} Você comprou 3 unidades de ${bot.config.ovogranada} **Ovo-Granada**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)
				break

			case 3:
				uData._rpg = uData._rpg > currTime ? uData._rpg + tres_dias : currTime + tres_dias
				bot.createEmbed(message, `${bot.config.ovo} Você comprou 72 horas de ${bot.config.rpg} **${bot.guns.rpg.desc}**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)
				break

			case 4:
				//whey
				let uGalo = bot.galos.get(message.author.id)
				if (uGalo.power >= 75) return bot.createEmbed(message, `Seu galo já tomou muito ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white)
				if (uGalo.train == 1) {
					if (uGalo.trainTime > currTime)
						return bot.createEmbed(
							message,
							`Seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`,
							`Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`,
							bot.colors.white
						)
					else return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
				}

				uGalo.power += 5

				if (uGalo.power > 75) uGalo.power = 75

				bot.createEmbed(
					message,
					`Você comprou um ${bot.config.superWhey} **Super Whey** para ${uGalo.nome} e ele subiu para o nível ${uGalo.power - 30} ${bot.config.galo}`,
					`Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`,
					bot.colors.white
				)
				break

			case 5:
				// let daysToAdd = uData.vipTime > currTime ? uData.vipTime + semana : currTime + semana
				if (!uData.nickAlterado)
					return bot.createEmbed(message, `${bot.config.ovo} Você já possui uma carga da troca de nick!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				// uData.vipTime = daysToAdd
				uData.nickAlterado = false
				bot.createEmbed(message, `${bot.config.ovo} Você adquiriu <:Jacas:921840598808428575> **Recarga na troca de nick**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)
				break

			case 6:
				if (bot.data.has(message.author.id, 'badgePascoa2020_dourado')) return bot.createEmbed(message, `${bot.config.ovo} Você já possui esta badge! ${bot.badges.ovos_dourados}`, null, cor)

				uData.badgePascoa2020_dourado = true
				bot.createEmbed(message, `${bot.config.ovo} Você comprou a badge ${bot.badges.ovos_dourados} **Ovos Dourados**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)
				break
		}
		return bot.data.set(message.author.id, uData)
	}
}
exports.config = {
	alias: ['natal'],
}
