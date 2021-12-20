module.exports = (bot) => {

	let multiplicador_tempo_evento = 1

	bot.jobs = {
		pedreiro: {
			id: 1,
			desc: "Motorista de Uber",
			time: 0.5 * 60 * multiplicador_tempo_evento,
			pagamento: 0.5 * 350,
			arma: null
		},
		açougueiro: {
			id: 2,
			desc: "Açougueiro",
			time: 1 * 60 * multiplicador_tempo_evento,
			pagamento: 1 * 500,
			arma: "knife"
		},
		vigilante: {
			id: 3,
			desc: "Segurança de Boate",
			time: 2 * 60 * multiplicador_tempo_evento,
			pagamento: 2 * 700,
			arma: "colt45"
		},
		segurança: {
			id: 4,
			desc: "Gangster",
			time: 3 * 60 * multiplicador_tempo_evento,
			pagamento: 3 * 1150,
			arma: "tec9"
		},
		caçador: {
			id: 5,
			desc: "Caçador de Corno",
			time: 4 * 60 * multiplicador_tempo_evento,
			pagamento: 4 * 1700,
			arma: "rifle"
		},
		funeral: {
			id: 6,
			desc: "Estraga-Funeral",
			time: 5 * 60 * multiplicador_tempo_evento,
			pagamento: 5 * 2000,
			arma: "shotgun"
		},
		milicia: {
			id: 7,
			desc: "Miliciano",
			time: 6 * 60 * multiplicador_tempo_evento,
			pagamento: 6 * 2400,
			arma: "mp5"
		},
		mercenario: {
			id: 8,
			desc: "Terrorista",
			time: 7 * 60 * multiplicador_tempo_evento,
			pagamento: 7 * 2900,
			arma: "ak47"
		},
		rei: {
			id: 9,
			desc: "Contra-terrorista",
			time: 6 * 60 * multiplicador_tempo_evento,
			pagamento: 5 * 3700,
			arma: "m4"
		},
		espiao: {
			id: 10,
			desc: "Espião da ABIN",
			time: 7 * 60 * multiplicador_tempo_evento,
			pagamento: 7 * 7100,
			arma: "sniper"
		},
		yakuza: {
			id: 11,
			desc: "Espadachim da Yakuza",
			time: 8 * 60 * multiplicador_tempo_evento,
			pagamento: 8 * 12500,
			arma: "katana"
		},
		bomba: {
			id: 12,
			desc: "Homem-bomba",
			time: 9 * 60 * multiplicador_tempo_evento,
			pagamento: 300000, // 10.5 * 29000
			arma: "rpg"
		},
		jacobi: {
			id: 13,
			desc: "Segurança do Jacobi",
			time: 10 * 60 * multiplicador_tempo_evento,
			pagamento: 1000000,
			arma: ["rpg", "katana", "goggles", "colete", "sniper", "m4", "ak47", "mp5", "shotgun", "rifle", "tec9", "colt45", "knife"]
		},
		informante: {
			id: 14,
			desc: "Informante do Mercado Negro",
			time: 4 * 60 * multiplicador_tempo_evento,
			pagamento: 4 * 375000,
			arma: "minigun"
		},
		duble: {
			id: 15,
			desc: "Dublê de Power Ranger",
			time: 4 * 60 * multiplicador_tempo_evento,
			pagamento: 4 * 150000,
			arma: ["jetpack", "katana", "goggles"]
		},
		et: {
			id: 16,
			desc: "Extraditor de Extraterrestre",
			time: 6 * 60 * multiplicador_tempo_evento,
			pagamento: 1000000,
			arma: ["rpg", "katana", "goggles", "colete", "colete_p"]
		},
		mafia: {
			id: 17,
			desc: "Godfather da Máfia Jacobina",
			time: 24 * 60 * multiplicador_tempo_evento,
			pagamento: 10000000,
			arma: "minigun"
		},
		conquistador: {
			id: 18,
			desc: "Conquistador Galático",
			time: 72 * 60 * multiplicador_tempo_evento,
			pagamento: 50000000,
			arma: ["bazuca", "minigun", "exoesqueleto", "jetpack"]
		},
	};
}