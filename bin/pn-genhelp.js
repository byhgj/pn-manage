#!/usr/bin/env node
require('pn-framework');

const
	fs = require('fs'),
	os = require('os'),
	path = require('path'),
	program = require('commander'),
	colors = require('colors'),
	cp = require('child_process'),
	Manage = require('../Manage');

// jsdoc huawei.me60.js -t jsdoc -d ./help
// pn genhelp dev
program
	.version('0.1')
	.usage('<module>')
	.parse(process.argv);

if (program.args.length == 0){
	program.help();
	process.exit();
}

let manage = new Manage();

if (!manage.config.modules.hasOwnProperty(program.args[0])) {
	console.log(program.args[0], '模块不存在');
	process.exit();
}

let mPath = manage.config.modules[program.args[0]];


// 遍历
function traverse(dir, subdir = ''){
	let _files = fs.readdirSync(dir);
	for(let _file of _files){
		let __file = path.join(dir, _file);
		let stat = fs.statSync(__file);
		if (stat.isDirectory()) {
			traverse(__file, _file);
		} else if (/\.js$/.test(__file)) {
			genHelp(__file, path.join(mPath, 'help', subdir, _file));
		}
	}
}

function genHelp(source, destination) {
	console.log(source);
	let jsdoc_cmd = 'jsdoc';
	if (os.platform() === 'win32') jsdoc_cmd = 'jsdoc.cmd';
	let template = path.join(manage.rootPath, 'jsdoc', 'help');

	let jsdoc = cp.spawn(jsdoc_cmd, [source, '-t', template, '-d', destination]);
	jsdoc.stderr.on('data', data => {
		nirvana.error(new Error(data.toString()));
	})
	jsdoc.on('error', err => {
		nirvana.error(err);
	})
	jsdoc.on('close', code => {
		if (code != 0) nirvana.error(new Error(`exitcode: ${code}`));
	})
}

traverse(path.join(mPath, 'controller'));
