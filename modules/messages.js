const Discord = require("discord.js");
module.exports = (bot) => {

	bot.createEmbed = (message, str, str_footer, color) =>
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
				.setDescription(str)
				.setColor(color ? color : bot.colors.darkGrey) //message.member.displayColor)
				.setTimestamp()
				.setFooter(str_footer ?
					(bot.data.get(message.author.id) != undefined && bot.data.has(message.author.id, "username") ? bot.data.get(message.author.id, "username") + ` • ${str_footer}` : message.author.username + ` • ${str_footer}`) : (bot.data.get(message.author.id) != undefined && bot.data.has(message.author.id, "username") ? bot.data.get(message.author.id, "username") : message.author.username), message.member.user.avatarURL())
			]
		}).catch(err => {
			console.log('createEmbed', err, str)
		})

	bot.showGalo = (message, tData, is_author) => {
		let currTime = new Date().getTime();
		if (!tData)
			return bot.createEmbed(message, `Este usuário não possui um inventário ${bot.config.galo}`, null, bot.colors.white);

		let winrate = tData.galoW + tData.galoL > 0 ? (tData.galoW / (tData.galoL + tData.galoW) * 100).toFixed(2) : '0';

		let situation = "";

		if (tData.galoTrain == 1) {
			if (tData.galoTrainTime - currTime < 0)
				situation = "Encerrou o treinamento";

			else
				situation = `Treinando por mais ${bot.segToHour((tData.galoTrainTime - currTime) / 1000)}`;

		} else if (tData.tempoRinha - currTime > 0 && tData.galoTrain == 0)
			situation = `${bot.segToHour((tData.tempoRinha - currTime) / 1000)} até descansar`;

		else if (tData.galoEmRinha)
			situation = "Em uma rinha"
		else
			situation = "Pronto para lutar!";

		let textoBadge = ''
		if (tData.badgePascoa2020_galo != undefined)
			textoBadge += bot.badges.galoelho
		if (tData.badgeCampeaoCanja != undefined)
			textoBadge += bot.badges.campeao_canja
		if (tData.badgeCoroamuruUniao != undefined)
			textoBadge += bot.badges.coroamuruUniao

		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.galo} ${(tData.galoNome == "Galo" ? `Galo de ${tData.username}` : tData.galoNome)}`)
			.setDescription(`${textoBadge}\n${(tData.galoTit == '' ? "Garnizé" : tData.galoTit)}`)
			.addField("Nível", (tData.galoPower - 30).toString(), true)
			.addField("Chance de vitória", tData.galoPower + "%", true)
			.addField("\u200b", "\u200b", true)
			.addField("Dados", `Vitórias: \`${tData.galoW}\`\nDerrotas: \`${tData.galoL}\`\nWin rate: \`${winrate}%\``, true)
			.addField("Stats", `ATK ${tData.galoPower - 30} | DEF ${(tData.galoPower - 30)/2}\nSPD ${((tData.galoPower - 30)/3).toFixed(1)} | CRT ${((tData.galoPower - 10)/3).toFixed(1)} %`, true)
			.addField("\u200b", `**${situation}**`)
			.setThumbnail(tData.galoAvatar)
			.setColor(bot.colors.white)
			.setFooter(`Galo de ${tData.username}`)
			.setTimestamp();

		if (tData.username == "Cross Roads") embed.setTitle(`${bot.config.caramuru} Caramuru`)

		if (is_author) {
			const desconto = tData.classe == 'mafioso' ? 0.95 : 1 // 1 = 0%, 0.7 = 30%
			let preco_whey = Math.floor((((tData.galoPower - 29) * 5) ** 2.7) * desconto);

			message.channel.send({
				embeds: [embed]
			}).then(msg => {
				msg.react('825828797265739798').catch(err => console.log("Não consegui reagir mensagem `galo view`", err)).then(r => {
					const filter = (reaction, user) => reaction.emoji.id === '825828797265739798' && user.id == message.author.id;

					const confirm = msg.createReactionCollector({
						filter,
						idle: 30000,
					});

					confirm.on('collect', r => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `galo whey`", err))
							.then(m => {
								tData = bot.data.get(message.author.id);
								preco_whey = Math.floor((((tData.galoPower - 29) * 5) ** 2.7) * desconto);

								if (tData.galoPower >= 60)
									return bot.createEmbed(message, `Seu galo já está muito forte, e só subirá de nível ganhando rinhas ${bot.config.galo}`);
								if (tData.galoTrain == 1) {
									if (tData.galoTrainTime > currTime)
										return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((tData.galoTrainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, null, bot.colors.white)
									else
										return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
								}

								const comprar_whey = new Discord.MessageEmbed()
									.setColor(bot.colors.background)
									.setDescription(`Você deseja comprar ${bot.config.whey} **Whey Protein** para ${tData.galoNome}? ${bot.config.galo}\nPreço: R$ ${preco_whey.toLocaleString().replace(/,/g, ".")}`);

								message.channel.send({
									embeds: [comprar_whey]
								}).then(msg2 => {
									msg2.react('✅').catch(err => console.log("Não consegui reagir mensagem `galo whey", err)).then(r => {
										const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id;

										const confirm_compra = msg2.createReactionCollector({
											filter,
											time: 30000
										});

										confirm_compra.on('collect', r => {
											if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `galo whey`", err))
												.then(m => {
													tData = bot.data.get(message.author.id);
													preco_whey = Math.floor(((tData.galoPower - 29) * 5) ** 2.7);
													if (tData.galoTrain == 1) {
														if (tData.galoTrainTime > currTime)
															return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.segToHour((tData.galoTrainTime - currTime) / 1000)} e não pode consumir whey no momento ${bot.config.galo}`, null, bot.colors.white)
														else
															return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de comprar whey ${bot.config.galo}`, null, bot.colors.white)
													}

													if (tData.galoPower >= 60)
														return bot.createEmbed(message, `Seu galo já está muito forte, e só subirá de nível ganhando rinhas ${bot.config.galo}`, null, bot.colors.white);
													if (tData.moni < preco_whey)
														return bot.msgSemDinheiro(message);
													if (tData.emRoubo)
														return bot.msgEmRoubo(message)

													const comprar_whey_confirm = new Discord.MessageEmbed()
														.setColor(bot.colors.background)
														.setDescription(`Você comprou um ${bot.config.whey} **Whey Protein** para ${tData.galoNome} e ele subiu para o nível ${tData.galoPower - 30 + 1} ${bot.config.galo}`);

													msg2.edit({
														embeds: [comprar_whey_confirm]
													}).catch(err => console.log("Não consegui editar mensagem `galo whey`", err));
													tData.galoPower++;
													tData.moni -= preco_whey;
													tData.lojaGastos += preco_whey;

													bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(preco_whey * bot.imposto));

													bot.data.set(message.author.id, tData);
													msg.react('825828797265739798').catch(err => console.log("Não consegui reagir mensagem `galo whey`", err));
												});
										});
									});
								}).catch(err => console.log("Não consegui enviar mensagem `galo whey`", err));
							});
					});
				});
			}).catch(err => console.log("Não consegui enviar mensagem `galo view`", err));

		} else
			return message.channel.send({
				embeds: [embed]
			}).catch(err => console.log("Não consegui enviar mensagem `galo view`", err));
	}

	bot.msgPreso = (message, uData, args) => {
		let currTime = new Date().getTime();
		return args ?
			bot.createEmbed(message, `${args} está preso por mais ${bot.segToHour((uData.preso - currTime) / 1000 )} e não pode fazer isto ${bot.config.prisao}`, null, bot.colors.policia) :
			bot.createEmbed(message, `Você está preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)} e não pode fazer isto ${bot.config.prisao}`, null, bot.colors.policia);
	}

	bot.msgHospitalizado = (message, uData, args) => {
		let currTime = new Date().getTime();
		return args ?
			bot.createEmbed(message, `${args} está hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.hospital) :
			bot.createEmbed(message, `Você está hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000 )} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.hospital);
	}

	bot.msgEmRoubo = (message, args) => args ?
		bot.createEmbed(message, `${args} está em um roubo e não pode fazer isto ${bot.config.roubar}`, null, bot.colors.roubar) :
		bot.createEmbed(message, `Você está em um roubo e não pode fazer isto ${bot.config.roubar}`, null, bot.colors.roubar)

	bot.msgTrabalhando = (message, uData) => {
		let currTime = new Date().getTime()
		let minutes = (uData.jobTime - currTime) / 1000
		if (minutes < 0)
			return bot.createEmbed(message, `Você deve receber seu salário antes de fazer isto ${bot.config.bulldozer}`)

		return bot.createEmbed(message, `Você está trabalhando por mais ${bot.segToHour(minutes)} e não pode fazer isto ${bot.config.bulldozer}`, bot.jobs[uData.job].desc)
	}

	bot.msgSemDinheiro = (message, args) => args ?
		bot.createEmbed(message, `${args} não tem dinheiro suficiente para fazer isto`) :
		bot.createEmbed(message, `Você não tem dinheiro suficiente para fazer isto`)

	bot.msgValorInvalido = (message) => bot.createEmbed(message, "O valor inserido é inválido")

	bot.msgDinheiroMenorQueAposta = (message, args) => args ?
		bot.createEmbed(message, `${args} não tem esta quantidade de dinheiro para fazer isto`) :
		bot.createEmbed(message, `Você não tem esta quantidade de dinheiro para fazer isto`)

	bot.msgGaloDescansando = (message, uData, args) => {
		let currTime = new Date().getTime();
		return args ?
			bot.createEmbed(message, `O galo de ${args} está descansando. Ele poderá rinhar/treinar novamente em ${bot.segToHour((uData.tempoRinha - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white) :
			bot.createEmbed(message, `Seu galo está descansando. Ele poderá rinhar/treinar novamente em ${bot.segToHour((uData.tempoRinha - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white);
	}
}