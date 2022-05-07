exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID)
		return;

	const code = args.join(" ");
	try {
		var evaled = eval(code);
		const clean = await bot.clean(bot, evaled);
		let index = 0;
		while (index < clean.length) {
			var cleaner = clean.substr(index, index + 1900);
			message.channel.send(`\`\`\`js\n${cleaner}\n\`\`\``)
				.catch(() => console.log("Não consegui enviar mensagem `eval`"));
			if (clean.length > 4000)
				index = clean.length;
			else
				index = index + 1900;
		}
	} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${await bot.clean(bot)}\n\`\`\``)
			.catch(() => console.log("Não consegui enviar mensagem `eval`"));
	}

};