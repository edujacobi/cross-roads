exports.run = async (bot, message, args) => {

	let currTime = new Date().getTime();
	uData = bot.data.get(message.author.id)

	if (uData.preso > currTime) 
		return bot.msgPreso(message, uData);
	
	if (!args[0]) {
		if (uData.job < 0 || !uData.jobTime)
			return bot.createEmbed(message, "Você não está trabalhando " + bot.config.bulldozer);

		let minutes = -Math.floor((currTime - uData.jobTime - bot.jobs.coolDown[uData.job]) / 1000 / 60);

		if (minutes < 0)
			return bot.createEmbed(message, "Você encerrou seu trabalho e pode receber seu pagamento " + bot.config.bulldozer);

		else
			return bot.createEmbed(message, `${bot.minToHour(minutes)} restantes para encerrar seu trabalho ${bot.config.bulldozer}`);

	} else {
		if (args[0] == 'parar'){
			if (uData.job >= 0) {
				bot.createEmbed(message, "Você desistiu do trabalho de **" + bot.jobs.desc[uData.job] + "** " + bot.config.bulldozer);
				uData.jobTime = 0;
				uData.job = -1;
			} else 
				bot.createEmbed(message, "Você não pode parar o que nem começou" + bot.config.bulldozer);
	
			bot.data.set(message.author.id, uData);
			return;
		}
	}

	if (args[0] < 1 || (args[0] % 1 != 0) || args[0] > bot.jobs.desc.length)
		return bot.createEmbed(message, `O ID deve ser entre 1 e ${bot.jobs.desc.length - 1} ${bot.config.bulldozer}`);
	
	else {
		if (args[0] == 4 && currTime > uData._knife)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.faca} para este trabalho`);

		if (args[0] == 5 && currTime > uData._9mm)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config._9mm} para este trabalho`);

		if (args[0] == 6 && currTime > uData._tec9)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.tec9} para este trabalho`);

		if (args[0] == 7 && currTime > uData._rifle)
			return bot.createEmbed(message, `É necessário possuir um ${bot.config.rifle} para este trabalho`);

		if (args[0] == 8 && currTime > uData._shotgun)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.escopeta} para este trabalho`);

		if (args[0] == 9 && currTime > uData._mp5)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.mp5} para este trabalho`);

		if (args[0] == 10 && currTime > uData._ak47)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.ak47} para este trabalho`);

		if (args[0] == 11 && currTime > uData._m4)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.m4} para este trabalho`);

		if (args[0] == 12 && currTime > uData._goggles)
			return bot.createEmbed(message, `É necessário possuir um ${bot.config.goggles} para este trabalho`);

		if (args[0] == 13 && currTime > uData._rpg)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.rpg} para este trabalho`);

		if (args[0] == 14 && currTime > uData._minigun)
			return bot.createEmbed(message, `É necessário possuir uma ${bot.config.minigun} para este trabalho`);

		if (currTime > (uData.jobTime + bot.jobs.coolDown[args[0] - 1]) || !uData.jobTime) {
			if (uData.job >= 0)
				bot.createEmbed(message, "Você precisa receber seu pagamento antes de começar outro trabalho! Use `;receber` " + bot.config.bulldozer);

			else {
				uData.job = args[0] - 1;
				uData.jobTime = currTime;
				bot.createEmbed(message, `Você começou a trabalhar de **${bot.jobs.desc[args[0] - 1]}** ` + bot.config.bulldozer);

				setTimeout(function () {
					(message.reply("você terminou seu trabalho! " + bot.config.bulldozer))
				}, bot.jobs.coolDown[args[0] - 1]);
			}

		} else
			bot.createEmbed(message, "Você ainda está trabalhando " + bot.config.bulldozer);

	}
	bot.data.set(message.author.id, uData)
}