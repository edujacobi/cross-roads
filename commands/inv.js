const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	const semana = 7 * 24 * 60 * 60 * 1000; // 7 dias
	let targetMention = message.mentions.members.first();
	let targetNoMention = [];
	let alvo;
	let currTime = new Date().getTime();
	let textGuns = '';
	let textoBadge = '';
	let total = 0;
	let investimento = ''


	/*
	Para ver inventário sem pingar (funciona para outros servidores)
	> Se não tiver uma menção, ele irá pegar a string fornecida (espera-se o username do usuário) e irá procurar
	 em todo o banco de dados se há alguém com o user. Caso houver mais de um usuário com o mesmo username, ele
	 informará uma lista dos usuários junto de suas tags (username + discriminator). Se informar a tag, o usuário
	 será selecionado corretamente
	*/
	if (!targetNoMention[0] && args[0] && !targetMention) {

		let name = args.join(" ").toLowerCase();

		bot.users.forEach(item => {
			if (item.tag.toLowerCase() == name)
				targetNoMention.push(item);

			else if (item.username.toLowerCase() == name)
				targetNoMention.push(item);
		});

		if (!targetNoMention[0])
			return bot.createEmbed(message, "Usuário não encontrado.");

		if (targetNoMention.length > 1) {
			let str = ''
			for (let i = 0; i < targetNoMention.length; ++i)
				str += `**${targetNoMention[i].tag}**\n`;

			return bot.createEmbed(message, `Há ${targetNoMention.length} usuários com o mesmo nome\n${str}`);
		}
	}

	if (targetNoMention.length > 0)
		alvo = targetNoMention[0];
	else {
		if (targetMention)
			alvo = targetMention.user;
		else
			alvo = message.author;
	}

	uData = bot.data.get(alvo.id)
	if (!uData)
		return bot.createEmbed(message, "Este usuário não possui um inventário");
	uData.nome = alvo.username;
	bot.data.has(alvo.id, "qtFugas") ? uData.qtFugas : uData.qtFugas = 0;
	bot.data.set(alvo.id, uData);

	/*
	Montagem do Inventário + Informações do usuário
	> Há dois embed, sendo o primeiro as informações básicas do inventário (armas, dinheiro e investimento)
	 e o segundo, estas mesmas informações com o acréscimo das informações do usuário (vitórias/derrotas no cassino, etc).
	*/

	if (uData.invest != -1)
		investimento = `• ${(currTime < uData.investTime + semana ? bot.config.propertyG : bot.config.propertyR)} ` + bot.investments.desc[uData.invest]

	const invClosed = new Discord.RichEmbed()
		.setColor(message.member.displayColor)
		.setTitle("Inventário de " + alvo.username)
		.setThumbnail(alvo.avatarURL)
		.setDescription(`${bot.config.coin} ${uData.moni.toLocaleString().replace(/,/g, ".")} ${investimento}`)
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();

	if (alvo.id == '384811752245690368' || alvo.id == '331959581502865408' || alvo.id == '215955539274760192')
		textoBadge = "<:race:539497344711000085> Top 3";

	horaInvestimento = uData.invest != -1 ? (currTime < uData.investTime + semana ?
		": " + bot.minToHour(((uData.investTime + semana) - currTime) / 1000 / 60) :
		": Encerrado") : "";

	const invOpen = new Discord.RichEmbed()
		.setColor(message.member.displayColor)
		.setTitle("Inventário de " + alvo.username)
		.setThumbnail(alvo.avatarURL)
		.setDescription(`${bot.config.coin} ${uData.moni.toLocaleString().replace(/,/g, ".")} ${investimento}${horaInvestimento}\n${textoBadge}`)
		.setFooter(message.author.username, message.member.user.avatarURL)
		.setTimestamp();

	configArray = Object.entries(bot.config);

	Object.entries(uData).forEach(([key, value]) => {
		let emoji;
		let nomeArma;
		if (key.includes("_") && value > currTime) {

			configArray.forEach(([keyConfig, valueConfig]) => { // corrigir defaultCarteira e data dos users 
				if (key.substring(1) == 'knife')
					emoji = '<:faca:529879141693259777>';
				else if (key.substring(1) == '9mm')
					emoji = '<:9mm:526209748953989125>';
				else if (key.substring(1) == 'shotgun')
					emoji = '<:escopeta:648533516338069524>';
				else if (keyConfig == key.substring(1))
					emoji = valueConfig;
			})

			if (key.substring(1) == 'knife')
				nomeArma = 'Faca';
			else if (key.substring(1) == 'shotgun')
				nomeArma = 'Escopeta';
			else
				nomeArma = key.substring(1).charAt(0).toUpperCase() + key.substring(1).slice(1);

			textGuns += emoji + " ";
			invOpen.addField(`${emoji} ${nomeArma}`, bot.minToHour((value - currTime) / 1000 / 60), true);
			total += 1;
		}
	});

	textGuns != "" ? invClosed.addField(textGuns, " 󠀀󠀀", true) : textGuns = '';

	if (total % 2 == 0)
		invOpen.addBlankField(true);
	else if (total % 3 != 0) {
		invOpen.addBlankField(true);
		invOpen.addBlankField(true);
	}

	let textSituation = uData.preso > currTime ?
		`${bot.config.police} Preso por mais ${bot.minToHour((uData.preso - currTime) / 1000 / 60)}` :
		(((currTime - uData.jobTime - bot.jobs.coolDown[uData.job]) < 0) ?
			`${bot.config.bulldozer} Trabalhando por mais ${bot.minToHour(-Math.floor((currTime - uData.jobTime - bot.jobs.coolDown[uData.job]) / 1000 / 60))}` :
			`${bot.config.car} Vadiando`)

	invOpen.addField(" 󠀀󠀀", textSituation)
		.addField("Cassino",
			`\`${uData.betW.toLocaleString().replace(/,/g, ".")}\` vitórias\n` +
			`\`${uData.betL.toLocaleString().replace(/,/g, ".")}\` derrotas\n` +
			`\`${uData.ficha.toLocaleString().replace(/,/g, ".")}\` fichas`, true)
		.addField("Roubos",
			`\`${uData.roubosW.toLocaleString().replace(/,/g, ".")}\` bem sucedidos\n` +
			`\`${uData.roubosL.toLocaleString().replace(/,/g, ".")}\` mal sucedidos\n` +
			`\`${uData.qtFugas.toLocaleString().replace(/,/g, ".")}\` fugas da prisão`, true)
		.addField("Dinheiro",
			`\`${uData.jobGanhos.toLocaleString().replace(/,/g, ".")}\` de trabalhos\n` +
			`\`${uData.investGanhos.toLocaleString().replace(/,/g, ".")}\` de investimentos\n` +
			`\`${uData.lojaGastos.toLocaleString().replace(/,/g, ".")}\` gastos na loja`, true);

	/*
	Reações
	> O bot irá reagir à mensagem do inventário. Se o usuário que chamou o comando clicar na reação, a mensagem
	 será editada para mostrar o segundo embed, as reações serão limpas e o bot irá reagir novamente, para "fechar"
	 o inventario.
	*/
	message.channel.send(invClosed).then(msg => { // troca de página
		msg.react('🔽').then(r => {
			const openFilter = (reaction, user) => reaction.emoji.name === '🔽' && user.id == message.author.id
			const closeFilter = (reaction, user) => reaction.emoji.name === '🔼' && user.id == message.author.id

			const open = msg.createReactionCollector(openFilter, {
				time: 90000
			})
			const close = msg.createReactionCollector(closeFilter, {
				time: 90000
			})

			open.on('collect', r => {
				r.remove(message.author.id).then(m => {
					r.remove(bot.user.id).then(m => {
						msg.edit(invOpen).then(m => {
							msg.react('🔼')
						})
					});
				})
			})
			close.on('collect', r => {
				r.remove(message.author.id).then(m => {
					r.remove(bot.user.id).then(m => {
						msg.edit(invClosed).then(m => {
							msg.react('🔽')
						})
					});
				})
			})
		})
	})
}