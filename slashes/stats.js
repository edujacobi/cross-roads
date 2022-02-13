const Discord = require("discord.js");

require("moment-duration-format");

exports.run = async (bot, interaction) => {
    let count_online = 0

    for (let [key, value] of bot.onlineNow) {
        if (value > new Date().getTime() - 600000) // 3600000
            count_online += 1
    }

    let minToMonths = (minutos) => {
        return `${Math.floor(minutos / 1440)} dias ${(minutos > 60 ? `e ${Math.floor((minutos / 24) % 24)} ${(minutos < 120 ? `hora` : `horas`)}` : "")}`
    }

    let avatar

    await bot.users.fetch('332228051871989761').then(user => {
        avatar = user.avatarURL({
            dynamic: true,
            size: 128
        })

    })

    let online = '<:online:763539013574459402>'

    const embed = new Discord.MessageEmbed()
        .setTitle(`📊 Estatísticas`)
        .setThumbnail(bot.user.avatarURL())
        .setColor('GREEN')
        .addField("Tempo online", bot.segToHour(Math.floor(bot.uptime / 1000)), true)
        .addField("Temporada 7", minToMonths((new Date() - new Date(2022, 0, 31)) / 1000 / 60), true)
        //.addField("Usuários", bot.users.cache.size, true)
        .addField("Jogadores", bot.data.indexes.length.toString(), true)
        //.addField("Servidores", bot.guilds.cache.size, true)
        //.addField("Canais", bot.channels.cache.size, true)
        .addField("Discord.js", ` v${Discord.version}`, true)
        .addField("NodeJS", process.version.toString(), true)
        .addField(" Uso de memória", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField(`${online} Online`, count_online.toString(), true)
        .setFooter("Desenvolvedor: Jacobi#5109\nArte gráfica: Cesar, nadalao, CassadorEterno, Kenny, periett e Quantum", avatar);

    await interaction.reply({embeds: [embed]})
        .catch(err => console.log("Não consegui enviar mensagem `stats`"));

};

exports.commandData = {
    name: "stats",
    description: "Estatísticas e informações do Cross Roads",
    options: [],
    defaultPermission: true,
};

exports.conf = {
    permLevel: "User",
    guildOnly: false
}