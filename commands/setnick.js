const Discord = require("discord.js")
exports.run = async (bot, message, args) => {

	if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id)) return

	let id = args[0]
	if (!args || !args[1])
		return bot.createEmbed(message, "`;setnick <id> <novo-nick>`")

	if (!bot.data.get(id))
		return message.reply("ID de Usuário inválido")

	let nick = args.join(" ").replace(id, "").replace(" ", "")
	bot.data.set(id, nick, 'username')
	bot.createEmbed(message, `Nick **${nick}** setado para <@${id}>`)

	return bot.log(message, new Discord.MessageEmbed()
		.setDescription(`**Nick ${nick} setado para <@${id}> por ${bot.data.get(message.author.id, "username")}**`)
		.setColor(bot.colors.admin))
	
}