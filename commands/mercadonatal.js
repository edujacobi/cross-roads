const Discord = require('discord.js')

exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)
	let currTime = new Date().getTime()
	let option = args[0]
	const tres_dias = 259200000
	const semana = 604800000
	const cor = 'YELLOW' //0x3ab4c1

	if (!bot.isAdmin(message.author.id)) return

	if (!option) {
		const embed = new Discord.MessageEmbed()

			.setTitle(`${bot.config.ovo} Mercado do Natal`)
			.setDescription(`Troque seus ${bot.config.ovo} **Presentes** por itens e benefícios!\nO Mercado ficará aberto até 9/01.`)
			.setColor(cor)
			.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/921754359656771634/Presente.png')
			.addField(`\`1.\` ${bot.badges.evento_natal_galo_2021} Badge para galo "Papai Galoel"`, `*Ho ho ho, chegou o papai galoel*\n\`50 presentes\``, true)
			.addField(`\`2.\` ${bot.config.ovogranada} Granada (2un)`, `*Faz 'ploc' e depois faz 'bum'*\n\`75 presentes\`\nATK +5`, true)
			.addField(`\`3.\` ${bot.config.rpg} ${bot.guns.rpg.desc} (72h)`, `*Uma velha amiga para novas aventuras*\n\`150 presentes\`\nATK ${bot.guns.rpg.atk}\nDEF ${bot.guns.rpg.def}`, true)
			.addField(`\`4.\` ${bot.config.superWhey} Super Whey`, `*Indicado somente para touros*\n\`200 presentes\`\nAumenta o nível do galo em 5`, true)
			.addField(`\`5.\` <:Jacas:921840598808428575> Recarga na troca de nick`, `*Quando você cansa de ser você mesmo*\n\`250 presentes\``, true)
			.addField(`\`6.\` ${bot.badges.evento_natal_2021} Badge "Biscoito Natalino"`, `*Você foi uma criança comportada?*\n\`500 presentes\``, true)
			.setFooter(`${uData.username} • Presentes: ${uData._ovo.toLocaleString().replace(/,/g, '.')}`, message.member.user.avatarURL())
			.setTimestamp()

		return message.channel.send({embeds: [embed]})
			.catch(() => console.log('Não consegui enviar mensagem `mnatal`'))

	} else {
	//	if (!bot.isAdmin(message.author.id))
		//	return bot.createEmbed(message, `${bot.config.ovo} A compra de itens ainda não está permitida`, null, cor)

		let prices = [50, 75, 150, 200, 250, 500]

		if (option < 1 || option % 1 != 0 || option > prices.length) return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length} ${bot.badges.ovos_dourados}`, null, cor)

		if (uData._ovo < prices[option - 1]) return bot.createEmbed(message, `Você não tem presentes suficientes para fazer isto`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

		if (uData.preso > currTime) return bot.msgPreso(message, uData)

		if (uData.hospitalizado > currTime) return bot.msgHospitalizado(message, uData)

		if (bot.isUserEmRouboOuEspancamento(message, uData)) return

		if (bot.isGaloEmRinha(message.author.id)) return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)

		uData._ovo -= prices[option - 1]

		switch (parseInt(option)) {
			case 1:
				if (bot.data.has(message.author.id, 'badgeNatal2021Galoel'))
					return bot.createEmbed(message, `${bot.config.ovo} Seu galo já possui esta badge! ${bot.config.galo}`, null, bot.colors.white)

				uData.badgeNatal2021Galoel = true
				bot.createEmbed(message, `${bot.config.ovo} Você comprou a badge ${bot.badges.evento_natal_galo_2021} **Papai Galoel** para ${bot.galos.get(message.author.id, 'nome')}!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`${bot.config.ovo} **${uData.username} comprou a badge para galo Galoel!**`)
					.addField("Preço", prices[option - 1].toLocaleString().replace(/,/g, "."), true)
					.addField('Presentes restantes', uData._ovo.toLocaleString().replace(/,/g, "."))
					.setColor('YELLOW'))

				break

			case 2:
				uData._ovogranada += 2
				// return bot.createEmbed(message, `Desativado temporariamente!`, null, cor)
				bot.createEmbed(message, `${bot.config.ovo} Você comprou 2 unidades de ${bot.config.ovogranada} **Granada**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`${bot.config.ovo} **${uData.username} comprou 2 ${bot.config.ovogranada} Granadas**`)
					.addField("Preço", prices[option - 1].toLocaleString().replace(/,/g, "."), true)
					.addField("Granadas totais", uData._ovogranada.toString(), true)
					.addField('Presentes restantes', uData._ovo.toLocaleString().replace(/,/g, "."))
					.setColor('YELLOW'))

				break

			case 3:
				uData._rpg = uData._rpg > currTime ? uData._rpg + tres_dias : currTime + tres_dias
				bot.createEmbed(message, `${bot.config.ovo} Você comprou 72 horas de ${bot.config.rpg} **${bot.guns.rpg.desc}**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`${bot.config.ovo} **${uData.username} comprou 72 horas de ${bot.config.rpg} **${bot.guns.rpg.desc}**`)
					.addField("Preço", prices[option - 1].toLocaleString().replace(/,/g, "."), true)
					.addField("Tempo restante", bot.segToHour((uData._rpg - currTime) / 1000), true)
					.addField('Presentes restantes', uData._ovo.toLocaleString().replace(/,/g, "."))
					.setColor('YELLOW'))

				break

			case 4:
				//whey
				let uGalo = bot.galos.get(message.author.id)

				if (uGalo.power < 70)
					return bot.createEmbed(message, `Seu galo está muito fraco para tomar ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white)
				if (uGalo.power >= 75)
					return bot.createEmbed(message, `Seu galo já tomou muito ${bot.config.superWhey} **Super Whey** ${bot.config.galo}`, null, bot.colors.white)
				if (uGalo.train) {
					if (uGalo.trainTime > currTime)
						return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((uGalo.trainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, bot.colors.white)
					else
						return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
				}

				uGalo.power += 5

				if (uGalo.power > 75)
					uGalo.power = 75

				bot.createEmbed(message, `Você comprou um ${bot.config.superWhey} **Super Whey** para ${uGalo.nome} e ele subiu para o nível ${uGalo.power - 30} ${bot.config.galo}`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, bot.colors.white)

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`${bot.config.ovo} **${uData.username} comprou ${bot.config.superWhey} Super Whey para ${uGalo.nome}**`)
					.addField("Preço", prices[option - 1].toLocaleString().replace(/,/g, "."), true)
					.addField("Nível do galo", (uGalo.power - 30).toString(), true)
					.addField('Presentes restantes', uData._ovo.toLocaleString().replace(/,/g, "."))
					.setColor('YELLOW'))

				bot.galos.set(message.author.id, uGalo)

				break

			case 5:
				// let daysToAdd = uData.vipTime > currTime ? uData.vipTime + semana : currTime + semana
				if (!uData.nickAlterado)
					return bot.createEmbed(message, `${bot.config.ovo} Você já possui uma carga da troca de nick!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				// uData.vipTime = daysToAdd
				uData.nickAlterado = false
				bot.createEmbed(message, `${bot.config.ovo} Você adquiriu <:Jacas:921840598808428575> **Recarga na troca de nick**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`${bot.config.ovo} **${uData.username} comprou <:Jacas:921840598808428575> Recarga na troca de nick!**`)
					.addField("Preço", prices[option - 1].toLocaleString().replace(/,/g, "."), true)
					.addField('Presentes restantes', uData._ovo.toLocaleString().replace(/,/g, "."))
					.setColor('YELLOW'))

				break

			case 6:
				if (bot.data.has(message.author.id, 'badgeNatal2021')) return bot.createEmbed(message, `${bot.config.ovo} Você já possui esta badge! ${bot.badges.evento_natal_2021}`, null, cor)

				uData.badgeNatal2021 = true
				bot.createEmbed(message, `${bot.config.ovo} Você comprou a badge ${bot.badges.evento_natal_2021} **Biscoito Natalino**!`, `Presentes: ${uData._ovo.toLocaleString().replace(/,/g, ".")}`, cor)

				bot.log(message, new Discord.MessageEmbed()
					.setDescription(`${bot.config.ovo} **${uData.username} comprou a badge ${bot.badges.evento_natal_2021} Biscoito Natalino**!`)
					.addField("Preço", prices[option - 1].toLocaleString().replace(/,/g, "."), true)
					.addField('Presentes restantes', uData._ovo.toLocaleString().replace(/,/g, "."))
					.setColor('YELLOW'))
				break
		}
		return bot.data.set(message.author.id, uData)
	}
}
exports.config = {
	alias: ['natal'],
}
