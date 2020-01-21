const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let keys = bot.data.indexes;
	let topArr = [];
	let nickArr = [];
	let topArr2 = [];
	let nickArr2 = [];
	let vezArr = [];
	let presos = [];
	let procurados = [];
	let currTime = new Date().getTime();


	if (args[0] == 'fugir') {
		uData = bot.data.get(message.author.id);

		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso <:police:539502682545717288>`)

		else {
			if (uData.fuga == uData.preso)
				return bot.createEmbed(message, `Os policiais estão te observando! Você não conseguirá fugir <:police:539502682545717288>`)

			let chance = bot.getRandom(1, 100);

			if (chance <= (uData._jetpack > currTime ? 30 : 15)) {
				uData.fuga = uData.preso;
				uData.roubo = currTime;
				uData.preso = 0;
				uData.qtFugas += 1;
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `Você fugiu! <:police:539502682545717288>`)

			} else {
				uData.preso += 1800000; //+30min
				uData.fuga = uData.preso;
				bot.data.set(message.author.id, uData)
				return bot.createEmbed(message, `Você não conseguiu fugir e ficará na prisão por mais 30 minutos! <:police:539502682545717288>`)
			}
		}

	} else if (args[0] == 'subornar') {
		uData = bot.data.get(message.author.id);

		if (uData.preso < currTime)
			return bot.createEmbed(message, `Você não está preso <:police:539502682545717288>`)

		if (!args[1])
			return bot.createEmbed(message, `Insira um valor para subornar os guardas! <:police:539502682545717288>`)

		if (args[1] <= 0 || (args[1] % 1 != 0))
			return bot.msgValorInvalido(message);

		if (args[1] > uData.moni)
			return bot.msgDinheiroMenorQueAposta(message);

		else {
			if (args[1] < 100000) {
				uData.moni = uData.moni - parseInt(args[1]);
				if (uData.fuga == uData.preso)
					uData.fuga += 1800000;
				uData.preso += 1800000; //+30m
				bot.data.set(message.author.id, uData);
				return bot.createEmbed(message, `"Isto é algum tipo de piada? Ficaremos com este dinheiro e você ficará preso por mais 30 minutos." <:police:539502682545717288>`);

			} else if (args[1] < (uData.moni / 4)) {
				uData.moni = uData.moni - parseInt(args[1]);
				bot.data.set(message.author.id, uData);
				return bot.createEmbed(message, `"Sabemos que você tem mais escondido aí. Vamos pegar este dinheiro e você vai continuar na prisão." <:police:539502682545717288>`);
			
			} else {
				uData.moni = uData.moni - parseInt(args[1]);
				uData.roubo = currTime + 300000; //+5m
				uData.preso = 0;
				bot.data.set(message.author.id, uData);
				return bot.createEmbed(message, `"Assim que se faz!. Cai fora daqui antes que mais te veja." <:police:539502682545717288>`);
			}

		}

	} else {
		for (let i = 0; i < keys.length; i++) {
			if (!message.guild.members.get(keys[i]))
				continue;
			if (!(keys[i] == bot.config.adminID)) {
				//nome = bot.data.get(keys[i], "nome").length > 25 ? bot.data.get(keys[i], "nome").substring(0, 22) + "..." : bot.data.get(keys[i], "nome");
				nome = bot.data.get(keys[i], "nome")
				if (bot.data.get(keys[i], "preso") > currTime) {
					presos[i] = {
						nick: nome,
						tempo: bot.data.get(keys[i], "preso") - currTime,
						vezes: bot.data.get(keys[i], "roubosL")
					};
				}
				if (bot.data.get(keys[i], "roubo") > currTime) {
					procurados[i] = {
						nick: nome,
						tempo: bot.data.get(keys[i], "roubo") - currTime,
					};
				}
			}
		}

		presos.sort(function (a, b) {
			return b.tempo - a.tempo;
		});
		procurados.sort(function (a, b) {
			return b.tempo - a.tempo;
		});


		for (let i = 0; i < keys.length; i++) { // mostra ou nao mostra
			if (presos[i]) {
				topArr[i] = presos[i].tempo;
				nickArr[i] = presos[i].nick;
				vezArr[i] = presos[i].vezes;
			}

			if (procurados[i]) {
				topArr2[i] = procurados[i].tempo;
				nickArr2[i] = procurados[i].nick;
			}
		}

		var topPreso = "";
		var topProcu = "";

		for (let i = 0; i < 10; ++i) {
			if (nickArr[i])
				topPreso = topPreso + (`**${nickArr[i]}**\nLivre em ${bot.minToHour((topArr[i] / 1000 / 60))}\nPreso ${vezArr[i]} vezes\n`);
			if (nickArr2[i])
				topProcu = topProcu + (`**${nickArr2[i]}**\nPor mais ${bot.minToHour((topArr2[i] / 1000 / 60))}\n`);
		}

		const embed = new Discord.RichEmbed()
			.setTitle("<:police:539502682545717288> Prisão de " + message.guild.name)
			.setDescription(`Você tem 15% (30% com um Jetpack) de chance de fugir da prisão!\n\`;prisao fugir\`.\n\nVocê pode subornar os guardas, mas eles são gananciosos!\n\`${bot.config.prefix}prisao subornar [valor]\``)
			.setThumbnail(message.guild.iconURL)
			.setColor(message.member.displayColor)
			.addField("Prisioneiros 👮", (topPreso == "" ? "Não há prisioneiros." : topPreso), true)
			.addField("Procurados 🏃", (topProcu == "" ? "Não há jogadores procurados." : topProcu), true)

			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();
		message.channel.send({
			embed
		});
	}
};