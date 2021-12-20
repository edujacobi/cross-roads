exports.run = async (bot, message, args) => {

	if (message.author.id != bot.config.adminID) return

	if (!args || !args[1])
		return bot.createEmbed(message, "`;setvip <days> <id>`")

	let days = args[0] * 60 * 60 * 1000 * 24
	let currTime = new Date().getTime()
	let id = args[1]
	let daysToAdd = bot.data.get(id, 'vipTime') > currTime ? bot.data.get(id, 'vipTime') + days : currTime + days

	bot.data.set(id, daysToAdd, 'vipTime')
	bot.data.set(id, false, 'nickAlterado')
	// let guild = bot.guilds.cache.get('529674666692837378')

	// let role = guild.roles.cache.get('529680357591613442')

	// if (guild.members.cache.has(message.author.id))
	// 	message.guild.members.cache.get(message.author.id).roles.add(role);

	let roleVip = message.member.guild.roles.cache.find(role => role.id === "529680357591613442");
	if (message.member?.guild?.id === '529674666692837378' && roleVip){
		let userInServer = message.guild?.members?.cache?.get(id)

		if (userInServer)
			userInServer?.roles?.add(roleVip)
				.catch(err => console.log("Não consegui adicionar o cargo VIP de " + id))
	}

	bot.users.fetch(id).then(user =>
		user.send(`${bot.badges.vip} Você adquiriu ${args[0]} dias de VIP!`)
			.catch(err => console.log(`Não consegui enviar mensagem privada para ${bot.data.get(id, 'username')} \`vip\``))
	)


	return bot.createEmbed(message, `${bot.badges.vip} **${bot.data.get(id, 'username')}** adquiriu ${args[0]} dias de VIP!`)

}