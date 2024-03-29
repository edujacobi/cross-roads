const {Client, Intents, Options, Collection} = require('discord.js')

const {promisify} = require("util")
const readdir = promisify(require("fs").readdir)
const {readdirSync} = require("fs")
const Josh = require('@joshdb/core')
const provider = require('@joshdb/sqlite')

require('dotenv').config({
	path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
})

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES
	],
}, {
	// shardCount: "auto",
	allowedMentions: {parse: ['users'], repliedUser: false},
	makeCache: 60,
	disabledEvents: [
		'GUILD_DELETE', 'GUILD_UPDATE', 'GUILD_MEMBER_ADD',
		'GUILD_MEMBER_REMOVE', 'GUILD_MEMBER_UPDATE', 'GUILD_MEMBERS_CHUNK', 'GUILD_ROLE_CREATE',
		'GUILD_ROLE_DELETE', 'GUILD_ROLE_UPDATE', 'GUILD_BAN_ADD', 'GUILD_BAN_REMOVE',
		'GUILD_EMOJIS_UPDATE', 'GUILD_INTEGRATIONS_UPDATE', 'CHANNEL_CREATE', 'CHANNEL_DELETE',
		'CHANNEL_UPDATE', 'CHANNEL_PINS_UPDATE', 'MESSAGE_DELETE', 'MESSAGE_UPDATE',
		'MESSAGE_REACTION_ADD', // ?
		'MESSAGE_DELETE_BULK', 'EMOJI_CREATE', 'EMOJI_DELETE', 'EMOJI_UPDATE',
		'MESSAGE_REACTION_REMOVE', 'MESSAGE_REACTION_REMOVE_ALL', 'USER_UPDATE', 'PRESENCE_UPDATE',
		'TYPING_START', 'VOICE_STATE_UPDATE', 'VOICE_SERVER_UPDATE', 'WEBHOOKS_UPDATE',
		'DIRECT_MESSAGE_TYPING', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES',
		'GUILD_VOICE_STATES', 'GUILD_MESSAGE_TYPING',
	]
})

bot.talkedRecently = new Set()
bot.functionTimers = new Map()
bot.onlineNow = new Map()
bot.config = require("./config.js")
bot.badges = require("./badges.js")
bot.colors = require("./colors.js")

bot.commands = new Collection()
bot.slashes = new Collection()


require("./db.js")(bot)
require("./modules/functions.js")(bot)
require("./modules/messages.js")(bot)
require("./modules/investimentos.js")(bot)
require("./modules/locais.js")(bot)
require("./modules/jobs.js")(bot)
require("./modules/armas.js")(bot)
require("./modules/bases.js")(bot)
require("./modules/classes.js")(bot)
require("./modules/aneis.js")(bot)


const init = async () => {
	// const commandFiles = await readdir("./commands/")
	// commandFiles.forEach(f => {
	// 	if (!f.endsWith(".js")) return
	// 	const response = bot.loadCommand(f)
	// 	if (response) console.log(response)
	// })

	const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"))
	for (const file of commands) {
		const props = require(`./commands/${file}`)
		const commandName = file.split(".")[0]
		console.log(`Loading Command: ${commandName}. 👌`)
		bot.commands.set(commandName, props)
	}

	const slashFiles = readdirSync("./slashes").filter(file => file.endsWith(".js"))
	for (const file of slashFiles) {
		const command = require(`./slashes/${file}`)
		const commandName = file.split(".")[0]
		console.log(`Loading Slash command: ${commandName}. 👌`)
		await bot.slashes.set(command.commandData.name, command)
	}

	const eventFiles = await readdir("./events/")
	eventFiles.forEach(file => {
		const eventName = file.split(".")[0]
		const event = require(`./events/${file}`)
		bot.on(eventName, event.bind(null, bot))
		
		const mod = require.cache[require.resolve(`./events/${file}`)]
		delete require.cache[require.resolve(`./events/${file}`)]
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
				mod.parent.children.splice(i, 1)
				break
			}
		}
	})

	bot.on('shardError', error => {
		console.warn(new Date() + '.\nA websocket connection encountered an error:', error)
	})
	process.on('unhandledRejection', (reason, promise) => {
		console.warn(new Date() + '.\nUnhandled promise rejection:', reason)
	})
	bot.on('unknownInteraction', error => {
		console.warn(new Date() + '.\nUnknown Interaction')
	})
	bot.on('missingPermissions', error => {
		console.warn(new Date() + '.\nMissing Permissions')
	})
	bot.login(process.env.TOKEN)
}

init()