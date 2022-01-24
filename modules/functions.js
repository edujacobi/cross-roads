const Discord = require('discord.js')
module.exports = bot => {
	bot.imposto = 0.05 // 5% do bet
	bot.carregamentoCassino = 0
	bot.moderators = ['145466251496390656', '843955033543540756', '606290632725626940', '555414232989040661', '731765213237346357', '274726815476744192']

	bot.palavrasBanidas = [
		'arrombado', 'viado', 'fdp', 'buceta', 'puta', 'caralh', 'filhadaputagem', 'filhodaputa', 'nazista',
		'fudido', 'verme', 'cuzin', 'fuder', 'biscate', 'meretriz', 'retardado', 'prostituta', 'vsf',
		'vsfd', 'estrupar', 'estripar', 'estuprar', 'vadia', 'piranha', 'cadela', 'vagabunda', 'mongol', 'piroca',
		'fodasse', 'fds', 'tnc', 'bct', 'buseta', 'bucetinha', 'arrombada', 'puto', 'bucetao', 'buceta', 'pinto',
		'xereca', 'hitler', 'penis',
	]

	bot.isAdmin = id => id === bot.config.adminID

	bot.isMod = id => bot.moderators.includes(id)

	bot.getRandom = (min, max) => {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min) + 1) + min
	}

	bot.shuffle = array => {
		let currentIndex = array.length,
			temp,
			rand
		while (0 !== currentIndex) {
			rand = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1
			temp = array[currentIndex]
			array[currentIndex] = array[rand]
			array[rand] = temp
		}
		return array
	}

	bot.segToHour = segundos => {
		return `${segundos > 3600 ? `${Math.floor(segundos / 3600)} ${segundos < 7200 ? `hora` : `horas`}${segundos % 3600 === 0 ? '' : ` e ${Math.floor((segundos / 60) % 60)} minutos`}` : Math.floor(segundos) < 60 ? `${Math.floor(segundos)} segundos` : `${Math.floor(segundos / 60)} minutos`}`
	}

	bot.findUser = (message, args) => {
		/*
		Para ver inventário sem pingar (funciona para outros servidores)
		 Se não tiver uma menção, ele irá pegar a string fornecida (espera-se o username do usuário) e irá procurar
		 em todo o banco de dados se há alguém com o user. Caso houver mais de um usuário com o mesmo username, ele
		 informará uma lista dos usuários junto de suas tags (username + discriminator). Se informar a tag ou id, 
		 o usuário será selecionado corretamente
		*/
		let targetMention = message.mentions.members.first()
		let targetNoMention
		if (args[0] && !targetMention) {
			// se não mencionou mas quer ver inv de outro user
			let name = args.join(' ').toLowerCase()

			bot.data.forEach((user, id) => {
				if (user.username?.toLowerCase() === name || id.toString() === name)
					targetNoMention = id
			})

			if (!targetNoMention)
				return bot.createEmbed(message, 'Usuário não encontrado.')
		}

		let alvo = targetNoMention ? targetNoMention : targetMention ? targetMention.id : message.author.id

		let uData = bot.data.get(alvo)

		if (!uData || uData.username === undefined)
			return bot.createEmbed(message, 'Este usuário não possui um inventário')

		return {uData, alvo}
	}

	bot.decrescimoNivelCasal = async () => {
		bot.casais.forEach((casal, id) => {
			if (casal.conjuges) {
				casal.nivel -= casal.ultimoDecrescimo
				casal.ultimoDecrescimo += casal.viagem > Date.now() ? 0 : 1
				if (casal.nivel < 0)
					casal.nivel = 0
				bot.casais.set(id, casal)
			}
		})
	}

	bot.defaultCarteira = {
		nome: '',
		moni: 0,
		ficha: 0,
		weekly: 0,
		day: 0,
		_knife: 0,
		_colt45: 0,
		_tec9: 0,
		_rifle: 0,
		_shotgun: 0,
		_mp5: 0,
		_ak47: 0,
		_m4: 0,
		_rpg: 0,
		_goggles: 0,
		_sniper: 0,
		_katana: 0,
		_colete: 0,
		_colete_p: 0,
		_jetpack: 0,
		_minigun: 0,
		_bazuca: 0,
		_exoesqueleto: 0,
		_ovo: 0,
		_ovogranada: 0,
		_flor: 0,
		conjuge: null,
		anel: null,
		casamentoID: null,
		job: null,
		jobTime: 0,
		roubo: 0,
		preso: 0,
		fuga: 0,
		qtEsmolasDadas: 0,
		qtEsmolasRecebidas: 0,
		esmolaEntregueHoje: 0,
		esmolaRecebidaHoje: 0,
		betJ: 0,
		betW: 0,
		betL: 0,
		roubosW: 0,
		roubosL: 0,
		emRoubo: {
			tempo: 0,
			user: null,
			isAlvo: false,
		},
		emEspancamento: {
			tempo: 0,
			user: null,
			isAlvo: false,
		},
		valorRoubado: 0,
		fugindo: 0,
		qtFugas: 0,
		qtRoubado: 0,
		jobGanhos: 0,
		lojaGastos: 0,
		invest: null,
		investTime: 0,
		investNotification: 0,
		investGanhos: 0,
		espancarW: 0,
		espancarL: 0,
		hospitalizado: 0,
		morto: 0,
		espancar: 0,
		vasculhar: 0,
		vasculharAchou: 0,
		qtHospitalizado: 0,
		hospitalGastos: 0,
		cassinoGanhos: 0,
		cassinoPerdidos: 0,
		cassinoNiquel: 0,
		prisaoGastos: 0,
		depositoGang: 0,
		vipTime: 0,
		_celular: 0,
		celularSmsBlock: false,
		celularPego: 0,
		celularCredito: 0,
		dataInicio: '',
		classeAlterada: 0,
	}

	bot.defaultGalo = {
		power: 30,
		avatar: 'https://cdn.discordapp.com/attachments/529674667414519810/530191738690732033/unknown.png',
		train: 0,
		trainTime: 0,
		nome: 'Galo',
		titulo: '',
		emRinha: false,
		wins: 0,
		loses: 0,
		descansar: 0,
	}

	bot.defautGang = {
		membros: [],
		nome: '',
		desc: '',
		icone: '',
		tag: '',
		cor: 0x0,
		caixa: 0,
		boneco: 0,
		baseLevel: 0,
		espacoMembro: 10,
		estoque: 0,
		golpeMissao1: {
			concluido: false,
			time: 0,
		},
		golpeMissao2: {
			concluido: false,
			time: 0,
		},
		golpeMissao3: {
			concluido: false,
			time: 0,
		},
		golpeTime: 0,
		golpeW: 0,
		golpeL: 0,
		valorRoubadoBanco: 0,
	}

	bot.isGaloEmRinha = id => {
		return bot.galos.get(id, 'emRinha')
	}

	bot.investReceber = async () => {
		bot.channels.cache.get('848232046387396628').send({
			embeds: [new Discord.MessageEmbed().setDescription(`${bot.config.propertyG} Pagamento dos investimentos iniciado`)],
		})
		const semana = 604800000 // 7 dias
		const hora = 3600000 // 1h

		let currTime = new Date().getTime()

		bot.data.forEach((user, id) => {
			if (user.invest != null && user.preso < currTime && user.hospitalizado < currTime) {
				if (bot.isPlayerMorto(user)) user.investLast = currTime

				let horas = user.investTime + semana > currTime ? currTime - user.investLast : user.investTime + semana - user.investLast
				// se investimento ainda não passou de uma semana, então horas = tempo atual - ultimo saque, senão horas = investTime + semana - investLast

				let praSacar = Math.round((horas / hora) * bot.investimentos[user.invest].lucro)

				if (user.classe === 'mafioso') praSacar = Math.round(praSacar * 0.9)

				if (user.classe === 'empresario') praSacar = Math.round(praSacar * 1.05)

				if (currTime < user.investTime + semana) {
					//se o investimento ainda não completou uma semana
					// user.investNotification += 1

					if (user.investNotification)
						bot.users.fetch(id).then(user_send => {
							user_send.send(`Você recebeu R$ ${praSacar.toLocaleString().replace(/,/g, '.')} de seu investimento **${bot.investimentos[user.invest].desc}** ${bot.config.propertyG}`)
								.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id}) Investimento`))
						})
					user.moni += praSacar
					user.investGanhos += praSacar
					user.investLast = currTime

				}
				else if (user.invest != null) {
					// se já passou uma semana
					//linhaInvest = `Seu investimento **${bot.investimentos[user.invest].desc}** acabou. Você recebeu R$ ${praSacar.toLocaleString().replace(/,/g, ".")} dele ${bot.config.propertyR}`
					let invest = bot.investimentos[user.invest].desc
					if (user.investNotification) {
						bot.users.fetch(id).then(user_send => {
							user_send.send(`Seu investimento **${invest}** acabou. Você recebeu R$ ${praSacar.toLocaleString().replace(/,/g, '.')} dele ${bot.config.propertyR}`)
								.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id}) Investimento`))
						})
					}
					else {
						bot.users.fetch(id).then(user_send => {
							user_send.send(`Seu investimento **${invest}** acabou ${bot.config.propertyR}`)
								.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id}) Investimento`))
						})
					}
					user.moni += praSacar
					user.investGanhos += praSacar
					user.investLast = 0
					user.invest = null
					user.investTime = 0
				}
				bot.data.set(id, user)
			}
		})
		bot.channels.cache.get('848232046387396628').send({
			embeds: [new Discord.MessageEmbed().setDescription(`${bot.config.propertyG} Pagamento dos investimentos encerrado`)],
		})
	}

	bot.informRinhaRouboCancelado = () => {
		// let currtime = new Date().getTime()
		// bot.data.forEach((user, id) => {
		// 	if (user.emRoubo.tempo > currtime) {
		// 		bot.users.fetch(id).then(user_send => {
		// 			user_send.send(`O Cross Roads foi reiniciado durante seu roubo e ele foi cancelado ${bot.config.roubar}`)
		// 				.catch(err => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`));
		// 		});
		// 	}
		// 	if (user.emEspancamento.tempo > currtime) {
		// 		bot.users.fetch(id).then(user_send => {
		// 			user_send.send(`O Cross Roads foi reiniciado durante seu espancamento e ele foi cancelado ${bot.config.espancar}`)
		// 				.catch(err => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`));
		// 		});
		// 	}
		// })
		bot.galos.forEach((galo, id) => {
			if (galo.emRinha) {
				bot.users.fetch(id).then(user_send => {
					user_send.send(`O Cross Roads foi reiniciado durante sua rinha e ela foi cancelada ${bot.config.galo}`).catch(() => console.log(`Não consegui mandar mensagem privada para ${bot.data.get(id, 'username')} (${id})`))
				})
				bot.galos.set(id, false, 'emRinha')
			}
		})
	}

	bot.putMoneyCassino = () => {
		if (bot.banco.get('caixa') - bot.carregamentoCassino > 0) {
			bot.banco.set('caixa', bot.banco.get('caixa') - bot.carregamentoCassino)
			bot.banco.set('cassino', bot.banco.get('cassino') + bot.carregamentoCassino)
		}
	}

	bot.getUserBadges = (userId, isInv) => {
		let textoBadge = ''

		// BADGES ------------------------------------
		if (['332228051871989761', '592022325835202600'].includes(userId)) //DEV
			textoBadge += bot.badges.dev
		if (bot.moderators.includes(userId)) //MOD
			textoBadge += bot.badges.mod
		if (bot.data.get(userId, 'vipTime') > new Date().getTime()) // VIP
			textoBadge += bot.badges.vip

		if (!isInv) {
			// TEMPORADA 1 -------------------------------
			if (userId === '215955539274760192') //Top 1 Grana Temporada 1
				textoBadge += bot.badges.topGrana1_s1
			if (userId === '384811752245690368') //Top 2 Grana Temporada 1
				textoBadge += bot.badges.topGrana2_s1
			if (userId === '621480481975959562') //Top 3 Grana Temporada 1
				textoBadge += bot.badges.topGrana3_s1

			// TEMPORADA 2 -------------------------------
			if (userId === '660136362514579468') //Top 1 Grana Temporada 2
				textoBadge += bot.badges.topGrana1_s2
			if (userId === '592022325835202600') //Top 2 Grana Temporada 2
				textoBadge += bot.badges.topGrana2_s2
			if (userId === '215955539274760192') //Top 3 Grana Temporada 2
				textoBadge += bot.badges.topGrana3_s2
			if (userId === '695078054497878028') //Top Pancada - Home Run
				textoBadge += bot.badges.homerun_s2
			if (userId === '636327778337423391') //Top Fugas - Fujão
				textoBadge += bot.badges.fujao_s2
			if (userId === '712070601845506143') //Top Win rate cassino - Sortudo
				textoBadge += bot.badges.sortudo_s2

			// TEMPORADA 3 -------------------------------
			if (userId === '726587303476330577') //Top 1 Grana Temporada 3
				textoBadge += bot.badges.topGrana1_s3
			if (userId === '565928906356424705') //Top 2 Grana Temporada 3
				textoBadge += bot.badges.topGrana2_s3
			if (userId === '450421081120047105') //Top 3 Grana Temporada 3
				textoBadge += bot.badges.topGrana3_s3
			if (userId === '517013970310397974') //Top Pancada - EsmagaCrânio
				textoBadge += bot.badges.esmagaCranio_s3
			if (userId === '305096107954798602') //Top espancado - Morto Muito Louco
				textoBadge += bot.badges.mortoMuitoLouco_s3
			if (userId === '555414232989040661') //Top Fugas - Fujão
				textoBadge += bot.badges.fujao_s3
			if (userId === '747135934100668476') //Top Win rate cassino - Sortudo
				textoBadge += bot.badges.sortudo_s3
			if (userId === '517013970310397974') //Top ganhos cassino - Trader Elite
				textoBadge += bot.badges.traderElite_s3
			if (userId === '145466251496390656') //Top Roubos qt - Mão Boba
				textoBadge += bot.badges.maoBoba_s3
			if (userId === '555414232989040661') //Top Roubos vl - Bolso Largo
				textoBadge += bot.badges.bolsoLargo_s3
			if (userId === '487046604147392521') //Top Win rate galo - Top Galo
				textoBadge += bot.badges.topGalo_s3
			if (userId === '786127589122768917') //Top roubado - Alvo Ambulante
				textoBadge += bot.badges.alvoAmbulante_s3
			if (userId === '731765213237346357') //Top esmola - Filantropo
				textoBadge += bot.badges.filantropo_s3
			if (userId === '517013970310397974') //Top investidor - Investidor
				textoBadge += bot.badges.investidor_s3
			if (userId === '517013970310397974') //Top trabalhador - Workaholic
				textoBadge += bot.badges.workaholic_s3
			if (userId === '533848042387013648') //Top gastador - Patricinha
				textoBadge += bot.badges.patricinha_s3
			if (userId === '555414232989040661') //Top suborno - Deputado
				textoBadge += bot.badges.deputado_s3
			if (userId === '675378704469196800') //Top hospital doente - Hipocondriaco
				textoBadge += bot.badges.hipocondriaco_s3

			// TEMPORADA 4 -------------------------------
			if (userId === '479611442824216576') //Top 1 Grana Temporada 4
				textoBadge += bot.badges.topGrana1_s4
			if (userId === '773017599121686570') //Top 2 Grana Temporada 4
				textoBadge += bot.badges.topGrana2_s4
			if (userId === '761236646116982844') //Top 3 Grana Temporada 4
				textoBadge += bot.badges.topGrana3_s4
			if (userId === '516023056095772674') //Top Pancada - EsmagaCrânio
				textoBadge += bot.badges.esmagaCranio_s4
			if (userId === '698361824340344965') //Top Fugas - Fujão
				textoBadge += bot.badges.fujao_s4
			if (userId === '406554359862788100') //Top Win rate cassino - Sortudo
				textoBadge += bot.badges.sortudo_s4
			if (userId === '145466251496390656') //Top ganhos cassino - Trader Elite
				textoBadge += bot.badges.traderElite_s4
			if (userId === '698361824340344965') //Top Roubos qt - Mão Boba
				textoBadge += bot.badges.maoBoba_s4
			if (userId === '698361824340344965') //Top Roubos vl - Bolso Largo
				textoBadge += bot.badges.bolsoLargo_s4
			if (userId === '667909521682989056') //Top Win rate galo - Top Galo
				textoBadge += bot.badges.topGalo_s4
			if (userId === '490281882697728010') //Top esmola - Filantropo
				textoBadge += bot.badges.filantropo_s4
			if (userId === '761236646116982844') //Top investidor - Investidor
				textoBadge += bot.badges.investidor_s4
			if (userId === '724639028636287049') //Top trabalhador - Workaholic
				textoBadge += bot.badges.workaholic_s4
			if (userId === '555414232989040661') //Top gastador - Patricinha
				textoBadge += bot.badges.patricinha_s4
			if (userId === '698361824340344965') //Top suborno - Deputado
				textoBadge += bot.badges.deputado_s4
			if (userId === '145466251496390656') //Top hospital doente - Hipocondriaco
				textoBadge += bot.badges.hipocondriaco_s4
			if (userId === '698361824340344965') //Top vasculhamentos - Xeroque Holmes
				textoBadge += bot.badges.xeroqueHolmes_s4


			// TEMPORADA 5 -------------------------------
			if (userId === '565928906356424705') //Top 1 Grana Temporada 5
				textoBadge += bot.badges.topGrana1_s5
			if (userId === '743494282308223156') //Top 2 Grana Temporada 5
				textoBadge += bot.badges.topGrana2_s5
			if (userId === '367423139132604416') //Top 3 Grana Temporada 5
				textoBadge += bot.badges.topGrana3_s5
			if (userId === '606290632725626940') //Top Pancada - EsmagaCrânio
				textoBadge += bot.badges.esmagaCranio_s5
			if (userId === '481618309851250688') //Top Fugas - Fujão
				textoBadge += bot.badges.fujao_s5
			if (userId === '880983727885406248') //Top Win rate cassino - Sortudo
				textoBadge += bot.badges.sortudo_s5
			if (userId === '145466251496390656') //Top ganhos cassino - Trader Elite
				textoBadge += bot.badges.traderElite_s5
			if (userId === '731765213237346357') //Top Roubos qt - Mão Boba
				textoBadge += bot.badges.maoBoba_s5
			if (userId === '593444673297580042') //Top Roubos vl - Bolso Largo
				textoBadge += bot.badges.bolsoLargo_s5
			if (userId === '726587303476330577') //Top Win rate galo - Top Galo
				textoBadge += bot.badges.topGalo_s5
			if (userId === '145466251496390656') //Top esmola - Filantropo
				textoBadge += bot.badges.filantropo_s5
			if (userId === '566417328586096655') //Top investidor - Investidor
				textoBadge += bot.badges.investidor_s5
			if (userId === '565928906356424705') //Top trabalhador - Workaholic
				textoBadge += bot.badges.workaholic_s5
			if (userId === '566417328586096655') //Top gastador - Patricinha
				textoBadge += bot.badges.patricinha_s5
			if (userId === '593444673297580042') //Top suborno - Deputado
				textoBadge += bot.badges.deputado_s5
			if (userId === '555414232989040661') //Top hospital doente - Hipocondriaco
				textoBadge += bot.badges.hipocondriaco_s5
			if (userId === '731765213237346357') //Top vasculhamentos - Xeroque Holmes
				textoBadge += bot.badges.xeroqueHolmes_s5
			if ([
				'646778544512565248', '740753560706220153',
				'859916007853785128', '533848042387013648',
				'334086157686013952', '684897590529359918',
				'145466251496390656', '726587303476330577',
				'508730960469164047', '708669255343800321',
				'776684955362656286', '578192731256389633',
				'342505762624503808', '671843186649333791',
				'370042915373973505', '818674190756347924',
				'882698935838322739', '495412204703580160',
				'784245228029870162', '561191619311697921',
			].includes(userId))
				textoBadge += bot.badges.topGangue_s5
		}
		// TEMPORADA 6 -------------------------------
		if (userId === '684185796093542402') //Top 1 Grana Temporada 6
			textoBadge += bot.badges.topGrana1_s6
		if (userId === '555414232989040661') //Top 2 Grana Temporada 6
			textoBadge += bot.badges.topGrana2_s6
		if (userId === '902321015223369759') //Top 3 Grana Temporada 6
			textoBadge += bot.badges.topGrana3_s6
		if (userId === '555414232989040661') //Top Pancada - EsmagaCrânio
			textoBadge += bot.badges.esmagaCranio_s6
		if (userId === '481618309851250688') //Top Fugas - Fujão
			textoBadge += bot.badges.fujao_s6
		if (userId === '924864319437541416') //Top Win rate cassino - Sortudo
			textoBadge += bot.badges.sortudo_s6
		if (userId === '481618309851250688') //Top ganhos cassino - Trader Elite
			textoBadge += bot.badges.traderElite_s6
		if (userId === '593444673297580042') //Top Roubos qt - Mão Boba
			textoBadge += bot.badges.maoBoba_s6
		if (userId === '731765213237346357') //Top Roubos vl - Bolso Largo
			textoBadge += bot.badges.bolsoLargo_s6
		if (userId === '684185796093542402') //Top Win rate galo - Top Galo
			textoBadge += bot.badges.topGalo_s6
		if (userId === '593444673297580042') //Top esmola - Filantropo
			textoBadge += bot.badges.filantropo_s6
		if (userId === '338191478637592577') //Top investidor - Investidor
			textoBadge += bot.badges.investidor_s6
		if (userId === '642831476852785212') //Top trabalhador - Workaholic
			textoBadge += bot.badges.workaholic_s6
		if (userId === '338191478637592577') //Top gastador - Patricinha
			textoBadge += bot.badges.patricinha_s6
		if (userId === '731765213237346357') //Top suborno - Deputado
			textoBadge += bot.badges.deputado_s6
		if (userId === '842100049432281189') //Top hospital doente - Hipocondriaco
			textoBadge += bot.badges.hipocondriaco_s6
		if (userId === '555414232989040661') //Top vasculhamentos - Xeroque Holmes
			textoBadge += bot.badges.xeroqueHolmes_s6
		if ([
			'338191478637592577', '755135847157858395',
			'863437497039454259', '632577162830020618',
			'821218418710675496', '736225030157107300',
			'842100049432281189', '461210195536642052',
			'755183560377499710', '566417328586096655',
			'720828847771222056', '869654855126499380',
			'868098562418962543', '898959920588795964',
			'372142137594347531', '474956360891629578',
			'743494282308223156', '503304962785148958',
			'676224670122639360', '920506496792551556',
		].includes(userId))
			textoBadge += bot.badges.topGangue_s6


		// OUTROS ------------------------------------

		if ([
			'846441465529630740', '715351546363379792', '508730960469164047',
			'761236646116982844', '338191478637592577', '654365946219200512',
			'565928906356424705', '636327778337423391', '650893454519435264',
			'592022325835202600', '215955539274760192', '405930523622375424',
			'316962994737119232', '274726815476744192', '332228051871989761',
			'335407447181230080', '462252828832956416', '843955033543540756',
			'697549215475433552', '493121335749246989', '517013970310397974',
			'555414232989040661', '145466251496390656', '516023056095772674',
			'729036810826678317', '372142137594347531']
			.includes(userId))
			textoBadge += bot.badges.cataBug

		if ([
			'460196598539092025', '660136362514579468', '650893454519435264',
			'332228051871989761', '555414232989040661', '667107441149870090',
			'732499761013325840', '593444673297580042', '727924880380526592',
			'662380115308576801']
			.includes(userId)) textoBadge += bot.badges.bilionario

		if (['332228051871989761', '493121335749246989', '843955033543540756', '517013970310397974', '390655016307916812'].includes(userId)) textoBadge += bot.badges.evento_natal_2020 // 12/2020

		if (bot.data.has(userId, 'badgePascoa2020_dourado') && bot.data.get(userId, 'badgePascoa2020_dourado') === true) textoBadge += bot.badges.ovos_dourados // 04/2021

		if (['740753560706220153', '145466251496390656', '352125425901895687', '859916007853785128', '400425520182853647'].includes(userId)) textoBadge += bot.badges.coroamuruDerrotei // 06/2021

		if (bot.data.has(userId, 'badgeHalloween2021') && bot.data.get(userId, 'badgeHalloween2021') === true) textoBadge += bot.badges.evento_halloween_2021 // 10/2021

		if (bot.data.has(userId, 'badgeNatal2021') && bot.data.get(userId, 'badgeNatal2021') === true) textoBadge += bot.badges.evento_natal_2021 // 12/2021

		if ([
			'593444673297580042', '782981311249121341', '662380115308576801',
			'390655016307916812', '555414232989040661', '605522607139454989',
			'571408267377508363', '731765213237346357', '840795540640104448',
			'702941658811203585', '736646173225385985', '716131530346463254',
			'274726815476744192', '372142137594347531', '481618309851250688',

			'666077411615572031', '555552682224648194', '642924823156228106',
			'843955033543540756', '697549215475433552', '332228051871989761']
			.includes(userId)) textoBadge += bot.badges.mandrakeChavoso

		if (textoBadge === '') return ''

		return textoBadge + '\n'
	}

	bot.sortearBilhete = () => {
		let hoje = new Date().getDay()
		let hora = new Date().getHours()
		let diaUltimoSorteio = bot.bilhete.get('diaUltimoSorteio')

		if (hora >= 18 && hoje !== diaUltimoSorteio) {
			let total = Math.round((bot.bilhete.get('acumulado') / 3) * 2)
			// let total = bot.bilhete.get('acumulado')
			let cassino = Math.round(bot.bilhete.get('acumulado') / 3)
			// let cassino = 0
			let participantes = []

			bot.bilhete.forEach((user, id) => {
				if (id === parseInt(id)) participantes.push(id)
			})

			if (participantes.length === 0) {
				bot.bilhete.set('diaUltimoSorteio', hoje)
				return
			}

			// let numeroVencedor = bot.getRandom(0, participantes.length)
			bot.shuffle(participantes)
			let numeroVencedor = participantes.shift()

			let ganhador = {
				numero: bot.bilhete.get(numeroVencedor, 'numero'),
				id: numeroVencedor,
				premio: total,
			}

			let uData = bot.data.get(numeroVencedor)
			uData.moni += total
			uData.cassinoGanhos += total
			bot.data.set(numeroVencedor, uData)

			let dias = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']

			const embedLose = new Discord.MessageEmbed()
				.setTitle(`🎟️ Bilhete premiado`)
				.setColor(bot.colors.darkGrey)
				.setDescription(`O vencedor do sorteio de ${dias[hoje]} é **${uData.username}**, que levou para casa R$ ${total.toLocaleString().replace(/,/g, '.')}!`)
				// .setDescription(`O vencedor da MEGA DA VIRADA é **${uData.username}**, que levou para casa R$ ${total.toLocaleString().replace(/,/g, '.')}!`)
				.setFooter(`Bilhete vencedor: #${bot.bilhete.get(numeroVencedor, 'numero')}`)

			participantes.forEach(id => {
				bot.users.fetch(id).then(user =>
					user.send({embeds: [embedLose]})
						.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${id})`))
				)
			})

			const embedWin = new Discord.MessageEmbed()
				.setTitle(`🎟️ Bilhete premiado`)
				.setColor('GREEN')
				.setDescription(`Você venceu o sorteio de ${dias[hoje]} e ganhou R$ ${total.toLocaleString().replace(/,/g, '.')}!`)
				.setFooter(`Bilhete vencedor: #${bot.bilhete.get(numeroVencedor, 'numero')}`)

			bot.users.fetch(numeroVencedor).then(user =>
				user.send({embeds: [embedWin]})
					.catch(() => console.log(`Não consegui mandar mensagem privada para ${user.username} (${numeroVencedor})`))
			)

			const log = new Discord.MessageEmbed()
				.setDescription(`🎟️ **${uData.username} venceu o sorteio de ${dias[hoje]}**`)
				.addField('Prêmio', `R$ ${total.toLocaleString().replace(/,/g, '.')}`, true)
				.addField('Participantes', (participantes.length + 2).toString(), true)
				.addField('Bilhete vencedor', `#${bot.bilhete.get(numeroVencedor, 'numero')}`, true)
				.setColor(bot.colors.darkGrey)

			bot.banco.set('cassino', bot.banco.get('cassino') + cassino)
			bot.bilhete.clear()
			bot.bilhete.set('diaUltimoSorteio', hoje)
			bot.bilhete.set('lastWinner', ganhador)
			bot.bilhete.set('acumulado', 0)

			return bot.channels.cache.get('848232046387396628').send({embeds: [log],})
		}
	}

	bot.clean = async (bot, text) => {
		if (text && text.constructor.name === 'Promise') text = await text

		if (typeof evaled !== 'string')
			text = require('util').inspect(text, {
				depth: 1,
			})

		text = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(bot.token, 'NDYxMTQ4OTc4MjI3MDUyNTU0.DhPW2g.ePkaYG2oUh10JkOWdzdbwAgHPlY')

		return text
	}

	bot.loadCommand = commandName => {
		try {
			const props = require(`../commands/${commandName}`)
			if (props.init) props.init(bot)

			let cmd = commandName.substring(0, commandName.length - 3)
			bot.commands.set(cmd, props)
			console.log('comando ' + commandName + ' carregado')
			return false
		} catch (e) {
			return `Não foi possível carregar ${commandName}: ${e}`
		}
	}

	bot.unloadCommand = async commandName => {
		let command
		if (bot.commands.has(commandName)) command = bot.commands.get(commandName)

		if (!command) return `O comando \`${commandName}\` não existe!`

		if (command.shutdown) await command.shutdown(bot)

		delete require.cache[require.resolve(`../commands/${commandName}.js`)]
		return false
	}

	bot.log = async (message, logMessage) => {
		if (!logMessage || !message) return
		logMessage
			.setAuthor(`${bot.data.get(message.author.id, 'username')} (${message.author.id})`, message.author.avatarURL())
			.setTimestamp()
			.setFooter(`Servidor ${message.guild.name}. Canal #${message.channel.name}`, message.guild.iconURL())

		bot.channels.cache.get('848232046387396628').send({
			embeds: [logMessage],
		})
	}
}