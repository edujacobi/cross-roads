const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
  if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return
  message.delete()
  const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription(args.join(" "))
			.setFooter(bot.user.username, bot.user.avatarURL())
			.setTimestamp()
  return message.channel.send({ embeds: [embed] }).catch(err => console.log("Não consegui enviar mensagem `embed`"))
}
// const Discord = require("discord.js");
// exports.run = async (bot, message, args) => {
// 	const embed = new Discord.MessageEmbed()
// 		.setColor(message.member.displayColor)
// 		.setAuthor("/me", message.author.avatarURL())
// 		.setDescription(`*${bot.data.get(message.author.id, 'username')} ${args.join(" ")}*`)
// 	return message.channel.send({ embeds: [embed] })
// }