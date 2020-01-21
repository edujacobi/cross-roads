const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id);
	uID = message.author.id;
	let targetMention = message.mentions.members.first();
	let targetNoMention = [];
	time = new Date().getTime();
	let option = args[0];
	let aposta = args[1];

	if (!targetMention && args[0] != "nome" && args[0] != "titulo" && args[0] != "info" && args[0] != "treinar") {

		if (!targetNoMention[0] && args[0] && !targetMention) {

			let name = args.join(" ").toLowerCase();

			bot.users.forEach(item => {
				if (item.tag.toLowerCase() == name)
					targetNoMention.push(item);

				else if (item.username.toLowerCase() == name)
					targetNoMention.push(item);
			});

			if (!targetNoMention[0])
				return bot.createEmbed(message, "Usuário não encontrado");

			if (targetNoMention.length > 1) {
				let str = ''
				for (let i = 0; i < targetNoMention.length; ++i)
					str += `**${targetNoMention[i].tag}**\n`;

				return bot.createEmbed(message, `Há ${targetNoMention.length} usuários com o mesmo nome\n${str}`);
			}
		}

		let alvo;

		if (targetNoMention.length > 0)
			alvo = targetNoMention[0];
		else
			alvo = targetMention ? targetMention.user : message.author;

		let tData = bot.data.get(alvo.id)
		return bot.showGalo(message, tData)

	}

	if (option == "nome") { // setar nome
		if (!args[1]) {
			return bot.createEmbed(message, "Insira um nome para seu galo :rooster:");

		} else {
			let nome = args.join(" ").replace(args[0], "");
			nome = nome.substring(1, nome.length);

			if (nome.length > 20)
				return bot.createEmbed(message, "O nome escolhido é muito grande, escolha um menor :rooster:");

			else {
				let nome = args.join(" ").replace(args[0], "");
				nome = nome.substring(1, nome.length);
				uData.galoNome = nome;
				bot.data.set(message.author.id, uData);
				return bot.createEmbed(message, `Você nomeou seu galo como **${uData.galoNome}** :rooster:`);
			}
		}

	} else if (option == "titulo") { // setar titulo
		if (!args[1]) {
			return bot.createEmbed(message, "Insira um título para seu galo :rooster:");

		} else {
			let titulo = args.join(" ").replace(args[0], "");
			titulo = titulo.substring(1, titulo.length);

			if (titulo.length > 20)
				return bot.createEmbed(message, "O título escolhido é muito grande, escolha um menor :rooster:");

			else {
				let titulo = args.join(" ").replace(args[0], "");
				titulo = titulo.substring(1, titulo.length);
				uData.galoTit = titulo;
				bot.data.set(message.author.id, uData);
				return bot.createEmbed(message, `Você deu o título **${uData.galoTit}** para seu galo :rooster:`);
			}
		}

	} else if (option == "treinar") {

		if (aposta == "parar") {
			if (uData.galoTrain != 1)
				return bot.createEmbed(message, "Você não pode parar o que nem começou")
			else {
				uData.galoTrain = 0
				uData.galoTrainTime = 0
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `Você encerrou o treinamento de **${uData.galoNome}**. Ele não subiu de nível :rooster:`);
			}
		}

		if (uData.galoTrain == 1 && uData.galoTrainTime > time)
			return bot.createEmbed(message, `**${uData.galoNome}** está treinando por mais ${bot.minToHour((uData.galoTrainTime - time) / 1000 / 60)} :rooster:`);

		if (uData.tempoRinha > time)
			return bot.msgGaloDescansando(message, uData);

		if (uData.preso > time)
			return bot.msgPreso(message, uData);


		if (uData.galoTrain == 1 && uData.galoTrainTime < time) {
			uData.galoTrain = 0
			uData.galoTrainTime = 0
			uData.galoPower += 1
			bot.data.set(message.author.id, uData)
			return bot.createEmbed(message, `**${uData.galoNome}** encerrou o treinamento. Ele subiu para o nível ${uData.galoPower - 30} :rooster:`);
		}

		baseTime = 900000 //15 minutos
		trainTime = (baseTime + ((uData.galoPower - 29) ** 2.3) * 1000 * 60) + time
		//tempo de treino = (15 minutos + (nível do galo)^2.3) + tempo atual

		uData.galoTrainTime = trainTime;
		uData.galoTrain = 1

		setTimeout(function () {
			(message.reply(`seu galo encerrou o treinamento! :rooster:`))
		}, trainTime - time);

		bot.data.set(message.author.id, uData)
		return bot.createEmbed(message, `**${uData.galoNome}** treinará por ${bot.minToHour((trainTime - time) / 1000 / 60)} :rooster:`);

	} else if (option == "info") { // ter infos sobre os galos

		const embed = new Discord.RichEmbed()
			.setTitle(":rooster: Galos")
			.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530616556518899722/unknown.png")
			.setColor(message.member.displayColor)
			.addField("Como assim?", "Você ganhou um galo de batalha!\n" +
				"Ele começa no nível 0 e avançará 1 nível ao ganhar uma luta.\n" +
				"A partir do nível 30, seu galo perderá níveis se perder as lutas, e o nível máximo que ele pode atingir é 40.\n" +
				`Você pode deixar seu galo treinando para aumentar seu nível em 1, ou comprar ${bot.config.whey} **Whey Protein** na loja para aumentar instantaneamente.\n` +
				"O tempo de treinamento e o valor do Whey aumentam com base no nível do seu galo.\n" +
				"Após cada luta, seu galo precisará descansar por 30 minutos até se recuperar.")
			//.addBlankField()

			.addField("Comandos",
				"`;galo (jogador)` Mostra informações de um galo\n" +
				"`;galo nome [novo-nome]` Escolhe um nome para seu galo\n" +
				"`;galo titulo [novo-titulo]` Escolhe um título para seu galo\n" +
				"`;galo rinha [valor] [jogador]` Desafia um jogador\n" +
				"`;galo treinar` Coloca o galo pra treinar\n" +
				"`;galo treinar parar` Encerra precocemente o treino\n" +
				"`;royale [valor]` Inicia um Battle Royale (em testes)")

			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();
		return message.channel.send({
			embed
		});

	} else if (option == "rinha") { // desafiar outros players

		if (!targetMention) {
			bot.createEmbed(message, "Você precisa escolher um jogador para rinhar :rooster:")

		} else {
			let alvo = targetMention.user;
			let tData = bot.data.get(alvo.id);
			let userT = tData;
			let userD = uData;

			if (!userT)
				return bot.createEmbed(message, "Este jogador não possui um galo :rooster:");

			if (message.author.id == targetMention.id)
				return bot.createEmbed(message, "Seu galo não pode lutar com ele mesmo :rooster:");

			if (userD.tempoRinha > time)
				return bot.msgGaloDescansando(message, userD);

			if (userT.tempoRinha > time)
				return bot.msgGaloDescansando(message, userT, userT.nome);

			if (userD.galoTrain == 1) {
				if (userD.galoTrainTime > time)
					return bot.createEmbed(message, `Seu galo está treinando por mais ${bot.minToHour((userD.galoTrainTime - time) / 1000 / 60)} :rooster:`);
				else
					return bot.createEmbed(message, `Seu galo terminou o treinamento. Conclua-o antes de começar uma rinha :rooster:`);
			}

			if (userT.galoTrain == 1) {
				if (userT.galoTrainTime > time)
					return bot.createEmbed(message, `O galo de ${userT.nome} está treinando por mais ${bot.minToHour((userT.galoTrainTime - time) / 1000 / 60)} :rooster:`);
				else
					return bot.createEmbed(message, `O galo de ${userT.nome} terminou o treinamento. Peça para ele concluí-o antes de começar uma rinha :rooster:`);
			}

			if (userD.moni < 1)
				return bot.msgSemDinheiro(message);

			else if (userT.moni < 1)
				return bot.msgSemDinheiro(message, userT.nome);

			else if (uData.preso > time)
				return bot.msgPreso(message, uData);

			else if (userT.preso > time)
				return bot.msgPreso(message, userT, userT.nome);

			else if (aposta <= 0 || (aposta % 1 != 0))
				return bot.msgValorInvalido(message);

			else {
				if (parseFloat(userD.moni) < aposta)
					return bot.msgDinheiroMenorQueAposta(message);

				if (parseFloat(userT.moni) < aposta)
					return bot.msgDinheiroMenorQueAposta(message, userT.nome);

				if (userD.galoNome == undefined)
					userD.galoNome = "Galo de " + userD.nome

				if (userT.galoNome == undefined)
					userT.galoNome = "Galo de " + userT.nome

				bot.createEmbed(message, `**${userD.nome}** desafiou **${userT.nome}** para uma rinha 1x1 valendo ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}${bot.config.coin}\n` + "Responda `aceito` ou ignore")
					.then(() => {
						message.channel.awaitMessages(response => response.content.toLowerCase() === 'aceito' && response.author.id == alvo.id, {
								max: 1,
								time: 30000,
								errors: ['time'],
							})
							.then(() => {
								bot.createEmbed(message, `**${userT.nome}** aceitou o desafio!`);

								let random1 = bot.getRandom(1, 100);
								let random2 = bot.getRandom(1, 100);

								let fight = (random1 * userD.galoPower > random2 * userT.galoPower ? "u" : "t");

								let textos_inicio = [
									`**${userD.galoNome}** começa a luta atacando **${userT.galoNome}** no queixo!`,
									`**${userT.galoNome}** começa a luta atacando **${userD.galoNome}** no queixo!`,
									`**${userT.galoNome}** provoca **${userD.galoNome}** chamando ele de galinha!`,
									`**${userD.galoNome}** provoca **${userT.galoNome}** chamando ele de galinha!`,
									`**${userD.galoNome}** falou que é filho do Caramuru!`,
									`**${userT.galoNome}** falou que é filho do Caramuru!`,
									`**${userD.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
									`**${userT.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
									`**${userD.galoNome}** disse que é rinha igual bumerangue, tudo que vai, volta.`,
									`**${userT.galoNome}** disse que é rinha igual bumerangue, tudo que vai, volta.`
								]

								let textos_luta = [
									`**${userD.galoNome}** voou por incríveis 2 segundos e deixou **${userT.galoNome}** perplecto!`,
									`**${userT.galoNome}** ciscou palha no olho de **${userD.galoNome}** e aproveitou para um ataque surpresa!`,
									`**${userD.galoNome}** arrancou o olho de **${userT.galoNome}**! Por sorte era o olho ruim.`,
									`**${userT.galoNome}** deu um rasante em **${userD.galoNome}** arrancando várias de suas penas!`,
									`**${userD.galoNome}** acertou um combo de 5 hits em **${userT.galoNome}**!`,
									`**${userT.galoNome}** aproveitou que **${userD.galoNome}** olhou para uma galinha e deu um mortal triplo carpado!`,
									`**${userD.galoNome}** usou um golpe especial e **${userT.galoNome}** ficou sem entender nada!`,
									`**${userT.galoNome}** apanha bastante, mas mostra para **${userD.galoNome}** que pau que nasce torto tanto bate até que fura!`,
									`**${userD.galoNome}** rasga o peito de **${userT.galoNome}** como se fosse manteiga!`,
									`**${userT.galoNome}** tentou usar *Raio Destruidor da Morte* em **${userD.galoNome}**, mas acaba errando.`,
									`**${userD.galoNome}** tenta acertar um *Fogo Sagrado da Conflagração* em **${userT.galoNome}**, erra por pouco e acerta a plateia!`,
									`**${userT.galoNome}** está paralizado e não consegue se mover!`,
									`**${userD.galoNome}** se sente lento e acaba errando diversos ataques.`,
									`A Polícia Federal adentra no recinto e todos ficam em pânico. Um dos policiais fala: "APOSTO MIL NO **${userT.galoNome}**"!`,
									`Pouco se importando com as regras, **${userD.galoNome}** pega uma ${bot.config._9mm} 9mm e atira em **${userT.galoNome}**.`,
									`**${userT.galoNome}** utiliza um *Z-Move* com **${userT.nome}**, causando dano crítico em **${userD.galoNome}**!`,
									`**${userD.galoNome}** utiliza um *Z-Move* com **${userD.nome}** em **${userT.galoNome}**. É super efetivo!`,
									`**${userT.galoNome}** usa a técnica do *Golpe do Dedo Ushi*, mas **${userD.galoNome}** aproveita a abertura e desce a porrada.`,
									`Após receber diversos golpes, **${userD.galoNome}** está atordoado, mas ainda continua de pé!`
								]

								bot.shuffle(textos_luta);

								//gera textos de batalha
								const msg1 = new Discord.RichEmbed({
									description: textos_inicio[Math.floor(Math.random() * textos_inicio.length)],
									color: 0x36393e
								})
								setTimeout(function () {
									(message.channel.send(msg1))
								}, 1000);

								if (userD.galoPower == userT.galoPower) {
									const msg2 = new Discord.RichEmbed({
										description: `**${userD.galoNome}** não sabe como atacar **${userT.galoNome}**! Eles já estão parados se encarando por 5 minutos!`,
										color: 0x36393e
									})
									const msg3 = new Discord.RichEmbed({
										description: `A única diferença entre **${userT.galoNome}** e **${userD.galoNome}** é o nome! Ambos são incrivelmente habilidosos!`,
										color: 0x36393e
									})
									setTimeout(function () {
										(message.channel.send(random1 >= random2 ? msg2 : msg3))
									}, 5000);

								} else {
									const msg4 = new Discord.RichEmbed({
										description: textos_luta[0],
										color: 0x36393e
									})
									setTimeout(function () {
										(message.channel.send(msg4))
									}, 5000);
								}

								const msg5 = new Discord.RichEmbed({
									description: textos_luta[1],
									color: 0x36393e
								})
								setTimeout(function () {
									(message.channel.send(msg5))
								}, 9000);

								const msg6 = new Discord.RichEmbed({
									description: textos_luta[2],
									color: 0x36393e
								})
								setTimeout(function () {
									(message.channel.send(msg6))
								}, 14000);

								const msg7 = new Discord.RichEmbed({
									description: textos_luta[3],
									color: 0x36393e
								})
								setTimeout(function () {
									(message.channel.send(msg7))
								}, 19000);

								const msg8 = new Discord.RichEmbed({
									description: (random1 >= random2 ? `**${userD.galoNome}** está implacável e **${userT.galoNome}** já não resiste mais!` : `**${userT.galoNome}** sabe que sua derrota foi digna e vai ao chão!`),
									color: 0x36393e
								})
								const msg9 = new Discord.RichEmbed({
									description: (random1 >= random2 ? `Os golpes de **${userT.galoNome}** são certeiros e **${userD.galoNome}** está ciente de sua derrota!` : `**${userD.galoNome}** cai na lona com um sorriso no rosto, pois sabe que deu o seu melhor.`),
									color: 0x36393e
								})
								setTimeout(function () {
									(message.channel.send(fight == 'u' ? msg8 : msg9))
								}, 24000);

								if (fight == "u") {
									if (userD.galoPower >= 70) {
										userD.moni += parseInt(aposta);
										userT.moni -= parseInt(aposta);
										userD.betW++;
										userT.betL++;
										setTimeout(function () {
											(bot.createEmbed(message, `**${userD.galoNome}** ganhou a rinha contra **${userT.galoNome}** e **${userD.nome}** recebeu ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}${bot.config.coin}!` +
												"\nEle está no nível 40 e não pode mais upar! :rooster:"))
										}, 26000);

									} else {
										userD.galoPower++;
										if (userT.galoPower >= 60)
											userT.galoPower -= 1;
										userD.moni += parseInt(aposta);
										userT.moni -= parseInt(aposta);
										userD.betW++;
										userT.betL++;
										setTimeout(function () {
											(bot.createEmbed(message, `**${userD.galoNome}** ganhou a rinha contra **${userT.galoNome}** e **${userD.nome}** recebeu ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}${bot.config.coin}!` +
												`\n**${userD.galoNome}** subiu para o nível ${userD.galoPower - 30}! :rooster:`))
										}, 26000);
									}

								} else {
									if (userT.galoPower >= 70) {
										userT.moni += parseInt(aposta);
										userD.moni -= parseInt(aposta);
										userT.betW++;
										userD.betL++;
										setTimeout(function () {
											(bot.createEmbed(message, `**${userT.galoNome}** ganhou a rinha contra **${userD.galoNome}** e **${userT.nome}** recebeu ${parseInt(aposta).toLocaleString().replace(/,/g, ".")} ${bot.config.coin}!` +
												`\n**${userT.galoNome}** está no nível 40 e não pode mais upar! :rooster:`))
										}, 26000);

									} else {
										userT.galoPower++;
										if (userD.galoPower >= 60)
											userD.galoPower -= 1;
										userT.moni += parseInt(aposta);
										userD.moni -= parseInt(aposta);
										userT.betW++;
										userD.betL++;
										setTimeout(function () {
											(bot.createEmbed(message, `**${userT.galoNome}** ganhou a rinha contra **${userD.galoNome}** e **${userT.nome}** recebeu ${parseInt(aposta).toLocaleString().replace(/,/g, ".")}${bot.config.coin}!` +
												`\n**${userT.galoNome}** subiu para o nível ${userT.galoPower - 30}! :rooster:`))
										}, 26000);
									}
								}

								userD.tempoRinha = time + 1800000;
								userT.tempoRinha = time + 1800000;
								bot.data.set(uID, userD);
								bot.data.set(targetMention.id, userT);

								setTimeout(function () {
									(message.reply(`<@${targetMention.id}>, seus galos estão prontos para outra batalha! :rooster:`))
								}, userD.tempoRinha - time);
							})

							.catch(() => {
								bot.createEmbed(message, `**${userT.nome}** não respondeu. Ele está offline ou é um frangote.`);
							});
					});
			}
		}

	} else { // mostra info do galo do targetMention com @
		let tData = bot.data.get(targetMention.id)
		return bot.showGalo(message, tData)
	}

	bot.data.set(message.author.id, uData);
};