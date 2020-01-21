const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	players = [];
	players.push(message.author.id)

	let time = new Date().getTime();

	players_negados = [];

	const reactionFilter = (reaction, user) => reaction.emoji.name === '🐓' && user.id != bot.user.id && !players.includes(user.id);

	uData = bot.data.get(message.author.id)
	let userD = uData;

	if (!args[0]) {
		const embed = new Discord.RichEmbed()
			.setTitle("Battle Royale!")
			.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530616556518899722/unknown.png")
			.setColor(message.member.displayColor)
			.setDescription("Coloque seu galo em uma batalha real!\n" +
				"Entre em uma rinha de 5 galos, onde o vencedor leva tudo!\n" +
				"Para participar de uma batalha já riada, clique na reação do galo.")

			.addField("Comando", "`;royale [valor]`: Inicia um Battle Royale")

			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();
		return message.channel.send({
			embed
		});
	} else {

		aposta = args[0];

		if (userD.tempoRinha > time) 
			return bot.msgGaloDescansando(message, userD);

		if (userD.moni < 1)
			return bot.msgSemDinheiro(message);

		else if (aposta <= 0 || (aposta % 1 != 0))
			return bot.msgValorInvalido(message);

		else if (userD.preso > time) 
			return msgPreso(message, uData);

		if (parseFloat(userD.moni) < aposta)
			return bot.msgDinheiroMenorQueAposta(message);

		bot.createEmbed(message, `**${userD.nome}** iniciou um Battle Royale entre os galos de **${message.guild.name}**!`)

		texto = userD.galoNome + "\n";

		const embed = new Discord.RichEmbed()
		embed.setTitle(`Espaço para ${(5 - players.length)} galos`)
			.setDescription(`Aposta: ${aposta}${bot.config.coin}`)
			.addField("Galos", texto)
			.setFooter(`Clique na reação para participar!`)
			.setColor(0x36393e);

		message.channel.send(embed)
			.then(msg => msg.react('🐓'))
			.then(mReaction => {
				const collector = mReaction.message
					.createReactionCollector(reactionFilter, {
						time: 50000
					});

				collector.on('collect', response => {

					newplayer = response.users.last();
					jogador = bot.data.get(newplayer.id)

					if (!players_negados.includes(newplayer.id)){
						if (jogador.tempoRinha > time) {
							let t = Math.floor((jogador.tempoRinha - time) / 1000 / 60);
							const embed = new Discord.RichEmbed({
								description: `**${jogador.nome}**, seu galo está descansando. Ele poderá lutar em ${t} minutos :rooster:`,
								color: 0x36393e
							})
							message.channel.send(embed);
							players_negados.push(newplayer.id)

						} else {
							if (jogador.preso > time) {
								let tt = Math.floor((jogador.preso - time) / 1000 / 60);
								const embed = new Discord.RichEmbed({
									description: `**${jogador.nome}**, você está preso por mais ${t} e não pode fazer isto ${bot.config.police}`,
									color: 0x36393e
								})
								message.channel.send(embed);
								players_negados.push(newplayer.id)

							} else {
								if (jogador.moni < 1) {
									const embed = new Discord.RichEmbed({
										description: `**${jogador.nome}** não tem ${bot.config.coin} suficiente para fazer isto`,
										color: 0x36393e
									});
									message.channel.send(embed)
									players_negados.push(newplayer.id)

								} else {
									if (parseFloat(jogador.moni) < aposta) {
										const embed = new Discord.RichEmbed({
											description: `**${jogador.nome}** não tem esta quantidade de ${bot.config.coin} para fazer isto`,
											color: 0x36393e
										})
										message.channel.send(embed);
										players_negados.push(newplayer.id)

									} else {

										players.push(newplayer.id)
										// copia o campo do embed pra um novo objeto
										let embedField = Object.assign({}, embed.fields[0]);

										texto += (bot.data.get(newplayer.id, "galoNome") + "\n");

										embedField.value = texto;

										const newEmbed = new Discord.RichEmbed({
											title: `Espaço para ${(5 - players.length)} galos`,
											description: embed.description,
											color: embed.color,
											footer: embed.footer,
											fields: [embedField]
										});

										response.message.edit(newEmbed)
									}
								}
							}
						}
					}
				});

				collector.on('end', async response => {
					if (players.length < 1)
						return bot.createEmbed(message, `Número insuficiente de galos para começar o Battle Royale.\nA rinha foi cancelada.`);

					else {
						//uData já é do autor da mensagem
						uData1 = bot.data.get(players[1]);
						uData2 = bot.data.get(players[2]);
						uData3 = bot.data.get(players[3]);
						uData4 = bot.data.get(players[4]);

						let galo0 = uData.galoPower * bot.getRandom(1, 100);
						let galo1 = uData1.galoPower * bot.getRandom(1, 100);
						let galo2 = uData2.galoPower * bot.getRandom(1, 100);
						let galo3 = uData3.galoPower * bot.getRandom(1, 100);
						let galo4 = uData4.galoPower * bot.getRandom(1, 100);
/*
						uData.moni -= parseInt(aposta);
						uData1.moni -= parseInt(aposta);
						uData2.moni -= parseInt(aposta);
						uData3.moni -= parseInt(aposta);
						uData4.moni -= parseInt(aposta);

						bot.data.set(players[0], uData)
						bot.data.set(players[1], uData1)
						bot.data.set(players[2], uData2)
						bot.data.set(players[3], uData3)
						bot.data.set(players[4], uData4)
*/
						let jogadores = [
							{id: uData, galo: galo0}, 
							{id: uData1, galo: galo1},
							{id: uData2, galo: galo2},
							{id: uData3, galo: galo3},
							{id: uData4, galo: galo4}
						]

						jogadores.sort(function (a, b) { // organiza em ordem decrescente
							return b.galo - a.galo;
						});

						bot.createEmbed(message, `A BATALHA COMEÇOU`);

						galoVencedor = bot.data.get(jogadores[0].id, 'galoNome');
						userVencedor = bot.data.get(jogadores[0].id, 'nome');

						

						//fazer textos com sentido + textos de eliminação

						const embed = new Discord.RichEmbed({
							description: `**${bot.data.get(jogadores[4].id, 'galoNome')}** tentou o máximo que pôde, mas foi eliminado`,
							color: 0x36393e
						});
						setTimeout(function () {
							(message.channel.send(embed))
						}, 5000);

						const embed2 = new Discord.RichEmbed({
							description: `**${bot.data.get(jogadores[3].id, 'galoNome')}** ficou para trás enquanto tentava pegar loot e acabou eliminado`,
							color: 0x36393e
						});
						setTimeout(function () {
							(message.channel.send(embed2))
						}, 10000);

						const embed3 = new Discord.RichEmbed({
							description: `**${bot.data.get(jogadores[2].id, 'galoNome')}** foi bombardeado por uma chuva de penas flamejantes`,
							color: 0x36393e
						});
						setTimeout(function () {
							(message.channel.send(embed3))
						}, 15000);

						const embed4 = new Discord.RichEmbed({
							description: `O círculo está se fechando, e somente **${bot.data.get(jogadores[0].id, 'galoNome')}** e **${bot.data.get(jogadores[1].id, 'galoNome')}** restaram na batalha`,
							color: 0x36393e
						});
						setTimeout(function () {
							(message.channel.send(embed4))
						}, 21000);

						const embed5 = new Discord.RichEmbed({
							description: `**${galoVencedor}** venceu o Battle Royale, e **${userVencedor}** ganhou ${5 * aposta} ${bot.config.coin}!`,
							color: 0x36393e
						});
						setTimeout(function () {
							(message.channel.send(embed5))
						}, 30000)
						
						.then(final => {
							console.log(userVencedor)
							//jogadores[0].id.moni += 5 * parseInt(aposta);
						})

					}
				});
			});
	}
}