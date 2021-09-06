const math = require('mathjs')
exports.run = async (bot, message, args) => {

	if (!args[0])
		return bot.createEmbed(message, `Insira um cálculo.`)

	let resp
	try {
		resp = math.evaluate(args.join(' '))
	} catch (error) {
		return bot.createEmbed(message, `Insira um cálculo válido`)
	}
	//${args.join('')
	return bot.createEmbed(message, `**Resultado**\n \`\`\`${resp}\`\`\``)
}