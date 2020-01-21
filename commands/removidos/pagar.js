/*exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id)
	if (uData.emprestimo == 0) {
		return bot.createEmbed(message, "Você não deve nada.");

	} else if (args[0] < 1 || (args[0] % 1 != 0)) {
		return bot.createEmbed(message, "O valor inserido não é válido.");

	} else if (uData.moni < args[0]) {
		return bot.createEmbed(message, `Você não tem ${bot.config.coin} suficiente para efetuar o pagamento.`);

	} else if (args[0] > uData.emprestimo) {
		uData.moni -= parseInt(uData.emprestimo);
		uData.emprestimo = 0;
		bot.data.set(message.author.id, uData);
		return bot.createEmbed(message, "Você não deve tudo isso, o valor devido foi pago.");

	} else if (args[0] < uData.emprestimo) {
		uData.emprestimo -= parseInt(args[0]);
		uData.moni -= parseInt(args[0]);
		bot.data.set(message.author.id, uData);
		return bot.createEmbed(message, "Você está pagando " + args[0] + bot.config.coin + ", ainda deve " + uData.emprestimo) + bot.config.coin + ".";
	}

	uData.emprestimo -= parseInt(args[0]);
	uData.moni -= parseInt(args[0]);
	bot.createEmbed(message, "Dívida paga com sucesso!");
	bot.data.set(message.author.id, uData);
}*/