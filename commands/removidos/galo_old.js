const Discord = require("discord.js");
exports.run = async (bot, message, args) => {

  uData = bot.data.get(message.author.id);
  uID = message.author.id;
  let target = message.mentions.members.first();
  let time = new Date().getTime();
  let option = args[0];
  let aposta = args[1];

  if (uData.galo == 0 || !bot.data.has(message.author.id, "galo")) { // se o user nao tem galo ainda
    uData.galo = 1;
    uData.galoPower = 30;
    uData.tempoRinha = 0;
    bot.data.set(message.author.id, uData);
    return bot.createEmbed(message, "Você recebeu um galo! :rooster:");
  }

  if (uData.preso > time) {
    let tt = Math.floor((uData.preso - time) / 1000 / 60);
    return bot.createEmbed(message, `Você não pode apostar enquanto estiver preso. Sairá após ${tt} minutos. :clock230: `);
  }

  if (!target) {
    if (!option) { // mostrar info do galo 
      let t = Math.floor((uData.tempoRinha - time) / 1000 / 60);
      const embed = new Discord.RichEmbed()
        .setTitle((bot.data.has(message.author.id, "galoNome") ? `Galo "${uData.galoNome}" de ${uData.nome} :rooster:` :
          `Galo de ${uData.nome} :rooster:`))
        .setDescription((uData.galoTit == undefined ? "**Título:** Garnizé" : `**Título:** ${uData.galoTit}`) +
          `\n**Nível: **${uData.galoPower - 30}` +
          `\n**Chance de vitória: **${uData.galoPower}%` +
          (t < 0 ? "\n**Pronto pra peleia**" : `\n**Tempo até descansar: ** ${t} minutos`))
        .setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530191738690732033/unknown.png")
        .setColor(message.member.displayColor)
        //.addField("Stats", "**ATK**: 0/10 | **DEF**: 0/10\n**SPD**: 0/10 | **RES**: 0/10")

        .setFooter(message.member.displayName, message.member.user.avatarURL)
        .setTimestamp();
      return message.channel.send({
        embed
      });

    } else if (option == "nome") { // setar nome
      if (!args[1]) {
        return bot.createEmbed(message, "Insira um nome para seu galo! :rooster:");
      
      } else {
        let nome = args.join(" ").replace(args[0], "");
        nome = nome.substring(1, nome.length);
        
        if (nome.length > 20) {
          return bot.createEmbed(message, "O nome escolhido é muito grande, escolha um menor. :rooster:");
        
        } else {
          let nome = args.join(" ").replace(args[0], "");
          nome = nome.substring(1, nome.length);
          uData.galoNome = nome;
          bot.data.set(message.author.id, uData);
          return bot.createEmbed(message, `Você nomeou seu galo como **${uData.galoNome}**! :rooster:`);
        }
      }

    } else if (option == "titulo") { // setar titulo
      if (!args[1]) {
        return bot.createEmbed(message, "Insira um título para seu galo! :rooster:");
      
      } else {
        let titulo = args.join(" ").replace(args[0], "");
        titulo = titulo.substring(1, titulo.length);
        
        if (titulo.length > 20) {
          return bot.createEmbed(message, "O título escolhido é muito grande, escolha um menor. :rooster:");
        
        } else {
          let titulo = args.join(" ").replace(args[0], "");
          titulo = titulo.substring(1, titulo.length);
          uData.galoTit = titulo;
          bot.data.set(message.author.id, uData);
          return bot.createEmbed(message, `Você deu o título de **${uData.galoTit}** para seu galo! :rooster:`);
        }
      }

    } else if (option == "info") { // ter infos sobre os galos

      const embed = new Discord.RichEmbed()
        .setTitle("Informações sobre os galos")
        .setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530616556518899722/unknown.png")
        .setColor(message.member.displayColor)
        .addField("Como funciona", "Você recebeu um galo de combate!\n" +
          "Ele começa no nível 0 e avançará 1 nível ao ganhar uma luta.\n" +
          "Do nível 25 em diante, seu galo perderá níveis se perder as lutas.\n" +
          "O nível máximo que ele pode atingir é 40.\n" +
          `Você pode comprar ${bot.config.whey} **Whey Protein** na loja, que aumenta o nível dele em 1.\n` +
          "O valor do Whey aumenta com base no nível do seu galo.\n" +
          "Após cada luta, seu galo precisará descansar por 1h para se recuperar.")

        .addField("Comandos", "`;galo (usuário)` Vê informações sobre um galo\n" +
          "`;galo nome [novo-nome]` Escolhe um nome para seu galo\n" +
          "`;galo titulo [novo-titulo]` Escolhe um título para seu galo\n" +
          "`;galo rinha [valor]` Coloca seu galo numa luta.\n" +
          "`;galo desafio [valor] [usuário]` Desafia um usuário para uma luta 1x1.")

        .setFooter(message.member.displayName, message.member.user.avatarURL)
        .setTimestamp();
      return message.channel.send({
        embed
      });

    } else if (option == "rinha") { // apostar contra o pc
      uData = bot.data.get(message.author.id);

      if (uData.tempoRinha > time) {
        let t = Math.floor((uData.tempoRinha - time) / 1000 / 60);
        return bot.createEmbed(message, `Seu galo está descansando. Ele estará pronto para outra briga em ${t} minutos. :rooster:`);
      }

      if ((uData.moni) < 1) {
        return bot.createEmbed(message, `Você não tem ${bot.config.coin} suficiente para apostar.`);

      } else if (aposta <= 0 || (aposta % 1 != 0)) {
        return bot.createEmbed(message, "O valor inserido não é válido.");

      } else if (aposta > 10000) {
        return bot.createEmbed(message, `O valor máximo de apostas é 10000 ${bot.config.coin}.`);

      } else {
        if (parseFloat(uData.moni) < aposta) {
          return bot.createEmbed(message, "Você não tem esse valor para apostar.");
        }

        let fight;

        // _jetpack = sorte +10%
        if (uData._jetpack > time) {
          fight = (bot.getRandom(0, 100) < (uData.galoPower + uData.galoPower * 0.1) ? "win" : "lose");
        
        } else {
          fight = (bot.getRandom(0, 100) < uData.galoPower ? "win" : "lose");
        }

        if (fight == "win") {
          if (uData.galoPower >= 70) {
            uData.moni += parseInt(aposta);
            uData.betW++;
            bot.createEmbed(message, `**${uData.galoNome}** venceu a rinha e você recebeu ${aposta}${bot.config.coin}.\nEle está no nível 40, e não poderá upar mais! :rooster:`);
          
          } else {
            uData.galoPower++;
            uData.moni += parseInt(aposta);
            uData.betW++;
            bot.createEmbed(message, `**${uData.galoNome}** venceu a rinha e você recebeu ${aposta}${bot.config.coin}.\nEle subiu para o nível ${uData.galoPower - 30}! :rooster:`);
          }

        } else {
          if (uData.galoPower >= 55)
            uData.galoPower -= 1;
          uData.moni -= parseInt(aposta);
          uData.betL++;
          bot.createEmbed(message, `**${uData.galoNome}** perdeu a rinha e você perdeu ${aposta}${bot.config.coin}.`);
        }

        uData.tempoRinha = time + 3600000;
        setTimeout(function () {
          (message.reply(`seu galo está pronto para mais uma feroz batalha! :rooster:`))
        }, uData.tempoRinha - time);
      }
    }

  } else if (option == "desafio") { // desafiar outros players
    let alvo = (target ? target.user : message.author);
    let tData = bot.data.get(alvo.id);
    let userT = tData;
    let userD = uData;
    
    if (!target) {
      bot.createEmbed(message, "Você deve escolher uma pessoa para desafiar. :rooster:")

    } else {
      if (!userT)
        return bot.createEmbed(message, "Este usuário não tem um galo. :rooster:");

      if (message.author.id == target.id)
        return bot.createEmbed(message, "Seu galo não pode ir para a rinha sozinho. :rooster:");

      if (userD.tempoRinha > time) {
        let t = Math.floor((userD.tempoRinha - time) / 1000 / 60);
        return bot.createEmbed(message, `Seu galo está descansando. Ele estará pronto para outra briga em ${t} minutos. :rooster:`);
      }
      if (userT.tempoRinha > time) {
        let t = Math.floor((userT.tempoRinha - time) / 1000 / 60);
        return bot.createEmbed(message, `O galo de **${userT.nome}** está descansando. Ele estará pronto para outra briga em ${t} minutos. :rooster:`);
      }

      if (userD.moni < 1) {
        return bot.createEmbed(message, `Você não tem ${bot.config.coin} suficiente para apostar.`);

      } else if (userT.preso > time) {
        let tt = Math.floor((userT.preso - time) / 1000 / 60);
        return bot.createEmbed(message, `${userT.nome} não pode apostar enquanto estiver preso. Sairá após ${tt} minutos. :clock230: `);

      } else if (aposta <= 0 || (aposta % 1 != 0)) {
        return bot.createEmbed(message, "O valor inserido não é válido.");

      } else if (aposta > 50000) {
        return bot.createEmbed(message, `O valor máximo de apostas é 50000${bot.config.coin}.`);

      } else if (userT.moni < 1) {
        return bot.createEmbed(message, `**${userT.nome}** não tem ${bot.config.coin} suficiente para apostar.`);

      } else {
        if (parseFloat(userD.moni) < aposta) {
          return bot.createEmbed(message, "Você não tem esse valor para apostar.");
        }
        if (parseFloat(userT.moni) < aposta) {
          return bot.createEmbed(message, `**${userT.nome}** não tem esse valor para apostar.`);
        }
        bot.createEmbed(message, `**${userD.nome}** desafiou **${userT.nome}** para uma rinha 1x1 valendo ${aposta}${bot.config.coin}. \n` + "Responda `aceitar` ou ignore.")
          .then(() => {
            message.channel.awaitMessages(response => response.content === 'aceitar' && response.author.id == alvo.id, {
                max: 1,
                time: 30000,
                errors: ['time'],
              })
              .then((collected) => {
                bot.createEmbed(message, `**${userT.nome}** aceitou o desafio!`); //${collected.first().content} 

                let random1 = bot.getRandom(0, 100);
                let random2 = bot.getRandom(0, 100);

                let fight = (random1 * userD.galoPower > random2 * userT.galoPower ? "u" : "t");

                let textos = [
                  `**${userD.galoNome}** começa a luta atacando **${userT.galoNome}** no queixo!`,
                  `**${userT.galoNome}** começa a luta atacando **${userD.galoNome}** no queixo!`,
                  `**${userT.galoNome}** provoca **${userD.galoNome}** chamando ele de galinha!`,
                  `**${userD.galoNome}** provoca **${userT.galoNome}** chamando ele de galinha!`,
                  `**${userD.galoNome}** falou que é filho do Caramuru!`,
                  `**${userT.galoNome}** falou que é filho do Caramuru!`,
                  `**${userD.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`,
                  `**${userT.galoNome}** disse que quem toma Whey pra subir de nível é pinto pequeno!`
                ]

                setTimeout(function () {
                  (message.channel.send(textos[Math.floor(Math.random() * textos.length)]))
                }, 1000);

                if (userD.galoPower > userT.galoPower) { //gera textos de batalha
                  setTimeout(function () {
                    (message.channel.send(random1 >= random2 ?
                      `**${userD.galoNome}** voou por incríveis 2 segundos e deixou **${userT.galoNome}** perplecto!` :
                      `**${userT.galoNome}** ciscou palha no olho de **${userD.galoNome}** e aproveitou para um ataque surpresa!`))
                  }, 5000);

                } else if (userD.galoPower < userT.galoPower) {
                  setTimeout(function () {
                    (message.channel.send(random1 >= random2 ?
                      `**${userD.galoNome}** arrancou o olho de **${userT.galoNome}**! Por sorte era o olho ruim.` :
                      `**${userT.galoNome}** deu um rasante em **${userD.galoNome}** arrancando várias de suas penas!`))
                  }, 5000);

                } else {
                  setTimeout(function () {
                    (message.channel.send(random1 >= random2 ?
                      `**${userD.galoNome}** não sabe como atacar **${userT.galoNome}**! Eles já estão parados se encarando por 5 minutos!` :
                      `A única diferença entre **${userT.galoNome}** e **${userD.galoNome}** é o nome! Ambos são incrivelmente habilidosos!`))
                  }, 5000);
                }
                setTimeout(function () {
                  (message.channel.send(random1 >= random2 ?
                    `**${userD.galoNome}** acertou um combo de 5 hits em **${userT.galoNome}**!` :
                    `**${userT.galoNome}** aproveitou que **${userD.galoNome}** olhou para uma galinha e deu um mortal triplo carpado!`))
                }, 10000);

                setTimeout(function () {
                  (message.channel.send(random1 > 50 ?
                    `**${userD.galoNome}** usou um golpe especial e **${userT.galoNome}** ficou sem entender nada!` :
                    `**${userT.galoNome}** apanha bastante, mas mostra para **${userD.galoNome}** que pau que nasce torto tanto bate até que fura!`))
                }, 15000);

                setTimeout(function () {
                  (message.channel.send(fight == 'u' ?
                    `**${userD.galoNome}** está implacável e **${userT.galoNome}** já não resiste mais!` :
                    `Os golpes de **${userT.galoNome}** são certeiros e **${userD.galoNome}** está ciente de sua derrota!`))
                }, 20000);

                if (fight == "u") {
                  if (userD.galoPower >= 70) {
                    userD.moni += parseInt(aposta);
                    userT.moni -= parseInt(aposta);
                    userD.betW++;
                    userT.betL++;
                    setTimeout(function () {
                      (bot.createEmbed(message, `**${userD.galoNome}** venceu a rinha contra **${userT.galoNome}** e **${userD.nome}** recebeu ${aposta} ${bot.config.coin}!` +
                        ".\nEle está no nível 40, e não poderá upar mais! :rooster:"))
                    }, 25000);

                  } else {
                    userD.galoPower++;
                    if (userT.galoPower >= 55)
                      userT.galoPower -= 1;
                    userD.moni += parseInt(aposta);
                    userT.moni -= parseInt(aposta);
                    userD.betW++;
                    userT.betL++;
                    setTimeout(function () {
                      (bot.createEmbed(message, `**${userD.galoNome}** venceu a rinha contra **${userT.galoNome}** e **${userD.nome}** ganhou ${aposta}${bot.config.coin}!` +
                        `.\n**${userD.galoNome}** subiu para o nível ${userD.galoPower - 30}! :rooster:`))
                    }, 25000);
                  }

                } else {
                  if (userT.galoPower >= 70) {
                    userT.moni += parseInt(aposta);
                    userD.moni -= parseInt(aposta);
                    userT.betW++;
                    userD.betL++;
                    setTimeout(function () {
                      (bot.createEmbed(message, `**${userT.galoNome}** venceu a rinha contra **${userD.galoNome}** e **${userT.nome}** ganhou ${aposta} ${bot.config.coin}!` +
                        `.\n**${userT.galoNome}** está no nível 40, e não poderá upar mais! :rooster:`))
                    }, 25000);

                  } else {
                    userT.galoPower++;
                    if (userD.galoPower >= 55)
                      userD.galoPower -= 1;
                    userT.moni += parseInt(aposta);
                    userD.moni -= parseInt(aposta);
                    userT.betW++;
                    userD.betL++;
                    setTimeout(function () {
                      (bot.createEmbed(message, `**${userT.galoNome}** venceu a rinha contra **${userD.galoNome}** e **${userT.nome}** ganhou ${aposta}${bot.config.coin}!` +
                        `.\n**${userT.galoNome}** subiu para o nível ${userT.galoPower - 30}! :rooster:`))
                    }, 25000);
                  }
                }

                userD.tempoRinha = time + 3600000;
                userT.tempoRinha = time + 3600000;
                bot.data.set(uID, userD);
                bot.data.set(target.id, userT);

                setTimeout(function () {
                  (message.reply("seu galo está pronto para mais uma feroz batalha! :rooster:"))
                }, userD.tempoRinha - time);

                setTimeout(function () {
                  (message.channel.send(`<@${target.id}> seu galo está pronto para mais uma feroz batalha! :rooster:`))
                }, userT.tempoRinha - time);

              })

              .catch(() => {
                bot.createEmbed(message, `**${userT.nome}** não respondeu. Ou ele está offline ou é um frangote.`);
              });
          });
      }
    }

  } else { // mostra info do galo do target
    let tData = bot.data.get(target.id)
    let t = Math.floor((tData.tempoRinha - time) / 1000 / 60);

    const embed = new Discord.RichEmbed()
      .setTitle((tData.galoNome == undefined ? `Galo de ${tData.nome} :rooster:` :
        `Galo "${tData.galoNome}" de ${tData.nome} :rooster:`))
      .setDescription((tData.galoTit == undefined ? "**Título:** Garnizé" : `**Título:** ${tData.galoTit}`) +
        `\n**Nível: ** ${tData.galoPower - 30}` +
        `\n**Chance de vitória: ** ${tData.galoPower}%` +
        (t < 0 ? "\n**Pronto pra peleia**" : `\n**Tempo até descansar: ** ${t} minutos`))
      .setThumbnail("https://cdn.discordapp.com/attachments/529674667414519810/530191738690732033/unknown.png")
      .setColor(message.member.displayColor)
      //.addField("Stats", "**ATK**: 0/10 | **DEF**: 0/10\n**SPD**: 0/10 | **RES**: 0/10")
      .setFooter(message.member.displayName, message.member.user.avatarURL)
      .setTimestamp();

    return message.channel.send({
      embed
    });

  }
  bot.data.set(message.author.id, uData);
};