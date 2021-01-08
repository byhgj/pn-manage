#!/usr/bin/env node
require('pn-framework');

const
	program = require('commander'),
	Manage = require('../Manage');
	
program
	.version('0.1')
	.usage('<name>')
	.parse(process.argv);

if (program.args.length < 1) {
	program.help();
	process.exit();
}

let manage = new Manage();
manage.modules = {name: program.args[0], path: null}
