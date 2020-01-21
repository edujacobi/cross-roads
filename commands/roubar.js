function getPercent(percent, from) {
	return (from / 100) * percent;
}
const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let currTime = new Date().getTime();
	let option = args[0];
	uData = bot.data.get(message.author.id)
	let userD = uData;

	if (!option) {
		const embed = new Discord.RichEmbed()
			.setTitle(bot.config.emmetGun + " Roubar")
			//.setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530730684613132328/9mm.png")
			.setColor(message.member.displayColor)
			.setDescription("Encontre um alvo e roube tudo!\n" +
				"Quanto melhor a arma, mais dinheiro pode ser roubado (e mais protegido você estará de ser roubado).\n" +
				"Se falhar, você será preso por um tempo definido pelo poder de sua arma.\n" +
				"Se conseguir, deverá esperar 1h para roubar novamente.")
			.addField("Roubar jogadores", `\`${bot.config.prefix}roubar user [jogador]\``, true)
			.addField("Roubar lugares", `\`${bot.config.prefix}roubar lugar [ID]\``, true)
			.addBlankField()
			.addField("1: Velhinha na esquina",
				"Sucesso: 75%\n" +
				"Necessário: " + bot.config.faca +
				"\n80 - 300" + bot.config.coin, true)
			.addField("2: Mercearia do Zé",
				"Sucesso: 65%\n" +
				"Necessário: " + bot.config._9mm +
				"\n1.200 - 1.700" + bot.config.coin, true)
			.addField("3: Posto de gasolina",
				"Sucesso: 55%\n" +
				"Necessário: " + bot.config.tec9 + " " + bot.config.rifle + " " + bot.config.escopeta +
				"\n4.000 - 6.500" + bot.config.coin, true)
			.addField("4: Banco da cidade",
				"Sucesso: 45%\n" +
				"Necessário: " + bot.config.ak47 + " " + bot.config.m4 + " " + bot.config.goggles +
				"\n9.000 - 23.000" + bot.config.coin, true)
			.addField("5: Mafia Jacobina",
				"Sucesso: 35%\n" +
				"Necessário: " + bot.config.rpg + " " + bot.config.katana + " " + bot.config.minigun + 
				"\n40.000 - 70.000" + bot.config.coin, true)
			.addBlankField(true)
			

			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();
		return message.channel.send(embed);
	}
	if (userD.preso > currTime) 
		return bot.msgPreso(message, uData);

	if (userD.roubo > currTime) {
		let t = Math.floor((userD.roubo - currTime) / 1000 / 60);
		return bot.createEmbed(message, `Você só poderá roubar novamente em ${bot.minToHour(t)} :gun:`)
	}

	if (option == "lugar") {
		let locais = [
			80, 300,
			1200, 1700,
			4000, 6500,
			9000, 23000,
			40000, 70000
		];
		if (args[1] < 1 || (args[1] % 1 != 0) || args[1] > (locais.length) / 2)
			return bot.createEmbed(message, `O ID deve ser entre 1 and ${locais.length/2}.`);

		else {
			if (args[1] == 1 && currTime > uData._knife)
				return bot.createEmbed(message, `É necessário ter uma ${bot.config.faca} para este roubo`);

			if (args[1] == 2 && currTime > uData._9mm)
				return bot.createEmbed(message, `É necessário ter uma ${bot.config._9mm} para este roubo`);

			if (args[1] == 3 && currTime > uData._tec9 && currTime > uData._rifle && currTime > uData._shotgun) 
				return bot.createEmbed(message, `É necessário ter uma ${bot.config.tec9} ou ${bot.config.rifle} ou ${bot.config.escopeta} para este roubo`);

			if (args[1] == 4 && currTime > uData._ak47 && currTime > uData._m4 && currTime > uData._goggles)
				return bot.createEmbed(message, `É necessário ter uma ${bot.config.ak47} ou ${bot.config.m4} ou ${bot.config.goggles} para este roubo`);

			if (args[1] == 5 && currTime > uData._rpg && currTime > uData._katana && currTime > uData._minigun)
				return bot.createEmbed(message, `É necessário ter uma ${bot.config.rpg} ou ${bot.config.katana} ou ${bot.config.minigun} para este roubo`);
		}

		if (userD.job >= 0) 
			return bot.msgTrabalhando(message, uData);

		let chances = [75, 65, 55, 45, 35];
		let tempos = [15, 30, 45, 60, 75]
		let lugares = [
			'Velhinha na Esquina', 'Mercearia do Zé', 'Posto de gasolina', 'Banco da cidade', 'Mafia Jacobista'
		]

		prob = (bot.getRandom(0, 100) < chances[args[1] - 1] ? "success" : "failure");

		if (prob == "success") {
			recompensa = bot.getRandom(locais[(args[1] * 2) - 2], locais[(args[1] * 2) - 1]);
			uData.roubosW++;
			uData.roubo = currTime + 3600000;
			uData.moni += recompensa;
			bot.createEmbed(message, `Você roubou ${recompensa.toLocaleString().replace(/,/g, ".")}${bot.config.coin} de **${lugares[args[1] - 1]}** ${bot.config.emmetGun}`);

		} else {
			uData.roubosL++;
			uData.preso = currTime + tempos[args[1] - 1] * 60 * 1000;
			bot.createEmbed(message, `Você falhou em roubar **${lugares[args[1] - 1]}** e ficará preso por ${bot.minToHour(tempos[args[1] - 1])} ${bot.config.police}`);
		}

	} else if (option == "user") {
		let target = message.mentions.members.first();
		let target2 = [];

		if (!target2[0] && args[1] && !target) { // para ver inventário sem pingar (funciona para outros servidores)

			let name = args.join(" ").replace(args[0], "").replace(" ", "").toLowerCase();

			bot.users.forEach(item => {
				if (item.tag.toLowerCase() == name)
					target2.push(item);

				else if (item.username.toLowerCase() == name)
					target2.push(item);
			});

			if (!target2[0])
				return bot.createEmbed(message, "Usuário não encontrado");

			if (target2.length > 1) {
				let str = ''
				for (let i = 0; i < target2.length; ++i)
					str += `**${target2[i].tag}**\n`;

				return bot.createEmbed(message, `Há ${target2.length} usuários com o mesmo nome.\n${str}`);
			}
		}

		let alvo;

		if (target2.length > 0)
			alvo = target2[0];
		else {
			if (target)
				alvo = target.user;
			else
				alvo = message.author;
		}
		//let alvo = (target ? target.user : message.author);

		if (!target && !target2[0])
			return bot.createEmbed(message, "Você deve inserir um usuário a ser roubado")

		let targetD = bot.data.get(alvo.id)
		if (!target) target = target2[0];

		if (!targetD) return bot.createEmbed(message, "Este usuário não possui um inventário");

		if (userD.job >= 0) return bot.msgTrabalhando(message, uData);

		// ordem Power: knife, goggles, 9mm, tec9, rifle, mp5, ak47, m4 e rpg (colete é nulo) + Minigun
		// ordem Def: knife, 9mm, tec9, rifle, mp5, ak47, m4, rpg, goggles e colete + Minigun
		let powerPercents = bot.guns.atk;
		let defPercents = bot.guns.def;
		let moneyAttack = bot.guns.moneyAttack;
		let moneyDef = bot.guns.moneyDef;

		let uIndex = -1; // usado pra definir atk
		let tIndex = -1; // usado pra definir def

		if (userD._colete > currTime) uIndex = 10; //colete não tem prioridade no ataque
		if (userD._knife > currTime) uIndex = 0; 
		if (userD._9mm > currTime) uIndex = 1;
		if (userD._tec9 > currTime) uIndex = 2; 
		if (userD._rifle > currTime) uIndex = 3; 
		if (userD._shotgun > currTime) uIndex = 4;
		if (userD._mp5 > currTime) uIndex = 5;
		if (userD._ak47 > currTime) uIndex = 6;
		if (userD._m4 > currTime) uIndex = 7;
		if (userD._goggles > currTime) uIndex = 8;
		if (userD._rpg > currTime) uIndex = 9; 
		if (userD._minigun > currTime) uIndex = 11;

		if (targetD._knife > currTime) tIndex = 0;
		if (targetD._9mm > currTime) tIndex = 1; 
		if (targetD._tec9 > currTime) tIndex = 2;
		if (targetD._rifle > currTime) tIndex = 3;
		if (targetD._shotgun > currTime) uIndex = 4;
		if (targetD._mp5 > currTime) tIndex = 5;
		if (targetD._ak47 > currTime) tIndex = 6;
		if (targetD._m4 > currTime) tIndex = 7;
		if (targetD._goggles > currTime) tIndex = 8;
		if (targetD._rpg > currTime) tIndex = 9;
		if (targetD._minigun > currTime) tIndex = 11;
		if (targetD._colete > currTime) tIndex = 10; // colete tem prioridade na defesa
		
		if (uIndex < 0) return bot.createEmbed(message, "Você não pode roubar sem uma arma");
		if (tIndex >= 0) powerPercents[uIndex] -= getPercent(defPercents[tIndex], powerPercents[uIndex]);

		if (message.author.id == target.id)
			return bot.createEmbed(message, "Você não pode roubar você mesmo");

		if (target.id == bot.config.adminID)
			return bot.createEmbed(message, "Quem em sã consciência roubaria o Jacobi?");

		if (bot.getRandom(0, 100) < powerPercents[uIndex]) {
			if (tIndex >= 0) moneyAttack[uIndex] -= getPercent(moneyDef[tIndex], moneyAttack[uIndex]);

			let money = Math.floor(getPercent(moneyAttack[uIndex], targetD.moni));
			let chips = Math.floor((getPercent(moneyAttack[uIndex], targetD.ficha)) / 2);

			bot.createEmbed(message, `Você roubou ${money.toLocaleString().replace(/,/g, ".")} ${bot.config.coin} ` +
				(targetD.ficha > 0 ? `e ${chips.toLocaleString().replace(/,/g, ".")} ${bot.config.ficha} ` : "") + `de **${alvo.username}** ${bot.config.emmetGun} `);
			
			bot.users.get(target.id).send(`Você foi roubado e perdeu ${money.toLocaleString().replace(/,/g, ".")} ${bot.config.coin} ` +
				(targetD.ficha > 0 ? `e ${chips.toLocaleString().replace(/,/g, ".")} ${bot.config.ficha} ` : "") + ` pro **${message.author.username}** do servidor **${message.guild.name}** ${bot.config.emmetGun}`)

			targetD.moni -= money;
			targetD.ficha -= chips;
			uData.moni += money;
			uData.ficha += chips;
			uData.roubosW++;
			uData.roubo = currTime + 3600000;
			setTimeout(function () {
				(message.reply("você pode roubar novamente! " + bot.config.emmetGun))
			}, 3600000);

		} else {
			bot.createEmbed(message, `Você falhou na sua tentativa e ficará preso por ${bot.minToHour(15 * (uIndex + 1))} ${bot.config.police}`);
			uData.preso = currTime + (15 * (uIndex + 1)) * 60 * 1000;
			uData.roubosL++;

			bot.users.get(target.id).send(`**${message.author.username}** do servidor **${message.guild.name}** tentou lhe roubar mas acabou sendo preso ${bot.config.police}`)

			setTimeout(function () {
				(message.reply("você está livre! " + bot.config.police))
			}, uData.preso - currTime);

		}
		bot.data.set(target.id, targetD)
	} else
		return bot.createEmbed(message, 'Você deve escolher "user" ou "lugar". Para mais informações, use `;roubar`.');
	bot.data.set(message.author.id, uData)

}