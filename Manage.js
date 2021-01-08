require('pn-framework');
require('./string');
const
	path = require('path'),
	os = require('os'),
	fs = require('fs'),
	qs = require('querystring');

nirvana.Controller.prototype.helpAction = function(param = {a: ''}) {
	try {
		const _help = require(path.join(this.module.path, 'help', this.className));
		if (param.a === '') return _help;
		else {
			let helpitem = _help[param.a];
			if (helpitem) return helpitem;
			else return null;
		}
	} catch(err) {
		return null;
	}
}

module.exports = class {
	constructor() {
		this.rootPath = __dirname;
		this.systemConfig = require('./config');
		this.userConfig = require(path.join(os.homedir(), '.userconfig.js'));
		this.config = Object.assign({
			route: {
				"^(.*?)://(.*)": "$1:$2"
			},
			modules: {

			}
		}, this.systemConfig, this.userConfig);
	}
	set modules(new_module) {
		if (!new_module.name) throw new Error('缺少模块名称');
		if (new_module.path === null) delete this.userConfig.modules[new_module.name];
		else {
			if (!new_module.path) throw new Error('缺少模块路径');
			if (!fs.existsSync(new_module.path)) throw new Error(`模块${new_module.name}路径${new_module.path}不存在`);
			if (this.userConfig.modules[new_module.name]) nirvana.log(`原路径是${this.userConfig.modules[new_module.name]}\n将更改到${new_module.path}`);
			this.userConfig.modules[new_module.name] = new_module.path;
		}
		this.config = Object.assign(this.config, this.userConfig);
		fs.writeFileSync(path.join(os.homedir(), '.userconfig.js'), 'module.exports = ' + JSON.stringify(this.userConfig, null, 4));
	}
	route(uri){
		for(let key in this.config.route) {
			let route = this.config.route[key];
			let _route = '';
			if (typeof route === 'string') _route = route;
			else if (typeof route === 'function') _route = route();
			else continue;
			uri = uri.replace(new RegExp(key), _route);
		}
		return uri;
	}
	parse(u){
		let match = /^(.*?):(.*?)\/(.*)/.exec(this.route(u));
		if (match) {
			let [, module, controller, _action] = match;
			let [action, param] = _action.split('?');
			if (param && param.indexOf('=') !== -1) param = qs.parse(param);
			return {module, controller, action, param};
		} else throw new Error('URI格式不符合要求: module:controller/action?paramlist');
	}
	async run(uri){
		try {
			let u = this.parse(uri);
			let modulePath = this.config.modules[u.module];
			return await nirvana.action(modulePath, u.controller, u.action, u.param);
		} catch(err) {
			console.log(err.message);
		}
	}
}