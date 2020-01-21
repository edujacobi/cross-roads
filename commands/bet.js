exports.run = async (bot, message, args) => {
	let time = new Date().getTime();
	let uData = bot.data.get(message.author.id);

	if (uData.job >= 0) 
		return bot.msgTrabalhando(message, uData);

	if (uData.preso > time) 
		return bot.msgPreso(message, uData);

	if (args[1] == 'allin')
		args[1] = uData.moni;

	if (uData.moni < 1)
		return bot.msgSemDinheiro(message);

	else if (args[1] <= 0 || (args[1] % 1 != 0))
		return bot.msgValorInvalido(message);

	else if (args[0] == "cara" || args[0] == "coroa") {
		//message.delete();

		if (parseFloat(uData.moni) < args[1])
			return bot.msgDinheiroMenorQueAposta(message);

		let flip;

		flip = (bot.getRandom(0, 100) < 50 ? "cara" : "coroa");

		if (args[0] == flip) {
			uData.moni += parseInt(args[1]);
			uData.betW++;
			bot.createEmbed(message, `<:positive:572134588340633611> Você **ganhou** ${parseInt(args[1]).toLocaleString().replace(/,/g, ".")} e ficou com ` + (uData.moni.toLocaleString().replace(/,/g, ".")) + bot.config.coin);

		} else {
			uData.moni -= parseInt(args[1]);
			uData.betL++;
			bot.createEmbed(message, `<:negative:572134589863034884> Você **perdeu** ${parseInt(args[1]).toLocaleString().replace(/,/g, ".")} e ficou com ` + (uData.moni.toLocaleString().replace(/,/g, ".")) + bot.config.coin);
		}

	} else {
		bot.createEmbed(message, bot.config.mafiaCasino + " Você deve apostar em Cara ou Coroa");
		return;
	}
	bot.data.set(message.author.id, uData);
}