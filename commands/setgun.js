exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime();

	if (message.author.id != bot.config.adminID) return;

	else {
		let member = message.mentions.members.first();
		uData = bot.data.get(member.id);
		let arma = args[0];
		let horas = parseInt(args[1]) * 1000 * 60 * 60;

		if (arma == 'knife')
			uData._knife = (uData._knife > currTime ? uData._knife + horas : currTime + horas);

		else if (arma == '9mm')
			uData._9mm = (uData._9mm > currTime ? uData._9mm + horas : currTime + horas);

		else if (arma == 'tec9')
			uData._tec9 = (uData._tec9 > currTime ? uData._tec9 + horas : currTime + horas);

		else if (arma == 'rifle')
			uData._rifle = (uData._rifle > currTime ? uData._rifle + horas : currTime + horas);

		else if (arma == 'escopeta')
			uData._shotgun = (uData._shotgun > currTime ? uData._shotgun + horas : currTime + horas);

		else if (arma == 'mp5')
			uData._mp5 = (uData._mp5 > currTime ? uData._mp5 + horas : currTime + horas);

		else if (arma == 'ak47')
			uData._ak47 = (uData._ak47 > currTime ? uData._ak47 + horas : currTime + horas);

		else if (arma == 'm4')
			uData._m4 = (uData._m4 > currTime ? uData._m4 + horas : currTime + horas);

		else if (arma == 'colete')
			uData._colete = (uData._colete > currTime ? uData._colete + horas : currTime + horas);

		else if (arma == 'jetpack')
			uData._jetpack = (uData._jetpack > currTime ? uData._jetpack + horas : currTime + horas);

		else if (arma == 'minigun')
			uData._minigun = (uData._minigun > currTime ? uData._minigun + horas : currTime + horas);

		else if (arma == 'rpg')
			uData._rpg = (uData._rpg > currTime ? uData._rpg + horas : currTime + horas);

		else if (arma == 'goggles')
			uData._goggles = (uData._goggles > currTime ? uData._goggles + horas : currTime + horas);

		else 
			return bot.createEmbed(message, "Arma inválida.")

		bot.createEmbed(message, `${member.user.username} recebeu ${args[1]}h de ${arma}`);	
		bot.data.set(member.user.id, uData);
	}
};