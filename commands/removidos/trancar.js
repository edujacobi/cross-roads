/*exports.run = async (bot, message, args) => {
    uData = bot.data.get(message.author.id)
    if (uData.statGrana) {
        uData.statGrana = false;
        bot.createEmbed(message, "Inventário trancado. :lock:");
    } else {
        uData.statGrana = true;
        bot.createEmbed(message, "Inventário destrancado. :unlock:");
    }
    bot.data.set(message.author.id, uData)
}*/