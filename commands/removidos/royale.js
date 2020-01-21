exports.run = async (bot, message, args) => {

	players = [];
	players.push(message.author.id)

	const response = await bot.createEmbed(message, 'Com quantas pessoas você gostaria de jogar? (*responda com 2,4 ou 6*)');

	if (response != '2' && response != '4' && response != '6') {
		return bot.createEmbed(message, 'Esse número de jogadores não é valido!');
	}

	embed.setDescription('Espaço para ' + (response - players.length) + ' jogadores')
	message.channel.send(response);


	const mensagem = await message.channel.send({
		embed
	});

	mensagem.react('🐓')

	collect = new Discord.ReactionCollector(mensagem, (reaction, user) => reaction.emoji.id == '432554311155843072' && user.id != bot.user.id && !players.includes(user.id), {
		maxUsers: parseInt(response - 1),
		time: 30000
	});

	collect.on('collect', resposta => {
		newplayer = resposta.users.last();
		players.push(newplayer.id)
		embed.setDescription('Espaço para ' + (response - players.length) + ' jogadores')
			.addField('Player ' + players.length, newplayer.username);
		mensagem.edit(embed)
	})

	collect.on('end', async resposta => {
		console.log(players);
		if (players.length < response)
			return message.channel.send('Número de pessoas para começar a partida inferior ao necessário. Truco cancelado!');
		for (x in players) {
			/*await merge([playerhands[x][0].img, playerhands[x][1].img, playerhands[x][2].img]).then(async (img) => {
				await img.write('playerhand' + x + '.png', async () => {})
			});
			bot.users.get(players[x]).send({
				files: [{
					attachment: ('./playerhand' + x + '.png'),
					name: 'playerhand.png'
				}]
			});*/
			return message.channel.send('Deu certo');

		}
	})
	//message.channel.send({files: [{ attachment: (cartas[escolha].img), name: 'carta.png' }]});
};
exports.run = async (bot, message, args) => {

	bot.shuffle(cartas);
	players = [];
	players.push(message.author.id)

	let playerhands = [
		cartas.slice(0, 3),
		cartas.slice(4, 7),
		cartas.slice(8, 11),
		cartas.slice(12, 15),
		cartas.slice(16, 19),
		cartas.slice(20, 23)
	];

	const response = await bot.awaitReply(message, 'Com quantas pessoas você gostaria de jogar? (*responda com 2,4 ou 6*)');
	if (response != '2' && response != '4' && response != '6')
		return message.reply('Esse número de jogadores não é valido!');

	embed.setDescription('Espaço para ' + (response - players.length) + ' jogadores')
	const m = await message.channel.send({
		embed
	});
	m.react('465964068382048259')
	collect = new Discord.ReactionCollector(m, (reaction, user) => reaction.emoji.id == '465964068382048259' && user.id != bot.user.id && !players.includes(user.id), {
		maxUsers: parseInt(response - 1),
		time: 30000
	});
	collect.on('collect', r => {
		newplayer = r.users.last();
		players.push(newplayer.id)
		embed.setDescription('Espaço para ' + (response - players.length) + ' jogadores')
			.addField('Player ' + players.length, newplayer.username);
		m.edit(embed)
	})
	collect.on('end', async r => {
		console.log(players);
		if (players.length < response) return message.channel.send('Número de pessoas para começar a partida inferior ao necessário. Truco cancelado!');
		for (x in players) {
			await merge([playerhands[x][0].img, playerhands[x][1].img, playerhands[x][2].img]).then(async (img) => {
				await img.write('playerhand' + x + '.png', async () => {})
			});
			bot.users.get(players[x]).send({
				files: [{
					attachment: ('./playerhand' + x + '.png'),
					name: 'playerhand.png'
				}]
			});
		}
	})
	//message.channel.send({files: [{ attachment: (cartas[escolha].img), name: 'carta.png' }]});
};

exports.help = {
	name: "base",
	category: "Code",
	description: "base",
	usage: "base",
	example: "base"
};