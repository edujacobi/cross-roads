exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID) return;
	else {
		let member = message.mentions.members.first();
		uData = bot.data.get(member.id);
		option = args[0];
		valor = args[1];

		if (!option)
			return bot.createEmbed(message, `Pelo amor de deus, Jacobi, escolha uma opção`);

		if (!member)
			return bot.createEmbed(message, `Caralho, Jacobi, escolha um usuário`);

		if (!valor)
			return bot.createEmbed(message, `Porra, Jacobi, defina um valor`);
		
		if (option == "add") {
			let money = uData.moni + parseInt(valor)
			bot.data.set(member.id, money, "moni");
			return bot.createEmbed(message, `Surgiram magicamente ${valor}${bot.config.coin} no inventário de **${member.user.username}**`);
		}
		if (option == "set"){
			let oldMoney = uData.moni
			let money = parseInt(valor)
			bot.data.set(member.id, money, "moni");
			return bot.createEmbed(message, `Sumiram ${oldMoney}${bot.config.coin} do inventário de **${member.user.username}**, mas outros ${valor}${bot.config.coin} apareceram`);
		}
	}
};