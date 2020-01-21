const Discord = require("discord.js");
exports.run = async (bot, message, args) => {

	let time = new Date().getTime();
	let uData = bot.data.get(message.author.id);

	if (uData.job >= 0)
		return bot.msgTrabalhando(message, uData);

	if (uData.preso > time) 
		return bot.msgPreso(message, uData);

	if (uData.ficha < 1) {
		return bot.createEmbed(message,`You don't have this amount of ${bot.config.ficha} to do this.`);

	} else {

		if (parseInt(args[0]) < 0 || parseInt(args[0]) > 36 || (args[0] % 1 != 0))
			return bot.createEmbed(message, `You must choose a number between <:0_:530181118763335680> and <:36:530230059039064066>`);

		if (args[1] < 0 || (args[1] % 1 != 0))
			return bot.msgValorInvalido(message);

		if (parseInt(args[1]) > uData.ficha)
			return bot.createEmbed(message, `You don't have this amount of ${bot.config.ficha} to do this`);

		if (!args[0])
			return bot.createEmbed(message, `You must enter a number to be wagered`);

		if (!args[1])
			return bot.createEmbed(message, `You must enter an amount of ${bot.config.ficha}`);

		let roleta = [
			'<:0_:530181118763335680>', '<:1_:530183938807955468>', '<:2_:530184591617687554>',
			'<:3_:530185405891608576>', '<:4_:530186961088937995>', '<:5_:530187621213667358>',
			'<:6_:530189587855966208>', '<:7_:530230057415737369>', '<:8_:530230057432776735>',
			'<:9_:530230060163006475>', '<:10:530230057298427914>', '<:11:530230056920940546>',
			'<:12:530230056983986196>', '<:13:530230056824340483>', '<:14:530230057256353812>',
			'<:15:530230058158129153>', '<:16:530230058636410890>', '<:17:530230057432776714>',
			'<:18:530230058779148308>', '<:19:530230058283958272>', '<:20:530230058376232981>',
			'<:21:530230057277325312>', '<:22:530230058204528640>', '<:23:530230057596223490>',
			'<:24:530230058657382403>', '<:25:530230058980474891>', '<:26:530230057982099486>',
			'<:27:530230057038381057>', '<:28:530230058804051968>', '<:29:530230057558474753>',
			'<:30:530230057034186782>', '<:31:530230057562669056>', '<:32:530230058384621570>',
			'<:33:530230058133094420>', '<:34:530230057151496195>', '<:35:530230057721921547>',
			'<:36:530230059039064066>'
		]

		calculo = Math.floor(Math.random() * roleta.length)
		mostrador = ':black_large_square::black_large_square::arrow_double_up::black_large_square::black_large_square:'

		if (calculo == 0)
			resultado = roleta[35] + roleta[36] + roleta[calculo] + roleta[calculo + 1] + roleta[calculo + 2];

		else if (calculo == 1)
			resultado = roleta[36] + roleta[calculo - 1] + roleta[calculo] + roleta[calculo + 1] + roleta[calculo + 2];

		else if (calculo == 35)
			resultado = roleta[calculo - 2] + roleta[calculo - 1] + roleta[calculo] + roleta[calculo + 1] + roleta[0];

		else if (calculo == 36)
			resultado = roleta[calculo - 2] + roleta[calculo - 1] + roleta[calculo] + roleta[0] + roleta[1];

		else
			resultado = roleta[calculo - 2] + roleta[calculo - 1] + roleta[calculo] + roleta[calculo + 1] + roleta[calculo + 2];

		const embed = new Discord.RichEmbed()

		if (calculo == args[0]){
			embed.addField(`${resultado}\n${mostrador}\n`, `You won ${parseInt(args[1] * 36).toLocaleString().replace(/,/g, ".")} ${bot.config.ficha}`);
			uData.ficha = uData.ficha + args[1]*36;
			uData.betW++;

		} else{ 
			embed.addField(`${resultado}\n${mostrador}\n`, `You lost ${parseInt(args[1]).toLocaleString().replace(/,/g, ".")} ${bot.config.ficha}`);
			uData.ficha = uData.ficha - args[1];
			uData.betL++;
		}

		embed.setColor(message.member.displayColor)
			.setFooter(`${message.member.displayName} • ${uData.ficha.toLocaleString().replace(/,/g, ".")} chips`, message.member.user.avatarURL)
			.setTimestamp();

		bot.data.set(message.author.id, uData);
		return message.channel.send({
			embed
		});

	};
}