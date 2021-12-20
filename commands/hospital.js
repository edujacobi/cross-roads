const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    let currTime = new Date().getTime()
    let uData = bot.data.get(message.author.id)
    let option = args[0] ? args[0].toString().toLowerCase() : args[0]
    let total = 0

    if (option === "particular" || option === "p") {
        if (uData.hospitalizado < currTime)
            return bot.createEmbed(message, `Você não está hospitalizado ${bot.config.hospital}`, "Quer uma injeçãozinha?", bot.colors.hospital)

        let defPower = 0

        Object.entries(uData).forEach(([key, value]) => {
            Object.values(bot.guns).forEach(arma => {
                if (value > currTime && arma.def > defPower && key == "_" + arma.data)
                    defPower = arma.def
            })
        })

        //let tempo_restante_proporcao = (uData.hospitalizado / currTime) - 1
        let preço = Math.floor((3000 + (defPower * (defPower / 6)) ** 2) + (uData.moni * 0.1) + (uData.ficha * 80 * 0.1))

        const confirmed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`**Você está curado!** ${bot.config.hospital}`)
            .setFooter(uData.username, message.member.user.avatarURL())
            .setTimestamp();

        bot.createEmbed(message, `Seu tratamento custará **R$ ${preço.toLocaleString().replace(/,/g, ".")}**. Confirmar pagamento? ${bot.config.hospital}`, null, 'RED')
            .then(msg => {
                msg.react('✅').catch(err => console.log("Não consegui reagir mensagem `hospital`")).then(r => {
                    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id

                    const confirm = msg.createReactionCollector({
                        filter,
                        max: 1,
                        time: 90000
                    })

                    confirm.on('collect', r => {
                        if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `hospital`"))
                            .then(m => {
                                if (uData.moni < preço)
                                    return bot.msgSemDinheiro(message)

                                uData.moni -= preço
                                uData.hospitalizado = 0
                                uData.hospitalGastos += preço
                                bot.banco.set('caixa', bot.banco.get('caixa') + Math.floor(preço * bot.imposto))
                                bot.data.set(message.author.id, uData)
                                msg.edit({
                                    embeds: [confirmed]
                                }).catch(err => console.log("Não consegui editar mensagem `hospital`"))
                            })

                    })
                })
            })
    } else {

        const embed = new Discord.MessageEmbed()
            .setTitle(`${bot.config.hospital} Hospital`)
            .setDescription("Público, Gratuito e de Qualidade!\n")
            .setThumbnail("https://cdn.discordapp.com/attachments/531174573463306240/739635753063153714/radar_hostpital.png")
            .setColor('RED')
            .addField("Serviço público", `Infelizmente, não temos mais leitos livres, então você precisará esperar no corredor para ser atendido`, true)
            .addField("Atendimento particular", `Caso você pague uma certa quantia, poderemos tratá-lo mais rapidamente\n \`;hospital particular\``, true)
            .setFooter(`${bot.user.username} • Clique na reação para abrir a lista de hospitalizados`, bot.user.avatarURL())
            .setTimestamp();

        message.channel.send({
            embeds: [embed]
        }).then(msg => {
            msg.react('539497344450691077').catch(err => console.log("Não consegui reagir mensagem `hospital`"))
                .then(() => {
                    const filter = (reaction, user) => reaction.emoji.id === '539497344450691077' && user.id == message.author.id;
                    const hospitalizados_ = msg.createReactionCollector({
                        filter,
                        time: 90000,
                    });
                    let hospitalizados = []

                    bot.data.indexes.forEach(user => {
                        if (user != bot.config.adminID) { // && message.guild.members.cache.get(user)
                            let uData = bot.data.get(user)
                            if (uData.hospitalizado > currTime && uData.morto < currTime) {
                                if (bot.users.fetch(user) != undefined)
                                    hospitalizados.push({
                                        nick: uData.username,
                                        tempo: uData.hospitalizado - currTime,
                                        vezes: uData.qtHospitalizado,
                                    })
                                total += 1
                            }
                        }
                    })

                    hospitalizados.sort(function (a, b) {
                        return b.tempo - a.tempo
                    })


                    const Hospitalizados = new Discord.MessageEmbed()
                        .setTitle(`${bot.config.hospital} Hospitalizados`)
                        .setColor(bot.colors.background)

                    if (hospitalizados.length > 0) {
                        hospitalizados.forEach(hospitalizado => Hospitalizados.addField(hospitalizado.nick, `Curado em ${bot.segToHour((hospitalizado.tempo / 1000))}\nHospitalizado ${hospitalizado.vezes} vezes`, true))
                    } else
                        Hospitalizados.setDescription("Não há hospitalizados")

                    // if (total == 1 || total == 4 || total == 7 || total == 10 || total == 13 || total == 16) {
                    //     Hospitalizados.addField('\u200b', '\u200b', true)
                    //     Hospitalizados.addField('\u200b', '\u200b', true)
                    // } else if (total == 2 || total == 5 || total == 8 || total == 11 || total == 14 || total == 17) {
                    //     Hospitalizados.addField('\u200b', '\u200b', true)
                    // }
                    hospitalizados_.on('collect', r => {
                        message.channel.send({
                            embeds: [Hospitalizados]
                        }).then(m => {
                            if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `hospital`"))
                        }).catch(err => console.log("Não consegui enviar mensagem `hospitalizados`"))
                    })
                })
        }).catch(err => {
            console.log("Não consegui enviar mensagem `hospitalizados`")
        })
    }
}
exports.config = {
    alias: ['h']
};