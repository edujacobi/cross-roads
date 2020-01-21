const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    players = [];
    players.push(message.author.id)

    uData = bot.data.get(message.author.id)
    let userD = uData;

    bot.createEmbed(message, `**${userD.nome}** iniciou um Battle Royale entre os galos de **${message.guild.name}**!`)

    const embed = new Discord.RichEmbed()
    embed.setDescription(`Espaço para ${(5 - players.length)} galos`)
        .addField(`Galo ${players.length}`, userD.galoNome, true)
        .setFooter(`Reaja à mensagem para participar!`);

    const mensagem = await message.channel.send({
        embed
    });

    mensagem.react('🐓');

    collect = new Discord.ReactionCollector(mensagem, (reaction, user) => reaction.emoji.id == '🐓' && user.id != bot.user.id && !players.includes(user.id), {
        maxUsers: 4,
        time: 40000,
    });

    collect.on('collect', response => {
        newplayer = response.users.last();
        console.log(bot.data.get(newplayer.id, 'nome'));
		players.push(newplayer.id)
		console.log(players);
		const newEmbed = new Discord.RichEmbed()
        newEmbed.setDescription(`Espaço para ${(5 - players.length)} galos`)
            .addField(`Galo ${players.length}`, bot.data.get(newplayer.id, "galoNome"), true);
        mensagem.edit(newEmbed)

    });
    collect.on('end', async response => {
        console.log(players);
        if (players.length < 5)
            return bot.createEmbed(message, `Número insuficiente de pessoas para começar o Battle Royale.\nA rinha foi cancelada.`);
        else {
            return bot.createEmbed(message, `COMEÇA A BATALHA`);

        }
    });
}