const Discord = require("discord.js");
const {
	promisify
} = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const bot = new Discord.Client();
bot.config = require("./config.js");

require("./modules/functions.js")(bot);
require("./modules/messages.js")(bot);

bot.commands = new Enmap();
bot.data = new Enmap({
	name: "data"
});

const init = async () => {
	const commandFiles = await readdir("./commands/");
	commandFiles.forEach(f => {
		if (!f.endsWith(".js")) return;
		const response = bot.loadCommand(f);
		if (response) console.log(response);
	});

	const eventFiles = await readdir("./events/");
	eventFiles.forEach(file => {
		const eventName = file.split(".")[0];
		const event = require(`./events/${file}`);

		bot.on(eventName, event.bind(null, bot));
		const mod = require.cache[require.resolve(`./events/${file}`)];
		delete require.cache[require.resolve(`./events/${file}`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
				mod.parent.children.splice(i, 1);
				break;
			}
		}
	});

	bot.on('error', console.error);
	bot.login(bot.config.token);
};

init();