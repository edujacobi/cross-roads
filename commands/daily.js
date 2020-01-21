exports.run = async (bot, message, args) => {
	let Day = new Date().getDate();
	let daily = 500;
	uData = bot.data.get(message.author.id);

	if (uData.day != Day) {
		uData.day = Day;
		uData.moni += daily;
		bot.createEmbed(message, `Você recebeu seus  ${daily}${bot.config.coin} diários`);

	} else
		bot.createEmbed(message, "Você já recebeu hoje. O `daily` fica disponível à meia-noite.");

	bot.data.set(message.author.id, uData);
}