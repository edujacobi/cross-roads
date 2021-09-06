exports.run = async (bot, message, args) => {
  if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return
  message.delete()
  let text = args.join(" ")
  return message.channel.send(text).catch(err => console.log("Não consegui enviar mensagem `say`", err))
}