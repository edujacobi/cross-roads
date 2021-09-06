module.exports = (bot) => {

	bot.bases = {
		aeroporto: {
			id: 1,
			desc: "Aeroporto Abandonado",
			imagem: "https://cdn.discordapp.com/attachments/531174573463306240/757330414342766676/unknown.png",
			beneficio: "-3h de tempo de importação de carregamentos e +1% de chance por nível de não perder carregamentos "
		},
		bunker: {
			id: 2,
			desc: "Bunker Subterrâneo",
			imagem: "https://cdn.discordapp.com/attachments/531174573463306240/757329826091892736/unknown.png",
			beneficio: "+15 DEF da base e +0.5 DEF por nível para seus membros"
		},
		motoclube: {
			id: 3,
			desc: "Motoclube Anarquista",
			imagem: "https://cdn.discordapp.com/attachments/531174573463306240/757330594303574146/unknown.png",
			beneficio: "+0.5% de chance em golpes por membro participante e +1% de valor roubado do banco por nível"
		}
	}
}