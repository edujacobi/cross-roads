const Discord = require("discord.js");

exports.run = async (bot, interaction, args) => {
	await interaction.deferReply();
	const embed = new Discord.MessageEmbed()
		.setColor('GREEN')
		.setTitle("Convites")
		.setThumbnail('https://cdn.discordapp.com/attachments/753748867991994409/756988818602721482/CrossRoadsLogo.png')
		.setDescription("Adicione o Cross Roads em seu servidor!\nOu entre no servidor oficial e jogue com outras pessoas!\n\nPrecisa copiar o link? Ó ele aqui → discord.gg/sNf8avn")
		// .addField("\u200b", "[Clique aqui e adicione Cross Roads em seu servidor!](https://discord.com/api/oauth2/authorize?client_id=526203502318321665&permissions=288832&scope=bot)\n\n[Clique aqui e entre também no server do Cross Roads!](https://discord.gg/sNf8avn)")
		.setFooter(bot.user.username, bot.user.avatarURL())
		.setTimestamp();

	const button1 = new Discord.MessageButton()
		.setStyle('LINK')
		.setLabel('Adicionar em meu servidor!')
		.setURL('https://discord.com/api/oauth2/authorize?client_id=526203502318321665&permissions=288832&scope=bot')

	const button2 = new Discord.MessageButton()
		.setStyle('LINK')
		.setLabel('Entrar no servidor oficial!')
		.setURL('https://discord.gg/sNf8avn')

	const row = new Discord.MessageActionRow()
		.addComponents(button1)
		.addComponents(button2)

	await interaction.editReply({
		components: [row],
		embeds: [embed]
	})
	// .catch(err => console.log("Não consegui enviar mensagem `invite`"))

}
exports.commandData = {
	name: "convite",
	description: "Convide o Cross Roads para seu servidor ou entre no servidor oficial",
	options: [],
	defaultPermission: true,
};

exports.conf = {
	permLevel: "User",
	guildOnly: false
};