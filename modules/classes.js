module.exports = (bot) => {

	bot.classes = {
		ladrao: {
			desc: "Ladrão",
			cor: 0x000000,
			emote: '823251212169904168',
			imagem: "https://media.discordapp.net/attachments/691019843159326757/822278858048798771/Ladrao_20210318222044.png",
			buff: "+10% valor roubado e +5% chance de fugir da prisão",
			debuff: "+10% tempo procurado e +10% tempo preso"
		},
		advogado: {
			desc: "Advogado",
			cor: 0xe9a911,
			emote: '823251210274471957',
			imagem: "https://media.discordapp.net/attachments/691019843159326757/822625784711479296/Advogado_20210319211808.png",
			buff: "-15% tempo preso e procurado e -10% valor do suborno",
			debuff: "-5% chance de fugir da prisão"
		},
		mafioso: {
			desc: "Mafioso",
			cor: 0x847c64,
			emote: '823251212135563304',
			imagem: "https://cdn.discordapp.com/attachments/691019843159326757/823009060654940200/Mafioso_20210320224204.png",
			buff: "Não paga nenhum imposto (normal: 5%)",
			debuff: "-10% salário de trabalhos e investimentos"
		},
		empresario: {
			desc: "Empresário",
			cor: 0x00A3E0,
			emote: '823719389337616385',
			imagem: "https://cdn.discordapp.com/attachments/691019843159326757/823659670966239282/Empresario_20210322174735.png",
			buff: "+5% salário de trabalhos e investimentos e -5% tempo de trabalhos",
			debuff: "-10% DEF"
		},
		assassino: {
			desc: "Assassino",
			cor: 0xd25253,
			emote: '823382624709378118',
			imagem: "https://media.discordapp.net/attachments/691019843159326757/823382379384930314/Assassino_20210321232544.png",
			buff: "+10% ATK",
			debuff: "-10% DEF"
		},

	}
}