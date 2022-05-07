const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

exports.run = async (bot, interaction) => {
	let currTime = new Date().getTime()
	const semana = 604800000 // 7 dias,
	let uData = await bot.data.get(interaction.user.id)
	const MULT = !!uData.invest ? bot.investimentos[uData.invest].id : 1
	let weekly_moni = uData.vipTime > currTime ? 1500 * MULT : 1000 * MULT
	// let weekly_ficha = uData.vipTime > currTime ? 15 : 10


	if (currTime > uData.weekly + semana) {
		uData.weekly = currTime
		uData.moni += parseInt(weekly_moni)
		// uData.ficha += parseInt(weekly_ficha)
		await bot.data.set(interaction.user.id, uData)

		const embed = new Discord.MessageEmbed()
			.setDescription(`Você recebeu seus R$ ${weekly_moni.toLocaleString().replace(/,/g, '.')} semanais ${bot.config.coin}`)
			.setColor('GREEN')
			.setFooter({
				text: `${uData.username} • R$ ${uData.moni.toLocaleString().replace(/,/g, '.')}`,
				iconURL: interaction.user.avatarURL()
			})
			.setTimestamp()

		await interaction.reply({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `weekly`"))

		return bot.log(interaction, new Discord.MessageEmbed()
			.setDescription(`${uData.username} recebeu seus R$ ${weekly_moni.toLocaleString().replace(/,/g, ".")} semanais`)
			.addField("Ficou com", `R$ ${uData.moni.toLocaleString().replace(/,/g, ".")}`)
			.setColor('GREEN'))

	}
	else {
		const embed = new Discord.MessageEmbed()
			.setDescription(`Você já recebeu esta semana. O Weekly ficará disponível novamente em ${bot.segToHour((uData.weekly + semana - currTime) / 1000)} ${bot.config.coin}`)
			.setColor('GREEN')
			.setFooter({
				text: uData.username,
				iconURL: interaction.user.avatarURL()
			})
			.setTimestamp()

		await interaction.reply({embeds: [embed]})
			.catch(() => console.log("Não consegui enviar mensagem `weekly`"))

	}
}

exports.commandData = new SlashCommandBuilder()
	.setName('weekly')
	.setDescription('Receba grana bônus semanalmente')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: false
}