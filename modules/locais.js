module.exports = (bot) => {

	bot.robbery = {
		velhinha: {
			id: 1,
			desc: "Velhinha na esquina",
			sucesso: 75,
			min: 100,
			max: 350,
			necessario: "knife"
		},
		mercearia: {
			id: 2,
			desc: "Mercearia do Zé",
			sucesso: 68,
			min: 625,
			max: 1725,
			necessario: "colt45"
		},
		posto: {
			id: 3,
			desc: "Posto de gasolina",
			sucesso: 61,
			min: 3125,
			max: 8000,
			necessario: ["tec9", "rifle"]
		},
		joalheria: {
			id: 4,
			desc: "Joalheria",
			sucesso: 54,
			min: 9700,
			max: 16000,
			necessario: ["shotgun", "mp5"]
		},
		banco: {
			id: 5,
			desc: "Banco pequeno",
			sucesso: 47,
			min: 18750,
			max: 38000,
			necessario: ["ak47", "m4", "sniper"]
		},
		mafia: {
			id: 6,
			desc: "Máfia Italiana",
			sucesso: 40,
			min: 50000,
			max: 90000,
			necessario: ["katana", "rpg"]
		},
		deposito: {
			id: 7,
			desc: "Depósito do Exército",
			sucesso: 33,
			min: 250000,
			max: 750000,
			necessario: "minigun"
		},
		palacio: {
			id: 8,
			desc: "Palácio do Jacobi",
			sucesso: 26,
			min: 1000000,
			max: 2500000,
			necessario: "bazuca"
		},
	}
}