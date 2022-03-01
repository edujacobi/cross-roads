exports.run = async (bot, message, args) => {
	return bot.commands.get('galo').run(bot, message)
};
exports.config = {
	alias: ['cara']
};