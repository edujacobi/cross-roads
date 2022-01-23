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
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591337561980979/1-Churros.png'
		},
		fumo: {
			id: 2,
			desc: "Boca de Fumo",
			preço: 15000,
			lucro: Math.floor(15000 * 0.013),
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591337972989952/2-Boca.png'
		},
		cancha: {
			id: 3,
			desc: "Cancha de Bocha",
			preço: 50000, 
			lucro: Math.floor(50000 * 0.014), 
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591338430185472/3-Cancha.png'
		},
		restaurante: {
			id: 4,
			desc: "Restaurante Vegano",
			preço: 150000, 
			lucro: Math.floor(150000 * 0.015), 
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591338824466532/4-Vegano.png'
		},
		golfe: {
			id: 5,
			desc: "Clube de Golfe",
			preço: 500000,
			lucro: Math.floor(500000 * 0.016),
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591339667488768/5-Golfe.png'
		},
		montadora: {
			id: 6,
			desc: "Montadora de Veículos",
			preço: 1500000, 
			lucro: Math.floor(1500000 * 0.017),
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591340078555226/6-Montadora.png'
		},
		pais: {
			id: 7,
			desc: "País Subdesenvolvido",
			preço: 5000000,
			lucro: Math.floor(5000000 * 0.018), 
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591340711903282/7-Pais.png'
		},
		seita: {
			id: 8,
			desc: "Seita Religiosa",
			preço: 15000000,
			lucro: Math.floor(15000000 * 0.019),
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591341282316368/8-Seita.png'
		},
		galaxia: {
			id: 9,
			desc: "Galáxia Estelar",
			preço: 50000000,
			lucro: Math.floor(50000000 * 0.020), 
			img: 'https://media.discordapp.net/attachments/529795576993415175/923591341684953188/9-Galaxia.png'
		},
	};
}