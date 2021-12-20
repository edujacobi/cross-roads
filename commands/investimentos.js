const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let uData = bot.data.get(message.author.id)

	const embed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.propertyG} Investimentos`)
		.setDescription("Você receberá lucros a cada hora. Cada investimento dura 7 dias.\nPara receber notificações do lucro depositado, use `;investir notificar`.")
		.setThumbnail("https://cdn.discordapp.com/attachments/719677144133009478/734264171511676969/radar_propertyG.png")
		.setColor('GREEN')

	Object.values(bot.investimentos).forEach(investimento => {
		let preço = uData.classe == 'mafioso' ? investimento.preço : (investimento.preço + investimento.preço * bot.imposto)
		let lucro = investimento.lucro
		if (uData.classe == 'mafioso')
			lucro = Math.floor(investimento.lucro * 0.9)
		if (uData.classe == 'empresario')
			lucro = Math.floor(investimento.lucro * 1.05)
		embed.addField(`${investimento.id}: ${investimento.desc}`, `R$ ${preço.toLocaleString().replace(/,/g, ".")}\nLucro/h: R$ ${lucro.toLocaleString().replace(/,/g, ".")}`, true)
	});
	embed.setFooter(`${uData.username} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`, message.member.user.avatarURL())
		.setTimestamp();

	message.channel.send({
		embeds: [embed]
	}).catch(err => console.log("Não consegui enviar mensagem `investimentos`"));
}
exports.config = {
	alias: ['invests', 'investments', 'locais']
};