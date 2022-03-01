exports.run = async (bot, message, args) => {
	return bot.commands.get('galo').run(bot, message, ['526203502318321665'])
};
exports.config = {
	alias: ['cara']
};