/*exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id)
	let time = Date.now();
	let value = uData.emprestimo;
	let empr = 200;

	if (uData._jetpack > time) empr = 5000;

	if (args[0] < 1 || (args[0] % 1 != 0)) {
		return bot.createEmbed(message, "O valor inserido não é válido.");
	} else if (args[0] > empr - value && (empr - value) > 0) {
		return bot.createEmbed(message, "O seu empréstimo está limitado a " + (empr - value) + bot.config.coin + ".");
	} else if (args[0] > empr - value) {
		return bot.createEmbed(message, "Você ainda deve " + value + bot.config.coin + ".");
	}

	uData.emprestimo += parseInt(args[0]);
	uData.moni += parseInt(args[0]);
	uData.diaemprestimo = new Date().getDay();

	bot.createEmbed(message, "Você recebeu um empréstimo de " + args[0] + bot.config.coin + ", pague até amanhã.");
	bot.data.set(message.author.id, uData);
}*/