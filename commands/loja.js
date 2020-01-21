const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id);
	let option = args[0];

	if (!option) {
		const embed = new Discord.RichEmbed()

			.setTitle(bot.config.ammugun + " Loja")
			.setDescription("Todos os itens tem duração de 3 dias!")
			.setColor(message.member.displayColor)

			.addField(`1: ${bot.config.faca} Faca`, `2.000${bot.config.coin} \nATK 10\nDEF 5`, true)
			.addField(`2: ${bot.config._9mm} 9mm`, `7.000${bot.config.coin} \nATK 20\nDEF 10`, true)
			.addField(`3: ${bot.config.tec9} Tec9`, `20.000${bot.config.coin} \nATK 30\nDEF 15`, true)
			.addField(`4: ${bot.config.rifle}  Rifle`, `30.000${bot.config.coin} \nATK 45\nDEF 15`, true)
			.addField(`5: ${bot.config.escopeta} Escopeta`, `36.000${bot.config.coin} \nATK 50\nDEF 10`, true)
			.addField(`6: ${bot.config.mp5} Mp5`, `42.000${bot.config.coin} \nATK 40\nDEF 20`, true)
			.addField(`7: ${bot.config.ak47} AK-47`, `62.000${bot.config.coin} \nATK 50\nDEF 25`, true)
			.addField(`8: ${bot.config.m4} M4`, `92.000${bot.config.coin} \nATK 60\nDEF 35`, true)
			.addField(`9: ${bot.config.goggles} Óculos Noturno`, `128.000${bot.config.coin} \nATK 10\nDEF 50`, true)
			.addField(`10: ${bot.config.rpg} RPG`, `250.000${bot.config.coin} \nATK 70\nDEF 40`, true)
			.addField(`11: ${bot.config.colete} Colete`, `1.000.000${bot.config.coin} \nATK 0\nDEF 70`, true)
			.addField(`12: ${bot.config.jetpack} Jetpack`, `2.000.000${bot.config.coin} \nFuga +15%`, true)
			.addField(`13: ${bot.config.whey} Whey Protein`, (bot.data.has(message.author.id, "galo") ?
				(uData.galoPower >= 70 ? "Seu pinto já tá grande." :
					"" + ((((uData.galoPower - 29) * 10) ** 2).toLocaleString().replace(/,/g, ".")) +
					bot.config.coin + "\nAumenta o nível do galo\nPreço para **" +
					(uData.nome.length > 12 ? uData.nome.substring(0, 10) + "...**" :
						`${uData.nome}**`)) : "Primeiro, use `;galo`."), true)
			.addField(`14: ${bot.config.ficha} 10 Fichas`, `1.000${bot.config.coin} \nPara usar no caça-níqueis`, true)
			.addField(`15: ${bot.config.ficha} 100 Fichas`, `9.900${bot.config.coin} \nUma é por conta da casa`, true)
			//.addBlankField(true)
			.setFooter(message.author.username + " • Dinheiro: " + uData.moni.toLocaleString().replace(/,/g, "."), message.member.user.avatarURL)
			.setTimestamp();
		message.channel.send({
			embed
		});

	} else {
		let prices = [2000, 7000, 20000, 30000, 36000, 42000, 62000, 92000, 128000, 250000, 1000000, 2000000, (((uData.galoPower - 29) * 10) ** 2), 1000, 9900];
		let currTime = new Date().getTime();

		if (option < 1 || (option % 1 != 0) || option > prices.length)
			return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length}`);

		else if (uData.moni < prices[option - 1])
			return bot.msgSemDinheiro(message);

		else if (option == 13 && uData.galoPower >= 70)
			return bot.createEmbed(message, `Seu pinto já tá grande e não pode aumentar mais de nível`);

		uData.moni -= prices[option - 1];
		uData.lojaGastos += prices[option - 1];

		switch (parseInt(option)) {
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
				uData._shotgun = (uData._shotgun > currTime ? uData._shotgun + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou uma Escopeta " + bot.config.escopeta);
				break;
			case 6:
				uData._mp5 = (uData._mp5 > currTime ? uData._mp5 + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou uma Mp5 " + bot.config.mp5);
				break;
			case 7:
				uData._ak47 = (uData._ak47 > currTime ? uData._ak47 + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou uma AK-47 " + bot.config.ak47);
				break;
			case 8:
				uData._m4 = (uData._m4 > currTime ? uData._m4 + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou uma M4 " + bot.config.m4);
				break;
			case 9:
				uData._goggles = (uData._goggles > currTime ? uData._goggles + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou um Óculos V Noturna " + bot.config.goggles);
				break;
			case 10:
				uData._rpg = (uData._rpg > currTime ? uData._rpg + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou uma RPG " + bot.config.rpg);
				break;
			case 11:
				uData._colete = (uData._colete > currTime ? uData._colete + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou um Colete " + bot.config.colete);
				break;
			case 12:
				uData._jetpack = (uData._jetpack > currTime ? uData._jetpack + 259200000 : currTime + 259200000);
				bot.createEmbed(message, "Você comprou um Jetpack " + bot.config.jetpack);
				break;
			case 13:
				uData.galoPower++
				bot.createEmbed(message, "Você comprou um Whey Protein para " + (uData.galoNome != "" ?
					uData.galoNome : "seu galo") + " e ele subiu para o nível  " + (uData.galoPower - 30));
				break;
			case 14:
				uData.ficha = uData.ficha + 10;
				bot.createEmbed(message, "Você comprou 10 fichas " + bot.config.ficha);
				break;
			case 15:
				uData.ficha = uData.ficha + 100;
				bot.createEmbed(message, "Você comprou 100 fichas " + bot.config.ficha);
				break;
		}

		bot.data.set(message.author.id, uData);
	}
}