const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
			const embed = new Discord.MessageEmbed()
				.setTitle(`🏆 Rankings`)
				.setDescription(`Os melhores jogadores em determinadas áreas e ações!`)
				.setColor('GREEN')
				.addField(`${bot.badges.topGrana1_s4} Valores`, `\`\;topvalor\``, true)
				.addField(`${bot.config.coin} Grana`, `\`\;topgrana\``, true)
				.addField(`${bot.config.ficha} Ficha`, `\`\;topficha\``, true)
				.addField(`${bot.badges.topGalo_s4} Galo`, `\`\;topgalo\``, true)
				.addField(`${bot.badges.topGangue_s4} Gang`, `\`\;topgang\``, true)
				.addField(`${bot.badges.esmagaCranio_s4} Pancada`, `\`;toppancada\``, true)
				.addField(`${bot.badges.sortudo_s4} Sortudo`, `\`;topsortudo\``, true)
				.addField(`${bot.badges.bolsoLargo_s4} Roubos`, `\`;toproubo\``, true)
				.addField(`${bot.badges.fujao_s4} Prisão`, `\`;toppreso\``, true)
				.addField(`${bot.badges.filantropo_s4} Esmolas`, `\`;topesmola\``, true)
				.addField(`${bot.badges.investidor_s4} Investidores`, `\`;topinvestidor\``, true)
				.addField(`${bot.badges.workaholic_s4} Trabalhadores`, `\`;toptrabalhador\``, true)
				.addField(`${bot.badges.patricinha_s4} Gastadores`, `\`;topgastador\``, true)
				.addField(`${bot.badges.deputado_s4} Subornadores`, `\`;topsuborno\``, true)
				.addField(`${bot.badges.hipocondriaco_s4} Doentes`, `\`;topdoente\``, true)
				.addField(`${bot.config.vasculhar} Vasculhadores`, `\`;topvasculhar\``, true)
				.setFooter(bot.user.username, bot.user.avatarURL())
				.setTimestamp();

			message.channel.send({
				embeds: [embed]
			}).then(msg => {

					let e = {
						valor: '853052970115006485',
						grana: '853052970115006485',
						ficha: '757021259451203665',
						galo: '853053236952825856',
						gang: '816407267665510440',
						pancada: '816407267246211084',
						sortudo: '819694112076726303',
						roubo: '856346384721772555',
						preso: '853053234632458240',
						esmola: '816407267707453490',
						invest: '816407267556851712',
						trab: '816407267246211115',
						patric: '817097198860894310',
						suborno: '816407267779411989',
						doente: '817965402621083748',
						vasculhar: '816407267581886575',
					}

					const filter = (reaction, user) => [Object.values(e)].includes(reaction.emoji.id) && user.id == message.author.id;
					const collector = msg.createReactionCollector({
						filter,
						time: 90000,
					});

					collector.on('collect', r => {
						if (r.emoji.id === e.valor)
							bot.commands.get('topvalor').run(bot, message, args)
						if (r.emoji.id === e.grana)
							bot.commands.get('topgrana').run(bot, message, args)
						if (r.emoji.id === e.ficha)
							bot.commands.get('topficha').run(bot, message, args)
						if (r.emoji.id === e.galo)
							bot.commands.get('topgalo').run(bot, message, args)
						if (r.emoji.id === e.gang)
							bot.commands.get('topgang').run(bot, message, args)
						if (r.emoji.id === e.pancada)
							bot.commands.get('toppancada').run(bot, message, args)
						if (r.emoji.id === e.sortudo)
							bot.commands.get('topsortudo').run(bot, message, args)
						if (r.emoji.id === e.roubo)
							bot.commands.get('toproubo').run(bot, message, args)
						if (r.emoji.id === e.preso)
							bot.commands.get('toppreso').run(bot, message, args)
						if (r.emoji.id === e.esmola)
							bot.commands.get('topesmola').run(bot, message, args)
						if (r.emoji.id === e.invest)
							bot.commands.get('topinvestidor').run(bot, message, args)
						if (r.emoji.id === e.trab)
							bot.commands.get('toptrabalhador').run(bot, message, args)
						if (r.emoji.id === e.patric)
							bot.commands.get('topgastador').run(bot, message, args)
						if (r.emoji.id === e.suborno)
							bot.commands.get('topsuborno').run(bot, message, args)
						if (r.emoji.id === e.doente)
							bot.commands.get('topdoente').run(bot, message, args)
						if (r.emoji.id === e.vasculhar)
							bot.commands.get('topvasculhar').run(bot, message, args)
					})

					Object.values(e).forEach(emoji => msg.react(emoji).catch(err => console.log("Não consegui reagir mensagem `top` reação " + emoji, err)))
					}).catch(err => console.log("Não consegui enviar mensagem `top`", err))
			};
			exports.config = {
				alias: ['ranking', 'rank']
			};