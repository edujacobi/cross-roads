exports.run = async (bot, message, args) => {
  if (!(message.author.id == bot.config.adminID) && !(message.author.id == '405930523622375424')) return
  message.delete()
  const Piii = require("piii")
  const piiiFilters = require("piii-filters")
  const piii = new Piii({
    filters: [
      ...Object.values(piiiFilters),
      ['arrombado', 'viado', 'fdp', 'buceta', 'puta', 'caralh', 'filhadaputagem', 'filhodaputa', 'nazista',
        'fudido', 'verme', 'cuzin', 'fuder', 'biscate', 'meretriz', 'retardado', 'prostituta', 'vsf', 'vsfd',
        'estrupar', 'estripar', 'estuprar', 'vadia', 'piranha', 'cadela', 'vagabunda', 'mongol'
      ]
    ],
    censor: badWord => {
      // return badWord.charAt(0) + "*".repeat(badWord.length - 1)
      let words = [
				'amor', 'abraço', 'amo', 'flor', 'flores', 'coração', 'paraíso', 'amizade', 'fofo', 'fofinho',
				'iti malia', 'pão', 'vida', 'UwU', 'te amo', 's-senpai', 'bola', 'futebol', 'lindo', 'maravilhoso',
				'encantador', 'charme', 'nenê', 'chamego', 'gatinho', 'cuti-cuti', 'bonito', 'arco-íris', 'adorável',
				'amável', 'graça', ':3'
			]
      bot.shuffle(words)
      return `\`[${words[0]}]\``
    }
  })

  let text = args.join(" ")
  return message.channel.send(piii.filter(text)).catch(err => console.log("Não consegui enviar mensagem `say`"))
}