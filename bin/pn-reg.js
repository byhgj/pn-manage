#!/usr/bin/env node
require('pn-framework');

const
	program = require('commander'),
	Manage = require('../Manage');

program
	.version('0.1')
	.usage('<name> <path>')
	.parse(process.argv);

if (program.args.length < 2) {
	program.help();
	process.exit();
}

try {
	let manage = new Manage();
	manage.modules = {name: program.args[0], path: program.args[1]}
} catch(err){
	nirvana.error(err);
}
