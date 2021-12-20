const { Permissions } = require("discord.js");
const Discord = require("discord.js");
const Piii = require("piii");
const piiiFilters = require("piii-filters");

module.exports = (bot, message) => {
  // if (message.author.id != bot.config.adminID && !bot.moderators.includes(message.author.id))
  // 	return

  // if (message.author.id != bot.config.adminID)
  // 	return

  if (message.author.bot) return;

  if (message.channel.type == "DM") return;

  if (
    message.mentions.has(bot.user) &&
    !message.content.startsWith(bot.config.prefix) &&
    !message.mentions.everyone
  )
    return bot.createEmbed(
      message,
      "Olá! Meu prefixo é `;`. Caso não saiba como começar a jogar, use `;ajuda`!"
    );

  if (!message.content.startsWith(bot.config.prefix)) return;

  const args = message.content
    .slice(bot.config.prefix.length)
    .trim()
    .split(/ +/g);

  const command = args.shift().toLowerCase();

  const cmd =
    bot.commands.get(command) ||
    bot.commands.find(
      (cmd) => cmd.config && cmd.config.alias.includes(command)
    );

  if (!cmd) return;

  if (!message?.guild?.me) return;

  bot.data.ensure(message.author.id, bot.defaultCarteira);
  bot.galos.ensure(message.author.id, bot.defaultGalo);

  if (!message.guild.me.permissions.has([Permissions.FLAGS.SEND_MESSAGES]))
    return message.author
      .send(
        "<:badge_cata_bug:799043225557008474> **PERA!** Eu não possuo as permissões necessárias para o jogo rolar belezinha. Contate o Administrador deste Servidor.\n\nAs seguintes permissões são necessárias:\n`Gerenciar mensagens`, `Enviar mensagens`, `Inserir links`, `Usar emojis externos` e `Adicionar reações`"
      )
      .catch((err) =>
        console.log(
          "Não consegui enviar mensagem pv `cadastro` (falta permissão enviar mensagens servidor"
        )
      );

  if (
    !message.guild.me.permissions.has([
      Permissions.FLAGS.MANAGE_MESSAGES,
      Permissions.FLAGS.EMBED_LINKS,
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
      Permissions.FLAGS.ADD_REACTIONS,
    ])
  )
    return bot.createEmbed(
      message,
      "<:badge_cata_bug:799043225557008474> **PERA!** Eu não possuo as permissões necessárias para o jogo rolar belezinha. Contate o Administrador deste Servidor.\n\nAs seguintes permissões são necessárias:\n`Gerenciar mensagens`, `Enviar mensagens`, `Inserir links`, `Usar emojis externos` e `Adicionar reações`"
    );

  let uData = bot.data.get(message.author.id);

  if (uData.username == undefined) {
    const newUser = new Discord.MessageEmbed()
      .setTitle(`Cadastro`)
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/531174573463306240/856211643742945290/CrossRoadsLogo.png"
      )
      .setDescription(
        `Olá **${message.author.username}**, bem vindo ao **Cross Roads**!`
      )
      .addField(
        `Para continuar jogando, defina seu **nick**`,
        `Na próxima mensagem, mande o nick escolhido`
      )
      .setColor("GREEN")
      .setFooter(
        `Proibido: caracteres especiais, emojis, acentos e palavras ofensivas`
      )
      .setTimestamp();

    return message.channel
      .send({
        embeds: [newUser],
      })
      .then((msg) => {
        const filter = (response) => response.author.id == message.author.id;
        const collector = message.channel.createMessageCollector({
          filter,
          time: 180000,
          max: 1,
        });

        collector.on("collect", (m) => {
          let regex = /^[a-zA-Z0-9 !$.,%^&()+=/\\]{3,18}$/gmu;

          const piii = new Piii({
            filters: [...Object.values(piiiFilters), bot.palavrasBanidas],
          });

          let nick = m.content;
          nick.replace(/\s/g, " "); // remove espaço bosta do caraios

          let msgCadastro = `• Use outro comando para reiniciar o cadastro.`;

          if (nick.length < 3)
            return bot.createEmbed(
              message,
              `Escolha um nick maior`,
              `Mínimo de caracteres: 3 ${msgCadastro}`
            );
          if (nick.length > 18)
            return bot.createEmbed(
              message,
              `Escolha um nick menor`,
              `Máximo de caracteres: 18 ${msgCadastro}`
            );
          if (
            nick.toLowerCase().indexOf("jacobi") > -1 ||
            nick.toLowerCase().indexOf("cross roads") > -1 ||
            nick.toLowerCase() == "user"
          )
            return bot.createEmbed(
              message,
              `Este nick é reservado`,
              `Escolha outro nick ${msgCadastro}`
            );
          if (
            nick.indexOf("@") > -1 ||
            nick.indexOf(":") > -1 ||
            nick.indexOf(";") > -1 ||
            nick.indexOf("`") > -1 ||
            nick.indexOf("_") > -1 ||
            nick.indexOf("*") > -1 ||
            nick.toLowerCase().indexOf("iii") > -1 ||
            nick.toLowerCase().indexOf("lll") > -1 ||
            nick.toLowerCase().indexOf("lilil") > -1 ||
            nick.indexOf("  ") > -1 ||
            nick.toLowerCase().indexOf("granada") > -1 ||
            nick.toLowerCase().indexOf("semgranada") > -1
          )
            return bot.createEmbed(
              message,
              `Este nick é inválido`,
              `Escolha outro nick ${msgCadastro}`
            );
          if (!regex.test(nick))
            return bot.createEmbed(
              message,
              "Este nick é inválido",
              `Escolha outro nick ${msgCadastro}`
            );

          for (let [id, user] of bot.data) {
            if (
              user.username != undefined &&
              nick.toLowerCase() == user.username.toLowerCase()
            )
              return bot.createEmbed(
                message,
                `Este nick já está em uso`,
                `Escolha outro nick ${msgCadastro}`
              );
          }

          if (piii.has(nick))
            return bot.createEmbed(
              message,
              `Escolha um nick maior`,
              `Palaras ofensivas não são aceitas ${msgCadastro}`
            );

          collector.stop();

          bot
            .createEmbed(
              message,
              `Deseja confirmar o nick **${nick}**?\n\nVocê não poderá alterá-lo depois!`,
              `Caso queira outro, utilize outro comando`
            )
            .then((msg) => {
              msg
                .react("✅")
                .catch((err) =>
                  console.log("Não consegui reagir mensagem `cadastro`")
                )
                .then((r) => {
                  const filter = (reaction, user) =>
                    reaction.emoji.name === "✅" &&
                    user.id == message.author.id;
                  const confirm = msg.createReactionCollector({
                    filter,
                    max: 1,
                    time: 90000,
                    errors: ["time"],
                  });

                  confirm.on("collect", (r) => {
                    if (msg)
                      msg.reactions
                        .removeAll()
                        .catch((err) =>
                          console.log(
                            "Não consegui remover as reações mensagem `cadastro`"
                          )
                        );
                    bot.data.set(message.author.id, nick, "username");
                    bot.createEmbed(
                      message,
                      `Seu **nick** foi definido como **${nick}**!\nAgora você deverá escolher uma classe!`,
                      `Use ;classe para continuar`,
                      "GREEN"
                    );
                    return bot.log(
                      message,
                      new Discord.MessageEmbed()
                        .setTitle("Novo jogador registrado!")
                        .setDescription(
                          `**Nick: ${bot.data.get(
                            message.author.id,
                            "username"
                          )}**`
                        )
                        .setColor(bot.colors.admin)
                    );
                  });
                });
            });
        });
      })
      .catch((err) => console.log("Não consegui enviar mensagem `cadastro`"));
  }

  if (uData.classe == undefined) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Escolha de Classe`)
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/531174573463306240/856211643742945290/CrossRoadsLogo.png"
      )
      .setColor("GREEN")
      .setTimestamp()
      .setDescription(
        `Olá **${uData.username}**, bem vindo à Temporada 6 do **Cross Roads**!\n\nAntes de continuar jogando você deve escolher uma **Classe**`
      );

    message.author
      .send({
        embeds: [embed],
      })
      .catch((err) =>
        message
          .reply(
            "Ops... não consigo te mandar mensagens no PV. Verifique suas configurações e use algum comando novamente"
          )
          .catch((err) => console.log("Não consegui enviar mensagem `classe`"))
      );

    Object.values(bot.classes).forEach((classe) => {
      message.author
        .send({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle(classe.desc)
              .setColor(classe.cor)
              .setThumbnail(classe.imagem)
              .addField("Positivo", classe.buff)
              .addField("Negativo", classe.debuff),
          ],
        })
        .catch((err) => console.log("Não consegui enviar mensagem `classe`"));
    });

    message.channel
      .send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `**${uData.username}** chegou a hora de você escolher uma **Classe**! Te mandei as opções no privado!`
            )
            .setFooter(bot.user.username, bot.user.avatarURL())
            .setTimestamp(),
        ],
      })
      .catch((err) => console.log("Não consegui enviar mensagem `classe`"));

    const escolha = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`Clique na classe que você deseja escolher!`);

    return message.author
      .send({
        embeds: [escolha],
      })
      .then((msg) => {
        msg
          .react(bot.classes.ladrao.emote)
          .then(() => msg.react(bot.classes.advogado.emote))
          .then(() => msg.react(bot.classes.mafioso.emote))
          .then(() => msg.react(bot.classes.empresario.emote))
          .then(() => msg.react(bot.classes.assassino.emote))
          .then(() => msg.react(bot.classes.mendigo.emote))
          .catch((err) =>
            console.log("Não consegui reagir mensagem `cadastro classe`")
          );

        let filter = (reaction, user) =>
          [
            bot.classes.ladrao.emote,
            bot.classes.advogado.emote,
            bot.classes.mafioso.emote,
            bot.classes.empresario.emote,
            bot.classes.assassino.emote,
            bot.classes.mendigo.emote,
          ].includes(reaction.emoji.id) && user.id === message.author.id;

        const collector = msg.createReactionCollector({
          filter,
          time: 180000,
          max: 1,
          errors: ["time"],
        });

        collector.on("collect", (r) => {
          if (bot.data.has(message.author.id, "classe"))
            return message.channel
              .send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Você já escolheu uma classe!`)
                    .setFooter(bot.user.username, bot.user.avatarURL())
                    .setTimestamp(),
                ],
              })
              .catch((err) =>
                console.log("Não consegui enviar mensagem `classe`")
              );

          let escolha = r.emoji.id;
          let classeEscolhida;
          if (escolha === bot.classes.ladrao.emote) classeEscolhida = "ladrao";
          if (escolha === bot.classes.advogado.emote)
            classeEscolhida = "advogado";
          if (escolha === bot.classes.mafioso.emote)
            classeEscolhida = "mafioso";
          if (escolha === bot.classes.empresario.emote)
            classeEscolhida = "empresario";
          if (escolha === bot.classes.assassino.emote)
            classeEscolhida = "assassino";
          if (escolha === bot.classes.mendigo.emote)
            classeEscolhida = "mendigo";

          const escolhido = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `Você escolheu a classe **${bot.classes[classeEscolhida].desc}**!`
            )
            .setFooter(`Use ;ajuda para começar a jogar Cross Roads!`);

          msg.delete();
          message.author.send({
            embeds: [escolhido],
          });
          bot.data.set(message.author.id, classeEscolhida, "classe");

          return bot.data.get(message.author.id, "classeAlterada") > 0
            ? bot.log(
                message,
                new Discord.MessageEmbed()
                  .setTitle(`${uData.username} alterou sua classe`)
                  .setDescription(`Classe escolhida: **${classeEscolhida}**`)
                  .setColor(bot.colors.admin)
              )
            : bot.log(
                message,
                new Discord.MessageEmbed()
                  .setTitle(`${uData.username} definiu a classe`)
                  .setDescription(`**Classe escolhida: ${classeEscolhida}**`)
                  .setColor(bot.colors.admin)
              );
        });
      })
      .catch((err) =>
        message
          .reply(
            "Ops... não consigo te mandar mensagens no PV. Verifique suas configurações e use algum comando novamente"
          )
          .catch(
            (er) =>
              `Não consegui responder ${uData.username} nem no PV nem no canal`
          )
      );
  }

  if (bot.isPlayerMorto(uData)) return;

  if (!bot.isComandoUsavelViagem(message)) return bot.isPlayerViajando(uData);

  if (!uData.dataInicio || uData.dataInicio == "") {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    bot.data.set(message.author.id, `${day}/${month}/${year}`, "dataInicio");
  }

  let isServerCrossRoads = message.member?.guild?.id === "529674666692837378";

  let jogador = message.member?.guild?.roles?.cache?.find(
    (role) => role.id === "824341916929622017"
  );
  if (isServerCrossRoads && jogador)
    message.guild?.members?.cache
      ?.get(message.author.id)
      .roles.add(jogador)
      .catch((err) =>
        console.log(
          "Não consegui adicionar o cargo Jogador de " + message.author.id
        )
      );

  let booster = message.member?.roles?.cache.has(
    (role) => role.id === "758691633544953936"
  ); //cargo booster
  let isBooster = isServerCrossRoads && booster;

  let isVip = uData.vipTime > new Date().getTime();
  let vip = message.member?.guild?.roles?.cache?.find(
    (role) => role.id === "529680357591613442"
  );
  let hasVipRole = message.member?.roles?.cache?.has(
    (role) => role.id === "529680357591613442"
  );
  let isVipWithoutRole = isServerCrossRoads && !hasVipRole && isVip;
  let isNotVipAnymoreButWithRole = isServerCrossRoads && hasVipRole && !isVip;

  if (
    isServerCrossRoads &&
    uData.username != message.member.nickname &&
    message.author.id !== bot.config.adminID
  ) {
    if (
      message.guild?.me?.permissions?.has([
        Permissions.FLAGS.MANAGE_NICKNAMES,
        Permissions.FLAGS.CHANGE_NICKNAME,
      ])
    )
      message.guild?.members?.cache
        ?.get(message.author.id)
        .setNickname(uData.username)
        .catch((err) =>
          console.log("Não consegui setar o nickname de " + message.author.id)
        );
  }

  if (isServerCrossRoads && isVipWithoutRole)
    message.guild?.members?.cache
      ?.get(message.author.id)
      .roles?.add(vip)
      .catch((err) =>
        console.log(
          "Não consegui adicionar o cargo VIP de " + message.author.id
        )
      );

  if (isServerCrossRoads && isNotVipAnymoreButWithRole)
    message.guild?.members?.cache
      ?.get(message.author.id)
      .roles?.remove(vip)
      .catch((err) =>
        console.log("Não consegui remover o cargo VIP de " + message.author.id)
      );

  // Se tá no cooldown
  if (bot.talkedRecently.has(message.author.id)) {
    // if (bot.moderators.includes(message.author.id))
    //   return message
    //     .reply("Moderador, você deve esperar 1 segundo entre cada comando.")
    //     .then((m) => setTimeout(() => m.delete(), 900))
    //     .catch(
    //       (er) =>
    //         `Não consegui responder ${uData.username}. \`Mensagem Cooldown\``
    //     );
    // else
      return message
        .reply("Você deve esperar 3 segundos entre cada comando.")
        .then((m) => setTimeout(() => m.delete(), 2700))
        .catch(
          (er) =>
            `Não consegui responder ${uData.username}. \`Mensagem Cooldown\``
        );
  }

  bot.onlineNow.set(message.author.id, new Date().getTime());
  bot.talkedRecently.add(message.author.id);
  // console.log(message.author.username, command, args)

  cmd.run(bot, message, args);

  if (isVip || isBooster || bot.isAdmin(message.author.id) || bot.isMod(message.author.id))
    bot.talkedRecently.delete(message.author.id);

  else setTimeout(() => bot.talkedRecently.delete(message.author.id), 3250);

  const embed = new Discord.MessageEmbed()
    .setAuthor(
      bot.data.has(message.author.id, "username")
        ? `${uData.username} (${message.author.id})`
        : `${message.author.username} (${message.author.id})`,
      message.author.avatarURL()
    )
    .setDescription(
      `${
        bot.data.has(message.author.id, "username")
          ? uData.username
          : message.author.username
      } **${message.content}**`
    )
    .setColor(bot.colors.background)
    .setFooter(
      `Servidor ${message.guild.name}. Canal #${message.channel.name}`,
      message.guild.iconURL()
    )
    .setTimestamp();

  bot.channels.cache
    .get("564988393713303579")
    .send({
      embeds: [embed],
    })
    .catch((err) => console.log("Não consegui fazer log de ", command, args));
};
