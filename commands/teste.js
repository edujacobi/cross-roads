// const Discord = require("discord.js")

// const Piii = require("piii")
// const piiiFilters = require("piii-filters")

exports.run = async (bot, message, args) => {

	if (!bot.isAdmin(message.author.id)) return
	const tres_dias = 259200000
// 	// setTimeout(() => {
// 	// bot.banco.set('caixa', 500000)
// 	// bot.banco.set('cassino', 200000)
// 	// // bot.createEmbed(message, `R$ 200.000.000 foram transferidos do ${bot.config.cash} Banco para o caixa do ${bot.config.mafiaCasino} Cassino`)

// 	// bot.gangs.clear()

// 	// bot.bilhete.clear()
// 	// bot.bilhete.set('diaUltimoSorteio', 6)
// 	// bot.bilhete.set('lastWinner', null)
// 	// bot.bilhete.set('acumulado', 0)
// 	// bot.gangs.forEach((gang, id) => {
// 	// 	gang.caixa = 0
// 	// 	gang.estoque = 0
// 	// 	bot.gangs.set(id, gang)
// 	// })

// 	// let currTime = new Date().getTime()

// 	// const piii = new Piii({
// 	// 	filters: [
// 	// 		...Object.values(piiiFilters),
// 	// 		['arrombado', 'viado', 'fdp', 'buceta', 'puta', 'caralh', 'filhadaputagem', 'filhodaputa', 'nazista',
// 	// 			'fudido', 'verme', 'cuzin', 'fuder', 'biscate', 'meretriz', 'retardado', 'prostituta', 'vsf', 'vsfd',
// 	// 			'estrupar', 'estripar', 'estuprar', 'vadia', 'piranha', 'cadela', 'vagabunda', 'mongol', 'piroca',
// 	// 			'fodasse', 'fds', 'tnc', 'bct', 'buseta', 'bucetinha', 'arrombada', 'puto', 'bucetao', 'buceta', 'pinto',
// 	// 			'xereca',
// 	// 		]
// 	// 	],
// 	// })
// 	// let count = 0
// 	// const msg = new Discord.MessageEmbed()
// 	// 	.setTitle(`Você recebeu um cupom!`)
// 	// 	.setColor('GREEN')
// 	// 	.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/816338032872390746/e6bbdbc150d358bf547a0b810715cb27.png')
// 	// 	//.setImage('https://cdn.discordapp.com/attachments/531174573463306240/816337857756528660/cross1.gif')
// 	// 	.setDescription('para entrar no servidor oficial do Cross Roads!!')
// 	// 	.addField(`${bot.badges.bilionario} Últimas novidades`, 'No servidor, são publicadas todas as atualizações realizadas no jogo, saiba tudo que está acontecendo!')
// 	// 	.addField(`${bot.config.caramuru} Eventos`, 'Os eventos são anunciados no servidor! Há eventos quase todo final de semana.\nAlguns eventos exclusivos só acontecem no servidor!')
// 	// 	.addField(`${bot.badges.cataBug} Informe bugs e dê sugestões`, 'O Cross Roads é mantido por uma pessoa só, mas é incentivado por toda a comunidade! Informe bugs chatos e dê sugestões de novas funcionalidades!')
// 	// 	.addField(`${bot.config.dateDrink} Interação com jogadores`, 'O servidor é bastante ativo, contando com membros de diversas gangues! Converse, troque dicas e organize roubos com seus novos amigos!')
// 	// 	.addField("<:CrossRoadsLogo:757021182020157571> Entre agora mesmo", "https://discord.gg/sNf8avn")
// 	// 	.addField(`${bot.badges.topGrana1_s3} Final de temporada`, "A temporada atual será encerrada às **23h59** do dia **6 de Março**! Fique preparado, pois o *reset* acontecerá logo após!")
// 	// 	.setFooter(bot.user.username + " • Clica aí, não dói nada :)", bot.user.avatarURL())
// 	// 	.setTimestamp();

// 	const tresDias = 259200000
// 	const doisDias = 172800000

// 	// bot.galos.forEach((galo, id) => {
// 	// 	if (id != '526203502318321665') {
// 	// 		galo.power = 30
// 	// 		galo.wins = 0
// 	// 		galo.loses = 0
// 	// 		// bot.galos.delete(id, 'raça')
// 	// 		// bot.galos.delete(id, 'nacionalidade')
// 	// 		// bot.galos.delete(id, 'raridade')
// 	// 		bot.galos.set(id, galo)
// 	// 	}
// 	// })

	bot.data.forEach((user, id) => {
		if (user.username != undefined) {
			// bot.data.delete(id, '_9mm')
			// bot.data.delete(id, 'galoPower')
			// bot.data.delete(id, 'galoAvatar')
			// bot.data.delete(id, 'galoNome')
			// bot.data.delete(id, 'galoTit')
			// bot.data.delete(id, 'galoTrain')
			// bot.data.delete(id, 'galoTrainTime')
			// bot.data.delete(id, 'galoEmRinha')
			// bot.data.delete(id, 'galoW')
			// bot.data.delete(id, 'galoL')
			// bot.data.delete(id, 'tempoRinha')
			// bot.data.delete(id, 'presente')
			// user.moni = 0
			// user.ficha = 0
			// user.weekly = 0
			// user.day = 0
			// user._knife = 0
			// user._colt45 = 0
			// user._tec9 = 0
			// user._rifle = 0
			// user._shotgun = 0
			// user._mp5 = 0
			// user._ak47 = 0
			// user._m4 = 0
			// user._sniper = 0
			// user._rpg = 0
			// user._goggles = 0
			// user._exoesqueleto = 0
			// user._katana = 0
			// user._colete = 0
			// user._colete_p = 0
			// user._jetpack = 0
			// user._minigun = 0
			// user._bazuca = 0
			// user._ovo = 0
			// user._ovogranada = 0
			// user.job = null
			if (user.job == null)
				user.jobTime = 0
			// user.roubo = 0
			// user.preso = 0
			// user.fuga = 0
			// user.qtEsmolasDadas = 0
			// user.qtEsmolasRecebidas = 0
			// user.esmolaEntregueHoje = 0
			// user.esmolaRecebidaHoje = 0
			// user.betJ = 0
			// user.betW = 0
			// user.betL = 0
			// user.roubosW = 0
			// user.roubosL = 0
			// user.valorRoubado = 0
			// user.qtFugas = 0
			// user.qtRoubado = 0
			// user.jobGanhos = 0
			// user.lojaGastos = 0
			// user.invest = null
			// user.investTime = 0
			// user.investNotification = null
			// user.investGanhos = 0
			// user.espancarW = 0
			// user.espancarL = 0
			// user.hospitalizado = 0
			// user.espancar = 0
			// user.vasculhar = 0
			// user.vasculharAchou = 0
			// user.qtHospitalizado = 0
			// user.hospitalGastos = 0
			// user.cassinoGanhos = 0
			// user.cassinoPerdidos = 0
			// user.prisaoGastos = 0
			// user.depositoGang = 0
			// user.emRoubo = {
			// 	tempo: 0,
			// 	user: null,
			// 	isAlvo: false
			// }
			// user.emEspancamento = {
			// 	tempo: 0,
			// 	user: null,
			// 	isAlvo: false
			// }
			// // user.morto = 0
			// user._celular = 0
			// user.celularSmsBlock = false
			// user.celularPego = 0
			// user.celularCredito = 0
			// user.nickAlterado = false
			// user.gangID = null
			// user.classeAlterada = 0
			// if (user.vipTime > Date.now())
			// 	user.vipTime += tres_dias * 3

			// if (user.classe != undefined)
			// 	bot.data.delete(id, 'classe')

			// user.fugindo = 0
			// user._flor = 0
			// bot.data.set(id, user)

			// if (user.username != undefined && user.username.length > 18)
			// 		bot.data.delete(id, 'username')

			bot.data.set(id, user)
		}
	})
	// console.log("===")
	message.reply('Concluído! Bem vindo à pré-temporada 7!')

	// }, 1200000)

}