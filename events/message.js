const Discord = require("discord.js");
module.exports = (bot, message) => {
	if (message.author.bot)
		return;

	if (message.channel.type == 'dm')
		return;

	if (!message.isMentioned(bot.user) && !message.content.startsWith(bot.config.prefix))
		return;

	const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	var key = message.author.id;
	bot.data.ensure(key, bot.defaultCarteira);

	const cmd = bot.commands.get(command);

	if (!cmd)
		return;

	message.flags = [];

	while (args[0] && args[0][0] === "-")
		message.flags.push(args.shift().slice(1));

	cmd.run(bot, message, args);

	//message.delete();

	const embed = new Discord.RichEmbed()
		.setAuthor(message.author.tag + " - ID: " + message.author.id, message.author.avatarURL)
		.setDescription(message.content)
		.setColor(0x36393E)
		.setFooter(message.guild.name + " in #" + message.channel.name, message.guild.iconURL)
		.setTimestamp();

	//console.log(`log: ${message.content} | ${message.author.username} | ${message.guild.name} | ${message.channel.name}`);
	bot.channels.get('564988393713303579').send(embed)
};