const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
	let time = new Date().getTime();
	let uData = bot.data.get(message.author.id);

	if (uData.job >= 0) 
		return bot.msgTrabalhando(message, uData);

	if (uData.preso > time) 
		return bot.msgPreso(message, uData);
	
	if (uData.ficha < 1) 
		return bot.createEmbed(message,`Suas ${bot.config.ficha} acabaram.`);
	
	else {
		uData.ficha--;
		let visor1, visor2, visor3;

		let emoji = [
			bot.config.tshirt,
			bot.config.spray,
			bot.config.saveGame,
			bot.config.dateDrink,
			bot.config.chicken,
			bot.config.cash,
			bot.config.car,
			bot.config.burgerShot,
			bot.config.pizza,
			bot.config.propertyG
		];
		
		let emojis = [];

  		for (let i = 0; i < 3; i++) 
			emojis[i] = emoji[Math.floor(Math.random() * emoji.length)];
		  
		  visor1 = emojis[0];
		  visor2 = emojis[1];
		  visor3 = emojis[2];

		resultado = `║ ${visor1}  ║ ${visor2}  ║ ${visor3}  ║`;

		if (visor1 == visor2 && visor2 == visor3 && visor1 != bot.config.cash){
			uData.betW++;
			uData.ficha = uData.ficha + 150;
			
			const embed = new Discord.RichEmbed()
			.setColor(message.member.displayColor)
			.addField("Você ganhou 150 fichas!",
			  "╔═══╦═══╦═══╗\n" 
			   + resultado + 
			"\n╚═══╩═══╩═══╝\n")
			.setFooter(`${message.member.displayName} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, message.member.user.avatarURL)
			.setTimestamp();

			message.channel.send({embed});
			bot.data.set(message.author.id, uData);
			return;

		} else if (visor1 == visor2 && visor2 == visor3 && visor1 == bot.config.cash){
			uData.betW++;
			uData.ficha = uData.ficha + 500;

			const embed = new Discord.RichEmbed()
			.setColor(message.member.displayColor)
			.addField("Você ganhou 500 fichas!",
			  "╔═══╦═══╦═══╗\n" 
			   + resultado + 
			"\n╚═══╩═══╩═══╝\n")
			.setFooter(`${message.member.displayName} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, message.member.user.avatarURL)
			.setTimestamp();

			message.channel.send({embed});
			bot.data.set(message.author.id, uData);
			return;

		} else {
			uData.betL++;

			const embed = new Discord.RichEmbed()
			.setColor(message.member.displayColor)
			.addField("Você não ganhou",
			  "╔═══╦═══╦═══╗\n" 
			   + resultado + 
			"\n╚═══╩═══╩═══╝\n")
			.setFooter(`${message.member.displayName} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} fichas`, message.member.user.avatarURL)
			.setTimestamp();
			
			message.channel.send({embed});
			bot.data.set(message.author.id, uData);
			return;
		}
	}
};

exports.help = {
  name: "base",
  category: "Code",
  description: "base",
  usage: "base",
  example: "base"
};