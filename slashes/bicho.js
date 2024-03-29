const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')
exports.run = async (bot, interaction) => {
	// if (message.author.id != bot.config.adminID)
	//     return bot.createEmbed(message, "🐒 Jogo do Bicho em breve!", "Mas sabe-se lá quando", 'GREEN')

	let animais = [
		'🦅 Águia', '🐕 Cachorro', '🐐 Cabra',
		'🐫 Camelo', '🐍 Cobra', '🐇 Coelho',
		'🐎 Cavalo', '🐘 Elefante', '🐓 Galo',
		'🐈 Gato', '🐊 Jacaré', '🐒 Macaco',
		'🦆 Pato', '🐖 Porco', '🦚 Pavão',
		'🦃 Peru', '🐂 Touro', '🐅 Tigre',
		'🐀 Rato', '🐢 Tartaruga', '🦈 Tubarão',
	]

	const embed = new Discord.MessageEmbed()
		.setTitle(`🐒 Jogo do Bicho`)
		.setDescription(`Aposte em um número de um animal! Sorteios sem vencedores são acumulados para o prêmio do final de semana!`)
		.setColor(bot.colors.admin)
		.setFooter({text: bot.user.username, iconURL: bot.user.avatarURL()})
		.setTimestamp()

	for (let i = 0; i < animais.length; i++) {
		embed.addField(animais[i], `\`${(i * 5) + 1}\` \`${(i * 5) + 2}\` \`${(i * 5) + 3}\` \`${(i * 5) + 4}\` \`${(i * 5) + 5}\``, true)
	}

	await interaction.reply({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `bicho`"));
}

exports.commandData = new SlashCommandBuilder()
	.setName('bicho')
	.setDescription('Aposte no Jogo do Bicho (Em desenvolvimento)')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}