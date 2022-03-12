const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')
exports.run = async (bot, interaction) => {
	// if (message.author.id != bot.config.adminID)
	const embed = new Discord.MessageEmbed()
		.setDescription(`${bot.config.car} Carros em breve!`)
		.setColor('GREEN')
		.setFooter({
			text: `Mas sabe-se lá quando`,
			iconURL: interaction.user.avatarURL()
		})
		.setTimestamp()
	
	return await interaction.reply({embeds: [embed]})
		.catch(() => console.log("Não consegui enviar mensagem `cars`"))

	let uData = bot.data.get(interaction.user.id)
	const embed1 = new Discord.MessageEmbed()

		.setTitle(`${bot.config.car} Concessionária [em breve]`)
		.setDescription("Reduza o tempo dos jobs!\nCada carro tem duração de 7 dias.\n")
		.setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/738571318865428500/radar_impound.png")
		.setColor(bot.colors.darkGrey)

		.addField("1: Chevrolet Onix", `R$ 50.000\nRedução: 5%`, true)
		.addField("2: Hyundai HB20", `R$ 250.000\nRedução: 10%`, true)
		.addField("3: Toyota Corolla", `R$ 750.000\nRedução: 15%`, true)
		.addField("4: Nissan GT-R", `R$ 2.500.000\nRedução: 20%`, true)
		.addField("5: Ferrari Berlinetta", `R$ 7.500.000\nRedução: 25%`, true)
		.addField("6: Bugatti Veyron", `R$ 25.000.000\nRedução: 30%`, true)

		.setFooter({
			text: `${bot.data.get(interaction.user.id, "username")} • Dinheiro: R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`,
			iconURL: interaction.user.user.avatarURL()
		})
		.setTimestamp()

	await interaction.reply({embeds: [embed1]})
		.catch(() => console.log("Não consegui enviar mensagem `cars`"))
}

exports.commandData = new SlashCommandBuilder()
	.setName('concessionaria')
	.setDescription('Adquira carros e faça ações mais rapidamente (Em desenvolvimento)')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}