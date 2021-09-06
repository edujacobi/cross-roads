const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const embed = new Discord.MessageEmbed()
		.setColor('GREEN')
		.setTitle("Convites")
		.setThumbnail('https://cdn.discordapp.com/attachments/753748867991994409/756988818602721482/CrossRoadsLogo.png')
		.setDescription("[Adicione o Cross Roads em seu servidor!](https://discord.com/api/oauth2/authorize?client_id=526203502318321665&permissions=288832&scope=bot)")
		// .addField("\u200b", "[Clique aqui e adicione Cross Roads em seu servidor!](https://discord.com/api/oauth2/authorize?client_id=526203502318321665&permissions=288832&scope=bot)\n\n[Clique aqui e entre também no server do Cross Roads!](https://discord.gg/sNf8avn)")
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();

	message.channel.send({
		embeds: [embed]
	}).catch(err => console.log("Não consegui enviar mensagem `invite`", err));
	// message.channel.send("discord.gg/sNf8avn")
	message.channel.send("discord.gg/ruasdacruz").catch(err => console.log("Não consegui enviar mensagem `invite`", err))
}
exports.config = {
	alias: ['convite', 'adicionar']
};