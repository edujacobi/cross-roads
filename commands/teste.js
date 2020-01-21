exports.run = async (bot, message, args) => {
	let user = [message.mentions.members.first()];

	if (!user[0] && args[0]) {
		user.pop();
		let name = args.join(" ").toLowerCase();

		bot.users.forEach(item => {
			if (item.tag.toLowerCase() == name) {
				user.push(item);
			} else if (item.username.toLowerCase() == name) {
				user.push(item);
			}
		});

		if (!user[0])
			return bot.createEmbed(message, "Usuário não encontrado.");

		if (user.length > 1) {

			let str = ''
			for (let i = 0; i < user.length; ++i) 
				str += `**${user[i].tag}**\n`

			return bot.createEmbed(message, `Existem ${user.length} usuários com o mesmo nome.\n${str}`);
		}
	}

}