exports.run = async (bot, message, args) => {
	if (message.author.id != bot.config.adminID) return

	let mb_antes = process.memoryUsage().heapUsed

	if (global.gc) {
		global.gc()
		let mb_depois = process.memoryUsage().heapUsed
		message.reply(`${((mb_antes - mb_depois)/ 1024 / 1024).toFixed(2)} MB limpos pelo Garbage Collector`)
	} else
		message.reply('GC não habilitado! Execute com `node --expose-gc index.js`.')
};

exports.config = {
	alias: ['gc']
};