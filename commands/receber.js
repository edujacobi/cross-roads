const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id);
	currTime = new Date().getTime();

	let semana = 604800000; // 7 dias
	let hora = 3600000; // 1h

	linhaTrabalho = '';
	linhaInvest = '';

	if (uData.job < 0) {
		linhaTrabalho = "Você não tem nada para receber do seu trabalho " + bot.config.bulldozer;

	} else if (currTime > (uData.jobTime + bot.jobs.coolDown[uData.job])) {
		linhaTrabalho = "Você recebeu seu pagamento de " + (bot.jobs.payment[uData.job].toLocaleString().replace(',', '.')) + bot.config.coin;

		uData.moni += parseInt(bot.jobs.payment[uData.job]);
		uData.jobGanhos += parseInt(bot.jobs.payment[uData.job]);
		uData.job = -1;
		uData.jobTime = 0;

	} else
		linhaTrabalho = "Você ainda está trabalhando " + bot.config.bulldozer;

	horas = (uData.investTime + semana) > currTime ? currTime - uData.investLast :  uData.investTime + semana - uData.investLast; 
	// se investimento ainda não passou de uma semana, então horas = tempo atual - ultimo saque, senão horas = investTime + semana - investLast
	
	praSacar = Math.floor(((horas / hora) * bot.investments.income[uData.invest]));// pega valor decimal e multiplica pelo lucro por hora


	if (currTime < (uData.investTime + semana)) { //se o investimento ainda não completou uma semana
		linhaInvest = "Você recebeu " + (praSacar.toLocaleString().replace(/,/g, ".")) + bot.config.coin + " de seu investimento";

		uData.moni += parseInt(praSacar);
		uData.investGanhos += parseInt(praSacar);
		uData.investLast = currTime; 

	} else if (uData.invest != -1) { // se já passou uma semana
		linhaInvest = "Seu investimento acabou. Você recebeu " + (praSacar.toLocaleString().replace(/,/g, ".")) + bot.config.coin + " dele";

		uData.moni += parseInt(praSacar);
		uData.investGanhos += parseInt(praSacar);
		uData.investLast = 0;
		uData.invest = -1;
		uData.investTime = 0;
	}

	const embed = new Discord.RichEmbed()
		.setColor(message.member.displayColor)
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp()
		.setDescription(linhaTrabalho + "\n" + linhaInvest)

	message.channel.send({
		embed
	});
	bot.data.set(message.author.id, uData)
}