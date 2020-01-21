const Discord = require("discord.js");

exports.run = async (bot, message, args, level) => {

	let listaNome = [];
	let listaID = [];

	let listaMoney = []; // total
	let listaCapita = []; // per capita
	let listaMembros = []; // membros
	let listaRoubos = []; // roubos bem suscedidos

	bot.guilds.forEach(server => listaNome.push(server.name)); // adiciona nomes dos servers na listaNome
	bot.guilds.forEach(server => listaID.push(server.id)); // adiciona id dos servers na listaID

	for (let i = 0; i < listaID.length; i++) { // pega os monis dos members e soma tudo
		let userServer = [];
		let moneyServer = 0;
		let users = 0;
		let roubosW = 0;

		bot.guilds.get(listaID[i]).members.forEach(member => userServer.push(member.user.id));

		if (listaID[i] == "529674666692837378" || listaID[i] == "397920631167123467") //remove da contagem o GTA discord e o Jacobi
			continue;

		else {
			for (let j = 0; j < userServer.length; j++) {
				if (!bot.data.indexes.includes(userServer[j])) // se não é jogador, ignora
					continue;

				else {
					if (userServer[j] != bot.config.adminID) { // se o user não é o Jacobi
						moneyServer += parseInt(bot.data.get(userServer[j], "moni"));
						users++;
						roubosW += parseInt(bot.data.get(userServer[j], "roubosW"));
					} else
						continue;
				}
			}

			listaMoney[i] = {
				server: /*listaNome[i].length > 15 ? listaNome[i].substring(0, 15) : */ listaNome[i],
				money: (users > 1 ? moneyServer : 0)
			}

			listaCapita[i] = {
				server: /*listaNome[i].length > 15 ? listaNome[i].substring(0, 15) : */ listaNome[i],
				money: (users > 1 ? Math.floor(moneyServer / users) : 0)
			}

			listaMembros[i] = {
				server: /*listaNome[i].length > 15 ? listaNome[i].substring(0, 15) : */ listaNome[i],
				membros: users
			}

			// listaRoubos[i] = {
			// 	server: /*listaNome[i].length > 15 ? listaNome[i].substring(0, 15) : */ listaNome[i],
			// 	roubos: roubosW
			// }
		}
	}


	listaMoney.sort(function (a, b) { // organiza em ordem decrescente
		return b.money - a.money;
	});

	listaCapita.sort(function (a, b) { // organiza em ordem decrescente
		return b.money - a.money;
	});

	listaMembros.sort(function (a, b) { // organiza em ordem decrescente
		return b.membros - a.membros;
	});

	// listaRoubos.sort(function (a, b) { // organiza em ordem decrescente
	// 	return b.roubos - a.roubos;
	// });


	var topMoney = "";
	var topCapita = "";
	var topMembros = "";
	//var topRoubos = "";

	for (let i = 0; i < 5; ++i) { // cria string do top server
		topMoney = topMoney + ("`" + (i + 1) + ".` **" + listaMoney[i].server + " **" + listaMoney[i].money.toLocaleString().replace(/,/g, ".") + "\n");
		topCapita = topCapita + ("`" + (i + 1) + ".` **" + listaCapita[i].server + " **" + listaCapita[i].money.toLocaleString().replace(/,/g, ".") + "\n");
		topMembros = topMembros + ("`" + (i + 1) + ".` **" + listaMembros[i].server + " **" + listaMembros[i].membros.toLocaleString().replace(/,/g, ".") + "\n");
		//topRoubos = topRoubos + ("`" + (i + 1) + ".` **" + listaRoubos[i].server + " **" + listaRoubos[i].roubos.toLocaleString().replace(/,/g, ".") + "\n");
	}

	const embed = new Discord.RichEmbed()
		.setTitle("Top Servidores")
		.setColor(message.member.displayColor)
		.addField("Valor per capita 👤", topCapita, true)
		.addField("Valor total 👥", topMoney, true)
		.addField("Jogadores 👨‍👩‍👧‍👦", topMembros, true)
		//.addField("Roubos 💰", topRoubos, true)
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["lb"],
	permLevel: "User"
};

exports.help = {
	name: "leaderboard",
	category: "Minigames",
	description: "Shows the top 10 richer players",
	usage: "leaderboard",
	example: "leaderboard"
};