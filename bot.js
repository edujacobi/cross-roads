// require('dotenv/config')
// const { ShardingManager } = require('discord.js');
//
// const manager = new ShardingManager('./bot.js', {
//     execArgv: ['--trace-warnings', '--unhandled-rejections=warn', '--expose-gc'],
//     token: process.env.TOKEN 
// });
//
// manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
//
// manager.spawn();

const { spawn } = require('child_process');
const start = spawn('node', ['--unhandled-rejections=warn', 'index.js']); // '--expose-gc''--trace-warnings', 

start.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

start.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});

start.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});