const Discord = require("discord.js");
module.exports = async bot => {
	console.log('pronto')
	// bot.user.setActivity(`Temporada 3 | ;ajuda`, {
	// 	type: "PLAYING"
	// });
	bot.user.setActivity(`${bot.data.indexes.length} jogadores | ;ajuda`, {
		type: "LISTENING"
	});

	const hora = 3600000

	// bot.user.setActivity(`EM MANUTENÇÃO`, {
	// 	type: "LISTENING"
	// });

	setInterval(() => {
		bot.user.setActivity(`${bot.data.indexes.length} jogadores | ;ajuda`, {
			type: "LISTENING"
		});
		setTimeout(() => {
			bot.user.setActivity(`Temporada 5!`, {
				type: "PLAYING"
			});
		}, hora / 2)
	}, hora)

	setInterval(() => {
		bot.putMoneyCassino()
		bot.sortearBilhete()
	}, (hora / 2))

	bot.informRouboCancelado()
	bot.informRinhaCancelada()

	setInterval(() => {
		bot.investReceber()
		if (global.gc)
			global.gc()
	}, hora) // 1h

	const embed = new Discord.MessageEmbed()
		.setTitle(`Cross Roads`, bot.user.avatarURL())
		.setDescription(`**BOT INICIADO**`)
		.setColor('GREEN') // bot.colors.background // 
		.setTimestamp();

	bot.channels.cache.get('848232046387396628').send({
		embeds: [embed]
	})
};