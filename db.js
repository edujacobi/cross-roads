// const Enmap = require("enmap")
const Josh = require("@joshdb/core")
const provider = require('@joshdb/sqlite')


module.exports = (bot) => {
	bot.modules = new Josh({name: "modules", provider})
	bot.data = new Josh({name: "data", provider})
	bot.galos = new Josh({name: "galos", provider})
	bot.gangs = new Josh({name: "gangs", provider})
	bot.banco = new Josh({name: "banco", provider})
	bot.coroamuru = new Josh({name: "coroamuru", provider})
	bot.bilhete = new Josh({name: "bilhete", provider})
	bot.casais = new Josh({name: "casais", provider})
	bot.beberroes = new Josh({name: "beberroes", provider})
}