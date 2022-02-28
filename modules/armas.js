module.exports = (bot) => {

	bot.guns = {
		faca: {
			id: 1,
			desc: "Faca",
			data: "faca",
			preço: 2500,
			atk: 15,
			def: 0,
			moneyAtk: 6,
			moneyDef: 8,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.açougueiro.desc}\n**Roubar:** ${bot.robbery.velhinha.desc}`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Faca:829906312837201970>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:faca:937170775063023636>',
					compravel: true,
					evento: false
				}
			}
		},
		colt45: {
			id: 2,
			desc: "Colt 45",
			data: "colt45",
			preço: 5900,
			atk: 20,
			def: 5,
			moneyAtk: 8,
			moneyDef: 12,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.vigilante.desc}\n**Roubar:** ${bot.robbery.mercearia.desc}`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Colt45:829906310538723339>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:colt45:937170775117553704>',
					compravel: true,
					evento: false
				}
			}
		},
		tec9: {
			id: 3,
			desc: "Tec 9",
			data: "tec9",
			preço: 15000,
			atk: 25,
			def: 10,
			moneyAtk: 10,
			moneyDef: 16,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.segurança.desc}\n**Roubar:** ${bot.robbery.posto.desc}`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Tec9:829906313743826944>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:tec9:937170775281119262>',
					compravel: true,
					evento: false
				},
				'brasil': {
					nome: 'Brasileira',
					emote: '<:tec9BR:937437983307595786>',
					compravel: false,
					evento: false
				}
			}
		},
		rifle: {
			id: 4,
			desc: "Rifle",
			data: "rifle",
			preço: 27000,
			atk: 30,
			def: 15,
			moneyAtk: 12,
			moneyDef: 20,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.caçador.desc}\n**Roubar:** ${bot.robbery.posto.desc}`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Rifle:829906310983581756>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássico',
					emote: '<:rifle:937170774727475242>',
					compravel: true,
					evento: false
				}
			}
		},
		shotgun: {
			id: 5,
			desc: "Escopeta",
			data: "shotgun",
			preço: 40000,
			atk: 35,
			def: 20,
			moneyAtk: 14,
			moneyDef: 24,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.funeral.desc}\n**Roubar:** ${bot.robbery.joalheria.desc}\n**Vasculhar:** Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Escopeta:829906310211567667>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:escopeta:937170774983319552>',
					compravel: true,
					evento: false
				}
			}
		},
		mp5: {
			id: 6,
			desc: "MP5",
			data: "mp5",
			preço: 65000,
			atk: 40,
			def: 25,
			moneyAtk: 16,
			moneyDef: 28,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.milicia.desc}\n**Roubar:** ${bot.robbery.joalheria.desc}\n**Vasculhar:** Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:MP5:829906313608691722>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:mp5:937170775050436619>',
					compravel: true,
					evento: false
				}
			}
		},
		ak47: {
			id: 7,
			desc: "AK-47",
			data: "ak47",
			preço: 100000,
			atk: 45,
			def: 30,
			moneyAtk: 18,
			moneyDef: 32,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.mercenario.desc}\n**Roubar:** ${bot.robbery.banco.desc}\n**Vasculhar:** Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:AK47:829906310099238984>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:ak47:937170774920400957>',
					compravel: true,
					evento: false
				},
				'zumbilandia': {
					nome: 'Zumbilândia',
					emote: '<:AK47Zumbilandia:947665280224591894>',
					compravel: false,
					evento: false
				}
			}
		},
		m4: {
			id: 8,
			desc: "M4",
			data: "m4",
			preço: 135000,
			atk: 50,
			def: 35,
			moneyAtk: 20,
			moneyDef: 36,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.rei.desc}\n**Roubar:** ${bot.robbery.banco.desc}\n**Vasculhar:** Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:M4:829906313374334976>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:M4:937170775100760114>',
					compravel: true,
					evento: false
				}
			}
		},
		sniper: {
			id: 9,
			desc: "Sniper",
			data: "sniper",
			preço: 210000,
			atk: 55,
			def: 40,
			moneyAtk: 22,
			moneyDef: 40,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.espiao.desc}\n**Roubar:** ${bot.robbery.banco.desc}\n**Vasculhar:** Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Sniper:829906314167451648>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:sniper:937170775138508830>',
					compravel: true,
					evento: false
				}
			}
		},
		katana: {
			id: 10,
			desc: "Katana",
			data: "katana",
			preço: 330000,
			atk: 60,
			def: 45,
			moneyAtk: 24,
			moneyDef: 44,
			utilidade: `**Trabalho:** ${bot.jobs.duble.desc}, ${bot.jobs.jacobi.desc}, ${bot.jobs.et.desc} e ${bot.jobs.yakuza.desc}\n**Roubar:** ${bot.robbery.mafia.desc}\n**Vasculhar:** Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Katana:829906312795521034>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:katanaicon:937170775021068378>',
					compravel: true,
					evento: false
				},
				'flamejante': {
					nome: 'Flamejante',
					emote: '<:KatanaFlamejante:947665278936948776>',
					compravel: true,
					evento: false
				}
			}
		},
		rpg: {
			id: 11,
			desc: "RPG",
			data: "rpg",
			preço: 666000,
			atk: 70,
			def: 35,
			moneyAtk: 26,
			moneyDef: 48,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc}, ${bot.jobs.et.desc} e ${bot.jobs.bomba.desc}\n**Roubar:** ${bot.robbery.mafia.desc}\n**Vasculhar:** Nave extraterrestre, Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:RPG:829906313126477874>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:rpg:937170775096557588>',
					compravel: true,
					evento: false
				}
			}
		},
		goggles: {
			id: 12,
			desc: "Óculos Noturno",
			data: "goggles",
			preço: 300000,
			atk: '+3 (noite)',
			def: '+3 (noite)',
			moneyAtk: null,
			moneyDef: null,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc}, ${bot.jobs.et.desc} e ${bot.jobs.duble.desc}\n Aumenta em 3 o ATK e DEF durante a noite (entre 20h e 4h)`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Oculos_Noturno:829906313026863104>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássico',
					emote: '<:goggles:937170774446461008>',
					compravel: true,
					evento: false
				}
			}
		},
		colete: {
			id: 13,
			desc: "Colete Leve",
			data: "colete",
			preço: 175000,
			atk: null,
			def: '+2',
			moneyAtk: null,
			moneyDef: null,
			utilidade: `**Trabalho:** ${bot.jobs.jacobi.desc} e ${bot.jobs.et.desc}\nAumenta em 2 a DEF (pode ser acumulado com outros coletes)`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Colete_Leve:829906314451746836>',
					compravel: true,
					evento: false
				}
				// 'classic': '<:faca:937170775063023636>'
			}
		},
		colete_p: {
			id: 14,
			desc: "Colete Pesado",
			data: "colete_p",
			preço: 1000000,
			atk: null,
			def: '+5',
			moneyAtk: null,
			moneyDef: null,
			utilidade: `**Trabalho:** ${bot.jobs.et.desc}\nAumenta em 5 a DEF (pode ser acumulado com outros coletes)`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Colete_Pesado:829906314653204511>',
					compravel: true,
					evento: false
				}
				// 'classic': '<:faca:937170775063023636>'
			}
		},
		celular: {
			id: 15,
			desc: "Celular",
			data: "celular",
			preço: 100000,
			atk: null,
			def: null,
			moneyAtk: null,
			moneyDef: null,
			utilidade: null,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:celular:734247685422579714>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássico',
					emote: '<:celular:937170774811361331>',
					compravel: true,
					evento: false
				}
			}
		},
		jetpack: {
			id: 16,
			desc: "Jetpack",
			data: "jetpack",
			preço: 5000000,
			atk: null,
			def: null,
			moneyAtk: null,
			moneyDef: null,
			utilidade: `**Trabalho:** ${bot.jobs.duble.desc} e ${bot.jobs.conquistador.desc}\n+30% de chance de fuga da prisão`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Jetpack:829906313034465284>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:jetpack:937170775079792690>',
					compravel: true,
					evento: false
				},
				'brasil': {
					nome: 'Brasileira',
					emote: '<:jetpackbr:937411620198563910>',
					compravel: false
				}
			}
		},
		minigun: {
			id: 17,
			desc: "Minigun",
			data: "minigun", // uData._minigun
			preço: 10000000,
			atk: 80,
			def: 45,
			moneyAtk: 28,
			moneyDef: 52,
			utilidade: `**Trabalho:** ${bot.jobs.mafia.desc}, ${bot.jobs.informante.desc} e ${bot.jobs.conquistador.desc}\n**Roubar**: ${bot.robbery.deposito.desc}\n**Vasculhar:** Base militar, Nave extraterrestre, Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Minigun:829906313580380160>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:minigun:937170775121731604>',
					compravel: true,
					evento: false
				}
			}
		},
		bazuca: {
			id: 18,
			desc: "Bazuca",
			data: "bazuca", // uData._bazuca
			preço: "-",
			atk: 90,
			def: 50,
			moneyAtk: 30,
			moneyDef: 56,
			utilidade: `**Trabalho:** ${bot.jobs.conquistador.desc}\n**Roubar**: ${bot.robbery.palacio.desc}\n**Vasculhar:** Base militar, Nave extraterrestre, Usina nuclear, Fábrica de armas`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Bazuca:829906313315090462>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:bazuca:937170775201439774>',
					compravel: true,
					evento: false
				}
			}
		},
		exoesqueleto: {
			id: 19,
			desc: "Exoesqueleto",
			data: "exoesqueleto", // uData._exoesqueleto
			preço: 20000000,
			atk: null,
			def: '+5',
			moneyAtk: null,
			moneyDef: '+5',
			utilidade: `**Trabalho:** ${bot.jobs.conquistador.desc}\nAumenta em 5 a DEF (pode ser acumulado com coletes) e em 5% o valor defendido`,
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Exoesqueleto:829906315618025492>',
					compravel: true,
					evento: false
				}
				// 'classic': '<:faca:937170775063023636>'
			}
		},
		granada: {
			id: 20,
			desc: "Granada",
			data: "granada", // uData._exoesqueleto
			preço: 750000,
			atk: '+5',
			def: null,
			moneyAtk: null,
			moneyDef: null,
			utilidade: 'Aumenta em 5 o ATK (é consumido ao utilizar) ',
			skins: {
				'default': {
					nome: 'Padrão',
					emote: '<:Granada:829906313239855105>',
					compravel: true,
					evento: false
				},
				'classic': {
					nome: 'Clássica',
					emote: '<:granada:937170774152859670>',
					compravel: true,
					evento: false
				},
				'natal': {
					nome: 'Natalina',
					emote: '<:GranadaNatal:921846896056737852>',
					compravel: false
				},
				'pascoa': {
					nome: 'Pascoalina',
					emote: '<:OvoGranada:829906313710272517>',
					compravel: false
				}
			}
		}
	}
} 