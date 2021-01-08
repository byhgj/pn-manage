#!/usr/bin/env node
const
	program = require('commander');

program
	.name('pn')
	.usage('<command> [options]')
	.command('run <uri>', '运行, 默认', {isDefault: true})
	.command('list [module]', '模块列表')
	.command('reg <module> <path>', '注册模块')
	.command('unreg <module>', '取消注册模块')
	.command('genhelp <module>', '生成指定模块帮助文档')
	.command('console', '控制台')
	.helpOption('-h, --help', '输出帮助信息')
	.on('--help', () => {
		console.log('\nExamples:');
		console.log('\tpn code:hash/md5?text=123456');
		console.log('\tpn run code:hash/md5?text=123456');
		console.log('\tpn list');
		console.log('\tpn list code');
	})
	.parse(process.argv);

