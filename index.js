const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', {
    execArgv: ['--trace-warnings', '--unhandled-rejections=warn', '--expose-gc'],
    token: 'NTI2MjAzNTAyMzE4MzIxNjY1.XB7fMw.zdiqmrePVRan7ow_Klvhda_SPJw' 
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();