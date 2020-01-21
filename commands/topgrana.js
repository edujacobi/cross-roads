const Discord = require("discord.js");

exports.run = async (bot, message, args, level) => {

	let keys = bot.data.indexes;
	let topArr1 = [];
	let nickArr1 = [];
	let topArr2 = [];
	let nickArr2 = [];
	let list1 = [];
	let list2 = [];

	for (let i = 0; i < keys.length; i++) { //gera lista para top global
		if (!bot.users.get(keys[i]))
			continue;
		if (!(keys[i] == bot.config.adminID)) {
			//nome = bot.data.get(keys[i], "nome").length > 12 ? bot.data.get(keys[i], "nome").substring(0, 10) + "..." : bot.data.get(keys[i], "nome");
			nome = bot.data.get(keys[i], "nome")
			//id = keys[i];
			//nome = bot.users.get(id).tag;
			
			list1[i] = {
				nick: nome,
				money: bot.data.get(keys[i], "moni")
			};
		}
	}

	for (let i = 0; i < keys.length; i++) { //gera lista para top local
		if (!message.guild.members.get(keys[i]))
			continue;
		if (!bot.users.get(keys[i]))
			continue;
		if (!(keys[i] == bot.config.adminID)) {
			//nome = bot.data.get(keys[i], "nome").length > 12 ? bot.data.get(keys[i], "nome").substring(0, 10) + "..." : bot.data.get(keys[i], "nome");
			nome = bot.data.get(keys[i], "nome")
			//id = keys[i];
			//nome = bot.users.get(id).tag;

			list2[i] = {
				nick: nome,
				money: bot.data.get(keys[i], "moni")
			};
		}
	}

	list1.sort(function (a, b) {
		return b.money - a.money;
	});
	list2.sort(function (a, b) {
		return b.money - a.money;
	});

	let amount = 10;

	if (args[0] > 0 && (args[0] % 1 == 0)) // limite das listas
		amount = (args[0] > list1.length) ? list1.length : args[0];


	for (let i = 0; i < keys.length; i++) { // mostra ou nao mostra
		if (list1[i]) {
			topArr1[i] = list1[i].money;
			nickArr1[i] = list1[i].nick;
		}
		if (list2[i]) {
			topArr2[i] = list2[i].money;
			nickArr2[i] = list2[i].nick;
		}
	}

	var topGeral = "";
	var topLocal = "";

	for (let i = 0; i < amount; ++i) { // cria string pra top geral
		if (nickArr1[i])
			topGeral = topGeral + ("`" + (i + 1) + "`. **" + nickArr1[i] + " **" + topArr1[i].toLocaleString().replace(/,/g, ".") + "\t\n");
		if (nickArr2[i])
			topLocal = topLocal + ("`" + (i + 1) + "`. **" + nickArr2[i] + " **" + topArr2[i].toLocaleString().replace(/,/g, ".") + "\t\n");
	}

	const embed = new Discord.RichEmbed()
		.setTitle("Ranking")
		.setColor(message.member.displayColor)
		.addField("Top Geral 🏆", topGeral, true)
		.addField("Top Servidor 🏅", topLocal, true)

		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();
	message.channel.send({
		embed
	});
};
//--
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