module.exports = (bot) => {

	bot.investimentos = {
		// key: {
		// 	id: 0,
		// 	desc: "Nome do Investimento",
		// 	preço: Valor de compra,
		// 	lucro: por hora. 
		// },
		churros: {
			id: 1,
			desc: "Carrinho de Churros",
			preço: 5000,
			lucro: Math.floor(5000 * 0.012), 
		},
		fumo: {
			id: 2,
			desc: "Boca de Fumo",
			preço: 15000,
			lucro: Math.floor(15000 * 0.013), 
		},
		cancha: {
			id: 3,
			desc: "Cancha de Bocha",
			preço: 50000, 
			lucro: Math.floor(50000 * 0.014), 
		},
		restaurante: {
			id: 4,
			desc: "Restaurante Vegano",
			preço: 150000, 
			lucro: Math.floor(150000 * 0.015), 
		},
		golfe: {
			id: 5,
			desc: "Clube de Golfe",
			preço: 500000,
			lucro: Math.floor(500000 * 0.016),
		},
		montadora: {
			id: 6,
			desc: "Montadora de Veículos",
			preço: 1500000, 
			lucro: Math.floor(1500000 * 0.017),
		},
		pais: {
			id: 7,
			desc: "País Subdesenvolvido",
			preço: 5000000,
			lucro: Math.floor(5000000 * 0.018), 
		},
		seita: {
			id: 8,
			desc: "Seita Religiosa",
			preço: 15000000,
			lucro: Math.floor(15000000 * 0.019),
		},
		galaxia: {
			id: 9,
			desc: "Galáxia Estelar",
			preço: 50000000,
			lucro: Math.floor(50000000 * 0.020), 
		},
	};
}