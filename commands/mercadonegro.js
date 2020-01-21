const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	uData = bot.data.get(message.author.id);
	let currTime = new Date().getTime();
	let dia = new Date().getDay();
	let option = args[0];

	if (dia == 0 || dia == 6) {
		if (!option) {
			const embed = new Discord.RichEmbed()

				.setTitle(bot.config.thetruth + " Mercado Negro")
				.setDescription("Olha essas belezinhas!")
				.setColor(message.member.displayColor)

				.addField(`1: ${bot.config.minigun} Minigun`, `10.000.000 ${bot.config.coin} \nATK 80\nDEF 55` + "\n`;mercadonegro 1`", true)
				.addField(`2: ${bot.config.ficha} 1000 fichas`, `95.000 ${bot.config.coin} \n5% de desconto` + "\n`;mercadonegro 2`", true)
				.addField("3: Godfather da Máfia Jacobina", `Duração: 72h \nSalário: 15.000.000 ${bot.config.coin}\nNecessário: ${bot.config.minigun}` + "\n`;job 14`")

				.setFooter(message.author.username + " • Dinheiro: " + uData.moni.toLocaleString().replace(/,/g, "."), message.member.user.avatarURL)
				.setTimestamp();
			message.channel.send({
				embed
			})

		} else {
			uData = bot.data.get(message.author.id);
			let prices = [10000000, 95000];

			if (option < 1 || (option % 1 != 0) || option > prices.length)
				return bot.createEmbed(message, `O ID deve ser entre 1 e ${prices.length}`);

			else if (uData.moni < prices[option - 1])
				return bot.msgSemDinheiro(message);

			uData.moni -= prices[option - 1];
			uData.lojaGastos += prices[option - 1];

			switch (parseInt(option)) {
				case 1:
					uData._minigun = (uData._minigun > currTime ? uData._minigun + 259200000 : currTime + 259200000);
					bot.createEmbed(message, "Você comprou uma Minigun " + bot.config.minigun);
					break;

				case 2:
					uData.ficha = uData.ficha + 1000;
					bot.createEmbed(message, "Você comprou 1000 fichas " + bot.config.ficha);
					break;
			}
			bot.data.set(message.author.id, uData);
		}

	} else
		return bot.createEmbed(message, bot.config.thetruth + " Hey, psst... Volta aqui mais tarde que eu vou ter umas coisinhas bem legais pra te mostar...")

};