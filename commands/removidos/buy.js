exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id);
	let prices = [2000, 7000, 20000, 30000, 42000, 62000, 92000, 128000, 250000, 1000000, 2000000, (((uData.galoPower - 29) * 10) ** 2), 1000, 10000];
	let currTime = new Date().getTime();

	if (args[0] < 1 || (args[0] % 1 != 0) || args[0] > prices.length) 
		return bot.createEmbed(message, `ID deve ser entre 1 e ${prices.length}`);

	else if (uData.moni < prices[args[0] - 1]) 
		return bot.msgSemDinheiro(message);

	 else if (args[0] == 12 && uData.galoPower >= 70)
		return bot.createEmbed(message, `Seu pinto já tá grande e não pode aumentar mais de nível`);
	

	uData.moni -= prices[args[0] - 1];
	uData.lojaGastos += prices[args[0] - 1];

	switch (parseInt(args[0])) {
		case 1:
			uData._knife = (uData._knife > currTime ? uData._knife + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma Faca " + bot.config.faca);
			break;
		case 2:
			uData._9mm = (uData._9mm > currTime ? uData._9mm + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma 9mm " + bot.config._9mm);
			break;
		case 3:
			uData._tec9 = (uData._tec9 > currTime ? uData._tec9 + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma Tec9 " + bot.config.tec9);
			break;
		case 4:
			uData._rifle = (uData._rifle > currTime ? uData._rifle + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou um Rifle " + bot.config.rifle);
			break;
		case 5:
			uData._mp5 = (uData._mp5 > currTime ? uData._mp5 + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma Mp5 " + bot.config.mp5);
			break;
		case 6:
			uData._ak47 = (uData._ak47 > currTime ? uData._ak47 + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma AK-47 " + bot.config.ak47);
			break;
		case 7:
			uData._m4 = (uData._m4 > currTime ? uData._m4 + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma M4 " + bot.config.m4);
			break;
		case 8:
			uData._goggles = (uData._goggles > currTime ? uData._goggles + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou um Óculos V Noturna " + bot.config.goggles);
			break;
		case 9:
			uData._rpg = (uData._rpg > currTime ? uData._rpg + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou uma RPG " + bot.config.rpg);
			break;
		case 10:
			uData._colete = (uData._colete > currTime ? uData._colete + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou um Colete " + bot.config.colete);
			break;
		case 11:
			uData._jetpack = (uData._jetpack > currTime ? uData._jetpack + 259200000 : currTime + 259200000);
			bot.createEmbed(message, "Você comprou um Jetpack " + bot.config.jetpack);
			break;
		case 12:
			uData.galoPower++
			bot.createEmbed(message, "Você comprou um Whey Protein para " + 
				(bot.data.has(message.author.id, "galoNome") ? uData.galoNome : "seu galo") + " e ele subiu para o nível  " + (uData.galoPower - 30));
			break;
		case 13:
			uData.ficha = uData.ficha + 10;
			bot.createEmbed(message, "Você comprou 10 fichas " + bot.config.ficha);
			break;
		case 14:
			uData.ficha = uData.ficha + 100;
			bot.createEmbed(message, "Você comprou 100 fichas " + bot.config.ficha);
			break;
	}

	bot.data.set(message.author.id, uData);
}