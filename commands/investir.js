exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id)

	let semana = 604800000; // 7 diass
	let date = new Date();
	let currTime = date.getTime();

	if (uData.preso > currTime) 
		return bot.msgPreso(message, uData);

	if (args[0] == "parar") {
		if (uData.invest == -1)
			return bot.createEmbed(message, "Você não pode parar um investimento se você não tem um");
		else {
			bot.createEmbed(message, "Você parou o investimento " + bot.investments.desc[uData.invest]);
			uData.investLast = 0;
			uData.invest = -1;
			uData.investTime = 0;
		}


	} else if (args[0] < 1 || (args[0] % 1 != 0) || args[0] > bot.investments.desc.length)
		return bot.createEmbed(message, `O ID deve ser entre 1 e ${bot.investments.desc.length}`);

	else if (uData.invest >= 0)
		return bot.createEmbed(message, "Você só pode ter um investimento por vez " + bot.config.propertyG);

	else if (uData.moni < bot.investments.price[args[0] - 1])
		return bot.semDinheiro(message);

	else {
		if (currTime > (uData.investTime + semana) || !uData.investTime) {
			uData.invest = args[0] - 1;
			uData.investTime = currTime;
			uData.investLast = currTime;
			bot.createEmbed(message, "Você adquiriu o investimento **" + bot.investments.desc[args[0] - 1] + "** " + bot.config.propertyG);
			uData.moni -= bot.investments.price[args[0] - 1];
		}
	}
	bot.data.set(message.author.id, uData)
}