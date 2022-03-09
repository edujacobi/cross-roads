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
			bot.user.setActivity(`Temporada 7!`, {
				type: "PLAYING"
			});
		}, hora)
	}, hora * 2)
	
	setInterval(() => {
		bot.decrescimoNivelCasal()
		bot.removeSkinsNoVIP()
	}, hora * 6)
	
	
	// setInterval(() => {
	// 	// bot.putMoneyCassino()
	// 	bot.sortearBilhete()
	// 	// if (global.gc)
	// 	// 	global.gc()
	// }, (hora / 2))
	
	// bot.informRinhaRouboCancelado()
	
	setInterval(() => bot.investReceber(), hora) // 1h

	const embed = new Discord.MessageEmbed()
		.setTitle(`Cross Roads`, bot.user.avatarURL())
		.setDescription(`**BOT INICIADO**`)
		.setColor('GREEN') // bot.colors.background // 
		.setTimestamp();

	bot.channels.cache.get('848232046387396628')?.send({embeds: [embed]})

	// bot.shard.broadcastEval(`bot.channels.cache.get('848232046387396628')?.send({embeds: [embed]})`)

	// bot.shard.broadcastEval(`
    //     (async () => {
    //         await bot.channels.cache.get('848232046387396628')?.send({ embeds: [${JSON.stringify(embed)}] });
    //     })();
    // `);
};