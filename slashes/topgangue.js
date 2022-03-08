const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

exports.run = async (bot, interaction) => {
	const getIcone = (index) => index ? bot.config['gang' + index] : bot.config.gang
	
	let top = []
	let topgrana = []
	let toplevel = []

	bot.gangs.forEach((gang, id) => {
		if (gang != '') {
			if (gang.nome != '') { //&& id != '1'
				top.push({
					id: id,
					nome: gang.nome,
					caixa: gang.caixa,
					base: gang.base,
					level: gang.baseLevel,
					boneco: gang.boneco
				})
			}
		}
	})

	const generateEmbed = start => {
		const current = top.slice(start, start + 10)

		const resultado = new Discord.MessageEmbed()
			.setTitle(`${bot.badges.topGangue_s4} Ranking Gangues`)
			.setColor('GREEN')
			.setFooter({
				text: `${bot.user.username} • Mostrando ${start + 1}-${start + current.length} gangues de ${top.length.toLocaleString().replace(/,/g, ".")}`,
				iconURL: bot.user.avatarURL()
			})
			.setTimestamp()

		if (top.length > 0) {
			topgrana = top.sort((a, b) => b.caixa - a.caixa).slice(start, start + 10)
			toplevel = top.sort((a, b) => b.level - a.level).slice(start, start + 10)

			let gangComando
			if (!topgrana.some(gang => gang.id === bot.data.get(interaction.user.id, 'gangID')))
				gangComando = top.find(gang => gang.id === bot.data.get(interaction.user.id, 'gangID'))

			let topgranaString = ""
			let toplevelString = ""

			let userGangId = bot.data.get(interaction.user.id, 'gangID')

			topgrana.forEach((gang, i) => {
				let mod = gang.id == userGangId && userGangId != null ? "__" : ""
				topgranaString += `\`${i + start + 1}.\` ${getIcone(gang.boneco)} ${mod}**${gang.nome}**${mod} R$ ${gang.caixa.toLocaleString().replace(/,/g, ".")}\n`
			})

			toplevel.forEach((gang, i) => {
				let mod = gang.id == userGangId && userGangId != null ? "__" : ""
				let base = bot.bases[gang.base] ? bot.bases[gang.base].desc.split(" ")[0] : ''
				toplevelString += `\`${i + start + 1}.\` ${getIcone(gang.boneco)} ${mod}**${gang.nome}**${mod} \`${gang.base != null ? `${base} ${gang.level}` : 'Sem base'}\`\n`
			})

			if (gangComando) {
				let gang = bot.gangs.get(userGangId)
				const i = top.indexOf(gangComando)
				let base = bot.bases[gang.base] ? bot.bases[gang.base].desc.split(" ")[0] : ''
				topgranaString += `\`${i + 1}.\` ${getIcone(gang.boneco)} __**${gang.nome}**__ R$ ${(gang.caixa).toLocaleString().replace(/,/g, ".")}\n`
				toplevelString += `\`${i + 1}.\` ${getIcone(gang.boneco)} __**${gang.nome}**__ \`${gang.base != null ? `${base} ${gang.baseLevel}` : 'Sem base'}\`\n`
			}

			resultado
				.addField("Top Grana", topgranaString, true)
				.addField("Top Base", toplevelString, true)

		}
		else
			resultado.addField("\u200b", 'Ninguém tem gangue nessa porra?')

		return resultado
	}

	let buttonAnterior = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Anterior')
		.setEmoji('⬅️')
		.setCustomId(interaction.id + interaction.user.id + 'prev')

	let buttonProx = new Discord.MessageButton()
		.setStyle('SECONDARY')
		.setLabel('Próximo')
		.setEmoji('➡️')
		.setCustomId(interaction.id + interaction.user.id + 'next')

	await interaction.reply({
		embeds: [generateEmbed(0)],
		components: top.length > 10 ? [new Discord.MessageActionRow().addComponents(buttonProx)] : []
	})
		.catch(() => console.log("Não consegui editar mensagem `topgangue`"))

	const filter = (button) => [
		interaction.id + interaction.user.id + 'prev',
		interaction.id + interaction.user.id + 'next',
	].includes(button.customId) && button.user.id === interaction.user.id

	const collector = interaction.channel.createMessageComponentCollector({
		filter,
		idle: 60000,
	})

	let currentIndex = 0
	
	collector.on('collect', async b => {
		await b.deferUpdate()

		let rowBtn = new Discord.MessageActionRow()

		if (b.customId === interaction.id + interaction.user.id + 'prev')
			currentIndex -= 10
		else if (b.customId === interaction.id + interaction.user.id + 'next')
			currentIndex += 10

		if (currentIndex !== 0)
			rowBtn.addComponents(buttonAnterior)
		if (currentIndex + 10 < top.length)
			rowBtn.addComponents(buttonProx)


		await interaction.editReply({
			embeds: [generateEmbed(0)],
			components: [rowBtn]
		})
	})
	
	collector.on('end', () => {
		if (interaction) interaction.editReply({components: []})
			.catch(() => console.log("Não consegui editar mensagem `topgangue`"))
	})
}

exports.commandData = new SlashCommandBuilder()
	.setName('topgangue')
	.setDescription('As melhores gangues!')
	.setDefaultPermission(true)

exports.conf = {
	permLevel: "User",
	guildOnly: true
}