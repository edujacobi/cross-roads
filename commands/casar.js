const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
    let target = message.mentions.members.first()
    let option = args ? args[0] : null
    let uData = bot.data.get(message.author.id)
    let currTime = new Date().getTime()

    let emote = '<:girlfriend:799053368189911081>'

    if (message.author.id != bot.config.adminID && uData.vipTime < currTime)
        return bot.createEmbed(message, `${emote} Casamentos em breve!`, "Mas sabe-se lá quando", 0xf47fff)
    const button = new DiscordButton.MessageButton()
        .setStyle('blurple')
        .setLabel('Comprar anel')
        .setID('anel')


    if (!option && !target) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${emote} Casamento`)
            .setThumbnail('https://media.discordapp.net/attachments/531174573463306240/862135638945824768/radar_girlfriend.png')
            .setDescription("_“Os edifícios ardem, as pessoas morrem, mas o amor verdadeiro é para sempre.”_\nPeça seu par romântico em casamento utilizando um 💍 Anel e compartilhe parte de seus ganhos!")
            .setColor(0xf47fff)
            .addField("💍 Anéis", `Quanto melhor o anel que vocês tiverem, maior o valor compartilhado.\n${uData._anel != null? `Você possui um anel de ${bot.aneis[uData._anel].desc}` : `Você não possui um anel`}`)
            .addField(`${bot.config.flor} Flores`, `Flores precisam ser entregues para manter o nível do relacionamento alto\nVocê possui \`${uData._flor}\` ${uData._flor == 1 ? `flor` : `flores`}`)
            .addField("🏝️ Viagens", `Com um relacionamento no nível máximo, vocês podem viajar para vários locais. Após a viagem, os bônus de casal duplicam por um período`)
            .addField("💔 Divórcio", `Caso o casamento fique com um nível muito baixo, ele será acabado, com cada um seguindo seu caminho. Você pode forçar um divórcio, mas custará caro`)
            .setFooter(bot.user.username, bot.user.avatarURL())
            .setTimestamp();

        let msg = await message.channel.send({
            button: button,
            embed: embed
        }).catch(err => console.log("Não consegui enviar mensagem `casar`", err))

        const filter = (button) => button.clicker.user.id === message.author.id

        const collector = msg.createButtonCollector(filter, {
            time: 90000
        });

        collector.on('collect', b => {
            b.defer();

            const embed = new Discord.MessageEmbed()
                .setTitle(`💍 Anéis`)
                .setDescription(`Quanto melhor o anel que vocês tiverem, maior o valor compartilhado. Os dois precisam ter o mesmo anel.\n${uData._anel != null? `Você possui um anel de **${bot.aneis[uData._anel].desc}**.` : `Você **não** possui um anel.`}`)
                .setColor(0xf47fff)
                .setFooter(bot.user.username, bot.user.avatarURL())
                .setTimestamp();

            Object.values(bot.aneis).forEach(anel => {
                let custoComImposto = uData.classe == 'mafioso' ? anel.custo : Math.round(anel.custo * 1.05)
                embed.addField(anel.desc, `Compartilhamento de ${anel.bonus}%\nPreço: R$ ${custoComImposto.toLocaleString().replace(/,/g, ".")}`)
            })

            const buttonBronze = new DiscordButton.MessageButton()
                .setStyle('gray')
                .setLabel('Prata')
                .setID('bronze')

            const buttonPrata = new DiscordButton.MessageButton()
                .setStyle('gray')
                .setLabel('Ouro')
                .setID('prata')

            const buttonOuro = new DiscordButton.MessageButton()
                .setStyle('gray')
                .setLabel('Diamante')
                .setID('ouro')

            msg.edit({
                embed: embed,
                buttons: [buttonBronze, buttonPrata, buttonOuro]
            }).catch(err => console.log("Não consegui editar mensagem `casar`", err));

            const filterBronze = (buttonBronze) => buttonBronze.clicker.user.id === message.author.id
            const filterPrata = (buttonPrata) => buttonPrata.clicker.user.id === message.author.id
            const filterOuro = (buttonOuro) => buttonOuro.clicker.user.id === message.author.id

            const collectorBronze = msg.createButtonCollector(filterBronze, {
                time: 90000
            });
            collectorBronze.on('collect', b => {
                b.defer();
                const embed1 = new Discord.MessageEmbed()
                    .setTitle(`💍 Anel de Prata adquirido!`)
                    .setColor(0xf47fff)
                    .setFooter(bot.user.username, bot.user.avatarURL())
                    .setTimestamp();
                return msg.edit({
                    embed: embed1,
                }).catch(err => console.log("Não consegui editar mensagem `casar`", err));
            })

            const collectorPrata = msg.createButtonCollector(filterPrata, {
                time: 90000
            });
            collectorPrata.on('collect', b => {
                b.defer();
                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`💍 Anel de Ouro adquirido!`)
                    .setColor(0xf47fff)
                    .setFooter(bot.user.username, bot.user.avatarURL())
                    .setTimestamp();
                return msg.edit({
                    embed: embed2,
                }).catch(err => console.log("Não consegui editar mensagem `casar`", err));
            })

            const collectorOuro = msg.createButtonCollector(filterOuro, {
                time: 90000
            });
            collectorOuro.on('collect', b => {
                b.defer();
                const embed3 = new Discord.MessageEmbed()
                    .setTitle(`💍 Anel de Diamante adquirido!`)
                    .setColor(0xf47fff)
                    .setFooter(bot.user.username, bot.user.avatarURL())
                    .setTimestamp();
                return msg.edit({
                    embed: embed3,
                }).catch(err => console.log("Não consegui editar mensagem `casar`", err));
            })
        })

    }

    if (target) {

        let tData = bot.data.get(target.id)
        if (!tData) return bot.createEmbed(message, "Este usuário não possui um inventário", null, 0xf47fff)
        if (uData.conjuge != null)
            return bot.createEmbed(message, `Você já é casado com ${bot.data.get(uData.conjuge, 'username')}!`, null, 0xf47fff)
        if (tData.conjuge != null)
            return bot.createEmbed(message, `${tData.username} já é casado com ${bot.data.get(tData.conjuge, 'username')}!`, null, 0xf47fff)
        if (uData.preso > currTime)
            return bot.msgPreso(message, uData)
        if (tData.preso > currTime)
            return bot.msgPreso(message, tData, tData.username)
        if (uData.hospitalizado > currTime)
            return bot.msgHospitalizado(message, uData)
        if (tData.hospitalizado > currTime)
            return bot.msgHospitalizado(message, tData, tData.username)
        if (uData.emRoubo)
            return bot.createEmbed(message, `Você está em um roubo e não pode fazer isto ${bot.config.roubar}`, null, bot.colors.roubar)
        if (tData.emRoubo)
            return bot.createEmbed(message, `**${tData.username}** está em um roubo e não pode fazer isto ${bot.config.roubar}`, null, bot.colors.roubar)
        if (uData.galoEmRinha)
            return bot.createEmbed(message, `Seu galo está em uma rinha e você não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
        if (tData.galoEmRinha)
            return bot.createEmbed(message, `O galo de **${tData.username}** está em uma rinha e ele não pode fazer isto ${bot.config.galo}`, null, bot.colors.white)
        if (uData.job != null)
            return bot.msgTrabalhando(message, uData)
        if (tData.job != null)
            return bot.createEmbed(message, `**${tData.username}** está trabalhando e não pode fazer isto ${bot.config.bulldozer}`, null, 0xf47fff)
        if (message.author.id == target.id)
            return bot.createEmbed(message, `Por mais que você se ame mais que tudo no mundo, não pode casar consigo mesmo`, null, 0xf47fff)
        if (target.id == '526203502318321665') // bot
            return bot.createEmbed(message, `001100011 01101111 01101101 00100000 01110110 01101111 01100011 11000011 10101010 00100000 01101110 11000011 10100011 01101111 <:CrossRoadsLogo:757021182020157571>`, null, 0xf47fff)
        if (uData._anel == null)
            return bot.createEmbed(message, `Você não possui um 💍 Anel! Compre um para fazer um pedido de casamento`, null, 0xf47fff)
        if (tData._anel == null || tData._anel != uData._anel)
            return bot.createEmbed(message, `Seu parceiro não possui um 💍 Anel igual ao seu! Vocês devem possui o mesmo tipo de anel`, null, 0xf47fff)

        const embed = new Discord.MessageEmbed()
            .setTitle(`${emote} Pedido de casamento`)
            .setDescription(`${tData.username}...`)
            .setColor(0xf47fff)
            .setFooter(uData.username, message.author.avatarURL())
            .setTimestamp();

        message.channel.send({
            embeds: [embed]
        }).then(msg => {
            setTimeout(() => {
                embed.setDescription(`${tData.username}... você aceita...`)
                msg.edit({
                    embeds: [embed]
                }).catch(err => console.log("Não consegui editar mensagem `casar`", err));
            }, 3000)

            setTimeout(() => {
                embed.setDescription(`${tData.username}... você aceita... casar comigo? 💍`)
                msg.edit({
                        embeds: [embed]
                    })
                    .catch(err => console.log("Não consegui editar mensagem `casar`", err))
                    .then(msg => {
                        msg.react('572134588340633611') // aceitar
                            .then(() => msg.react('572134589863034884')) // negar
                            .catch(err => console.log("Não consegui reagir mensagem `casar`", err))

                        let filter = (reaction, user) => ['572134588340633611', '572134589863034884'].includes(reaction.emoji.id) && user.id === target.id

                        msg.awaitReactions(filter, {
                                time: 90000,
                                max: 1,
                                errors: ['time'],

                            }).then(reaction => {
                                if (msg) msg.reactions.removeAll().then(async () => {
                                    if (reaction.first()._emoji.id === '572134588340633611') { //aceitar
                                        if (uData.conjuge != null)
                                            return bot.createEmbed(message, `Você já é casado com ${bot.data.get(uData.conjuge, 'username')}!`, null, 0xf47fff)
                                        if (tData.conjuge != null)
                                            return bot.createEmbed(message, `${tData.username} já é casado com ${bot.data.get(tData.conjuge, 'username')}!`, null, 0xf47fff)
                                        if (uData._anel == null)
                                            return bot.createEmbed(message, `Você não possui um 💍 Anel! Compre um para fazer um pedido de casamento`, null, 0xf47fff)
                                        if (tData._anel == null || tData._anel != uData._anel)
                                            return bot.createEmbed(message, `Seu parceiro não possui um 💍 Anel igual ao seu! Vocês devem possui o mesmo tipo de anel`, null, 0xf47fff)

                                        uData._anel = null
                                        tData._anel = null
                                        uData.conjuge = target.id
                                        tData.conjuge = message.author.id

                                        embed.setThumbnail('https://media.discordapp.net/attachments/531174573463306240/862135638945824768/radar_girlfriend.png')
                                            .setTitle(`${emote} Eu vos declaro Casados!`)
                                            .setDescription(`${uData.username}, ${tData.username}, podem se beijar!`)
                                            .setFooter(bot.user.username, bot.user.avatarURL())
                                            .setTimestamp();
                                        return msg.edit({
                                                embeds: [embed]
                                            })
                                            .catch(err => console.log("Não consegui editar mensagem `casar`", err))
                                            .then(() => msg.react('🎉')).catch(err => console.log("Não consegui reagir mensagem `casar`", err))

                                    } else if (reaction.first()._emoji.id === '572134589863034884') {
                                        embed.setTitle(`${emote} Pedido recusado`)
                                            .setDescription(`${tData.username}, ainda conquistarei seu coração!`)
                                        return msg.edit({
                                            embeds: [embed]
                                        }).catch(err => console.log("Não consegui editar mensagem `casar`", err))
                                    }
                                }).catch(err => console.log("Não consegui remover as reações mensagem `casar`", err))
                            })

                            .catch(() => {
                                if (msg) msg.reactions.removeAll().catch(err => console.log("Não consegui remover as reações mensagem `prisao`", err))
                                embed.setTitle(`${emote} Pedido não respondido`)
                                    .setDescription(`${tData.username}, você não me ama?`)
                                msg.edit({
                                    embeds: [embed]
                                }).catch(err => console.log("Não consegui editar mensagem `casar`", err))
                            })
                    })
            }, 6000)
        })
    }

}