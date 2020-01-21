exports.run = async (bot, message, args) => {

	uData = bot.data.get(message.author.id);

	if (uData.presente == -2)
		return bot.createEmbed(message, "Você já recebeu seu presente");

	else {
		uData.moni = uData.moni + 1500;
		uData.ficha = uData.ficha + 15;
		uData.presente = -2;
		bot.createEmbed(message, `Você recebeu 1500 ${bot.config.coin} e 15 ${bot.config.ficha}!`);
	}
	bot.data.set(message.author.id, uData);
};