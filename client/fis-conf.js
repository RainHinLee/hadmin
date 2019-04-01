// ---fis3 构建工具，只用于静态页面的构建；

// ---fis3 构建工具，只用于静态页面的构建；



const config = require('./config.js')
const TYPE = process.argv.includes('local') ? "test" : "release";
const OPTIONS = TYPE=="test" ? config.test : config.release

console.log("OPTIONS",OPTIONS)

const replaceDomain = function (content){  //---替换_domain和_timestamp，font
		let string = content.toString('utf8');
		let rex1 = /_domain/g;
		let rex2 = /_timestamp/g;
		let rex3 = /_alifonts/g;
		let rex4 = /_api/g;
		let rex5 = /_cmsapi/g;
		string = string.replace(rex1,OPTIONS.domain)
									 .replace(rex2,config.time)
									 .replace(rex3,config.fonts)
									 .replace(rex4,OPTIONS.api)
									 .replace(rex5,OPTIONS.cmsapi)
		return new Buffer(string,'utf8');
};

//---本地服务器
fis.media('local').set('project.files', [
	'views/**',
	'statics/**',
]).match('**.html',{ //---增加时间戳和cdn加速域名;
	optimizer:replaceDomain,
}).match('**.js',{ //---增加时间戳和cdn加速域名;
	optimizer:replaceDomain,
});

//--线上服务器
fis.media('remote').set('project.files', [
	'views/**',
	'statics/**',
]).match('**.html',{ //---增加时间戳和cdn加速域名;
	optimizer:replaceDomain,
}).match('**.js',{ //---增加时间戳和cdn加速域名;
	optimizer:replaceDomain,
});
