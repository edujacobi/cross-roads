const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

	if (message.author.id != bot.config.adminID) return
	// setTimeout(() => {
		// bot.banco.set('caixa', 1000000)
		// bot.banco.set('cassino', 250000)
		// // bot.createEmbed(message, `R$ 200.000.000 foram transferidos do ${bot.config.cash} Banco para o caixa do ${bot.config.mafiaCasino} Cassino`)

		// bot.gangs.clear()
		// bot.gangs.forEach((gang, id) => {
		// 	gang.caixa = 0
		// 	gang.estoque = 0
		// 	bot.gangs.set(id, gang)
		// })

		let currTime = new Date().getTime()
		// let count = 0
		// const msg = new Discord.MessageEmbed()
		// 	.setTitle(`Você recebeu um cupom!`)
		// 	.setColor('GREEN')
		// 	.setThumbnail('https://cdn.discordapp.com/attachments/531174573463306240/816338032872390746/e6bbdbc150d358bf547a0b810715cb27.png')
		// 	//.setImage('https://cdn.discordapp.com/attachments/531174573463306240/816337857756528660/cross1.gif')
		// 	.setDescription('para entrar no servidor oficial do Cross Roads!!')
		// 	.addField(`${bot.badges.bilionario} Últimas novidades`, 'No servidor, são publicadas todas as atualizações realizadas no jogo, saiba tudo que está acontecendo!')
		// 	.addField(`${bot.config.caramuru} Eventos`, 'Os eventos são anunciados no servidor! Há eventos quase todo final de semana.\nAlguns eventos exclusivos só acontecem no servidor!')
		// 	.addField(`${bot.badges.cataBug} Informe bugs e dê sugestões`, 'O Cross Roads é mantido por uma pessoa só, mas é incentivado por toda a comunidade! Informe bugs chatos e dê sugestões de novas funcionalidades!')
		// 	.addField(`${bot.config.dateDrink} Interação com jogadores`, 'O servidor é bastante ativo, contando com membros de diversas gangues! Converse, troque dicas e organize roubos com seus novos amigos!')
		// 	.addField("<:CrossRoadsLogo:757021182020157571> Entre agora mesmo", "https://discord.gg/sNf8avn")
		// 	.addField(`${bot.badges.topGrana1_s3} Final de temporada`, "A temporada atual será encerrada às **23h59** do dia **6 de Março**! Fique preparado, pois o *reset* acontecerá logo após!")
		// 	.setFooter(bot.user.username + " • Clica aí, não dói nada :)", bot.user.avatarURL())
		// 	.setTimestamp();

		const tresDias = 259200000
		const doisDias = 172800000
		bot.data.forEach((user, id) => {

			if (id != '526203502318321665') {
				// user.moni = 0
				// user.ficha = 0
				// user.presente = 0
				// user.day = 0
				// user._knife = 0
				// user._9mm = 0
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
				// user.jobTime = 0
				// user.jobNotification = 0
				// user.roubo = 0
				// user.preso = 0
				// user.presoNotification = 0
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
				// user.galo = 1
				// user.galoPower = 30
				// user.galoTrain = 0
				// user.galoTrainNotification = 0
				// user.galoTrainTime = 0
				// user.galoEmRinha = false
				// user.galoW = 0
				// user.galoL = 0
				// user.espancarW = 0
				// user.espancarL = 0
				// user.hospitalizado = 0
				// user.hospitalizadoNotification = 0
				// user.espancar = 0
				// user.vasculhar = 0
				// user.vasculharAchou = 0
				// user.qtHospitalizado = 0
				// user.hospitalGastos = 0
				// user.cassinoGanhos = 0
				// user.cassinoPerdidos = 0
				// user.prisaoGastos = 0
				// user.depositoGang = 0
				// user.emRoubo = false
				// user.morto = 0
				// user._celular = 0
				// // user.celularSmsBlock = false
				// // user.celularPego = 0
				// user.celularCredito = 0
				user.nickAlterado = false
				// user.gangID = null
				user.classeAlterada = 0
				// user.cassinoNiquel = 0
				// // if (user.vipTime > currTime)
				// // 	user.vipTime += tresDias * 3

				// user.tempoRinha = 0

				// if (user.classe != undefined){
				// 	bot.data.delete(id, 'classe')

				// }

				bot.data.set(id, user)
			}
		})
		// console.log("===")
		message.reply('Concluído!')

	// }, 1200000)

}