const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let opt = ["faca", "9mm", "tec9", "rifle", "escopeta", "mp5", "ak47", "m4", "oculos", "rpg", "colete", "minigun"];
	let nome = bot.guns.desc;
	let atk = bot.guns.atk;
	let def = bot.guns.def;
	let thumb = bot.guns.thumb;
	let utilidade = bot.guns.utilidade;

	if (!args[0]) {
		const embed = new Discord.RichEmbed()
			.setTitle(bot.config.emmetGun + " Armas")
			//.setThumbnail(bot.guilds.get('529674666692837378').emojis.find('name', 'fist').url)
			.setDescription("As seguintes armas estão disponíveis:")
			.setColor(message.member.displayColor)
			.addField(" 󠀀󠀀",
				`${bot.config.faca} Faca\n` + 
				`${bot.config._9mm} 9mm\n` +
				`${bot.config.tec9} Tec9\n` +
				`${bot.config.rifle} Rifle\n` +
				`${bot.config.escopeta} Escopeta\n` +
				`${bot.config.mp5} Mp5`, true)
			.addField(" 󠀀󠀀",
				`${bot.config.ak47} AK-47\n` + 
				`${bot.config.m4} M4\n` +
				`${bot.config.goggles} Óculos Noturno\n` +
				`${bot.config.rpg} RPG\n` +
				`${bot.config.colete} Colete\n` +
				`${bot.config.minigun} Minigun`, true)
			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();
		message.channel.send({
			embed
		});

	} else if (opt.indexOf(args[0]) > -1) {
		i = opt.indexOf(args[0])
		const embed = new Discord.RichEmbed()
			.setTitle(bot.config.emmetGun + " " + nome[i])
			.setThumbnail(bot.guilds.get('529674666692837378').emojis.find(emoji => emoji.name == thumb[i]).url)
			.setDescription(`**Poder de ataque:** ${atk[i]}\n**Poder de defesa:** ${def[i]}\n${utilidade[i]}`)
			.setColor(message.member.displayColor)
			.setFooter(message.author.username, message.member.user.avatarURL)
			.setTimestamp();
		message.channel.send({
			embed
		});

	} else
		return bot.createEmbed(message, "Esta arma não existe")
};