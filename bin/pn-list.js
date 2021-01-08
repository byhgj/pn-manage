#!/usr/bin/env node
require('pn-framework');

const
	fs = require('fs'),
	path = require('path'),
	program = require('commander'),
	colors = require('colors'),
	Manage = require('../Manage');

program
	.version('0.1')
	.usage('[module]')
	.parse(process.argv);

let mod = null;

if (program.args.length>0) mod = program.args[0];

let manage = new Manage();
const modules = manage.config.modules;

if (!mod) {
	console.log('模块'.padRight(20), '路径');
	console.log('-'.repeat(80));
	for(let item of Object.keys(modules)){
		console.log(item.padRight(20), path.normalize(modules[item]));
	}
} else if (!modules.hasOwnProperty(mod)) console.log('没有帮助文档');
else {
	const mPath = path.normalize(modules[mod]);
	console.log('模块名称:'.cyan, mod);
	console.log('模块位置:'.cyan, mPath);
	console.log('-'.repeat(80));

	console.log('控制器：'.cyan);
	let _dirs = fs.readdirSync(path.join(mPath, 'controller'||nirvana.options.controller_path));
	let controllerlist = [];
	for(let _dir of _dirs){
		let stat = fs.statSync(path.join(mPath, 'controller'||nirvana.options.controller_path, _dir));
		if (/\.js$/.test(_dir) && stat.isFile()) {
			let f = _dir.replace(/\.js$/, '');
			if (f !== 'base') console.log('    ' + f);
		}
	}
	console.log('\n详细帮助:'.cyan, `pn ${mod}:<controller>/help`)
}