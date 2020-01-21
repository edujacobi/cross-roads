const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	let user = message.mentions.members.first();

	if (!user && args[0]) {
		if (/^-?[0-9]+$/.test(args[0]) && args[0].length == 18)
			user = message.guild.members.get(args[0]);

		let name = args.join(" ").toLowerCase();

		message.guild.members.forEach(item => {
			if (item.user.username.toLowerCase() == name)
				user = item;

			else if (item.displayName.toLowerCase() == name)
				user = item;
		});

		if (!user)
			return bot.createEmbed(message, "Usuário não encontrado");
	}

	let avatar = (user ? user.user : message.author).avatarURL || (user ? user.user : message.author).defaultAvatarURL;
	let embed = new Discord.RichEmbed()

		.setTitle("Avatar de " + (user ? user.user : message.author).username)
		.setImage(avatar)
		.setColor(message.member.displayColor)
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();

	message.channel.send(embed);
}