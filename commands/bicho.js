const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    // if (message.author.id != bot.config.adminID)
    return bot.createEmbed(message, "🐒 Jogo do Bicho em breve!", "Mas sabe-se lá quando", 'GREEN')
}