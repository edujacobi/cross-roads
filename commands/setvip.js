exports.run = async (bot, message, args) => {

	if (message.author.id != bot.config.adminID) return

	if (!args || !args[1])
		return bot.createEmbed(message, "`;setvip <days> <id>`")

	let days = args[0] * 60 * 60 * 1000 * 24
	let currTime = new Date().getTime()
	let daysToAdd = bot.data.get(args[1], 'vipTime') > currTime ? bot.data.get(args[1], 'vipTime') + days : currTime + days
	
	bot.data.set(args[1], daysToAdd, 'vipTime')
	bot.data.set(args[1], false, 'nickAlterado')
	// let guild = bot.guilds.cache.get('529674666692837378')

	// let role = guild.roles.cache.get('529680357591613442')

	// if (guild.members.cache.has(message.author.id))
	// 	message.guild.members.cache.get(message.author.id).roles.add(role);

	let roleVip = message.member.guild.roles.cache.find(role => role.id === "529680357591613442");
	if (message.member.guild.id === '529674666692837378' && roleVip)
		message.guild.members.cache.get(message.author.id).roles.add(roleVip);
	

	return bot.createEmbed(message, `${bot.badges.vip} **${bot.data.get(args[1], 'username')}** adquiriu ${args[0]} dias de VIP!`)
	
}