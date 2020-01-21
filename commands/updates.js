const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    const embed = new Discord.RichEmbed()

        .setTitle(bot.config.saveGame + " Update 1.4")
        //.setThumbnail("https://cdn.discordapp.com/attachments/453314806674358292/526265639552417802/GTD.png")
        .setColor(message.member.displayColor)
        .addField("Nova arma", bot.config.escopeta + " **Escopeta** adicionada", true)
        .addField("Novo job", bot.config.bulldozer + " **Estraga-Funeral** adicionado", true)
        .addField("Trabalho? Meu negócio é roubar!", "Roubos à lugares agora aceitam diversas armas")
        .addField("Eu quero um aumento.", "Salários dos trabalhos **Caçador de Corno** e **Treinador de Milícias** aumentados")
        .addField("Mestre das artes ninjas", "Galos agora podem treinar para subir de nível. `;galo info`") 
        .addField("Mestre da programação", "Bug do Inventário abrindo e fechando sozinho corrigido. Agora você pode abrir e fechar ele quantas vezes quiser")
		.setFooter(`${message.author.username} • Última atualização: 29/11/2019`, message.member.user.avatarURL)
        .setTimestamp();

    message.channel.send({
        embed
    })
}