
var path = require('path')
var template = path.resolve(__dirname,'../views/login.html');
var config = require('./config.js')

module.exports = function (req,res){
	if(req.user.uid){
		return res.redirect(config.domain || "/");
	}
	res.sendFile(template)
}


