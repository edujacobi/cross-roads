let jobs = ["Entregador de panfleto", "Motoboy", "Pedreiro", "Açougueiro", "Vigilante", "Segurança Particular", "Caçador de Corno",
	"Treinador de milícia", "Mercenário", "Rei do Crime", "Espião da Ordem", "Homem-Bomba", "Godfather da Mafia Nyanista"
];

exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id)
	if (uData.job >= 0) {
		bot.createEmbed(message, "Você desistiu do trabalho de **" + jobs[uData.job] + "** " + bot.config.bulldozer);
		uData.jobTime = 0;
		uData.job = -1;
	} else {
		bot.createEmbed(message, "Você não pode parar o que nem começou");
	}
	bot.data.set(message.author.id, uData);
}