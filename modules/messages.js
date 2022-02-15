const Discord = require("discord.js")
module.exports = (bot) => {

	bot.createEmbed = (message, str, str_footer, color) => {
		let uData = bot.data.get(message.author.id)
		
		const embed = new Discord.MessageEmbed()
			.setDescription(str)
			.setColor(color ? color : bot.colors.darkGrey) //message.member.displayColor)
			.setTimestamp()
			.setFooter({
				text: str_footer ?
					(uData?.username ? `${uData.username} • ${str_footer}` : `${message.author.username} • ${str_footer}`) :
					(uData?.username ? uData.username : message.author.username),
				iconURL: message?.member?.user ? message?.member?.user?.avatarURL() : ''
			})
		
		return message.channel.send({embeds: [embed]})
			.catch(() => {
				console.log('Não consegui enviar createEmbed', str)
				message.author.send('Desculpe, não consegui responder seu comando. Verifique as permissões do servidor/canal.\n\nAs seguintes permissões são necessárias:\n`Gerenciar mensagens`, `Enviar mensagens`, `Inserir links`, `Usar emojis externos` e `Adicionar reações`')
					.catch(() => console.log("Não consegui enviar mensagem pv `createEmbed`"))
			})
	}

	bot.isUserEmRouboOuEspancamento = (message, user) => {
		let currTime = new Date().getTime()
		if (!user)
			return console.error("Informe o usuário")
		if (!message)
			return console.error("Informe a mensagem")

		if (user.emRoubo.tempo > currTime) {
			let roubado = !isNaN(user.emRoubo.user) ? bot.data.get(user.emRoubo.user, 'username') : user.emRoubo.user

			if (user.emRoubo.isAlvo) {
				bot.createEmbed(message, `Você está sendo roubado por **${roubado}** e não pode fazer isto ${bot.config.roubar}`, null, bot.colors.roubar)
				return true

			}
			else {
				bot.createEmbed(message, `Você está roubando **${roubado}** e não pode fazer isto ${bot.config.roubar}`, null, bot.colors.roubar)
				return true
			}
		}
		if (user.emEspancamento.tempo > currTime) {
			let espancado = !isNaN(user.emEspancamento.user) ? bot.data.get(user.emEspancamento.user, 'username') : user.emEspancamento.user

			if (user.emEspancamento.isAlvo) {
				bot.createEmbed(message, `Você está sendo espancado por **${espancado}** e não pode fazer isto ${bot.config.espancar}`, null, bot.colors.espancar)
				return true

			}
			else {
				bot.createEmbed(message, `Você está espancando **${espancado}** e não pode fazer isto ${bot.config.espancar}`, null, bot.colors.espancar)
				return true
			}
		}

		return false
	}

	bot.isAlvoEmRouboOuEspancamento = (message, user) => {
		let currTime = new Date().getTime()
		if (!user)
			return console.error("Informe o usuário")
		if (!message)
			return console.error("Informe a mensagem")

		if (user.emRoubo.tempo > currTime) {
			let roubado = !isNaN(user.emRoubo.user) ? bot.data.get(user.emRoubo.user, 'username') : user.emRoubo.user

			if (user.emRoubo.isAlvo) {
				bot.createEmbed(message, `**${user.username}** está sendo roubado por **${roubado}**. Espere mais ${bot.segToHour((user.emRoubo.tempo - currTime) / 1000)} para iniciar sua ação ${bot.config.roubar}`, null, bot.colors.roubar)
				return true

			}
			else {
				bot.createEmbed(message, `**${user.username}** está roubando **${roubado}.** Espere mais ${bot.segToHour((user.emRoubo.tempo - currTime) / 1000)} para iniciar sua ação ${bot.config.roubar}`, null, bot.colors.roubar)
				return true
			}
		}
		if (user.emEspancamento.tempo > currTime) {
			let espancado = !isNaN(user.emEspancamento.user) ? bot.data.get(user.emEspancamento.user, 'username') : user.emEspancamento.user

			if (user.emEspancamento.isAlvo) {
				bot.createEmbed(message, `**${user.username}** está sendo espancado por **${espancado}**. Espere mais ${bot.segToHour((user.emEspancamento.tempo - currTime) / 1000)} para iniciar sua ação ${bot.config.espancar}`, null, bot.colors.espancar)
				return true

			}
			else {
				bot.createEmbed(message, `**${user.username}** está espancando **${espancado}**. Espere mais ${bot.segToHour((user.emEspancamento.tempo - currTime) / 1000)} para iniciar sua ação ${bot.config.espancar}`, null, bot.colors.espancar)
				return true
			}
		}

		return false
	}

	bot.msgPreso = (message, uData, username) => {
		let currTime = new Date().getTime()
		return bot.createEmbed(message, `${username ?? 'Você'} está preso por mais ${bot.segToHour((uData.preso - currTime) / 1000)} e não pode fazer isto ${bot.config.prisao}`, null, bot.colors.policia)
	}

	bot.msgHospitalizado = (message, uData, username) => {
		let currTime = new Date().getTime()
		return bot.createEmbed(message, `${username ?? 'Você'} está hospitalizado por mais ${bot.segToHour((uData.hospitalizado - currTime) / 1000)} e não pode fazer isto ${bot.config.hospital}`, null, bot.colors.hospital)
	}

	bot.msgTrabalhando = (message, uData, username) => {
		let currTime = new Date().getTime()
		let minutes = (uData.jobTime - currTime) / 1000
		if (minutes < 0)
			return bot.createEmbed(message, `${username ?? 'Você'} deve receber seu salário antes de fazer isto ${bot.config.bulldozer}`, null, 'YELLOW')

		return bot.createEmbed(message, `${username ?? 'Você'} está trabalhando por mais ${bot.segToHour(minutes)} e não pode fazer isto ${bot.config.bulldozer}`, bot.jobs[uData.job].desc, 'YELLOW')
	}

	bot.msgSemDinheiro = (message, username) => bot.createEmbed(message, `${username ?? 'Você'} não tem dinheiro suficiente para fazer isto`)

	bot.msgValorInvalido = (message) => bot.createEmbed(message, "O valor inserido é inválido")

	bot.msgDinheiroMenorQueAposta = (message, username) => bot.createEmbed(message, `${username ?? 'Você'} não tem esta quantidade de dinheiro para fazer isto`)

	bot.msgGaloDescansando = (message, uGalo, username) => {
		let currTime = new Date().getTime()
		return username ?
			bot.createEmbed(message, `O galo de ${username} está descansando. Ele poderá rinhar/treinar novamente em ${bot.segToHour((uGalo.descansar - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white) :
			bot.createEmbed(message, `Seu galo está descansando. Ele poderá rinhar/treinar novamente em ${bot.segToHour((uGalo.descansar - currTime) / 1000)} ${bot.config.galo}`, null, bot.colors.white)
	}

	let comandosViagem = ['eval', 'admin', 'money', 'ficha', 'setgun', 'setnick', 'liberar', 'comunicar', 'trocarconta', 'stats', 'matar', 'i', 'inv', 'ui', 'userinfo',
		'celular', 'cel', 'buscar', 'procurar', 'ajuda', 'help', 'comandos', 'cmds', 'badges', 'arma', 'armas', 'evento', 'updates', 'invite', 'convite',
		'ping', 'me', 'vip', ' setvip', 'reload', 'say', 'embed', 'top', 'topv', 'tpv', 'tpg', 'topg', 'topvalor', 'topgrana', 'tpf', 'topf', 'topficha',
		'banco', 'casamento', 'casal', 'nos', 'nós', 'investir', 'topnatal', 'topn', 'tpn', 'toppresente', 'avatar']

	bot.isComandoUsavelViagem = (message, args) => {
		if (!message)
			return console.error("Informe a mensagem")

		let user = bot.data.get(message.author.id)
		let uCasamento = bot.casais.get(user.casamentoID)

		if (!uCasamento || uCasamento.viagem < Date.now()) return true

		const argumentos = message.content.slice(bot.config.prefix.length).trim().split(/ +/g)

		const command = args ?? argumentos.shift().toLowerCase()

		if (comandosViagem.includes(command)) return true

		if (!args) bot.msgPlayerViajando(message, user)

		return false
	}

	bot.msgPlayerViajando = (message, user, username) => {
		let uCasamento = bot.casais.get(user.casamentoID)
		bot.createEmbed(message, `${bot.config.aviao} ${username ?? 'Você'} está viajando com ${bot.data.get(user.conjuge, 'username')} e ${username ? 'você não pode fazer nada' : 'não pode realizar nenhuma ação'}`, `Tempo restante: Viajando por mais ${bot.segToHour((uCasamento.viagem - Date.now()) / 1000)}`, bot.colors.casamento)
	}

	bot.isPlayerViajando = (user) => {
		if (!user)
			return console.error("Informe o usuário")

		let uCasamento = bot.casais.get(user.casamentoID)

		return !(!uCasamento || uCasamento.viagem < Date.now())
	}

	bot.isPlayerMorto = (user) => {
		if (!user)
			return console.error("Informe o usuário")

		return user.morto >= Date.now()
	}

	bot.msgPlayerMorto = (message, username) => bot.createEmbed(message, `🪦 ${username ?? 'Você'} está morto e não pode fazer isto.`)
}