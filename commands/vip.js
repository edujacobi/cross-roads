const Discord = require("discord.js");

minToDays = (minutes) => {
	d = Math.floor(minutes / 1440) // 60*24
	h = Math.floor((minutes - (d * 1440)) / 60)

	if (d > 0)
		return (`${d} dias e ${h} horas`)
	else
		return (`${h} horas`)
};

exports.run = async (bot, message, args) => {
	const embed = new Discord.MessageEmbed()

		.setTitle(`${bot.config.vip} Seja VIP`)
		.setThumbnail("https://media.discordapp.net/attachments/531174573463306240/799060089503875072/VIP.png")
		.setColor(0xffd700)
		.addField("Vantagens", "Badge exclusiva no inventário\nBônus de 50% no `;daily` e `;weekly`\nRecarga na alteração de nick\nAvatar GIF do galo\nDobro de limite de caracteres no título do galo\nImune ao cooldown entre comandos\nEntrega esmolas 50% maiores\nEnvio de SMS mais rápido\nAcesso ao canal de desenvolvimento\nAcesso à categoria VIP do servidor Cross Roads\nCargo VIP no servidor do Cross Roads\n25% de desconto na troca de Classe\nPode solicitar alteração do `Jogando desde`\nSorteios do Bilhete premiado exclusivos\nMuito mais a vir!")
		.addField("Como adquirir", "Mande uma DM pro Jacobi#5109. Caso não consiga, entre no servidor do Cross Roads. Valores: R$ 8,00 = 1 mês. R$ 20,00 = 3 meses.")
		.setFooter(`${bot.data.get(message.author.id, "username")} • Clique na reação para abrir a lista de VIPs`, message.member.user.avatarURL())
		.setTimestamp();

	message.channel.send({
		embeds: [embed]
	}).then(msg => {
		msg.react('778572312215027744').catch(err => console.log("Não consegui reagir mensagem `vip`"))
			.then(() => {
				const filter = (reaction, user) => reaction.emoji.id === '778572312215027744' && user.id == message.author.id;
				const vips_ = msg.createReactionCollector({
					filter,
					time: 90000,
				});
				let vips = []
				let total = 0
				let currTime = new Date().getTime()

				bot.data.indexes.forEach(user => {
					let uData = bot.data.get(user)
					if (uData.vipTime > currTime) {
						if (bot.users.fetch(user) != undefined)
							vips.push({
								nick: uData.username,
								tempo: uData.vipTime - currTime,
							})
						total += 1
					}

				})

				vips.sort((a, b) => b.tempo - a.tempo)

				const membros = new Discord.MessageEmbed()
					.setTitle(`${bot.config.vip} Membros VIP`)
					.setColor(bot.colors.background)

				if (vips.length > 0)
					vips.forEach(vip => membros.addField(vip.nick, `Tempo restante: ${minToDays((vip.tempo / 1000 / 60))}`, true))
				else
					membros.setDescription("Não há VIPs")

				if (total == 1 || total == 4 || total == 7 || total == 10 || total == 13 || total == 16) {
					membros.addField('\u200b', '\u200b', true)
					membros.addField('\u200b', '\u200b', true)
				} else if (total == 2 || total == 5 || total == 8 || total == 11 || total == 14 || total == 17) {
					membros.addField('\u200b', '\u200b', true)
				}
				vips_.on('collect', r => {
					message.channel.send({
						embeds: [membros]
					}).then(m => {
						if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `vip`"))
					}).catch(err => console.log("Não consegui enviar mensagem `vip`"))
				})
			})
	}).catch(err => console.log("Não consegui enviar mensagem `vip`"))
};