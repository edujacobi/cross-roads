require('dotenv').config({
	path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
})
functions = require("./modules/functions.js")
const {ShardingManager} = require('discord.js')

const manager = new ShardingManager('./bot.js', {
	execArgv: ['--expose-gc', '--trace-warnings'], //
	token: process.env.TOKEN
})

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))

manager.spawn().then(r => {
	// const hora = 1 * 60 * 60 * 1000
	//
	// setInterval(() => {
	// 	// bot.putMoneyCassino()
	// 	// bot.sortearBilhete()
	// 	if (global.gc)
	// 		global.gc()
	// }, (hora / 2))
	//
	// setInterval(() => {
	// 	functions.decrescimoNivelCasal()
	// 	functions.removeSkinsNoVIP()
	// }, hora * 6)
	//
	// functions.informRinhaRouboCancelado()
	//
	// functions.investReceber()
	//
	// setInterval(() => functions.investReceber(), hora) // 1h

})
// const { spawn } = require('child_process');
// const start = spawn('node', ['--unhandled-rejections=warn', 'index.js']); // '--expose-gc''--trace-warnings', 
//
// start.stdout.on('data', (data) => {
// 	console.log(`stdout: ${data}`);
// });
//
// start.stderr.on('data', (data) => {
// 	console.error(`stderr: ${data}`);
// });
//
// start.on('close', (code) => {
// 	console.log(`child process exited with code ${code}`);
// });
