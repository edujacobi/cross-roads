const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	if (args && args[0] > 15)
		return bot.createEmbed(message, "O limite máximo é 15")

	if (args[0] < 1 || (args[0] % 1 != 0))
		args = 5

	let top = [];
	let topGlobal = [];

	for (let [id, user] of bot.data) {
		if (user.username != undefined) {
			if (id != bot.config.adminID) {
				top.push({
					nick: user.username,
					id: id,
					ovo: user._ovo,
				})
			}

		}
	}

	topGlobal = top.sort((a, b) => b.ovo - a.ovo).slice(0, args[0] ? args[0] : 5)

	let topGlobalString = ""
	let topGlobalStringID = ""

	topGlobal.forEach((user, i) => {
		topGlobalString += `\`${i + 1}.\` **${user.nick}** ${user.ovo.toLocaleString().replace(/,/g, ".")}\n`;
		topGlobalStringID += `\`${i + 1}.\`  **${user.nick}** ${user.id}\n`;
	});

	const embedWithoutID = new Discord.MessageEmbed()
		.setTitle(`${bot.config.ovo} Ranking Ovos`)
		.setColor('GREEN')
		.setDescription(topGlobalString)
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();

	const embedWithID = new Discord.MessageEmbed()
		.setTitle(`${bot.config.ovo} Ranking Ovos`)
		.setColor('GREEN')
		.setDescription(topGlobalStringID)
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();

	return message.channel.send({
		embeds: [embedWithoutID]
	}).then(msg => {
		msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topovo`")).then(r => {
			const withoutIDFilter = (reaction, user) => reaction.emoji.id === '827309700285595699' && user.id == message.author.id;
			const withIDFilter = (reaction, user) => reaction.emoji.name === '🆔' && user.id == message.author.id;

			const withoutID = msg.createReactionCollector({
				withoutIDFilter,
				time: 60000
			});
			const withID = msg.createReactionCollector({
				withIDFilter,
				time: 60000
			});

			withoutID.on('collect', r => {
				r.users.remove(message.author.id).then(m => {
					r.users.remove(bot.user.id).then(m => {
						msg.edit({
								embeds: [embedWithoutID]
							}).catch(err => console.log("Não consegui editar mensagem `topovo`"))
							.then(m => {
								msg.react('🆔').catch(err => console.log("Não consegui reagir mensagem `topovo`"));
							});
					});
				});
			});
			withID.on('collect', r => {
				r.users.remove(message.author.id).then(m => {
					r.users.remove(bot.user.id).then(m => {
						msg.edit({
								embeds: [embedWithID]
							}).catch(err => console.log("Não consegui editar mensagem `topovo`"))
							.then(m => {
								msg.react('827309700285595699').catch(err => console.log("Não consegui reagir mensagem `topovo`"));
							});
					});
				});
			});
		});
	}).catch(err => console.log("Não consegui enviar mensagem `topovo`"));
};
//--
exports.config = {
	alias: ['tpo']
};