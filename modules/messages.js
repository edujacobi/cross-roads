const Discord = require("discord.js");
module.exports = (bot) => {

	bot.createEmbed = function (message, str) { // cria um embed bonitinho pra respostas
		return message.channel.send({
			embed: {
				description: str,
				color: message.member.displayColor,
				timestamp: new Date(),
				footer: {
					icon_url: message.member.user.avatarURL,
					text: message.author.username
				}
			}
		});
	}

	bot.showGalo = function (message, tData) {
		if (!tData)
			return bot.createEmbed(message, `Este usuário não possui um inventário`);
		let tRinha = Math.floor((tData.tempoRinha - time) / 1000 / 60);
		let tTrain = Math.floor((tData.galoTrainTime - time) / 1000 / 60);

		situation = ''
		if (tRinha < 0) {
			if (tTrain >= 1 && tData.galoTrain == 1)
				situation = `**Treinando por mais ${bot.minToHour(tTrain)}**`
			if (tTrain < 0 && tData.galoTrain == 1)
				situation = "**Encerrou o treinamento**"
			else
				situation = "**Pronto para lutar!**"
		} else {
			if (tTrain < 0 && tData.galoTrain == 0)
				situation = `**${tRinha} minutos até descansar**`
			else
				situation = "**Pronto para lutar!**"
		}

		const embed = new Discord.RichEmbed()
			.setTitle(":rooster: " + (tData.galoNome == undefined ? "Galo" : tData.galoNome))
			.setDescription((tData.galoTit == undefined ? "Garnizé" : tData.galoTit))
			.addField("Nível", (tData.galoPower - 30), true)
			.addField("Chance de vitória", tData.galoPower + "%", true)
			.addField(" 󠀀󠀀", situation)
			.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530191738690732033/unknown.png")
			.setColor(message.member.displayColor)
			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();

		return message.channel.send({
			embed
		});

	};

	bot.msgPreso = function (message, uData, args) {
		currTime = new Date().getTime();
		return args ?
			bot.createEmbed(message, `${args} está preso por mais ${bot.minToHour((uData.preso - currTime) / 1000 / 60)} e não pode fazer isto ` + bot.config.police) :
			bot.createEmbed(message, `Você está preso por mais ${bot.minToHour((uData.preso - currTime) / 1000 / 60)} e não pode fazer isto ` + bot.config.police);
	}

	bot.msgTrabalhando = function (message, uData) {
		currTime = new Date().getTime();
		let minutes = -Math.floor((currTime - uData.jobTime - bot.jobs.coolDown[uData.job]) / 1000 / 60);
		if (minutes < 0)
			return bot.createEmbed(message, `Você deve recebeu seu salário antes de fazer isto ` + bot.config.bulldozer);
		return bot.createEmbed(message, `Você está trabalhando por mais ${bot.minToHour(minutes)} e não pode fazer isto ` + bot.config.bulldozer);
	}

	bot.msgSemDinheiro = function (message, args) {
		return args ?
			bot.createEmbed(message, `${args} não tem ${bot.config.coin} suficientes para fazer isto`) :
			bot.createEmbed(message, `Você não tem ${bot.config.coin} suficientes para fazer isto`);
	}

	bot.msgValorInvalido = function (message) {
		return bot.createEmbed(message, "O valor inserido é inválido");
	}

	bot.msgDinheiroMenorQueAposta = function (message, args) {
		return args ?
			bot.createEmbed(message, `${args} não tem esta quantidade de dinheiro para fazer isto`) :
			bot.createEmbed(message, `Você não tem esta quantidade de dinheiro para fazer isto`);
	}

	bot.msgGaloDescansando = function (message, uData, args) {
		currTime = new Date().getTime();
		return args ?
			bot.createEmbed(message, `O galo de ${args} está descansando. Ele poderá rinhar novamente em ${Math.floor((uData.tempoRinha - time) / 1000 / 60)} minutos. :rooster:`) :
			bot.createEmbed(message, `Seu galo está descansando. Ele poderá rinhar novamente em  ${Math.floor((uData.tempoRinha - time) / 1000 / 60)} minutos. :rooster:`);
	}

}