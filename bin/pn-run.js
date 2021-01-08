#!/usr/bin/env node
require('pn-framework');

const
	program = require('commander'),
	colors = require('colors'),
	Manage = require('../Manage');

process.on('uncaughtException', function (err) {
	nirvana.error(err);
    process.exit();
});

program
    .version('0.1.1')
	.name('pn run')
    .usage('[options] [module:controller/action?param1=value1&param2=value2&...]')
    .option('-d, --debug', '调试')
    // .option('-k, --keepalive', '保持存活，主要应用于服务器')
    .option('-s, --silent', '不显示结果')
    .on('--help', () => {
		console.log('\nExample: pn code:hash/md5?text=123456');
	})
	.parse(process.argv);

if (program.args.length === 0) {
    program.help();
    process.exit();
}

nirvana.debug = program.debug;

let uri = program.args[0];

function controller_help(data){
	console.log(`${'动作'.padRight(15)}\t描述`.cyan);
	console.log('-'.repeat(80));
	for(let item in data) {
		if (item === 'default') continue;
		let helpitem = data[item];
		if (typeof helpitem != 'object') continue;
		console.log(`${item.padEnd(15)}\t${helpitem.description||''}`)
	}			
}
function action_help(data){
	let helpitem = data;
	console.log(helpitem.description);

	console.log(`${'参数'.padRight(15)}\t${'必须?'.padRight(10)}\t${'值'.padRight(20)}\t描述`.cyan);
	console.log('-'.repeat(80));

	for(let item of helpitem.params){
		let required = (item.required || typeof item.required === 'undefined') ? '是' : '否';
		let value = item.value || '';

		console.log(`${item.name.padRight(15)}\t${required.padRight(10)}\t${value.toString().padRight(20)}\t${item.description}`);
	}
}

let manage = new Manage();
manage.run(uri).then(data => {
	const u = manage.parse(uri);
	if (u.action === 'help') {
		if (!data) {
			console.log('没有发现帮助文档\n使用pn genhelp <module>自动生成，支持jsdoc文档语法');
			return;
		}
		if (u.param && u.param.a) {
			process.stdout.write(u.param.a+': ');
			action_help(data);
			if (data.usage) console.log(`\n用法: ${u.module}:${u.controller}/${u.param.a}${data.usage}`);
		} else {
			controller_help(data);
			console.log(`\n详细帮助:\n    ${u.module}:${u.controller}/help?a=<动作>`)
		}
	}
	else if (typeof data == 'object') console.log(JSON.stringify(data, null, 4));
	else console.log(data);
	// if (typeof data === 'array')
	// 	nirvana.util.show(data, {type: 'array'})
	// else if (typeof data === 'object')
	// nirvana.util.show(data, {type: 'json'})
	// else if (typeof data != 'undefined')
	// 	console.log(data);
	// if (program.keepalive !== true)
	// 	process.exit();
}).catch(err => {
	nirvana.error(err);
	process.exit();
});
