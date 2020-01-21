exports.run = async (bot, message, args) => {
	let botPing = Math.round(bot.ping);
	let svPing = new Date().getTime();
	bot.createEmbed(message, `:satellite_orbital: ${botPing}ms API.`).then(msg => msg.edit({
		embed: {
			description: `:satellite_orbital: ${botPing}ms API. ${Math.round(new Date().getTime() - svPing)}ms Server.`,
			color: message.member.displayColor,
			timestamp: new Date(),
			footer: {
				icon_url: message.member.user.avatarURL,
				text: message.member.displayName
			}
		}
	}));
};