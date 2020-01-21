module.exports = (bot) => {

	bot.getRandom = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	bot.shuffle = (array) => {
		var currentIndex = array.length,
			temp, rand;
		while (0 !== currentIndex) {
			rand = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temp = array[currentIndex];
			array[currentIndex] = array[rand];
			array[rand] = temp;
		}
		return array;
	}

	bot.minToHour = (minutes) => {
		return `${(minutes > 60 ? `${Math.floor(minutes / 60)} horas ${(minutes % 60 == 0 ? "" : `e ${Math.floor(minutes % 60)} minutos`)}` : `${Math.floor(minutes)} minutos`)}`
	}

	// String.prototype.toProperCase = function() {
	//   return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	//};   

	bot.jobs = {
		desc: ["Entregador de Panfleto", "Motoboy", "Pedreiro", "Açougueiro", "Vigilante", "Segurança Particular", "Caçador de Corno",
			"Estraga-Funeral", "Treinador de Milícia", "Mercenário", "Rei do Crime", "Espião da Ordem", "Homem-bomba", "Godfather da Mafia Jacobina"
		],
		coolDown: [3600000, 7200000, 10800000, 14400000, 21600000, 28800000, 3600000, 10800000, 43200000, 64800000, 86400000, 144000000, 216000000, 259200000],
		payment: [220, 500, 800, 1500, 4000, 8000, 1800, 6000, 22000, 35000, 75000, 200000, 1000000, 15000000]
	}

	bot.investments = {
		desc: ["Boca de Fumo", "Puteiro", "Boate", "Clube de Golfe", "Cassino", "País do Terceiro Mundo"],
		price: [10000, 50000, 150000, 500000, 1500000, 5000000],
		income: [100, 550, 1725, 6000, 18750, 65000]
	}

	bot.guns = {
		desc:  ["Faca",   "9mm",  "Tec9",  "Rifle",  "Escopeta", "Mp5",  "AK-47", "M4",  "Óculos Noturno", "RPG",  "Colete",  "Minigun"],
		data:  ["_knife", "_9mm", "_tec9", "_rifle", "_shotgun", "_mp5", "_ak47", "_m4", "_goggles",       "_rpg", "_colete", "_minigun"], // uData._rifle
		emote: ["faca",  "_9mm", "tec9",  "rifle",  "escopeta", "mp5",  "ak47",  "m4",  "goggles",        "rpg",  "colete",  "minigun"], //bot.config.rifle
		thumb: ["faca",  "9mm",  "tec9",  "rifle",  "escopeta", "mp5",  "ak47",  "M4",  "goggles",        "rpg",  "colete",  "minigun"],
		atk:   [10,       20,      30, 		45, 		50, 	40, 	 50, 	  60, 	  10, 			    70, 	0,  		80],
		def:   [5,  	  10, 	   15, 		15, 		10, 	20, 	 25, 	  35, 	  50, 				40, 	70, 		55],
		moneyAttack: [6, 9, 12, 18, 24, 30, 36, 40, 44, 48, 0,  52],
		moneyDef:    [3, 6, 9,  12, 15, 18, 21, 24, 27, 30, 33, 36],
		utilidade: [
			`**Trabalho:** ${bot.jobs.desc[3]}\n**Roubar:** Velhinha na esquina`, // Faca
			`**Trabalho:** ${bot.jobs.desc[4]}\n**Roubar:** Mercearia do Zé`, // 9mm
			`**Trabalho:** ${bot.jobs.desc[5]}\n**Roubar:** Posto de gasolina`, // tec9
			`**Trabalho:** ${bot.jobs.desc[6]}\n**Roubar:** Posto de gasolina`, // rifle
			`**Trabalho:** ${bot.jobs.desc[7]}\n**Roubar:** Posto de gasolina`, // escopeta
			`**Trabalho:** ${bot.jobs.desc[8]}`, // mp5
			`**Trabalho:** ${bot.jobs.desc[9]}\n**Roubar:** Banco da cidade`, // ak-47
			`**Trabalho:** ${bot.jobs.desc[10]}\n**Roubar:** Banco da cidade`, // m4
			`**Trabalho:** ${bot.jobs.desc[11]}\n**Roubar:** Banco da cidade`, // goggles
			`**Trabalho:** ${bot.jobs.desc[12]}\n**Roubar:** Mafia Jacobina`, // rpg
			``, // colete
			`**Trabalho:** ${bot.jobs.desc[13]}\n**Roubar:** Mafia Jacobina`, // minigunn
		]
	}

	bot.defaultCarteira = {
		nome: '',
		moni: 0,
		ficha: 0,
		presente: 0,
		day: -1,
		_knife: 0,
		_9mm: 0,
		_tec9: 0,
		_rifle: 0,
		_shotgun: 0,
		_mp5: 0,
		_ak47: 0,
		_m4: 0,
		_rpg: 0,
		_goggles: 0,
		_katana: 0,
		_colete: 0,
		_jetpack: 0,
		_minigun: 0,
		job: -1,
		jobTime: 0,
		roubo: 0,
		preso: 0,
		fuga: 0,
		betW: 0,
		betL: 0,
		roubosW: 0,
		roubosL: 0,
		qtFugas: 0,
		jobGanhos: 0,
		lojaGastos: 0,
		investTime: 0,
		invest: -1,
		investGanhos: 0,
		galo: 1,
		galoPower: 30,
		galoTrain: 0,
		galoTrainTime: 0,
		galoNome: "",
		galoTit: "",
		tempoRinha: 0
	}

	bot.clean = async (bot, text) => {
		if (text && text.constructor.name == "Promise")
			text = await text;

		if (typeof evaled !== "string")
			text = require("util").inspect(text, {
				depth: 1
			});

		text = text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(bot.token, "NDYxMTQ4OTc4MjI3MDUyNTU0.DhPW2g.ePkaYG2oUh10JkOWdzdbwAgHPlY");

		return text;
	};

	bot.loadCommand = (commandName) => {
		try {
			const props = require(`../commands/${commandName}`);
			if (props.init)
				props.init(bot);

			cmd = commandName.substring(0, commandName.length - 3)
			bot.commands.set(cmd, props);
			console.log('comando ' + commandName + ' carregado')
			return false;
		} catch (e) {
			return `Não foi possível carregar ${commandName}: ${e}`;
		}
	};

	bot.unloadCommand = async (commandName) => {
		let command;
		if (bot.commands.has(commandName))
			command = bot.commands.get(commandName);

		if (!command)
			return `O comando \`${commandName}\` não existe!`;

		if (command.shutdown)
			await command.shutdown(bot);

		delete require.cache[require.resolve(`../commands/${commandName}.js`)];
		return false;
	};
}