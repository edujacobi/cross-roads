exports.run = async (bot, message, args) => {
	return bot.commands.get('galo').run(bot, message, ['cross', 'roads'])
};
exports.config = {
	alias: ['cara']
};