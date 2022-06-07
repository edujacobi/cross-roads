const Discord = require("discord.js")
module.exports = async bot => {

	// await bot.shard.broadcastEval(c => {
	// 	if (c.shard.ids.includes(0)) {
			// bot.user.setActivity(`Temporada 3 | ;ajuda`, {
			// 	type: "PLAYING"
			// });
			// bot.user.setActivity(`${await bot.data.size} jogadores | ;ajuda`, {
			// 	type: "LISTENING"
			// })

			const hora = 1 * 60 * 60 * 1000

			bot.user.setActivity(`Manutenção quase acabando`, {
				type: "LISTENING"
			})

			// setInterval(async () => {
			// 	bot.user.setActivity(`${await bot.data.size} jogadores | ;ajuda`, {
			// 		type: "LISTENING"
			// 	})
			// 	setTimeout(() => {
			// 		bot.user.setActivity(`Temporada 7!`, {
			// 			type: "PLAYING"
			// 		})
			// 	}, hora)
			// }, hora * 2)

			setInterval(() => {
				bot.decrescimoNivelCasal()
				bot.removeSkinsNoVIP()
			}, hora * 6)


			setInterval(() => {
				bot.putMoneyCassino()
				// bot.sortearBilhete()
				if (global.gc)
					global.gc()
			}, (hora / 2))

			bot.informRinhaRouboCancelado()

			// bot.investReceber()

			setInterval(() => bot.investReceber(), hora) // 1h

			const embed = new Discord.MessageEmbed()
				.setTitle(`Cross Roads`, bot.user.avatarURL())
				.setDescription(`**BOT INICIADO**`)
				.setColor('GREEN') // bot.colors.background // 
				.setTimestamp()

			const LOG_CHANNEL_ID = '848232046387396628'

			// bot.channels.cache.get(LOG_CHANNEL_ID)?.send({embeds: [embed]})

			bot.shard.broadcastEval(async (c, {channelId, embed}) => {
				const channel = c.channels.cache.get(channelId)
				if (!channel)
					return false

				await channel.send({embeds: [embed]})
				return true

			}, {context: {channelId: LOG_CHANNEL_ID, embed}})
				.then(sentArray => {
					if (!sentArray.includes(true))
						return console.warn('Não encontrei o canal de log.')

				})

			console.log('Cross Roads iniciado')
	// 	}
	// })
}