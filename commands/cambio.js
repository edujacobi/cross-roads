exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id);

	if (uData.ficha < 1) 
		return bot.createEmbed(message, `Você não tem ${bot.config.ficha} suficientes para trocar`);

	else if (args[0] <= 0 || (args[0] % 1 != 0)) 
		return bot.msgValorInvalido(message);

	else {
		if (parseFloat(uData.ficha) < args[0]) 
			return bot.createEmbed(message, `Você não tem esta quantidade de ${bot.config.ficha} para trocar`);
		
		valor = args[0];
		cambio = valor * 90; // cada ficha vale 90 no câmbio
		uData.ficha = uData.ficha - valor;
		uData.moni = uData.moni + cambio;
		bot.createEmbed(message, `Você trocou ${valor.toLocaleString().replace(/,/g, ".")} ${bot.config.ficha} por ${cambio.toLocaleString().replace(/,/g, ".")}${bot.config.coin}`);
	}
	bot.data.set(message.author.id, uData);
};